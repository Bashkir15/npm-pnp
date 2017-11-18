import buble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';
import builtinModules from 'builtin-modules';

const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies).concat(builtinModules);

export default {
    input: 'src/index.js',
    output: {
        file: 'bin/npm-pnp',
        format: 'cjs',
        sourcemap: true,
    },
    external,
    banner: '#!/usr/bin/env node\n',
    plugins: [
        json(),
        buble({
            objectAssign: 'Object.assign',
        }),
    ],
};
