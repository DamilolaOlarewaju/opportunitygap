import {
  inputSchema,
  validateResult,
  type AnalysisInput,
} from "./analysis-contract";
import { sampleInput, sampleResult } from "./sample";
export function analyseDemo(input: AnalysisInput) {
  const parsed = inputSchema.parse(input);
  if (
    (Object.keys(sampleInput) as (keyof AnalysisInput)[]).some(
      (key) => parsed[key] !== sampleInput[key],
    )
  ) {
    throw new Error(
      "Demo mode analyses only the labelled sample. Load the sample again, or choose AI analysis for your own text.",
    );
  }
  return validateResult(structuredClone(sampleResult), parsed);
}
