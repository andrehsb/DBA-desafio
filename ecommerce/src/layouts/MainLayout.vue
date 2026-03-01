<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import Carrinho from 'src/components/Carrinho.vue';
import { useQuasar } from 'quasar';

const auth = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const carrinhoAberto = ref(false); 
const drawerCarrinho = ref<InstanceType<typeof Carrinho> | null>(null);

function openCart() {
  if (drawerCarrinho.value) {
    drawerCarrinho.value.toggle();
    carrinhoAberto.value = !carrinhoAberto.value; 
  }
}
const toggleDarkMode = () => {
  $q.dark.toggle();
};

function handleLogout() {
  auth.logout(); // Limpa token e role
  router.push('/login'); // Manda de volta para o login
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="text-white">
      <q-toolbar style="margin-top: 16px">
        <q-toolbar-title sty>
          DBA Ecommerce
          <q-badge align="middle" color="orange" v-if="auth.role === 'admin'">Admin</q-badge>
        </q-toolbar-title>

        <q-btn flat round @click="toggleDarkMode" :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'">
          <q-tooltip>{{ $q.dark.isActive ? 'Modo Claro' : 'Modo Escuro' }}</q-tooltip>
        </q-btn>

        <q-item v-if="auth.role === 'admin'" clickable to="/cadastro" active-class="borda-ativa">
          <q-item-section side>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cadastrar Produto</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator dark q-my-md v-if="auth.isAuthenticated" />

        <template v-if="auth.isAuthenticated">

          <q-item clickable @click="openCart" :active="carrinhoAberto" active-class="borda-ativa">
            <q-item-section side>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Carrinho</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable @click="handleLogout" class="text-negative">
            <q-item-section side>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Sair</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-toolbar>
    </q-header>

    <Carrinho ref="drawerCarrinho"/>
    
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
