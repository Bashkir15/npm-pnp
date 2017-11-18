import { isAbsolute, relative } from 'path';
import { rollup } from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replacePlugin from 'rollup-plugin-replace';
import yamlPlugin from 'rollup-plugin-yaml';
import jsonPlugin from 'rollup-plugin-json';
import fileExists from 'file-exists';

const formatToRollup = {
    commonjs: 'cjs',
    esmodule: 'es',
};

export function findBestInput(inputs) {
    const filtered = inputs.filter(fileExists.sync);
    return filtered[0];
}

export function generateBundle({
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
}) {
    const prefix = 'process.env.';
    const env = {
        [`${prefix}NAME`]: JSON.stringify(pkg.name),
        [`${prefix}VERSION`]: JSON.stringify(pkg.version),
        [`${prefix}TARGET`]: JSON.stringify(targetId),
    };

    return rollup({
        input,
        cache,
        onwarn(error) {
            console.warn(error.message);
        },
        external(dependency) {
            if (dependency == input) {
                return false;
            }

            if (isAbsolute(dependency)) {
                const relativePath = relative(Root, dependency);
                return Boolean(/node_modules/.exec(relativePath));
            }

            return dependency.charAt(0) !== '.';
        },
        plugins: [
            nodeResolve({
                extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'],
                jsnext: true,
                module: true,
                main: true,
            }),
            replacePlugin(env),
            commonjs({
                include: 'node_modules/**',
            }),
            yamlPlugin(),
            jsonPlugin(),
            current,
        ],
    })
        .then(({ write }) =>
            write({
                format: formatToRollup[format],
                name,
                banner,
                dest: outputFile,
            })
        )
        .then(() => doneCallback(null))
        .catch(err => {
            console.error(err);
            doneCallback(`Error bundling ${input} in ${format}: ${err}`);
        });
}
