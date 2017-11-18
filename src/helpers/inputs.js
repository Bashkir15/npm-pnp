export default function configureInputs(flags) {
    const inputNode = flags.inputNode;
    const inputWeb = flags.inputWeb;
    const inputBinary = flags.inputBinary;
    const targets = {};

    buildInput(targets, inputNode);
    buildWeb(targets, inputWeb);
    buildBinary(targets, inputBinary);

    return targets;
}

function buildInputs(targets, input) {
    if (input) {
        targets.node = [input];
    } else {
        targets.node = [
            'src/node/public.js',
            'src/node/export.js',
            'src/node.js',

            'src/server/public.js',
            'src/server/export.js',
            'src/server/server.js',

            'server/server.js',
            'server/index.js',
        ];
    }
}

function buildWeb(targets, web) {
    if (web) {
        targets.web = [web];
    } else {
        targets.web = [
            'src/web/public.js',
            'src/web/export.js',
            'src/web.js',

            'src/browser/public.js',
            'src/browser/export.js',
            'src/browser.js',

            'src/client/public.js',
            'src/client/export.js',
            'src/client/index.js',
            'src/client.js',

            'client/index.js',
            'client/main.js',
        ];
    }
}

function buildBinary(targets, binary) {
    if (binary) {
        targets.binary = [binary];
    } else {
        targets.binary = ['src/binary.js', 'src/script.js', 'src/cli.js'];
    }
}
