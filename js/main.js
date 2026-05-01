// CANNATEK - Motor Unificado v3.5
let carrito = JSON.parse(localStorage.getItem('cart')) || [];
const WS_NUMBER = "5491123629580";

function iniciarProcesoCheckout() {
    if (!carrito.length) {
        mostrarAvisoCarritoVacio();
        return;
    }
    localStorage.removeItem('user_authenticated'); 
    mostrarAvisoSeguridad();
}

function mostrarAvisoCarritoVacio() {
    const avisoHTML = `
        <div id="empty-cart-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(15px); z-index:5000; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.3s ease;">
            <div style="background:rgba(28,28,30,0.92); border:0.5px solid rgba(255,255,255,0.1); padding:36px; border-radius:28px; text-align:center; max-width:380px; box-shadow:0 20px 40px rgba(0,0,0,0.4);">
                <h2 style="font-size:23px; margin-bottom:10px; font-weight:600; color:white;">Tu bolsa está vacía</h2>
                <p style="color:#86868b; font-size:15px; margin-bottom:24px;">Elegí al menos un producto para continuar con la verificación y confirmar tu pedido.</p>
                <button onclick="document.getElementById('empty-cart-overlay').remove()" class="buy-btn" style="padding:14px 34px; width:100%;">Ver productos</button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', avisoHTML);
}

function mostrarAvisoSeguridad() {
    const avisoHTML = `
        <div id="auth-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(15px); z-index:5000; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.4s ease;">
            <div style="background:rgba(28,28,30,0.9); border:0.5px solid rgba(255,255,255,0.1); padding:40px; border-radius:32px; text-align:center; max-width:380px; box-shadow:0 20px 40px rgba(0,0,0,0.4);">
                <h2 style="font-size:24px; margin-bottom:12px; font-weight:600; color:white;">Verificación Requerida</h2>
                <p style="color:#86868b; font-size:15px; margin-bottom:28px;">Para garantizar la seguridad de tu pedido, necesitamos verificar tu identidad por Gmail.</p>
                <button id="btn-iniciar-auth" class="buy-btn" style="padding:16px 40px; width:100%;">Entendido, verificar ahora</button>
                <p onclick="document.getElementById('auth-overlay').remove()" style="color:#444; font-size:12px; margin-top:15px; cursor:pointer;">Cancelar</p>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', avisoHTML);
    document.getElementById('btn-iniciar-auth').onclick = () => window.location.href = 'checkout.html';
}

function agregarAlCarrito(producto, sabor) {
    const itemExistente = carrito.find(item => item.id === producto.id && item.sabor === sabor);
    if (itemExistente) { itemExistente.cantidad++; } else { carrito.push({ ...producto, sabor, cantidad: 1 }); }
    actualizarCarrito();
    if (!document.getElementById("cart-panel").classList.contains("active")) toggleCart();
}

function cambiarCantidad(index, delta) {
    if (carrito[index]) {
        carrito[index].cantidad += delta;
        if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const contenedor = document.getElementById('cart-content');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    let total = 0, cant = 0;

    if (contenedor) {
        contenedor.innerHTML = carrito.length === 0 ? '<p style="color:#86868b; font-size:15px; text-align:center; padding-top:40px;">Tu bolsa está vacía.</p>' : '';
        carrito.forEach((item, index) => {
            const sub = (item.precio || 0) * item.cantidad; total += sub; cant += item.cantidad;
            contenedor.innerHTML += `
                <div class="cart-item-row">
                    <img src="${item.img}" class="cart-item-img">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.marca} ${item.modelo || ''}</p>
                        <p style="font-size:12px; color:var(--text-secondary);">${item.sabor}</p>
                        <div class="qty-control">
                            <button class="qty-btn" onclick="cambiarCantidad(${index}, -1)">−</button>
                            <span style="font-size:12px; font-weight:600;">${item.cantidad}</span>
                            <button class="qty-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div style="text-align:right;"><span style="font-weight:600; font-size:14px; color:var(--accent-color);">$${sub.toLocaleString('es-AR')}</span></div>
                </div>`;
        });
    }
    if (totalEl) totalEl.innerText = total.toLocaleString('es-AR');
    if (countEl) countEl.innerText = cant;
    localStorage.setItem('cart', JSON.stringify(carrito));
}

function toggleCart() {
    const panel = document.getElementById("cart-panel"), overlay = document.getElementById("overlay");
    if (panel) { panel.classList.toggle("active"); overlay.style.display = panel.classList.contains("active") ? "block" : "none"; }
}

document.addEventListener('DOMContentLoaded', actualizarCarrito);