const options = {
    client: 'sqlite3',
    connection: {
        filename: './src/DB/ecommerce.sqlite'
    },
    useNullAsDefault: true
};

module.exports = options;