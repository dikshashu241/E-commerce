const products=[
{id:1,name:"Smartphone",price:12000,category:"electronics",img:".//images/p1.jpg"},
{id:2,name:"Laptop",price:55000,category:"electronics",img:".//images/p2.jpg"},
{id:3,name:"T-Shirt",price:700,category:"fashion",img:".//images/p3.jpg"},
{id:4,name:"Sneakers",price:2000,category:"fashion",img:".//images/p4.jpg"},
{id:5,name:"Rice Bag",price:60,category:"grocery",img:".//images/p5.jpg"},
{id:6,name:"Saree",price:5000,category:"fashion",img:".//images/p6.jpg"},
{id:7,name:"Almirah",price:12000,category:"furniture",img:".//images/p7.jpg"},
{id:8,name:"Watch",price:500,category:"electronics",img:".//images/p8.jpg"},
{id:9,name:"Jeans",price:900,category:"fashion",img:".//images/p9.jpg"},
{id:10,name:"Kurti",price:200,category:"fashion",img:".//images/p10.jpg"},
{id:11,name:"Corn flour",price:80,category:"grocery",img:".//images/p11.jpg"},
{id:12,name:"Milk Pack",price:50,category:"grocery",img:".//images/p12.jpg"}
];

let cart=JSON.parse(localStorage.getItem('cart'))||[];

function saveCart(){
localStorage.setItem('cart',JSON.stringify(cart));
}

function renderProducts(){
let search=document.getElementById('search').value.toLowerCase();
let cat=document.getElementById('category').value;

let filtered=products.filter(p=>p.name.toLowerCase().includes(search)&&(cat==='all'||p.category===cat));

document.getElementById('products').innerHTML=filtered.map(p=>`
<div class="card">
<img src="${p.img}">
<h4>${p.name}</h4>
<p class="price">₹${p.price}</p>
<button onclick="addToCart(${p.id})">Add to Cart</button>
</div>`).join('');
}

function addToCart(id){
let item=cart.find(i=>i.id===id);
if(item)item.qty++; else cart.push({...products.find(p=>p.id===id),qty:1});
saveCart();renderCart();
}

function renderCart(){
document.getElementById('cart-count').innerText=cart.reduce((a,b)=>a+b.qty,0);

let subtotal=cart.reduce((a,b)=>a+b.price*b.qty,0);
let shipping=subtotal?50:0;
let total=subtotal+shipping;

let html='<h3>Your Cart</h3>';

cart.forEach(item=>{
html+=`
<div class="cart-item">
<div class="cart-row"><strong>${item.name}</strong><span>₹${item.price}</span></div>
<div class="qty-controls">
<button onclick="changeQty(${item.id},1)">+</button>
<button onclick="changeQty(${item.id},-1)">-</button>
<button onclick="removeItem(${item.id})">Remove</button>
</div>
</div>`;
});

html+=`<div class="cart-summary">
<hr>
<p>Subtotal: ₹${subtotal}</p>
<p>Shipping: ₹${shipping}</p>
<h3>Total: ₹${total}</h3>
</div>

<div class="checkout">
<h3>Checkout</h3>
<input id="name" placeholder="Full Name">
<input id="mobile" placeholder="Mobile Number">
<input id="address" placeholder="Shipping Address">

<h4>Select Payment Method</h4>

<div class="payment-box">

<label class="payment-option">
<div class="payment-left">
<span class="payment-icon">📱</span>
<span>UPI (Google Pay / PhonePe)</span>
</div>
<input type="radio" name="payment" value="UPI">
</label>

<label class="payment-option">
<div class="payment-left">
<span class="payment-icon">💳</span>
<span>Credit / Debit Card</span>
</div>
<input type="radio" name="payment" value="Card">
</label>

<label class="payment-option">
<div class="payment-left">
<span class="payment-icon">💵</span>
<span>Cash on Delivery (COD)</span>
</div>
<input type="radio" name="payment" value="COD">
</label>

</div>
<button onclick="checkout()">Place Order</button>
</div>`;

document.getElementById('cart').innerHTML=html;
}

function changeQty(id,delta){
let item=cart.find(i=>i.id===id);
item.qty+=delta;
if(item.qty<=0)cart=cart.filter(i=>i.id!==id);
saveCart();renderCart();
}

function removeItem(id){
cart=cart.filter(i=>i.id!==id);
saveCart();
renderCart();
}

function checkout(){
let name=document.getElementById('name').value;
let mobile=document.getElementById('mobile').value;
let address=document.getElementById('address').value;
let payment=document.querySelector('input[name=\"payment\"]:checked');

if(!name||!mobile||!address||!payment){
alert('Complete all fields');
return;
}

// remove spaces and +91
mobile = mobile.replace(/\s+/g, '').replace('+91','');

if(!/^\d{10}$/.test(mobile)){
alert('Enter valid 10-digit mobile number');
return;
}

cart=[];
saveCart();

document.getElementById('store').style.display='none';
document.getElementById('cart').classList.remove('active');
document.getElementById('success').classList.add('active');
}

function toggleCart(){
let cart = document.getElementById('cart');
let overlay = document.getElementById('overlay');

cart.classList.toggle('active');
overlay.classList.toggle('active');

// disable background scroll
if(cart.classList.contains('active')){
document.body.style.overflow = 'hidden';
}else{
document.body.style.overflow = 'auto';
}
}
function goHome(){
location.reload();
}

document.getElementById('search').addEventListener('input',renderProducts);
document.getElementById('category').addEventListener('change',renderProducts);

renderProducts();
renderCart();
let selectedPayment = payment.value;

// show payment method in success page
document.getElementById('payment-method').innerText = selectedPayment;

