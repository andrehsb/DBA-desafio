<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { useCarrinhoStore } from 'src/stores/carrinho';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    stock: number;
    category: string;
}
const auth = useAuthStore();
const cart = useCarrinhoStore();
const $q = useQuasar();
const route = useRoute();
const product = ref<Product | null>(null);
const loading = ref(true);

const imagensPorCategoria: Record<string, string> = {
    'Eletrônicos': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    'Roupas': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
    'Alimentos': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
    'Jogos': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
    'default': 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500'
};


function addItem() {
    if (product.value) {
        cart.addToCart(product.value);
        $q.notify({
            message: `${product.value.name} adicionado ao carrinho!`,
            color: 'positive',
            icon: 'check',
            position: 'bottom-right'
        });
    }
}

const loadProduct = async () => {
    try {
        const id = route.params.id;
        const response = await api.get(`/products/${id}`);
        product.value = response.data;
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
    } finally {
        loading.value = false;
    }
    
};
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadProduct();
    }
  }
);
onMounted(loadProduct);

const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val);
};
</script>

<template>
    <q-page padding>
        <q-btn flat icon="arrow_back" label="Voltar" to="/" class="q-mb-md" />

        <div v-if="loading" class="flex flex-center">
            <q-spinner-dots color="primary" size="40px" />
        </div>

        <q-card v-else-if="product" class="q-pa-md">
            <div v-if="auth.role === 'admin'" class="absolute-top-right q-pa-lg">
                <q-btn color="secondary" icon="edit" label="Editar Dados" :to="`/editar/${product.id}`" />
            </div>

            <div class="row q-col-gutter-xl items-center">

                <div class="col-12 col-md-6 flex justify-center items-start q-mt-none">
                    <q-img :src="imagensPorCategoria[product.category] || imagensPorCategoria.default"
                        style="width: 100%; max-height: 450px; border-radius: 8px;" fit="contain" />
                </div>

                <div class="col-md-6">
                    <div class="text-h3 text-grey-10 text-weight-bold q-mb-sm">{{ product.name }}</div>

                    <div class="text-h4 text-primary q-mb-md">
                        {{ formatPrice(product.price) }}
                    </div>

                    <q-chip icon="inventory_2" outline color="grey-8" class="q-mb-lg">
                        Estoque disponível: {{ product.stock }}
                    </q-chip>

                    <div class="bg-grey-3 q-pa-md" style="border-radius: 8px;">
                        <div class="text-weight-bold text-black q-mb-xs">Descrição:</div>
                        <div class="text-body1 text-black" style="word-break: break-word; line-height: 1.5;">
                            {{ product.description }}
                        </div>
                    </div>

                    <div class="row q-mt-xl">
                        <q-btn color="primary" icon="shopping_cart" label="Adicionar ao Carrinho" @click="addItem"
                            class="full-width q-py-md text-weight-bold" size="lg" />
                    </div>
                </div>
            </div>
        </q-card>
    </q-page>
</template>
