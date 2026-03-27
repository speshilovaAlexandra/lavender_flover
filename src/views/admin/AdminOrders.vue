Вот обновленный дизайн для страницы управления заказами. Я сохранил единую стилистику с предыдущими страницами (панель администратора), сделав интерфейс чистым, профессиональным и удобным.

**Основные изменения:**
1.  **Таблица:** Современный вид с четкими заголовками, выделением строк при наведении и аккуратными отступами.
2.  **Статусы:** Вместо простого текста — красивые бейджи (цветные плашки) для каждого статуса. Select стилизован так, чтобы выглядеть органично.
3.  **Модальное окно:** Полностью переработано. Теперь это аккуратная карточка с тенью, разделенная на логические блоки (инфо о клиенте, список товаров).
4.  **Список товаров:** Товары в заказе отображаются в виде списка с миниатюрами, что позволяет быстро оценить состав заказа.
5.  **Анимации:** Плавное появление модального окна и ховер-эффекты.

```html
<template>
  <div class="admin-page">
    <div class="container">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-title">
          <h1>Управление заказами</h1>
          <p>Просмотр и обработка заказов клиентов</p>
        </div>
      </header>

      <!-- Content Card -->
      <div class="card">
        <div v-if="loading" class="state-container">
          <div class="spinner"></div>
          <p>Загрузка заказов...</p>
        </div>

        <div v-else-if="orders.length === 0" class="state-container empty-state">
          <span class="icon-empty">📦</span>
          <h3>Заказов пока нет</h3>
          <p>Как только клиенты сделают заказы, они появятся здесь.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 80px;">ID</th>
                <th>Клиент</th>
                <th>Email</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Дата</th>
                <th class="text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="font-mono">#{{ order.id }}</td>
                <td>
                  <div class="cell-main">{{ order.user?.name || 'Неизвестно' }}</div>
                </td>
                <td class="text-muted">{{ order.user?.email || '-' }}</td>
                <td>
                  <span class="price-tag">{{ formatPrice(order.total_price) }}</span>
                </td>
                <td>
                  <div class="status-wrapper">
                    <select 
                      v-model="order.status" 
                      @change="updateStatus(order)"
                      :class="'status-select status-' + order.status"
                    >
                      <option value="pending">Ожидает</option>
                      <option value="confirmed">Подтвержден</option>
                      <option value="completed">Завершен</option>
                      <option value="canceled">Отменен</option>
                    </select>
                  </div>
                </td>
                <td class="text-muted">{{ formatDate(order.created_at) }}</td>
                <td class="text-right">
                  <button @click="viewDetails(order)" class="btn-icon btn-view" title="Детали заказа">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Просмотр
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Details -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-container">
          <div class="modal-header">
            <div>
              <h3>Заказ №{{ selectedOrder?.id }}</h3>
              <span class="modal-subtitle">{{ formatDate(selectedOrder?.created_at) }}</span>
            </div>
            <button @click="showModal = false" class="btn-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div class="modal-body">
            <!-- Customer Info Grid -->
            <div class="info-grid">
              <div class="info-block">
                <label>Клиент</label>
                <div class="info-value">{{ selectedOrder?.user?.name }}</div>
              </div>
              <div class="info-block">
                <label>Email</label>
                <div class="info-value">{{ selectedOrder?.user?.email }}</div>
              </div>
              <div class="info-block">
                <label>Статус</label>
                <div class="info-value">
                  <span :class="'badge status-' + selectedOrder?.status">
                    {{ getStatusText(selectedOrder?.status) }}
                  </span>
                </div>
              </div>
              <div class="info-block">
                <label>Итого</label>
                <div class="info-value price-large">{{ formatPrice(selectedOrder?.total_price) }}</div>
              </div>
            </div>

            <!-- Items List -->
            <div class="items-section">
              <h4>Товары в заказе</h4>
              <div class="items-list">
                <div v-for="flower in selectedOrder?.flowers" :key="flower.id" class="item-row">
                  <div class="item-img">
                    <img :src="getImageUrl(flower.img)" :alt="flower.nazvanie">
                  </div>
                  <div class="item-info">
                    <div class="item-name">{{ flower.nazvanie }}</div>
                    <div class="item-meta">
                      {{ flower.pivot?.quantity }} шт. × {{ formatPrice(flower.pivot?.price_at_purchase) }}
                    </div>
                  </div>
                  <div class="item-total">
                    {{ formatPrice(flower.pivot?.quantity * flower.pivot?.price_at_purchase) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="showModal = false" class="btn-secondary">Закрыть</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/api';

const orders = ref([]);
const loading = ref(true);
const showModal = ref(false);
const selectedOrder = ref(null);

const formatPrice = (price) => {
  if (!price) return '0 ₽';
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusText = (status) => {
  const statuses = {
    pending: 'Ожидает',
    confirmed: 'Подтвержден',
    completed: 'Завершен',
    canceled: 'Отменен'
  };
  return statuses[status] || status;
};

const getBaseUrl = () => api.defaults.baseURL.replace('/api', '');

const getImageUrl = (imgPath) => {
  if (!imgPath) return '/images/placeholder.jpg';
  if (imgPath.startsWith('http')) return imgPath;
  const clean = imgPath.replace(/^\//, '');
  return `${getBaseUrl()}/storage/${clean}`;
};

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/orders');
    orders.value = data;
  } catch (e) {
    alert('Ошибка загрузки заказов: ' + (e.response?.data?.message || e.message));
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const updateStatus = async (order) => {
  try {
    await api.patch(`/admin/orders/${order.id}/status`, { 
      status: order.status 
    });
    
    if (order.status === 'canceled') {
      alert('Заказ отменен. Товары возвращены на склад.');
    } else {
      // Можно добавить красивое уведомление (toast) вместо alert
      console.log('Статус обновлен');
    }
  } catch (e) {
    alert('Ошибка обновления статуса: ' + (e.response?.data?.message || e.message));
    // Перезагружаем список, чтобы откатить визуальное изменение при ошибке
    const { data } = await api.get('/admin/orders');
    orders.value = data;
  }
};

const viewDetails = (order) => {
  selectedOrder.value = order;
  showModal.value = true;
};
</script>

<style scoped>
/* Variables */
:root {
  --primary: #481C69;
  --primary-light: #f3f0f7;
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --bg-page: #f3f4f6;
  --bg-card: #ffffff;
  --border: #e5e7eb;
  
  /* Status Colors */
  --status-pending-bg: #fef3c7;
  --status-pending-text: #92400e;
  --status-confirmed-bg: #dbeafe;
  --status-confirmed-text: #1e40af;
  --status-completed-bg: #d1fae5;
  --status-completed-text: #065f46;
  --status-canceled-bg: #fee2e2;
  --status-canceled-text: #b91c1c;
}

.admin-page {
  background-color: var(--bg-page);
  min-height: 100vh;
  padding: 30px 20px;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text-main);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.admin-header {
  margin-bottom: 30px;
}

.header-title h1 {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 5px;
  color: var(--text-main);
}

.header-title p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Card & Table */
.card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid var(--border);
}

.state-container {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-muted);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.empty-state .icon-empty { font-size: 3rem; display: block; margin-bottom: 15px; }
.empty-state h3 { margin: 0 0 10px; color: var(--text-main); }

.table-responsive {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background: #f9fafb;
  padding: 16px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.admin-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.admin-table tr:hover {
  background-color: #f9fafb;
}

.font-mono { font-family: monospace; color: var(--text-muted); }
.text-muted { color: var(--text-muted); font-size: 0.9rem; }
.text-right { text-align: right; }
.price-tag { font-weight: 700; color: var(--primary); }

/* Status Select */
.status-wrapper {
  display: inline-block;
}

.status-select {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  outline: none;
  appearance: none; /* Убираем стандартную стрелку браузера */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
  transition: all 0.2s;
}

/* Status Colors for Select */
.status-pending { background-color: var(--status-pending-bg); color: var(--status-pending-text); }
.status-confirmed { background-color: var(--status-confirmed-bg); color: var(--status-confirmed-text); }
.status-completed { background-color: var(--status-completed-bg); color: var(--status-completed-text); }
.status-canceled { background-color: var(--status-canceled-bg); color: var(--status-canceled-text); }

.status-select:hover {
  filter: brightness(0.95);
}

/* Action Button */
.btn-icon {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: white;
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: modal-slide-up 0.3s ease-out;
}

@keyframes modal-slide-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  margin: 0 0 4px;
  font-size: 1.25rem;
  color: var(--text-main);
}

.modal-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f3f4f6;
  color: var(--text-main);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
}

.info-block label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 6px;
  font-weight: 600;
}

.info-value {
  font-size: 1rem;
  color: var(--text-main);
  font-weight: 500;
}

.price-large {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary);
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}
.badge.status-pending { background: var(--status-pending-bg); color: var(--status-pending-text); }
.badge.status-confirmed { background: var(--status-confirmed-bg); color: var(--status-confirmed-text); }
.badge.status-completed { background: var(--status-completed-bg); color: var(--status-completed-text); }
.badge.status-canceled { background: var(--status-canceled-bg); color: var(--status-canceled-text); }

.items-section h4 {
  margin: 0 0 15px;
  font-size: 1rem;
  color: var(--text-main);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: background 0.2s;
}

.item-row:hover {
  background: #f9fafb;
}

.item-img {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 4px;
}

.item-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.item-total {
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  background: #f9fafb;
  border-radius: 0 0 16px 16px;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--border);
  color: var(--text-main);
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .admin-table th, .admin-table td {
    padding: 12px 8px;
    font-size: 0.9rem;
  }
  
  .btn-icon span {
    display: none; /* Скрываем текст кнопки на мобильных, оставляем иконку */
  }
  .btn-icon {
    padding: 8px;
  }
}
</style>
```