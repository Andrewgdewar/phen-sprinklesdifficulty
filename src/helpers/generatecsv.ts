import * as fs from 'fs';
import * as path from 'path';

const jsonsInDir = fs.readdirSync('./types').filter(file => path.extname(file) === '.json');
const interestedKeys = [
    'Aiming',
    'Boss',
    'Change',
    'Core',
    'Cover',
    'Grenade',
    'Hearing',
    'Lay',
    'Look',
    'Mind',
    'Move',
    'Patrol',
    'Scattering',
    'Shoot'
] as const;

const difficulties = ['easy', 'hard', 'normal', 'impossible'] as const;

const filterFiles = [
    'bear.json',
    'usec.json',
    'gifter.json',
    'peacefullzryachiyevent.json',
    'spiritspring.json',
    'spiritwinter.json',
    'test.json',
    'followertest.json',
    'bosstest.json',
    'infectedassault.json',
    'infectedcivil.json',
    'infectedlaborant.json',
    'infectedpmc.json',
    'infectedtagilla.json'
];

/** Type for a difficulty type */
type Difficulty = typeof difficulties[number];
/** Type for a key we're interested in */
type InterestedKey = typeof interestedKeys[number];
/** JSON structure of files */
interface DifficultyJSON {
    difficulty: Record<Difficulty, Record<InterestedKey, Record<string, any>>>;
}

/** Helper to get JSON files in directory and write specific difficulty section */
function getJSONdir(type: Difficulty): void {
    jsonsInDir.forEach(file => {
        const filePath = path.join('./types', file);
        const fileData = fs.readFileSync(filePath);
        const json: DifficultyJSON = JSON.parse(fileData.toString());
        const stringified = JSON.stringify(json.difficulty[type]);
        const outputPath = path.join('./', type, file);
        fs.writeFileSync(outputPath, stringified);
    });
}

// Main execution
difficulties.forEach(difficulty => {
    getJSONdir(difficulty);

    const difficultyJsonFiles = fs.readdirSync(path.join('./', difficulty)).filter(file => path.extname(file) === '.json');

    const keyColumns: Record<InterestedKey, { columns: Set<string>; values: Record<string, Record<string, any>> }> = {} as any;

    difficultyJsonFiles
        .filter(file => !filterFiles.includes(file))
        .forEach(file => {
            const filePath = path.join('./', difficulty, file);
            const fileData = fs.readFileSync(filePath);
            const json: Record<InterestedKey, Record<string, any>> = JSON.parse(fileData.toString());

            interestedKeys.forEach(interestedKey => {
                if (!keyColumns[interestedKey]) {
                    keyColumns[interestedKey] = { columns: new Set(), values: {} };
                }

                const currentJson = json[interestedKey];
                if (currentJson) {
                    Object.keys(currentJson).forEach(key => keyColumns[interestedKey].columns.add(key));
                    keyColumns[interestedKey].values[file] = currentJson;
                }
            });
        });

    // Write output CSVs
    interestedKeys.forEach(interestedKey => {
        const columns = Array.from(keyColumns[interestedKey]?.columns || []);
        const header = ['NAME', ...columns].join(',');

        fs.writeFileSync(path.join('./out', `${interestedKey}.csv`), header + '\n');
        Object.entries(keyColumns[interestedKey]?.values || {}).forEach(([file, values]) => {
            const row = [file];
            columns.forEach(column => {
                row.push(values[column] != null ? values[column] : 'null');
            });
            fs.appendFileSync(path.join('./out', `${interestedKey}.csv`), row.join(',') + '\n');
        });
    });
});
