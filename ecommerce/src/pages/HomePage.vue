<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { Product } from 'components/models';
import { useCarrinhoStore } from 'src/stores/carrinho';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const products = ref<Product[]>([]);
const cart = useCarrinhoStore();
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

async function deleteProduct(id: number) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja excluir este produto?',
    ok: {
      label: 'Sim',
      color: 'negative'
    },
    cancel: {
      label: 'Não',
      color: 'grey',
      flat: true
    },
    persistent: true
  }).onOk(async () => {
    await api.delete(`/products/${id}`);
    products.value = products.value.filter(prod => prod.id !== id); // atualiza a lista localmente para evitar nova chamada da api
    $q.notify({
      type: 'positive',
      message: 'Produto excluído com sucesso!',
      position: 'center',
      timeout: 3000
    });
  });
}

function addItem(prod: Product) {
  if (prod) {
    cart.addToCart(prod);

    $q.notify({
      message: `${prod.name} adicionado ao carrinho!`,
      color: 'positive',
      icon: 'check',
      position: 'bottom-right'
    });
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

          <q-card-actions align="between">
            <q-btn flat color="negative" label="Excluir" @click="deleteProduct(prod.id)" />
            <q-btn flat color="primary" label="Ver detalhes" :to="`/produto/${prod.id}`" />
            <q-btn color="primary" icon="shopping_cart" label="Adicionar" @click="addItem(prod)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template> 