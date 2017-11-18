import { get as getRoot } from 'app-root-dir';
import { eachOfSeries } from 'async';
import meow from 'meow';

import getTranspilers from './transpilers';
import getBanner from './banner';
import configureInputs from './helpers/inputs';
import { findBestInput, generateBundle } from './helpers/bundle';
import { generateOutputMatrix, generateOutputFolder } from './helpers/output';

const Root = getRoot();
const pkg = require(resolve(Root, 'package.json'));

let cache;

const command = meow(
    `
    Usage
        $ npm-pnp

    Options
        --input-node        Input file for targeting NodeJS
        --input-web         Input file for targeting Browsers
        --input-binary      Input file for targeting binaries

        --output-folder     The destination folder
`,
    {
        default: {
            inputNode: null,
            inputWeb: null,
            inputBinary: null,
            outputFolder: null,
        },
    }
);

const binaryConfig = pkg.bin;
let binaryOutput = null;
if (binaryConfig) {
    for (const name in binaryConfig) {
        binaryOutput = binaryConfig[name];
        break;
    }
}

const outputFolder = command.flags.outputFolder;
const outputMatrix = generateOutputFolder(
    outputFolder,
    generateOutputMatrix(pkg, binaryOutput)
);

const name = pkg.name;
const banner = getBanner(pkg);
const formats = ['esmodule', 'cjs'];
const targets = configureInputs(command.flags);

try {
    eachOfSeries(targets, (inputs, targetId, inputCallback) => {
        const input = findBestInput(inputs);
        if (input) {
            eachOfSeries(
                formats,
                (format, formatIdx, formatCallback) => {
                    const transpilers = getTranspilers(
                        command.flags.transpiler,
                        {
                            minified: command.flags.minified,
                            presets: [],
                            plugins: [],
                            unstableTarget: true,
                        }
                    );
                    eachOfSeries(
                        transpilers,
                        (current, transpilerId, doneCallback) => {
                            const outputFile =
                                outputMatrix[
                                    `${targetId}-${transpilerId}-${format}`
                                ];
                            if (outputFile) {
                                return generateBundle({
                                    input,
                                    targetId,
                                    transpilerId,
                                    current,
                                    format,
                                    outputFile,
                                    pkg,
                                    banner,
                                    cache,
                                    Root,
                                    doneCallback,
                                });
                            } else {
                                return doneCallback(null);
                            }
                        },
                        formatCallback
                    );
                },
                inputCallback
            );
        } else {
            inputCallback(null);
        }
    });
} catch (err) {
    console.error(err);
    process.exit(1);
}
