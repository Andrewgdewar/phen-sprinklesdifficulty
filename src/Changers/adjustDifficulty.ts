import { DependencyContainer } from "tsyringe";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import bossMeanJson from "../../config/data/aiming_bossmean.json"
import sprayPrayMeanJson from "../../config/data/aiming_spraypraymean.json"
import insaneMean from "../../config/data/aiming_insane.json"
import { globaldefaultdifficulty, difficultyLevels } from "../../config/difficulty.json"
import { valueFromProximity } from "../helpers/kmean";


export default (container: DependencyContainer) => {
    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
    const tables = databaseServer.getTables();

    const globalDifficulty: number = globaldefaultdifficulty

    Object.keys(tables.bots.types).forEach((botkey) => {
        let botSetting = difficultyLevels.find((override) =>
            override.brains.find((x) => x === botkey)
        );
        if (!botSetting) {
            // console.log(`No bot setting found for ${botkey}`);
            return
        }
        const easyMul = botSetting.perdiffcultymultipier.easy || 1.0;
        const normalMul = botSetting.perdiffcultymultipier.normal || 1.0;
        const hardMul = botSetting.perdiffcultymultipier.hard || 1.0;
        const impossibleMul =
            botSetting.perdiffcultymultipier.impossible || 1.0;
        const difficultySetting = botSetting.difficulty || globalDifficulty;

        Object.keys(sprayPrayMeanJson).forEach((aimingKey) => {
            tables.bots.types[botkey].difficulty.easy.Aiming[aimingKey] =
                valueFromProximity(
                    easyMul * difficultySetting,
                    aimingKey,
                    bossMeanJson,
                    sprayPrayMeanJson,
                    insaneMean
                );
            tables.bots.types[botkey].difficulty.normal.Aiming[aimingKey] =
                valueFromProximity(
                    normalMul * difficultySetting,
                    aimingKey,
                    bossMeanJson,
                    sprayPrayMeanJson,
                    insaneMean
                );
            tables.bots.types[botkey].difficulty.hard.Aiming[aimingKey] =
                valueFromProximity(
                    hardMul * difficultySetting,
                    aimingKey,
                    bossMeanJson,
                    sprayPrayMeanJson,
                    insaneMean
                );
            tables.bots.types[botkey].difficulty.impossible.Aiming[aimingKey] =
                valueFromProximity(
                    impossibleMul * difficultySetting,
                    aimingKey,
                    bossMeanJson,
                    sprayPrayMeanJson,
                    insaneMean
                );

        });
    });

    // Credit to SAIN This appears to make bots alot more consistent across maps.
    for (const locationName in tables.locations) {
        const location = tables.locations[locationName].base;

        if (location && location.BotLocationModifier) {
            location.BotLocationModifier.AccuracySpeed = 1;
            location.BotLocationModifier.GainSight = 1;
            location.BotLocationModifier.Scattering = 1;
            location.BotLocationModifier.VisibleDistance = 1;
        }
    }
}