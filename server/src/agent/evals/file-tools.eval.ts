import { evaluate } from "@lmnr-ai/lmnr";
import { tools } from "../tools/index.js";
import { toolSelectionScore } from "./evaluators.js";
import { singleTurnExecutor } from "./executors.js";
import type { EvalData, EvalTarget } from "../types.js";
import dataset from "./data/kitzaa-eval.json" with { type: "json" };

const typedDataset = dataset as unknown as Array<{
  data: EvalData;
  target: EvalTarget;
}>;

evaluate({
  data: typedDataset,
  executor: (data: EvalData) => singleTurnExecutor(data, tools),
  evaluators: {
    toolSelectionScore: (output, target) =>
      target ? toolSelectionScore(output, target) : 0,
  },
});
