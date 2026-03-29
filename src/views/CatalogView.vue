<template>
  <div class="catalog-page">
    <div class="container">
      <!-- Header Section -->
      <header class="catalog-header">
        <p class="delivery-hint">
          Бесплатная <router-link to="/delivery">доставка цветов</router-link> при заказе от 5000 ₽</p>
        <div class="header-content">
          <h1 class="page-title">Наши лучшие продажи</h1>
        </div>
        
        <!-- Filters (Placeholder for future logic) -->
        <div class="filters">
          <button class="filter-btn active">Все товары</button>
          <button class="filter-btn">Акции</button>
          <button class="filter-btn">Букеты</button>
          <button class="filter-btn">Композиции</button>
        </div>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="state-container">
        <div class="spinner"></div>
        <p>Загрузка коллекции...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="state-container error-state">
        <span class="icon-error">⚠️</span>
        <p>{{ error }}</p>
        <button @click="onMounted" class="btn-retry">Попробовать снова</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="flowers.length === 0" class="state-container">
        <span class="icon-empty">🌸</span>
        <p>Товары пока не найдены</p>
      </div>

      <!-- Product Grid -->
      <div v-else class="product-grid">
        <div v-for="flower in flowers" :key="flower.id" class="product-card">
          <div class="card-image-wrapper">
            <img 
              :src="getImageUrl(flower.img)" 
              :alt="flower.nazvanie"
              class="card-img"
              @click="$router.push('/product/' + flower.id)"
              @error="onImageError"
            >

          </div>
          
          <div class="card-details">
            <h3 class="product-name">{{ flower.nazvanie }}</h3>
            <div class="product-footer">
              <span class="product-price">{{ formatPrice(flower.price) }}</span>
              <button class="btn-text-cart" @click="addToCart(flower)">В корзину</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import { useAuthStore } from '@/stores/auth';

const flowers = ref([]);
const loading = ref(true);
const error = ref(null);
const authStore = useAuthStore();

// Берем URL из конфига axios, чтобы не хардкодить
const getBaseUrl = () => api.defaults.baseURL.replace('/api', ''); 

const getImageUrl = (imgPath) => {
  // if (!imgPath) return '/images/placeholder.jpg';
  if (imgPath.startsWith('http')) return imgPath;
  const clean = imgPath.replace(/^\//, '');
  return `${getBaseUrl()}/storage/${clean}`;
};

// const onImageError = (e) => {
//   e.target.src = '/images/placeholder.jpg';
// };

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
};

const addToCart = (flower) => {
  if (!authStore.isAuthenticated) {
    alert('Пожалуйста, войдите в систему, чтобы добавлять товары в корзину.');
    return;
  }
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const item = cart.find(i => i.id === flower.id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ ...flower, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Добавлено в корзину!');
};

onMounted(async () => {
  try {
    const res = await api.get('/flowers');
    flowers.value = Array.isArray(res.data) ? res.data : [];
  } catch (e) {
    error.value = 'Не удалось загрузить товары';
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Variables */
:root {
  --primary: #481C69;
  --primary-light: #6d3a96;
  --bg-body: #f9fafb;
  --bg-card: #ffffff;
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --radius: 12px;
}

/* --- BASE STYLES (Desktop 1440px - 1920px) --- */
.catalog-page {
  background-color: var(--bg-body);
  min-height: 100vh;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 60px 40px;
  font-family: 'Inter', system-ui, sans-serif;
  box-sizing: border-box;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Header */
.catalog-header {
  text-align: center;
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.page-title {
  font-size: 3rem;
  color: var(--primary);
  margin: 0 0 15px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.25rem;
  margin: 0 0 40px;
  max-width: 600px;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  background: transparent;
  border: 1px solid var(--border);
  padding: 10px 24px;
  border-radius: 30px;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: #f3f0f7;
}

.filter-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  box-shadow: 0 4px 10px rgba(72, 28, 105, 0.3);
}

/* --- FLEX LAYOUT (Вместо Grid) --- */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  /* Отрицательные марджины компенсируют паддинги карточек для ровного края */
  margin: -20px; 
  gap: 40px; /* Fallback для современных браузеров */
}

.product-card {
  /* FLEXBOX MAGIC: 
     grow: 1 (растягиваться)
     shrink: 0 (не сжиматься меньше заданного)
     basis: 280px (базовая ширина) 
  */
  flex: 1 0 280px;
  
  /* Учитываем отступы, чтобы карточка не вылезала за контейнер */
  margin: 20px; 
  width: calc(25% - 40px); /* Принудительно 4 в ряд на больших экранах */
  
  background: var(--bg-card);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0,0,0,0.03);
  height: fit-content; /* Чтобы карточки не растягивались по высоте соседа */
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 100%; 
  background: #f3f4f6;
  overflow: hidden;
}

.card-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  cursor: pointer;
}

.product-card:hover .card-img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.btn-quick-add {
  background: white;
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  cursor: pointer;
  transform: translateY(20px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  font-size: 1.5rem;
}

.product-card:hover .btn-quick-add {
  transform: translateY(0);
}

.btn-quick-add:hover {
  background: var(--primary);
  color: white;
}

.card-details {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 16px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.btn-text-cart {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-text-cart:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: #f3f0f7;
}

/* States */
.state-container {
  text-align: center;
  padding: 100px 20px;
  color: var(--text-muted);
}
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.icon-error, .icon-empty { font-size: 4rem; display: block; margin-bottom: 20px; }
.btn-retry {
  margin-top: 20px;
  padding: 12px 30px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

/* ========================================= */
/* ADAPTIVE BREAKPOINTS (FLEX)               */
/* ========================================= */

/* 2. Планшет - 991px и меньше */
@media (max-width: 991px) {
  .catalog-page {
    padding: 40px 30px;
  }
  
  .page-title { font-size: 2.5rem; }
  .subtitle { font-size: 1.1rem; }

  .product-grid {
    gap: 30px;
    margin: -15px;
  }

  .product-card {
    /* На планшете 3 в ряд */
    width: calc(33.333% - 30px);
    flex: 1 0 240px;
    margin: 15px;
  }
  
  .card-details { padding: 20px; }
}

/* 3. Мобильный телефон в горизонтальном режиме - 767px и меньше */
@media (max-width: 767px) {
  .catalog-page {
    padding: 30px 20px;
  }

  .catalog-header { margin-bottom: 30px; }
  .page-title { font-size: 2rem; }

  .filters { gap: 8px; }
  .filter-btn { padding: 8px 16px; font-size: 0.9rem; }

  .product-grid {
    gap: 15px;
    margin: -10px;
  }

  .product-card {
    /* На горизонтальном мобильном 2 в ряд */
    width: calc(50% - 20px);
    flex: 1 0 45%;
    margin: 10px;
  }

  .card-image-wrapper { padding-top: 100%; }
  .card-details { padding: 15px; }

  .product-name {
    font-size: 1rem;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-price { font-size: 1.2rem; }
  .btn-text-cart { font-size: 0.8rem; padding: 6px 12px; }
}

/* 4. Мобильный телефон в портретном режиме - 479px и меньше */
@media (max-width: 479px) {
  .catalog-page {
    padding: 20px 15px;
  }

  .page-title { font-size: 1.75rem; margin-bottom: 10px; }
  .subtitle { font-size: 0.95rem; margin-bottom: 20px; }

  .filters {
    justify-content: center;
    overflow-x: auto;
    width: 100%;
    padding-bottom: 10px;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .filters::-webkit-scrollbar { display: none; }

  .filter-btn {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .product-grid {
    display: flex;
    gap: 20px;
    margin: -10px;
    height: 100%;
    width: 100%;
    flex-direction: row;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
  }

  .product-card {
    /* На портретном мобильном 1 в ряд */
    width: calc(50% - 20px);
    /* flex: 1 0 50%; */
    margin: 10px;
    
  }

  .card-image-wrapper { padding-top: 100%;}

  .image-overlay {
    opacity: 1;
    background: transparent;
    pointer-events: none;
  }

  .btn-quick-add {
    transform: none;
    opacity: 1;
    width: 44px;
    height: 44px;
    position: absolute;
    bottom: 10px;
    right: 10px;
    pointer-events: auto;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .product-card:hover .btn-quick-add { transform: none; }

  .card-details { padding: 16px; display: flex;}

  .product-name {
    font-size: 1.1rem;
  }

  .product-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .product-price { font-size: 1.3rem; }

  .btn-text-cart {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
}
</style>