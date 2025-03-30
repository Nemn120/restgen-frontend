import pkg from '../../package.json';

export const environment = {
    production: true,
    NAME: pkg.name,
    VERSION: pkg.version,
    URI: 'BACKEND_URI_PLACEHOLDER'
};
