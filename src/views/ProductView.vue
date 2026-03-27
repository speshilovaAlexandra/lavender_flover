<template>
  <div class="product-page-wrapper">
    <!-- Loading State -->
    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>Загрузка товара...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="state-container error-state">
      <span class="icon">⚠️</span>
      <h2>Упс!</h2>
      <p>{{ error }}</p>
      <router-link to="/" class="btn-back">Вернуться в каталог</router-link>
    </div>

    <!-- Product Content -->
    <div v-else-if="flower" class="product-container">
      <!-- Left Column: Image -->
      <div class="product-gallery">
        <div class="image-frame">
          <img 
            :src="getImageUrl(flower.img)" 
            :alt="flower.nazvanie"
            class="product-img"
            @error="onImageError"
          >
        </div>
      </div>

      <!-- Right Column: Info -->
      <div class="product-info">
        <nav class="breadcrumb">
          <router-link to="/">Каталог</router-link> / <span>{{ flower.nazvanie }}</span>
        </nav>

        <h1 class="product-title">{{ flower.nazvanie }}</h1>
        
        <div class="price-tag">{{ formatPrice(flower.price) }}</div>

        <div class="description-box">
          <h3>Описание</h3>
          <p>{{ flower.opisanie || 'Описание этого прекрасного букета скоро появится.' }}</p>
        </div>

        <!-- Actions -->
        <div class="actions-area">
          <div class="quantity-control">
            <label>Количество:</label>
            <div class="qty-buttons">
              <button @click="decrementQty" :disabled="qty <= 1">
                <svg width="16" height="2" viewBox="0 0 16 2"><path d="M0 1H16" stroke="currentColor" stroke-width="2"/></svg>
              </button>
              <span class="qty-value">{{ qty }}</span>
              <button @click="incrementQty">
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 0V16M0 8H16" stroke="currentColor" stroke-width="2"/></svg>
              </button>
            </div>
          </div>

          <button class="btn-add-to-cart" @click="addToCart" :disabled="!isAuthenticated()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>{{ isAuthenticated() ? 'Добавить в корзину' : 'Войдите для покупки' }}</span>
          </button>
          <p class="delivery-info">
            <router-link to="/delivery">Условия доставки</router-link> — от 2 часов
          </p>
          <p v-if="!isAuthenticated()" class="login-hint">
            <router-link to="/login">Войти</router-link>, чтобы оформить заказ.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const flower = ref(null)
    const qty = ref(1)
    const loading = ref(true)
    const error = ref(null)

    const isAuthenticated = () => {
      return !!localStorage.getItem('token')
    }

    const getBaseUrl = () => api.defaults.baseURL.replace('/api', '');

    const getImageUrl = (imgPath) => {
      if (!imgPath) return '/images/placeholder.jpg'
      if (imgPath.startsWith('http')) return imgPath
      const clean = imgPath.replace(/^\//, '')
      return `${getBaseUrl()}/storage/${clean}`
    }

    const onImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
    }

    const incrementQty = () => qty.value++
    const decrementQty = () => { if (qty.value > 1) qty.value-- }

    const addToCart = () => {
      if (!isAuthenticated()) {
        router.push('/login')
        return
      }

      if (!flower.value) return
      
      let cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find(i => i.id === flower.value.id)
      
      if (existingItem) {
        existingItem.qty += qty.value
      } else {
        cart.push({ ...flower.value, qty: qty.value })
      }
      
      localStorage.setItem('cart', JSON.stringify(cart))
      
      // В реальном проекте лучше использовать Toast уведомления
      alert(`Товар "${flower.value.nazvanie}" добавлен в корзину (${qty.value} шт.)`)
    }

    onMounted(async () => {
      try {
        const res = await api.get(`/flowers/${route.params.id}`)
        flower.value = res.data
      } catch (e) {
        error.value = 'Товар не найден или был удален.'
        console.error(e)
      } finally {
        loading.value = false
      }
    })

    return {
      flower,
      qty,
      loading,
      error,
      getImageUrl,
      onImageError,
      formatPrice,
      isAuthenticated,
      incrementQty,
      decrementQty,
      addToCart
    }
  }
}
</script>

<style scoped>
/* ========================================= */
/* 1. VARIABLES & BASE STYLES                */
/* ========================================= */
:root {
  --primary: #481C69;
  --primary-dark: #361550;
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --bg-light: #f9fafb;
  --border: #e5e7eb;
  --danger: #ef4444;
}

.product-page-wrapper {
  font-family: 'Inter', system-ui, sans-serif;
  min-height: 100vh;
  width: 100%;
  max-width: 1920px;
  margin: 20px auto;
  padding: 0;
  box-sizing: border-box;
}

/* ========================================= */
/* 2. STATES (Loading/Error)                 */
/* ========================================= */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
  min-height: 60vh;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin { 
  0% { transform: rotate(0deg); } 
  100% { transform: rotate(360deg); } 
}

.error-state .icon { 
  font-size: 4rem; 
  margin-bottom: 15px; 
  display: block; 
}

.error-state h2 { 
  color: var(--text-main); 
  margin: 0 0 10px; 
  font-size: 1.5rem;
}

.error-state p { 
  color: var(--text-muted); 
  margin-bottom: 25px; 
  font-size: 1rem;
}

.btn-back {
  display: inline-block;
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s, transform 0.1s;
}

.btn-back:hover { 
  background: var(--primary-dark);
  transform: translateY(-2px);
}

/* ========================================= */
/* 3. MAIN LAYOUT (FLEXBOX)                  */
/* ========================================= */
.product-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 60px;
  align-items: flex-start;
}

/* Левая часть (галерея) */
.product-gallery-wrapper {
  flex: 1 1 500px;
  position: sticky;
  top: 20px;
}

/* Правая часть (инфо) */
.product-info-wrapper {
  flex: 1 1 500px;
}

/* ========================================= */
/* 4. GALLERY                                */
/* ========================================= */
.product-gallery {
  position: relative;
  width: 80%;
  height: 80%;
}

.image-frame {
  background: #f3f4f6;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s ease;
  width: 80%;
  height: 80%;
}

.image-frame:hover {
  box-shadow: 0 25px 30px -5px rgba(0, 0, 0, 0.15);
}

.product-img {
  width: 80%;
  height: 80%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-frame:hover .product-img {
  transform: scale(1.05);
}

/* ========================================= */
/* 5. PRODUCT INFO                           */
/* ========================================= */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.breadcrumb {
  font-size: 0.9rem;
  color: var(--text-muted);
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb a:hover { 
  color: var(--primary); 
}

.product-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
  margin: 0;
  letter-spacing: -0.02em;
}

.price-tag {
  font-size: 2rem;
  color: var(--primary);
  font-weight: 700;
  margin: 10px 0;
}

.description-box h3 {
  font-size: 1.1rem;
  margin: 0 0 10px;
  color: var(--text-main);
  font-weight: 600;
}

.description-box p {
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
  font-size: 1.05rem;
}

/* ========================================= */
/* 6. ACTIONS                                */
/* ========================================= */
.actions-area {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.quantity-control label {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.95rem;
}

.qty-buttons {
  display: flex;
  align-items: center;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.qty-buttons button {
  width: 44px;
  height: 44px;
  border: none;
  background: #fff;
  color: var(--text-main);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  font-size: 1.2rem;
}

.qty-buttons button:hover:not(:disabled) {
  background: #f3f4f6;
}

.qty-buttons button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  width: 50px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-main);
}

.btn-add-to-cart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 18px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(72, 28, 105, 0.2);
}

.btn-add-to-cart:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(72, 28, 105, 0.3);
}

.btn-add-to-cart:active:not(:disabled) {
  transform: translateY(0);
}

.btn-add-to-cart:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.login-hint {
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: -10px 0 0;
}

.login-hint a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: underline;
}

.login-hint a:hover {
  color: var(--primary-dark);
}

/* ========================================= */
/* 7. ADAPTIVE BREAKPOINTS                   */
/* ========================================= */

/* 2. Планшет - 991px и меньше */
@media (max-width: 991px) {
  .product-page-wrapper {
    margin: 10px auto;
  }

  .product-container {
    padding: 30px 20px;
    gap: 40px;
    display: flex;
    flex-direction: column;

  }

  .product-gallery-wrapper {
    flex: 1 1 100%;
    position: static;
  }

  .product-info-wrapper {
    flex: 1 1 100%;
  }

  .product-title {
    font-size: 2rem;
  }

  .price-tag {
    font-size: 1.75rem;
  }

  .image-frame {
    aspect-ratio: 4/3;
  }
}

/* 3. Мобильный телефон в горизонтальном режиме - 767px и меньше */
@media (max-width: 767px) {
  .product-page-wrapper {
    margin: 0 auto;
  }

  .product-container {
    padding: 20px 15px;
    gap: 30px;
    display: flex;
    flex-direction: column;
  }

  .product-title {
    font-size: 1.75rem;
  }

  .price-tag {
    font-size: 1.5rem;
    margin: 5px 0;
  }

  .breadcrumb {
    font-size: 0.85rem;
  }

  .description-box h3 {
    font-size: 1rem;
  }

  .description-box p {
    font-size: 0.95rem;
  }

  .image-frame {
    aspect-ratio: 1/1;
    border-radius: 16px;
  }

  .actions-area {
    margin-top: 25px;
    padding-top: 25px;
  }

  .quantity-control {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .qty-buttons button {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .qty-value {
    width: 45px;
    font-size: 1rem;
  }

  .btn-add-to-cart {
    padding: 16px;
    font-size: 1rem;
    border-radius: 10px;
  }
}

/* 4. Мобильный телефон в портретном режиме - 479px и меньше */
@media (max-width: 479px) {
  .product-page-wrapper {
    margin: 0 auto;
  }

  .state-container {
    padding: 60px 15px;
    min-height: 50vh;
  }

  .spinner {
    width: 40px;
    height: 40px;
  }

  .error-state .icon {
    font-size: 3rem;
  }

  .error-state h2 {
    font-size: 1.3rem;
  }

  .error-state p {
    font-size: 0.9rem;
  }

  .btn-back {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .product-container {
    padding: 15px 12px;
    gap: 20px;
  }

  /* === СКРЫВАЕМ ГАЛЕРЕЮ НА МОБИЛЬНОМ ПОРТРЕТЕ === */
  .product-gallery {
    display: none;
    border-radius: 20px;
  }

  .product-info-wrapper {
    flex: 1 1 100%;
  }
  /* ============================================= */

  .product-title {
    font-size: 1.5rem;
    line-height: 1.3;
  }

  .price-tag {
    font-size: 1.3rem;
  }

  .breadcrumb {
    font-size: 0.8rem;
    gap: 5px;
  }

  .description-box h3 {
    font-size: 0.95rem;
    margin-bottom: 8px;
  }

  .description-box p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .actions-area {
    margin-top: 20px;
    padding-top: 20px;
    gap: 15px;
  }

  .quantity-control {
    width: 100%;
  }

  .quantity-control label {
    font-size: 0.9rem;
  }

  .qty-buttons {
    flex: 1;
  }

  .qty-buttons button {
    width: 38px;
    height: 38px;
    font-size: 0.9rem;
  }

  .qty-value {
    width: 40px;
    font-size: 0.95rem;
  }

  .btn-add-to-cart {
    padding: 16px;
    font-size: 0.95rem;
    border-radius: 10px;
  }

  .login-hint {
    font-size: 0.85rem;
  }
}
</style>