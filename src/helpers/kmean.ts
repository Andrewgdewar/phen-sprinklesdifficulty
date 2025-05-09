
const columInteger : Set<string> = new Set([
    "DAMAGE_TO_DISCARD_AIM_0_100",
    "FIRST_CONTACT_ADD_CHANCE_100",
    "NEXT_SHOT_MISS_CHANCE_100",
    "ANYTIME_LIGHT_WHEN_AIM_100",
    "AIMING_TYPE"
])

type MeanMap = { [key: string]: number };

function closetinlist(goal, counts) {
    return counts.reduce((prev, curr) => Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev); 
};

/**
 * Given a bossness score (0 to 1 to 4), interpolate a value between spray and boss and exusec (insane).
 * 0 = spray-and-pray value, 1 = boss/sniper value, 0.5 = midway, 4 = exusec
 */
export function valueFromProximity(
    proximity: number,
    column: string,
    bossMeans: MeanMap,
    sprayMeans: MeanMap,
    insaneMeans: MeanMap
): number {
    const bossVal = bossMeans[column];
    const sprayVal = sprayMeans[column];
    const insaneVal = insaneMeans[column];

    if (bossVal === undefined || sprayVal === undefined || insaneVal === undefined) {
        throw new Error(`Missing mean values for column: ${column}`);
    }

    if(proximity < 1.0)
    {
        const result = sprayVal + proximity * (bossVal - sprayVal);
        //console.log(`Setting result ${column} to ${result}`);
        return columInteger.has(column) ? Math.round(result) : result;
    }

    const result = bossVal + ((1.0 - proximity) / 4.0) * (insaneVal - bossVal);
    //console.log(`Setting result ${column} to ${result}`);
    return columInteger.has(column) ? Math.round(result) : result;
}

/**
 * Calculates how close a value is to a 'boss-like' AI behavior.
 * Returns a number between 0 (spray-and-pray) and 1 (boss), 4 (usec)
 */
export function proximityToBoss(
    value: number,
    column: string,
    bossMeans: MeanMap,
    sprayMeans: MeanMap
): number {
    const bossVal = bossMeans[column];
    const sprayVal = sprayMeans[column];

    if (bossVal === undefined || sprayVal === undefined) {
        throw new Error(`Missing mean values for column: ${column}`);
    }
    if (bossVal === sprayVal) 
        return 0.5;

    const score = (value - sprayVal) / (bossVal - sprayVal);
    return Math.max(0, Math.min(1, score));
}

