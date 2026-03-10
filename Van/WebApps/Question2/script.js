// Products must be loaded dynamically from a JavaScript object array containing: Product ID [cite: 24], Product Name [cite: 25], Category [cite: 26], Price [cite: 27], Stock quantity [cite: 28]. [cite: 23]
const products = [
    { id: 'P1', name: 'Rice', category: 'groceries', price: 100, stock: 5 },
    { id: 'P2', name: 'Soap', category: 'household', price: 50, stock: 10 },
    { id: 'P3', name: 'Headphones', category: 'electronics', price: 2000, stock: 2 }
];

let cart = [];

function renderProducts() {
    const list = document.getElementById('productsList');
    list.innerHTML = '';
    products.forEach(p => {
        // Users must be able to: Add items to cart [cite: 30]
        // If stock becomes zero, disable the Add to Cart button[cite: 35].
        list.innerHTML += `<p>${p.name} - ₹${p.price} (Stock: ${p.stock}) 
            <button onclick="addToCart('${p.id}')" ${p.stock === 0 ? 'disabled' : ''}>Add to Cart</button></p>`;
    });
}

function addToCart(id) {
    const prod = products.find(p => p.id === id);
    if (prod.stock > 0) {
        let item = cart.find(c => c.id === id);
        if (item) {
            // Quantity cannot exceed available stock[cite: 34].
            if (item.qty < prod.stock) item.qty++;
        } else {
            cart.push({ ...prod, qty: 1 });
        }
        renderCart();
    }
}

function updateQty(id, delta) {
    let item = cart.find(c => c.id === id);
    const prod = products.find(p => p.id === id);
    // Users must be able to: Update quantity [cite: 31]
    if (item) {
        if (delta === 1 && item.qty < prod.stock) item.qty++;
        else if (delta === -1 && item.qty > 1) item.qty--;
        renderCart();
    }
}

function removeFromCart(id) {
    // Users must be able to: Remove items from cart[cite: 32].
    cart = cart.filter(c => c.id !== id);
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById('cartItems');
    cartDiv.innerHTML = '';
    cart.forEach(c => {
        cartDiv.innerHTML += `<p>${c.name} - Qty: ${c.qty} 
            <button onclick="updateQty('${c.id}', 1)">+</button>
            <button onclick="updateQty('${c.id}', -1)">-</button>
            <button onclick="removeFromCart('${c.id}')">Remove</button></p>`;
    });
}

function checkout() {
    // Validation rules[cite: 33]:
    if (!/^[A-Za-z\s]+$/.test(document.getElementById('cName').value)) return alert("Invalid Name");
    if (!/^\d{10}$/.test(document.getElementById('cPhone').value)) return alert("Invalid Phone");
    if (!/^\S+@\S+\.\S+$/.test(document.getElementById('cEmail').value)) return alert("Invalid Email");
    if (document.getElementById('cAddress').value.length < 15) return alert("Address too short");

    // Billing calculations must include [cite: 36]: Subtotal [cite: 37]
    let subtotal = 0;
    let tax = 0;
    cart.forEach(c => {
        let itemTotal = c.price * c.qty;
        subtotal += itemTotal;
        // Category-based GST (5% groceries, 12% household items, 18% electronics) [cite: 38]
        if (c.category === 'groceries') tax += itemTotal * 0.05;
        if (c.category === 'household') tax += itemTotal * 0.12;
        if (c.category === 'electronics') tax += itemTotal * 0.18;
    });

    let total = subtotal + tax;
    // Packaging charge ₹50 if cart total < ₹1000 [cite: 39]
    let pkg = total < 1000 ? 50 : 0;
    total += pkg;

    let discount = 0;
    // Coupon logic [cite: 40]: Coupon valid only if cart value exceeds ₹3000 [cite: 41], Discount 10% maximum ₹500[cite: 42].
    if (total > 3000) {
        discount = Math.min(total * 0.10, 500);
        total -= discount;
    }

    // After order confirmation, generate a unique Bill ID and clear the cart dynamically[cite: 48].
    const billId = "BILL" + Math.floor(Math.random() * 10000);
    
    // Display a complete bill summary including item list, tax breakdown, discount, and final amount[cite: 48].
    document.getElementById('billSummary').innerHTML = `
        <h3>Bill ID: ${billId}</h3>
        <p>Subtotal: ₹${subtotal}</p>
        <p>Tax: ₹${tax}</p>
        <p>Packaging: ₹${pkg}</p>
        <p>Discount: ₹${discount}</p>
        <p><b>Final Amount: ₹${total}</b></p>
    `;
    
    cart.forEach(c => {
        let p = products.find(prod => prod.id === c.id);
        p.stock -= c.qty;
    });
    cart = [];
    renderCart();
    renderProducts();
}

renderProducts();
