import babel from 'rollup-plugin-babel';
import frostPreset from 'babel-preset-frost';

export function createBabelHelper({
    mode = 'classic',
    minified = false,
    presets = [],
    plugins = [],
    unstableTarget = false,
}) {
    const extraPresets = presets.concat();
    const extraPlugins = plugins.concat();

    let selected;

    if (mode === 'modern') {
        selected = [
            frostPreset,
            {
                target: 'modern',
                env: 'production',
                compression: minified,
            },
        ];
    } else if (mode === 'es2015') {
        selected = [
            frostPreset,
            {
                target: 'es2015',
                env: 'production',
                compression: minified,
            },
        ];
    } else if (mode === 'binary') {
        selected = [
            frostPreset,
            {
                target: unstableTarget ? 'node8' : 'node',
                env: 'production',
                compression: minified,
                modules: false,
            },
        ];
    } else {
        selected = [
            frostPreset,
            {
                target: 'library',
                env: 'production',
                compression: minified,
            },
        ];
    }

    return babel({
        // don't look for .rc so we can force this config
        babelrc: false,
        runtimeHelpers: true,
        comments: minified === false,
        compact: minified === true ? true : 'auto',
        minified,
        exclude: ['node_modules/**', '**/*.json'],
        presets: [selected, ...extraPresets],
        plugins: [...extraPlugins],
    });
}

export default function createBabel(config) {
    return {
        classic: createBabelHelper({ ...config, mode: 'classic' }),
        es2015: createBabelHelper({ ...config, mode: 'es2015' }),
        modern: createBabelHelper({ ...config, mode: 'modern' }),
        binary: createBabelHelper({ ...config, mode: 'binary' }),
    };
}
