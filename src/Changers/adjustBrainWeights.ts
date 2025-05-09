import { ConfigTypes } from "@spt/models/enums/ConfigTypes";
import { IBotConfig } from "@spt/models/spt/config/IBotConfig";
import { IPmcConfig } from "@spt/models/spt/config/IPmcConfig";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { DependencyContainer } from "tsyringe";


export default (container: DependencyContainer) => {
    let botConfig: IBotConfig;
    let pmcConfig: IPmcConfig;
    let configServer: ConfigServer;
    configServer = container.resolve<ConfigServer>("ConfigServer");
    pmcConfig = configServer.getConfig<IPmcConfig>(ConfigTypes.PMC);
    botConfig = configServer.getConfig<IBotConfig>(ConfigTypes.BOT);

    // Only allow `pmcBot` brains to spawn for PMCs
    for (const pmcType in pmcConfig.pmcType) {
        console.log(pmcType)
        for (const map in pmcConfig.pmcType[pmcType]) {
            const pmcBrains = pmcConfig.pmcType[pmcType][map];
            for (const brain in pmcBrains) {
                if (brain === "pmcBot") {
                    pmcBrains[brain] = 1;
                } else {
                    pmcBrains[brain] = 0;
                }
            }
        }
    }

    // Only allow `assault` brains for scavs
    for (const map in botConfig.assaultBrainType) {
        const scavBrains = botConfig.assaultBrainType[map];
        for (const brain in scavBrains) {
            if (brain === "assault") {
                scavBrains[brain] = 1;
            } else {
                scavBrains[brain] = 0;
            }
        }
    }

    // Only allow `pmcBot` brains for player scavs
    for (const map in botConfig.playerScavBrainType) {
        const playerScavBrains = botConfig.playerScavBrainType[map];
        for (const brain in playerScavBrains) {
            if (brain === "pmcBot") {
                playerScavBrains[brain] = 1;
                playerScavBrains;
            } else {
                playerScavBrains[brain] = 0;
            }
        }
    }
}