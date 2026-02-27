<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { Product } from 'components/models';

const products = ref<Product[]>([]);
const loading = ref(true);

// busca os produtos
async function loadProducts() {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    loading.value = true;
    const response = await api.get('/products');
    products.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  } finally {
    loading.value = false;
  }
}
const formatPrice = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
// Rodar assim que a página abrir
onMounted(() => {
  loadProducts();
});
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div v-for="prod in products" :key="prod.id" class="col-12 col-sm-6 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ prod.name }}</div>
            <div class="text-subtitle2">{{ prod.category }}</div>
          </q-card-section>

          <q-card-section>
            {{ prod.description }}
            <div class="text-primary text-bold q-mt-md">
              {{ formatPrice(prod.price) }}
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat color="primary" label="Ver detalhes" />
            <q-btn color="primary" icon="shopping_cart" label="Adicionar" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>