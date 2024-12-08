let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update jumlah item di ikon keranjang
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }
}

// Tambah item ke keranjang (dengan quantity)
function addToCart(name, price) {
  // Cek apakah item sudah ada di keranjang
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    // Jika sudah ada, tambahkan quantity
    existingItem.quantity += 1;
  } else {
    // Jika belum ada, tambahkan item baru
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Hapus item dari keranjang
function removeFromCart(index) {
  const item = cart[index];

  if (item.quantity > 1) {
    // Kurangi quantity jika lebih dari 1
    item.quantity -= 1;
  } else {
    // Hapus item jika quantity adalah 1
    cart.splice(index, 1);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartList();
  updateTotal();
}

// Tampilkan daftar di modal
function updateCartList() {
  const cartList = document.getElementById('cart-list');
  if (cartList) {
    cartList.innerHTML = '';

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = `${item.name} - Rp ${item.price} x ${item.quantity}`;

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Hapus';
      removeButton.classList.add('btn', 'btn-sm', 'btn-danger', 'ms-2');
      removeButton.addEventListener('click', () => {
        removeFromCart(index); // Gunakan fungsi hapus
      });

      li.appendChild(removeButton);
      cartList.appendChild(li);
    });
  }
}

// Menghitung dan menampilkan total harga
function updateTotal() {
  let total = 0;

  // Hitung total harga dari semua item dalam keranjang
  for (let item of cart) {
    total += item.price * item.quantity; // Perhitungan total dengan quantity
  }

  // Menampilkan total harga di elemen dengan id 'total-price'
  document.getElementById('total-price').innerText = `Total: Rp ${total.toLocaleString()}`;
}

// Kirim ke WhatsApp
function sendToWhatsApp() {
  if (cart.length === 0) {
    alert('Keranjang belanja kosong!');
    return;
  }

  const message = cart
    .map((item, index) => `${index + 1}. ${item.name} - Rp ${item.price} x ${item.quantity}`)
    .join('\n');

  const whatsappNumber = '085792972827'; // Ganti dengan nomor WhatsApp Anda
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Order Barang:\n' + message)}`;
  
  window.open(whatsappLink, '_blank');
}

// Buka modal
function showCartModal() {
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) {
    updateCartList();
    updateTotal();
    cartModal.style.display = 'flex';
  }
}

// Tutup modal
function closeCartModal() {
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) {
    cartModal.style.display = 'none';
  }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', showCartModal);
  }

  const closeModal = document.getElementById('close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', closeCartModal);
  }

  const sendWhatsAppButton = document.getElementById('send-whatsapp');
  if (sendWhatsAppButton) {
    sendWhatsAppButton.addEventListener('click', sendToWhatsApp);
  }

  // Tambah ke keranjang jika tombol klik
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price')); // Pastikan harga dalam format angka
      addToCart(name, price);
    });
  });
});
