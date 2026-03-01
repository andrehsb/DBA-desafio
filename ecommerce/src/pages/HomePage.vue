<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { api } from 'boot/axios';
import { Product } from 'components/models';
import { useCarrinhoStore } from 'src/stores/carrinho';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';
import SearchBar from 'components/SearchBar.vue';

const auth = useAuthStore();
const $q = useQuasar();
const products = ref<Product[]>([]);
const cart = useCarrinhoStore();
const loading = ref(true);
const filtroNome = ref('');
const filtroCategoria = ref('Todos');
const imagensPorCategoria: Record<string, string> = {
  'Eletrônicos': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
  'Roupas': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
  'Alimentos': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
  'Jogos': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
  'default': 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500'
};

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
    title: '<span class="text-black"> Confirmar Exclusão </span>',
    message: '<span class="text-black">Tem certeza que deseja excluir este produto?</span>',
    html: true,
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

const produtosFiltrados = computed(() => {
  let lista = products.value;

  //por Nome (da SearchBar)
  if (filtroNome.value) {
    const needle = filtroNome.value.toLowerCase();
    lista = lista.filter(p => p.name.toLowerCase().includes(needle));
  }

  //por Categoria (dos botões)
  if (filtroCategoria.value !== 'Todos') {
    lista = lista.filter(p => p.category === filtroCategoria.value);
  }

  return lista;
});

const categorias = computed(() => {
  const lista = products.value.map(p => p.category);
  return [...new Set(lista)];
});
</script>

<template>
  <q-page padding>
    <div class="row justify-center q-mb-lg">
      
      <div class="col-md-8 col-lg-5">
        <SearchBar @update-filter="(val: string) => filtroNome = val" />
      
        </div>
    </div>
    <div class="row justify-center q-mb-xl q-gutter-sm">
      
      <div class="text-subtitle1 text-primary q-mb-sm text-weight-medium">
        Selecione uma categoria:
      </div>
      
      <q-chip v-for="categ in categorias" :key="categ" clickable @click="filtroCategoria = categ"
        :removable="filtroCategoria === categ" @remove="filtroCategoria = 'Todos'"
        :color="filtroCategoria === categ ? 'primary' : 'grey-4'"
        :text-color="filtroCategoria === categ ? 'white' : 'grey-9'">
        {{ categ }}
      
      </q-chip>
    </div>
    <div class="row q-col-gutter-md">
      
      <div v-for="prod in produtosFiltrados" :key="prod.id" class="col-md-4 col-lg-3">
        <q-card clickable @click="() => $router.push(`/produto/${prod.id}`) "class="cursor-pointer">
          
          <q-img :src="imagensPorCategoria[prod.category] || imagensPorCategoria.default" style="height: 120px"></q-img>
          
          <q-card-section class="text-center q-pa-xs">
            <div class="text-h6 text-bold text-grey-10 ellipsis-4-lines flex flex-center"
              style="height: 64px; line-height: 1.2">
              {{ prod.name }}
            </div>
          </q-card-section>
          
          <q-card-actions class="q-px-md q-gutter-xs q-pt-none" align="between">
            <q-btn v-if="auth.role === 'admin'" flat color="negative" label="Excluir" @click.stop="deleteProduct(prod.id)"
              class="q-px-sm" />
            
              <div class="text-secondary text-bold">
              {{ formatPrice(prod.price) }}
            </div>
            
            <q-btn color="primary" icon="shopping_cart" label="Adicionar" @click.stop="addItem(prod)" class="q-px-sm" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>