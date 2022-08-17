const socket = io.connect();

const logoutBtn = document.getElementById('logoutBtn');

const handleLogout = () => {
    location.href = '/app/logout';
}

logoutBtn.addEventListener('click', handleLogout);

const removeFromCart = (product) => {
    alert(`Producto: ${product.name} eliminado del carrito`);
    socket.emit('removeItemCart', product.id);
};

const renderCart = ({ products, total }) => {
    const cartItems = document.getElementById('cart-items');
    const cartFooter = document.getElementById('cart-footer');

    if(!products.length) {
        cartItems.innerHTML = '<p>No hay productos en el carrito</p>';
        cartFooter.classList.add('hidden');
        return;
    }

    cartFooter.classList.remove('hidden');

    const cartTotal = document.getElementById('total');
    cartTotal.innerText = `Total: $${total}`;
    
    cartItems.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <p>${product.name}</p>
            <p>${product.subTotal / product.quantity}</p>
            <p>${product.quantity}</p>
            <p>${product.subTotal}</p>
            <button class="addCart" id="remove-${product.id}-btn">X</button>
        `;
         
        cartItems.appendChild(productDiv); 

        const removeBtn = document.getElementById(`remove-${product.id}-btn`);
        removeBtn.addEventListener('click', 
            () => { removeFromCart(product) });
    });
};

socket.on('cartItems', cart => renderCart(cart));

const checkoutBtn = document.getElementById('checkoutBtn');
const handleCheckout = () => {
    location.href = '/app/cart/checkout';
}
checkoutBtn.addEventListener('click', handleCheckout);