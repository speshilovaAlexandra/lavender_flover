<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Ваша корзина</h1>

      <!-- Empty State -->
      <div v-if="cart.length === 0" class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>Корзина пуста</h3>
        <p>Похоже, вы еще ничего не добавили.</p>
        <button class="btn-browse" @click="router.push('/')">Перейти в каталог</button>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-content">
        <!-- Items List -->
        <div class="items-section">
          <div class="items-header">
            <span>Товар</span>
            <span class="text-right">Итого</span>
          </div>
          
          <div v-for="item in cart" :key="item.id" class="cart-item">
            <div class="item-details">
              <!-- Optional: Add an image placeholder if you have one, otherwise keep text -->
              <div class="item-image-placeholder">
                <span>{{ item.nazvanie.charAt(0) }}</span>
              </div>
              <div class="item-text">
                <h4 class="item-name">{{ item.nazvanie }}</h4>
                <p class="item-price">${{ item.price }} / шт.</p>
              </div>
            </div>

            <div class="item-actions">
              <div class="qty-control">
                <button @click="changeQty(item, -1)" :class="{ 'disabled': item.qty <= 1 }">
                  <svg width="12" height="2" viewBox="0 0 12 2" fill="none"><path d="M0 1H12" stroke="currentColor" stroke-width="2"/></svg>
                </button>
                <span class="qty-value">{{ item.qty }}</span>
                <button @click="changeQty(item, 1)">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0V12M0 6H12" stroke="currentColor" stroke-width="2"/></svg>
                </button>
              </div>
              <div class="item-total">
                ${{ (item.price * item.qty).toFixed(2) }}
              </div>
              <button class="btn-remove" @click="changeQty(item, -item.qty)" title="Удалить">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
          <h3>Детали заказа</h3>
          <div class="summary-row">
            <span>Количество товаров:</span>
            <span>{{ cart.reduce((acc, item) => acc + item.qty, 0) }} шт.</span>
          </div>
          <div class="summary-row total">
            <span>Итого к оплате:</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          
          <div class="checkout-area">
            <button class="btn-checkout" @click="sendOrder" :disabled="loading">
              <span v-if="loading">Обработка...</span>
              <span v-else>Оформить заказ</span>
            </button>
            <div v-if="error" class="error-msg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';

const router = useRouter();
const cart = ref([]);
const loading = ref(false);
const error = ref('');

onMounted(() => {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]');
});

const total = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0));

const changeQty = (item, val) => {
  item.qty += val;
  if (item.qty < 1) {
    cart.value = cart.value.filter(i => i.id !== item.id);
  }
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const sendOrder = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const payload = {
      items: cart.value.map(i => ({ id: i.id, qty: i.qty }))
    };
    
    await api.post('/orders', payload);
    
    alert('Заказ оформлен!');
    cart.value = [];
    localStorage.removeItem('cart');
    router.push('/profile');
  } catch (e) {
    error.value = e.response?.data?.error || e.response?.data?.message || 'Ошибка сервера';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Variables for consistent theming */
:root {
  --primary: #1a1a1a;
  --accent: #D0C4C8;
  --bg-light: #f9f9f9;
  --text-main: #333;
  --text-muted: #666;
  --border: #e5e5e5;
  --danger: #ef4444;
}

/* ========================================= */
/* 1. BASE STYLES (Desktop 1440px+)          */
/* ========================================= */
.cart-page {
  padding: 60px 40px;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 1920px;
  margin: 20px auto;
  box-sizing: border-box;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.page-title {
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: var(--text-main);
  font-weight: 700;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  background: var(--bg-light);
  border-radius: 12px;
  border: 1px dashed var(--border);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 25px;
  display: block;
}

.empty-state h3 {
  margin: 0 0 15px;
  color: var(--text-main);
  font-size: 1.5rem;
}

.empty-state p {
  color: var(--text-muted);
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.btn-browse {
  padding: 14px 32px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-browse:hover {
  opacity: 0.9;
}

.btn-browse:active {
  transform: scale(0.98);
}

/* ========================================= */
/* 2. LAYOUT (FLEXBOX)                       */
/* ========================================= */
.cart-content {
  display: flex; /* БЫЛО: grid */
  flex-wrap: wrap;
  gap: 50px;
  align-items: flex-start;
}

/* Левая часть (товары) - занимает всё свободное место */
.cart-items-wrapper {
  flex: 1 1 600px;
  min-width: 0; /* Важно для flex-контейнеров с длинным контентом */
}

/* Правая часть (итог) - фиксированная ширина на десктопе */
.cart-summary-wrapper {
  flex: 0 0 400px;
}

/* Items Section */
.items-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 2px solid var(--border);
  margin-bottom: 20px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  font-size: 0.85rem;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 0;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
  gap: 20px;
}

.cart-item:hover {
  background-color: #fafafa;
}

.item-details {
  display: flex;
  align-items: center;
  gap: 25px;
  flex: 1;
  min-width: 0;
}

.item-image-placeholder {
  width: 80px;
  height: 80px;
  background: var(--accent);
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  flex-shrink: 0;
}

.item-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.item-name {
  margin: 0 0 8px;
  font-size: 1.2rem;
  color: var(--text-main);
  font-weight: 500;
  /* Обрезка длинного названия */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted);
}

/* Controls */
.item-actions {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-shrink: 0;
}

.qty-control {
  display: flex;
  align-items: center;
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 4px;
}

.qty-control button {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  border-radius: 6px;
  transition: background 0.2s;
  font-size: 1.2rem;
}

.qty-control button:hover:not(.disabled) {
  background: #e5e5e5;
}

.qty-control button.disabled {
  opacity: 0.3;
  cursor: default;
}

.qty-value {
  width: 50px;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
}

.item-total {
  font-weight: 700;
  font-size: 1.2rem;
  width: 100px;
  text-align: right;
  flex-shrink: 0;
}

.btn-remove {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 10px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  color: var(--danger);
}

/* Summary Section */
.summary-section {
  background: var(--bg-light);
  padding: 35px;
  border-radius: 12px;
  height: fit-content;
  border: 1px solid var(--border);
  position: sticky;
  top: 100px; /* Липкий блок при скролле */
}

.summary-section h3 {
  margin-top: 0;
  margin-bottom: 30px;
  font-size: 1.4rem;
  color: var(--text-main);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  color: var(--text-muted);
  font-size: 1rem;
}

.summary-row.total {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 2px solid var(--border);
  color: var(--text-main);
  font-weight: 700;
  font-size: 1.4rem;
}

.btn-checkout {
  width: 100%;
  background: var(--primary);
  color: #fff;
  padding: 18px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 25px;
  transition: background 0.2s, transform 0.1s;
}

.btn-checkout:hover:not(:disabled) {
  background: #000;
}

.btn-checkout:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-checkout:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--danger);
  background: #fee2e2;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 0.95rem;
  margin-top: 20px;
}

/* ========================================= */
/* 3. ADAPTIVE BREAKPOINTS                   */
/* ========================================= */

/* 2. Планшет - 991px и меньше */
@media (max-width: 991px) {
  .cart-page {
    padding: 40px 30px;
  }

  .page-title {
    font-size: 2rem;
    margin-bottom: 30px;
  }

  .cart-content {
    gap: 40px;
  }

  .cart-summary-wrapper {
    flex: 0 0 350px;
  }

  .item-image-placeholder {
    width: 70px;
    height: 70px;
    font-size: 1.5rem;
  }

  .item-name {
    font-size: 1.1rem;
  }

  .summary-section {
    padding: 25px;
  }
}

/* 3. Мобильный телефон в горизонтальном режиме - 767px и меньше */
@media (max-width: 767px) {
  .cart-page {
    padding: 30px 20px;
    margin: 10px auto;
  }

  .page-title {
    font-size: 1.75rem;
    margin-bottom: 25px;
  }

  .cart-content {
    flex-direction: column; /* Блок с итогом уходит вниз */
    gap: 30px;
  }

  .cart-items-wrapper {
    flex: 1 1 100%;
  }

  .cart-summary-wrapper {
    flex: 1 1 100%;
    max-width: 100%;
  }

  .items-header {
    display: none; /* Скрываем заголовки таблицы на мобильном */
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 15px;
    padding: 20px 0;
  }

  .item-details {
    width: 100%;
    gap: 15px;
  }

  .item-image-placeholder {
    width: 60px;
    height: 60px;
    font-size: 1.3rem;
  }

  .item-text {
    flex: 1;
    min-width: 0;
  }

  .item-name {
    font-size: 1rem;
    white-space: normal; /* Разрешаем перенос названия */
    overflow: visible;
  }

  .item-actions {
    width: 100%;
    justify-content: space-between;
    gap: 15px;
    margin-top: 10px;
    padding-top: 15px;
    border-top: 1px solid var(--border);
  }

  .qty-control {
    order: 1;
  }

  .item-total {
    order: 2;
    width: auto;
    text-align: right;
    font-size: 1.1rem;
  }

  .btn-remove {
    order: 3;
    padding: 8px;
  }

  .summary-section {
    position: static; /* Убираем липкость на мобильном */
    padding: 25px;
  }

  .summary-row {
    font-size: 0.95rem;
  }

  .summary-row.total {
    font-size: 1.2rem;
  }
}

/* 4. Мобильный телефон в портретном режиме - 479px и меньше */
@media (max-width: 479px) {
  .cart-page {
    padding: 20px 15px;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .empty-state {
    padding: 60px 15px;
  }

  .empty-icon {
    font-size: 3.5rem;
  }

  .empty-state h3 {
    font-size: 1.2rem;
  }

  .empty-state p {
    font-size: 0.95rem;
  }

  .cart-item {
    padding: 15px 0;
  }

  .item-image-placeholder {
    width: 50px;
    height: 50px;
    font-size: 1.1rem;
  }

  .item-name {
    font-size: 0.95rem;
  }

  .item-price {
    font-size: 0.85rem;
  }

  .qty-control button {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .qty-value {
    width: 40px;
    font-size: 0.9rem;
  }

  .item-total {
    font-size: 1rem;
  }

  .summary-section {
    padding: 20px;
    border-radius: 10px;
  }

  .summary-section h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  .summary-row {
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

  .summary-row.total {
    font-size: 1.1rem;
    padding-top: 15px;
    margin-top: 15px;
  }

  .btn-checkout {
    padding: 16px;
    font-size: 1rem;
    margin-top: 20px;
  }

  .btn-browse {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
}
</style>