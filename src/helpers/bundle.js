import fileExists from 'file-exists';

export function findBestInput(inputs) {
    const filtered = inputs.filter(fileExists.sync);
    return filtered[0];
}
