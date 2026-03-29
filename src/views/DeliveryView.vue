<template>
  <div class="delivery-page">
    <div class="container">
      <!-- H1 с основным коммерческим запросом -->
      <header class="page-header">
      <h1 class="page-title">Немного о том как работает наша доставка</h1>
      <p class="subtitle">Привезем на дом или в офис за 2 часа</p>
        <router-link to="/">Перейти в каталог</router-link>
        <router-link to="/product/1">Популярный букет</router-link>
      </header>

      <!-- Основной контент с H2/H3 -->
      <article class="content">
        
        <!-- H2: Коммерческий блок -->
        <section class="section">
          <h2>Как заказать доставку букета</h2>
          <p>
            Мы предлагаем <strong>быструю доставку цветов</strong> по Перми и области. 
            Чтобы <strong>купить букет с доставкой</strong>, выберите понравившуюся композицию 
            в каталоге, добавьте её в корзину и укажите адрес получателя.
          </p>
          
          <h3>Сроки и стоимость доставки</h3>
          <ul class="info-list">
            <li>
              <div>
                <strong>Экспресс-доставка</strong> — от 2 часов
                <span class="detail">Бесплатно при заказе от 5000 ₽</span>
              </div>
            </li>
            <li>
              <div>
                <strong>Доставка к времени</strong> — точно к назначенному часу
                <span class="detail">+300 ₽ к стоимости заказа</span>
              </div>
            </li>
            <li>
              <div>
                <strong>Ночная доставка</strong> — круглосуточно
                <span class="detail">+500 ₽ к стоимости заказа</span>
              </div>
            </li>
          </ul>
        </section>

        <!-- H2: Информационный блок -->
        <section class="section">
          <h2>Зоны доставки цветов</h2>
          <p>
            Мы осуществляем <strong>доставку букетов по всей Перми</strong>
            Курьеры работают во всех округах: Центральный, Северный, Южный, Восточный, Западный.
          </p>

          <div class="zones-grid">
            <div class="zone-card">
              <h4>В пределах Города</h4>
              <p>Бесплатно от 5000 ₽</p>
              <span class="price">от 350 ₽</span>
            </div>
            <div class="zone-card">
              <h4>Пермский край</h4>
              <p>До 30 км от Перми</p>
              <span class="price">от 800 ₽</span>
            </div>
          </div>
        </section>

        <!-- H2: FAQ блок -->
        <section class="section">
          <h2>Частые вопросы о доставке</h2>
          
          <div class="faq-item">
            <h3>Можно ли заказать доставку к точному времени?</h3>
            <p>Да, мы доставляем <strong>цветы к назначенному времени</strong> с точностью до 30 минут. 
            Укажите желаемое время при оформлении заказа.</p>
          </div>

          <div class="faq-item">
            <h3>Как получить скидку на доставку?</h3>
            <p>При заказе от 5000 ₽ <strong>доставка букета бесплатно</strong>. 
            Также мы проводим акции для постоянных клиентов.</p>
          </div>

          <div class="faq-item">
            <h3>Что делать, если получателя нет дома?</h3>
            <p>Курьер свяжется с получателем по телефону. Если не удалось вручить букет, 
            мы согласуем повторную доставку.</p>
          </div>
        </section>

        <!-- Изображение с ALT -->
        <figure class="image-block">
          <img 
            src="../img/img1.webp" 
            alt="Курьер доставляет букет цветов клиенту на дом — быстрая доставка цветов в Перми"
            class="delivery-image"
          >
          <figcaption>Наши курьеры бережно доставят ваш букет в любое время суток</figcaption>
        </figure>

        <!-- CTA блок -->
        <section class="cta-section">
          <h2>Готовы заказать цветы с доставкой?</h2>
          <p>
            <strong>Купить букет с доставкой</strong> можно прямо сейчас в нашем каталоге. 
            Выберите композицию и оформите заказ за 2 минуты!
          </p>
          <router-link to="/" class="btn-primary">
            Перейти в каталог
          </router-link>
        </section>

      </article>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// Выносим SEO-данные в отдельный объект для чистоты кода
const seo = {
  title: 'Доставка цветов Пермь — купить букет с доставкой недорого | LAVENDER',
  description: 'Быстрая доставка цветов по Перми от 2 часов. Бесплатно при заказе от 5000 ₽. Закажите букет с доставкой на дом или в офис. Скидки постоянным клиентам!',
  subtitle: 'Оформите заказ с доставкой на дом или в офис за 2 часа'
};

onMounted(() => {
  // Устанавливаем заголовок вкладки
  document.title = seo.title;
  
  // Находим или создаем мета-тег description
  let metaDescription = document.querySelector('meta[name="description"]');
  
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  
  // Обновляем контент
  metaDescription.content = seo.description;
});
</script>
<style scoped>:root{--primary:#1a1a1a;--accent:#D0C4C8;--bg-light:#f9f9f9;--text-main:#333;--text-muted:#666;--border:#e5e5e5;--danger:#ef4444}.cart-page{padding:60px 40px;min-height:100vh;font-family:'Inter',sans-serif;width:100%;max-width:1920px;margin:20px auto;box-sizing:border-box}.container{max-width:1400px;margin:0 auto;width:100%}.page-title{font-size:2.5rem;margin-bottom:40px;color:var(--text-main);font-weight:700}.empty-state{text-align:center;padding:100px 20px;background:var(--bg-light);border-radius:12px;border:1px dashed var(--border)}.empty-icon{font-size:5rem;margin-bottom:25px;display:block}.empty-state h3{margin:0 0 15px;color:var(--text-main);font-size:1.5rem}.empty-state p{color:var(--text-muted);margin-bottom:30px;font-size:1.1rem}.btn-browse{padding:14px 32px;background:var(--primary);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:1rem;transition:opacity 0.2s,transform 0.1s}.btn-browse:hover{opacity:0.9}.btn-browse:active{transform:scale(0.98)}.cart-content{display:flex;flex-wrap:wrap;gap:50px;align-items:flex-start}.cart-items-wrapper{flex:1 1 600px;min-width:0}.cart-summary-wrapper{flex:0 0 400px}.items-header{display:flex;justify-content:space-between;padding:15px 0;border-bottom:2px solid var(--border);margin-bottom:20px;font-weight:600;color:var(--text-muted);text-transform:uppercase;font-size:0.85rem}.cart-item{display:flex;justify-content:space-between;align-items:center;padding:25px 0;border-bottom:1px solid var(--border);transition:background 0.2s;gap:20px}.cart-item:hover{background-color:#fafafa}.item-details{display:flex;align-items:center;gap:25px;flex:1;min-width:0}.item-image-placeholder{width:80px;height:80px;background:var(--accent);color:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:bold;flex-shrink:0}.item-text{display:flex;flex-direction:column;min-width:0}.item-name{margin:0 0 8px;font-size:1.2rem;color:var(--text-main);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.item-price{margin:0;font-size:0.95rem;color:var(--text-muted)}.item-actions{display:flex;align-items:center;gap:30px;flex-shrink:0}.qty-control{display:flex;align-items:center;background:var(--bg-light);border:1px solid var(--border);border-radius:8px;padding:4px}.qty-control button{width:36px;height:36px;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-main);border-radius:6px;transition:background 0.2s;font-size:1.2rem}.qty-control button:hover:not(.disabled){background:#e5e5e5}.qty-control button.disabled{opacity:0.3;cursor:default}.qty-value{width:50px;text-align:center;font-weight:600;font-size:1rem}.item-total{font-weight:700;font-size:1.2rem;width:100px;text-align:right;flex-shrink:0}.btn-remove{background:none;border:none;color:#999;cursor:pointer;padding:10px;transition:color 0.2s;display:flex;align-items:center;justify-content:center}.btn-remove:hover{color:var(--danger)}.summary-section{background:var(--bg-light);padding:35px;border-radius:12px;height:fit-content;border:1px solid var(--border);position:sticky;top:100px}.summary-section h3{margin-top:0;margin-bottom:30px;font-size:1.4rem;color:var(--text-main)}.summary-row{display:flex;justify-content:space-between;margin-bottom:18px;color:var(--text-muted);font-size:1rem}.summary-row.total{margin-top:25px;padding-top:25px;border-top:2px solid var(--border);color:var(--text-main);font-weight:700;font-size:1.4rem}.btn-checkout{width:100%;background:var(--primary);color:#fff;padding:18px;border:none;border-radius:10px;font-size:1.1rem;font-weight:600;cursor:pointer;margin-top:25px;transition:background 0.2s,transform 0.1s}.btn-checkout:hover:not(:disabled){background:#000}.btn-checkout:active:not(:disabled){transform:scale(0.98)}.btn-checkout:disabled{background:#ccc;cursor:not-allowed}.error-msg{display:flex;align-items:center;gap:10px;color:var(--danger);background:#fee2e2;padding:12px 15px;border-radius:8px;font-size:0.95rem;margin-top:20px}@media (max-width:991px){.cart-page{padding:40px 30px}.page-title{font-size:2rem;margin-bottom:30px}.cart-content{gap:40px}.cart-summary-wrapper{flex:0 0 350px}.item-image-placeholder{width:70px;height:70px;font-size:1.5rem}.item-name{font-size:1.1rem}.summary-section{padding:25px}}@media (max-width:767px){.cart-page{padding:30px 20px;margin:10px auto}.page-title{font-size:1.75rem;margin-bottom:25px}.cart-content{flex-direction:column;gap:30px}.cart-items-wrapper{flex:1 1 100%}.cart-summary-wrapper{flex:1 1 100%;max-width:100%}.items-header{display:none}.cart-item{flex-wrap:wrap;gap:15px;padding:20px 0}.item-details{width:100%;gap:15px}.item-image-placeholder{width:60px;height:60px;font-size:1.3rem}.item-text{flex:1;min-width:0}.item-name{font-size:1rem;white-space:normal;overflow:visible}.item-actions{width:100%;justify-content:space-between;gap:15px;margin-top:10px;padding-top:15px;border-top:1px solid var(--border)}.qty-control{order:1}.item-total{order:2;width:auto;text-align:right;font-size:1.1rem}.btn-remove{order:3;padding:8px}.summary-section{position:static;padding:25px}.summary-row{font-size:0.95rem}.summary-row.total{font-size:1.2rem}}@media (max-width:479px){.cart-page{padding:20px 15px}.page-title{font-size:1.5rem;margin-bottom:20px}.empty-state{padding:60px 15px}.empty-icon{font-size:3.5rem}.empty-state h3{font-size:1.2rem}.empty-state p{font-size:0.95rem}.cart-item{padding:15px 0}.item-image-placeholder{width:50px;height:50px;font-size:1.1rem}.item-name{font-size:0.95rem}.item-price{font-size:0.85rem}.qty-control button{width:32px;height:32px;font-size:1rem}.qty-value{width:40px;font-size:0.9rem}.item-total{font-size:1rem}.summary-section{padding:20px;border-radius:10px}.summary-section h3{font-size:1.2rem;margin-bottom:20px}.summary-row{font-size:0.9rem;margin-bottom:12px}.summary-row.total{font-size:1.1rem;padding-top:15px;margin-top:15px}.btn-checkout{padding:16px;font-size:1rem;margin-top:20px}.btn-browse{padding:12px 24px;font-size:0.95rem}}</style>
