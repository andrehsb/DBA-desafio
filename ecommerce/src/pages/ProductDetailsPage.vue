<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { useCarrinhoStore } from 'src/stores/carrinho';
import { useQuasar } from 'quasar';

const cart = useCarrinhoStore();
const $q = useQuasar();

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

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    stock: number;
    category: string;
}

const route = useRoute();
const product = ref<Product | null>(null);
const loading = ref(true);

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

        <q-card v-else-if="product" class="my-card">
            <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                    <q-img :src="product.image" style="max-height: 400px" fit="contain" />
                </div>

                <q-card-section class="col-12 col-md-6">
                    <div class="text-h4">{{ product.name }}</div>
                    <div class="text-h5 text-primary q-mt-md">
                        {{ formatPrice(product.price) }}
                    </div>
                    <p class="q-mt-lg text-body1">{{ product.description }}</p>
                    <q-badge color="grey-3" text-color="black">Estoque: {{ product.stock }}</q-badge>
                    
                </q-card-section>
                <q-card-actions align="right" class="col-12">
                    <q-btn color="primary" icon="shopping_cart" label="Adicionar" @click="addItem" />
                </q-card-actions>
            </div>
        </q-card>
    </q-page>
</template>
