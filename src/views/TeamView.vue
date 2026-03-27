
<template>
  <div class="team-page">
    <div class="container">
      <header class="team-header">
        <h1 class="page-title">Наша команда</h1>
        <p class="subtitle">Профессионалы, которые создают красоту для вас</p>
      </header>

      <div class="team-grid">
        <div v-for="member in teamMembers" :key="member.id" class="team-card">
          <div class="member-photo">
            <img :src="member.photo" :alt="`${member.name} ${member.surname}`">
          </div>
          <div class="member-info">
            <h3 class="member-name">{{ member.name }} {{ member.surname }}</h3>
            <p class="member-position">{{ member.position }}</p>
            <div class="member-contacts">
                {{ member.phone }}
                {{ member.email }}
            </div>
            <div class="member-quote">
              
              <p>"{{ member.quote }}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const teamMembers = ref([
  {
    id: 1,
    name: 'Анна',
    surname: 'Цветкова',
    position: 'Главный флорист',
    phone: '+7 (999) 123-45-67',
    email: 'anna@lavender.ru',
    photo: "https://img.freepik.com/premium-photo/portrait-young-woman-standing-against-plants_1048944-21369490.jpg?semt=ais_hybrid&w=740&q=80",
    quote: 'Каждый букет — это история любви, которую я помогаю рассказать.'
  },
  {
    id: 2,
    name: 'Михаил',
    surname: 'Садовников',
    position: 'Менеджер по закупкам',
    phone: '+7 (999) 234-56-78',
    email: 'mikhail@lavender.ru',
    photo: 'https://img.freepik.com/premium-photo/portrait-young-woman-standing-against-plants_1048944-21369490.jpg?semt=ais_hybrid&w=740&q=80',
    quote: 'Только свежие цветы от проверенных поставщиков.'
  },
  {
    id: 3,
    name: 'Елена',
    surname: 'Доставкина',
    position: 'Руководитель службы доставки',
    phone: '+7 (999) 345-67-89',
    email: 'elena@lavender.ru',
    photo: 'https://img.freepik.com/premium-photo/portrait-young-woman-standing-against-plants_1048944-21369490.jpg?semt=ais_hybrid&w=740&q=80',
    quote: 'Доставим вовремя, в любую погоду, с улыбкой!'
  },
  {
    id: 4,
    name: 'Ольга',
    surname: 'Клиентова',
    position: 'Менеджер по работе с клиентами',
    phone: '+7 (999) 456-78-90',
    email: 'olga@lavender.ru',
    photo: 'https://img.freepik.com/premium-photo/portrait-young-woman-standing-against-plants_1048944-21369490.jpg?semt=ais_hybrid&w=740&q=80',
    quote: 'Ваше удовлетворение — моя главная награда.'
  }
]);
</script>

<style scoped>
/* ========================================= */
/* 1. VARIABLES & BASE STYLES                */
/* ========================================= */
:root {
  --primary: #481C69;
  --primary-light: #f3f0f7;
  --text-main: #1f2937;
  --text-muted: #6b7280;
  --bg-page: #f9fafb;
  --bg-card: #ffffff;
  --border: #e5e7eb;
}

.team-page {
  background-color: var(--bg-page);
  min-height: 100vh;
  padding: 60px 20px;
  font-family: 'Inter', system-ui, sans-serif;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  box-sizing: border-box;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* ========================================= */
/* 2. HEADER                                 */
/* ========================================= */
.team-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  font-size: 2.5rem;
  color: var(--primary);
  margin: 0 0 15px;
  font-weight: 800;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* ========================================= */
/* 3. TEAM GRID (FLEXBOX)                    */
/* ========================================= */
.team-grid {
  display: flex; /* БЫЛО: grid */
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.team-card {
  /* Flex вместо grid-column */
  flex: 1 1 280px;
  max-width: 350px;
  
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* ========================================= */
/* 4. MEMBER CARD                            */
/* ========================================= */
.member-photo {
  width: 100%;
  height: 280px;
  overflow: hidden;
  flex-shrink: 0;
}

.member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.team-card:hover .member-photo img {
  transform: scale(1.05);
}

.member-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.member-name {
  font-size: 1.25rem;
  color: var(--text-main);
  margin: 0 0 8px;
  font-weight: 700;
}

.member-position {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0 0 16px;
}

.member-contacts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.contact-link:hover {
  color: var(--primary);
}

.member-quote {
  background: var(--primary-light);
  padding: 16px;
  border-radius: 12px;
  position: relative;
  margin-top: auto;
}

.quote-icon {
  color: var(--primary);
  opacity: 0.3;
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.member-quote p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-main);
  font-style: italic;
  line-height: 1.5;
}

/* ========================================= */
/* 5. ADAPTIVE BREAKPOINTS                   */
/* ========================================= */

/* 2. Планшет - 991px и меньше */
@media (max-width: 991px) {
  .team-page {
    padding: 50px 20px;
  }

  .page-title {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .team-header {
    margin-bottom: 50px;
  }

  .team-card {
    flex: 1 1 45%; /* 2 карточки в ряд */
    max-width: 45%;
  }

  .member-photo {
    height: 260px;
  }

  .member-info {
    padding: 20px;
  }
}

/* 3. Мобильный телефон в горизонтальном режиме - 767px и меньше */
@media (max-width: 767px) {
  .team-page {
    padding: 40px 15px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .team-header {
    margin-bottom: 40px;
  }

  .team-grid {
    gap: 25px;
  }

  .team-card {
    flex: 1 1 48%; /* 2 карточки в ряд */
    max-width: 48%;
  }

  .member-photo {
    height: 240px;
  }

  .member-name {
    font-size: 1.1rem;
  }

  .member-position {
    font-size: 0.9rem;
  }

  .member-info {
    padding: 18px;
  }

  .member-quote p {
    font-size: 0.85rem;
  }
}

/* 4. Мобильный телефон в портретном режиме - 479px и меньше */
@media (max-width: 479px) {
  .team-page {
    padding: 30px 12px;
  }

  .page-title {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .team-header {
    margin-bottom: 30px;
  }

  .team-grid {
    gap: 20px;
  }

  .team-card {
    flex: 1 1 100%; /* 1 карточка на всю ширину */
    max-width: 100%;
  }

  .member-photo {
    height: 220px;
  }

  .member-info {
    padding: 16px;
  }

  .member-name {
    font-size: 1.1rem;
  }

  .member-position {
    font-size: 0.85rem;
    margin-bottom: 12px;
  }

  .member-contacts {
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 16px;
  }

  .contact-link {
    font-size: 0.85rem;
    gap: 6px;
  }

  .member-quote {
    padding: 14px;
    border-radius: 10px;
  }

  .quote-icon {
    font-size: 1.2rem;
    margin-bottom: 6px;
  }

  .member-quote p {
    font-size: 0.85rem;
    line-height: 1.4;
  }
}
</style>