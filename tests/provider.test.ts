import test from "node:test";
import assert from "node:assert/strict";
import {
  analyseAI,
  AnalysisError,
  readBoundedJson,
} from "../src/lib/server/ai-analysis";
import { sampleInput, sampleResult } from "../src/lib/sample";
import { POST } from "../src/app/api/analyse/route";
const config = {
  key: "synthetic-test-credential",
  model: "synthetic-test-model",
};
const response = (result: unknown) =>
  Response.json({
    status: "completed",
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: JSON.stringify(result) }],
      },
    ],
  });
const expectStatus = (status: number) => (error: unknown) =>
  error instanceof AnalysisError && error.status === status;
test("missing provider configuration produces an honest unavailable error", async () => {
  await assert.rejects(analyseAI(sampleInput, {}), expectStatus(503));
});
test("valid structured output is validated; request disables provider storage and keeps credentials server-side", async () => {
  const fetcher: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    const body = JSON.parse(init!.body as string);
    assert.equal(body.store, false);
    assert.equal(body.text.format.strict, true);
    assert.equal(body.model, config.model);
    assert.equal(init!.cache, "no-store");
    assert.ok(body.instructions.includes("untrusted data"));
    return response(sampleResult);
  };
  assert.deepEqual(await analyseAI(sampleInput, config, fetcher), sampleResult);
});
test("invalid contract, hallucinated evidence, truncated output and refusals fail closed", async () => {
  const fabricated = structuredClone(sampleResult);
  fabricated.requirements[0].evidence!.excerpt = "Invented work";
  const responses = [
    response({}),
    response(fabricated),
    Response.json({ status: "incomplete", output: [] }),
    Response.json({
      status: "completed",
      output: [{ type: "message", content: [{ type: "refusal" }] }],
    }),
    new Response("not JSON"),
  ];
  for (const res of responses)
    await assert.rejects(
      analyseAI(sampleInput, config, async () => res),
      expectStatus(502),
    );
});
test("provider errors and network failures expose no raw response or input", async () => {
  for (const status of [401, 429, 500]) {
    await assert.rejects(
      analyseAI(
        sampleInput,
        config,
        async () => new Response("sensitive raw provider error", { status }),
      ),
      (e) =>
        expectStatus(502)(e) && !(e as Error).message.includes("sensitive"),
    );
  }
  await assert.rejects(
    analyseAI(sampleInput, config, async () => {
      throw new Error("sensitive network details");
    }),
    expectStatus(502),
  );
});
test("timeout and response size are bounded", async () => {
  const fetcher: typeof fetch = async (_url, init) =>
    new Promise((_resolve, reject) => {
      init!.signal!.addEventListener(
        "abort",
        () => reject(init!.signal!.reason),
        { once: true },
      );
    });
  // Keep Node alive while its unref'd timeout signal fires.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    await assert.rejects(
      analyseAI(sampleInput, config, fetcher, 10),
      expectStatus(504),
    );
  } finally {
    clearInterval(keepAlive);
  }
  await assert.rejects(
    readBoundedJson(
      new Response('"' + "a".repeat(101) + '"').body,
      100,
      AbortSignal.timeout(1000),
    ),
    /too large/,
  );
});
test("server validates body, character bounds, origin and content type before provider work", async () => {
  const make = (
    body: string,
    headers: Record<string, string> = { "Content-Type": "application/json" },
  ) =>
    new Request("http://localhost:3000/api/analyse", {
      method: "POST",
      headers,
      body,
    });
  for (const body of [
    "invalid",
    JSON.stringify({ ...sampleInput, cv: "" }),
    JSON.stringify({ ...sampleInput, role: "a".repeat(12001) }),
    '"' + "a".repeat(200001) + '"',
  ]) {
    const result = await POST(make(body));
    assert.equal(result.status, 400);
    assert.equal(result.headers.get("cache-control"), "no-store");
  }
  assert.equal(
    (await POST(make("{}", { "Content-Type": "text/plain" }))).status,
    415,
  );
  assert.equal(
    (
      await POST(
        make("{}", {
          "Content-Type": "application/json",
          Origin: "http://unrelated.example",
        }),
      )
    ).status,
    403,
  );
});

test("stalled provider body is cancelled on timeout", async () => {
  const keepAlive = setInterval(() => {}, 1000);
  let cancelled = false;
  const body = new ReadableStream<Uint8Array>({
    cancel() {
      cancelled = true;
    },
  });
  try {
    await assert.rejects(
      analyseAI(sampleInput, config, async () => new Response(body), 10),
      expectStatus(504),
    );
    assert.equal(cancelled, true);
  } finally {
    clearInterval(keepAlive);
  }
});
