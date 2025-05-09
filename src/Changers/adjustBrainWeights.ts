import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { IPmcConfig } from "@spt/models/spt/config/IPmcConfig";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DependencyContainer } from "tsyringe";
import { pmcBrainWeights, scavBrainWeights, playerScavBrainWeights } from "../../config/brainWeightings/brainWeights.json";

export default (container: DependencyContainer) => {
    let botConfig: IBotConfig;
    let pmcConfig: IPmcConfig;
    let configServer: ConfigServer;
    configServer = container.resolve<ConfigServer>("ConfigServer");
    pmcConfig = configServer.getConfig<IPmcConfig>(ConfigTypes.PMC);
    botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);

    // Adjust brain weights from config
    for (const pmcType in pmcConfig.pmcType) {
        for (const map in pmcConfig.pmcType[pmcType]) {
            const pmcBrains = pmcConfig.pmcType[pmcType][map];
            for (const brain in pmcBrains) {
                if (pmcBrainWeights[brain]) {

                    pmcBrains[brain] = pmcBrainWeights[brain];
                } else {
                    pmcBrains[brain] = 0;
                }
                // if (map === "bigmap") console.log(`${pmcType}: ${brain}: ${pmcBrains[brain]}`);
            }
        }
    }

    // Adjust brain weights for scavs
    for (const map in botConfig.assaultBrainType) {
        const scavBrains = botConfig.assaultBrainType[map];

        for (const brain in scavBrains) {
            if (pmcBrainWeights[brain]) {
                scavBrains[brain] = scavBrainWeights[brain];
            } else {
                scavBrains[brain] = 0;
            }
        }

        // Adjust brain weights for playerScavs
        const playerScavBrains = botConfig.playerScavBrainType[map];
        for (const brain in playerScavBrains) {
            if (pmcBrainWeights[brain]) {
                playerScavBrains[brain] = playerScavBrainWeights[brain];
            } else {
                playerScavBrains[brain] = 0;
            }
        }
    }

}