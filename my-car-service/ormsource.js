// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require('./ormconfig.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DataSource = require('typeorm').DataSource;

const source = new DataSource(dbConfig);

module.exports = source;
