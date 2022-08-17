const Container = require('./lib/Container');
const sqlite = require('./options/sqlite');

const pd = new Container(sqlite, 'products');

pd.createTable(
    (table) => {
        table.increments('id').primary();
        table.string('name', 50).notNullable();
        table.float('price').notNullable();
        table.string('thumbnail', 255).notNullable();
    }
);

module.exports = {
    pd
};