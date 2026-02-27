import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    // recupera role do storage para nao sumir ao recarregar a página
    role: localStorage.getItem('role') || '' 
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(username: string, password: string) {
      const response = await api.post('/auth/login', { username, password });
      this.token = response.data.token;

      // decodifica para pegar a role  (admin ou user)
      const decoded: any = jwtDecode(this.token);
      this.role = decoded.role;

      // salva tudo
      localStorage.setItem('token', this.token);
      localStorage.setItem('role', this.role);

      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },
    logout() {
      this.token = '';
      this.role = '';
      localStorage.clear();
      delete api.defaults.headers.common['Authorization'];
    }
  }
});