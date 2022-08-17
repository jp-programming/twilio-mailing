const { faker } = require('@faker-js/faker');
faker.locale = 'es_MX';

const createProducts = () => {
    const products = Array.from(new Array(5), () => ({
        name: faker.commerce.product(),
        price: faker.commerce.price(), 
        thumbnail: faker.image.business()
    }));

    return products;
};

module.exports = {
    createProducts
}


