export function generateOutputMatrix(pkg, binary) {
    return {
        'node-classic-commonjs': pkg['main'] || null,
        'node-classic-esmodule': pkg['module'] || pkg['jsnext:main'] || null,

        'node-es2015-commonjs': pkg['main:es2015'] || null,
        'node-es2015-esmodule': pkg['es2015'] || pkg['module:es2015'] || null,

        'node-modern-commonjs': pkg['main:modern'] || null,
        'node-modern-esmodule': pkg['module:modern'] || null,

        'web-classic-esmodule': pkg['web'] || pkg['browser'] || null,
        'web-es2015-esmodule':
            pkg['web:es2015'] || pkg['browser:es2015'] || null,
        'web-modern-esmodule':
            pkg['web:modern'] || pkg['browser:modern'] || null,
        'binary-binary-commonjs': binary || null,
    };
}

export function generateOutputFolder(folder, matrix) {
    matrix['node-classic-commonjs'] = `${folder}/node.classic.cjs.js`;
    matrix['node-classic-esmodule'] = `${folder}/node.classic.es.js`;

    matrix['node-es2015-commonjs'] = `${folder}/node.es2015.cjs.js`;
    matrix['node-es2015-esmodule'] = `${folder}/node.es2015.es.js`;

    matrix['node-modern-commonjs'] = `${folder}/node.modern.cjs.js`;
    matrix['node-modern-esmodule'] = `${folder}/node.modern.es.js`;

    matrix['web-classic-esmodule'] = `${folder}/web.classic.es.js`;
    matrix['web-es2015-esmodule'] = `${folder}/web.es2015.es.js`;
    matrix['web-modern-esmodule'] = `${folder}/web.modern.es.js`;

    return matrix;
}
