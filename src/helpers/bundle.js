import fileExists from 'file-exists';

export function findBest(inputs) {
    const filtered = inputs.filter(fileExists.sync);
    return filtered[0];
}
