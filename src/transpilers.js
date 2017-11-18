import createBabel from './helpers/babel';
import createBuble from './helpers/buble';

export default function getTranspiler(mode, config) {
    switch (mode) {
        case 'buble':
            return createBuble(config);
        case 'babel':
            return createBabel(config);
        default: {
        }
    }
}
