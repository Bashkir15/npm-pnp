import fs from 'fs';

const executable = 0o111;

export default function execute(config = {}) {
    return {
        onwrite: ({ file }) => {
            const { mode } = fs.statSync(file);
            const newMode = mode | executable;
            fs.chmodSync(file, newMode);
        },
    };
}
