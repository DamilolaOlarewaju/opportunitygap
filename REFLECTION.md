# First proof of concept reflection

## Decisions

The reviewed setup was committed separately before product work. The Next.js App
Router, strict TypeScript, plain CSS, system fonts and existing configuration were
preserved. New features are separated into input UI, results UI, contract validation,
synthetic data, download formatting and a server-only provider adapter.

The complete deterministic demo was built and tested before integrating AI. Demo
outputs are valid only for the labelled sample; editing it cannot silently produce
an unrelated assessment. Unknown evidence and explicit gaps are separate. Projects
must address skill requirements and cannot replace credentials or eligibility.

The action plan is a plain UTF-8 text download, avoiding an extra document-generation
service. It contains evidence, clarifications, project completion steps and clearly
conditional future wording. There is no website offline-loading claim.

## Checks and repairs

Final validation on 7 October 2026: 13 product/adapter/route tests and four production
browser tests passed; lint, production build, standalone typecheck and diff whitespace
checks passed. Browser tests used system Chromium at desktop and 390px width. They
verified the full flow, keyboard submission/focus, download contents, no horizontal
overflow, absence of browser storage and AI failure/response handling. Axe found zero
violations on the demo result screens. Visual inspection used desktop/mobile captures.

Initial checks found a Next.js internal-link lint error and a browser-test selector
that also matched Next.js's route announcer. Both were repaired. Tightening rewrite grounding also rejected a sample rewrite
whose context was absent from its cited excerpt; the rewrite was narrowed to the
supplied wording. Sandboxed process
permissions initially prevented test/build subprocesses; supported execution
permissions resolved that. Playwright's download host was blocked, so the already
installed system Chromium was used without changing network policy or TLS settings.

## Limits and lessons

Live OpenAI analysis is unverified: no configured key/model and the environment's
network allowlist excludes the API host. Mocked tests verify transport, validation,
storage flag, refusals, errors, size bounds and timeouts; they do not measure model
quality. Provider retention is not independently verified. No secret was provisioned
or exposed, and no network policy was changed.

Exact excerpts and conservative rewrite checks catch unsupported evidence and new
words/metrics but cannot establish semantic truth or exhaustive requirement extraction.
AI results still require review. The explicit-gap validator favours English limitation
wording; multilingual support is not implemented. The UI has not been tested with
screen readers, Safari/Firefox or real students. No measured hiring outcomes, user
benefits, time savings or representative research claims are made.

The main lesson is to establish an inspectable evidence contract and complete sample
flow before relying on a model. The clear separation lets students try the prototype
while service access remains unavailable. Next evaluation should test whether students
understand unknowns and can use the recommended checklist, then verify live analysis
with synthetic examples after authorized provider configuration.
