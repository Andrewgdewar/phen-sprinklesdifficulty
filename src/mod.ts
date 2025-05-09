import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import config from "../config/config.json"
import adjustDifficulty from "./Changers/adjustDifficulty";
import adjustBrainWeights from "./Changers/adjustBrainWeights";

class Sprinkles implements IPostDBLoadMod {
  public postDBLoad(container: DependencyContainer): void {
    config.enableBrainWeightingChanges && adjustBrainWeights(container);
    config.enableDifficultyChanges && adjustDifficulty(container);
  }
}

module.exports = { mod: new Sprinkles() };
