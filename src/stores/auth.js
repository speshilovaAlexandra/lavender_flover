import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async login(email, password) {
      try {
   
        const response = await axios.post('/api/login', { email, password });

 
        this.token = response.data.token;
        this.user = response.data.user;

        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        

        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        
     

      } catch (error) {

        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error; // Пробрасываем ошибку обратно в Login.vue
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    },
    

    checkAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  },
});
