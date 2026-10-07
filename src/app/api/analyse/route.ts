import { inputSchema } from "@/lib/analysis-contract";
import {
  analyseAI,
  AnalysisError,
  readBoundedJson,
} from "@/lib/server/ai-analysis";
export const runtime = "nodejs";
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return Response.json(
      { error: "Analysis requests must come from this app." },
      { status: 403, headers },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return Response.json(
      { error: "Analysis requires a JSON input." },
      { status: 415, headers },
    );
  let body: unknown;
  try {
    body = await readBoundedJson(
      request.body,
      200000,
      AbortSignal.any([request.signal, AbortSignal.timeout(5000)]),
    );
  } catch {
    return Response.json(
      {
        error:
          "Analysis input is invalid, too large or could not be read. Use the documented character limits.",
      },
      { status: 400, headers },
    );
  }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success)
    return Response.json(
      {
        error: "Analysis inputs do not meet the character limits.",
        fields: parsed.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      },
      { status: 400, headers },
    );
  try {
    const result = await analyseAI(parsed.data, {
      key: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL,
    });
    return Response.json(result, { headers });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof AnalysisError
            ? error.message
            : "AI analysis failed. Your inputs are retained.",
      },
      { status: error instanceof AnalysisError ? error.status : 502, headers },
    );
  }
}
