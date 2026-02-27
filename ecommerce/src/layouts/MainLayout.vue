<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { useCarrinhoStore } from 'src/stores/carrinho';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

const cart = useCarrinhoStore();
const auth = useAuthStore();
const router = useRouter();
const menu = ref(false);
const carrinho = ref(false);
const $q = useQuasar();

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

function handleLogout() {
  auth.logout(); // Limpa token e role
  router.push('/login'); // Manda de volta para o login
}

function openCart() {
  carrinho.value = !carrinho.value;
}


function finalizaCompra() {
  if (cart.items.length === 0) {
    $q.notify({
      message: 'Seu carrinho está vazio!',
      color: 'warning',
      icon: 'warning'
    });
    return;
  }
  $q.dialog({
    title: 'Finalizar Pedido',
    message: `O total da sua compra é ${formatPrice(cart.totalValue)}. Deseja confirmar?`,
    ok: {
      label: 'Confirmar',
      color: 'positive'
    },
    cancel: {
      label: 'cancelar',
      color: 'negative',
      flat: true
    },
    persistent: true
  }).onOk(() => {
    cart.clearCart();
    $q.notify({
      type: 'positive',
      message: 'Sua compra foi finalizada com sucesso!',
      position: 'center',
      timeout: 3000
    });
  });
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          DBA Ecommerce
          <q-badge align="middle" color="orange" v-if="auth.role === 'admin'">Admin</q-badge>
        </q-toolbar-title>

        <q-item v-if="auth.role === 'admin'" clickable to="/cadastro">
          <q-item-section avatar>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cadastrar Produto</q-item-label>
          </q-item-section>
        </q-item>
        <q-section v-if="auth.isAuthenticated" side>
          <q-btn flat icon="shopping_cart" label="Carrinho" @click="openCart" />
          <q-btn flat icon="logout" label="Sair" @click="handleLogout" />
        </q-section>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="auth.isAuthenticated" v-model="carrinho" side="right" bordered class="bg-grey-1">
      <q-list separator>
        <q-item-label header class="text-h6">
          Carrinho ({{ cart.totalItems }})
        </q-item-label>

        <q-item v-if="cart.items.length === 0">
          <q-item-section class="text-grey text-center q-pa-md">
            Seu carrinho está vazio.
          </q-item-section>
        </q-item>

        <q-item v-for="prod in cart.items" :key="prod.id" class="q-py-md">
          <q-item-section avatar>
            <q-img :src="prod.image" style="width: 50px; height: 50px" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">{{ prod.name }}</q-item-label>
            <q-item-label caption>
              Qtd: {{ prod.quantidade }} x {{ formatPrice(prod.price) }}
            </q-item-label>
          </q-item-section>
          <q-btn flat round dense icon="remove" size="sm" @click="prod.id && cart.removeFromCart(prod.id)" />
          <q-item-section side>
            <div class="text-primary text-weight-bold">
              {{ formatPrice(prod.price * prod.quantidade) }}
            </div>
          </q-item-section>
          <q-btn flat round dense icon="add" size="sm" @click="prod.id && cart.addToCart(prod)" />
        </q-item>

        <q-item class="q-py-md" v-if="cart.items.length > 0">
          <q-item-section>
            <q-item-label class="text-h10 q-mb-md">Total: {{ formatPrice(cart.totalValue) }}</q-item-label>
            <q-btn color="primary" label="Finalizar Compra" icon='check' class="full-width" @click="finalizaCompra" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
