import pkg from '../../package.json';

export const environment = {
    production: false,
    NAME: pkg.name,
    VERSION: pkg.version,
    URI: 'http://localhost:8080/restgen'
};

