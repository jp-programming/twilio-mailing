const socket = io.connect();

const renderProducts = (products) => {
    const productList = document.getElementById('products');
    console.log(products)
    const html = products.map(product => 
        `<div class="product">
            <p>${product.name}</p>
            <p>${product.price}</p>
            <img src="${product.thumbnail}" alt="${product.name}">
        </div>`
    ).join(" ");

    productList.innerHTML = html;
};

socket.on('productsTest', products => renderProducts(products));