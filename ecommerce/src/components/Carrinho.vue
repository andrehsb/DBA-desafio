<script setup lang="ts">
import { ref } from 'vue';
import { useCarrinhoStore } from 'src/stores/carrinho';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const auth = useAuthStore();
const $q = useQuasar();
const cart = useCarrinhoStore();
const carrinho = ref(false);

defineExpose({
    toggle: () => { carrinho.value = !carrinho.value }
});

const imagensPorCategoria: Record<string, string> = {
    'Eletrônicos': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    'Roupas': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
    'Alimentos': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500',
    'Jogos': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
    'default': 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500'
};

const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
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
        title: '<span class="text-black">Finalizar Pedido</span>',
        message: `<span class="text-black">O total da sua compra é ${formatPrice(cart.totalValue)}. Deseja confirmar?</span>`,
        html:true,
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

function removerTudo(prod: any) {
    cart.clearItem(prod.id);
}
</script>

<template>
    <q-drawer v-if="auth.isAuthenticated" v-model="carrinho" side="right" bordered>
        <q-list separator>
            <q-item-label header class="text-h6 text-grey-10">
                Carrinho ({{ cart.totalItems }})
            </q-item-label>

            <q-item v-if="cart.items.length === 0">
                <q-item-section class="text-grey-10 text-center q-pa-md">
                    Seu carrinho está vazio.
                </q-item-section>
            </q-item>

            <q-item v-for="prod in cart.items" :key="prod.id" class="q-py-md cursor-pointer" clickable
                @click="() => $router.push(`/produto/${prod.id}`)">
                <q-item-section avatar>
                    <q-img :src="imagensPorCategoria[prod.category] || imagensPorCategoria.default" />
                </q-item-section>

                <q-item-section>
                    <q-item-label class="text-weight-bold text-black">{{ prod.name }}</q-item-label>
                    <q-item-label caption class="text-grey-10">
                        Quantidade: {{ prod.quantidade }} x {{ formatPrice(prod.price) }}
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <div class="row items-center q-gutter-x-xs">
                        <q-btn flat round dense icon="remove" size="sm" color="black"
                            @click.stop="prod.id && cart.removeFromCart(prod.id)" />

                        <div class="text-primary text-weight-bold q-px-xs">
                            {{ formatPrice(prod.price * prod.quantidade) }}
                        </div>

                        <q-btn flat round dense icon="add" size="sm" color="black"
                            @click.stop="prod.id && cart.addToCart(prod)" />
                        <q-btn flat round dense icon="delete" size="sm" color="negative"
                            @click.stop="removerTudo(prod)" />

                    </div>
                </q-item-section>

            </q-item>

            <q-item class="q-py-md" v-if="cart.items.length > 0">
                <q-item-section>
                    <q-item-label class="text-h10 text-grey-10 q-mb-md">Total: {{ formatPrice(cart.totalValue)
                    }}</q-item-label>
                    <q-btn color="primary" label="Finalizar Compra" icon='check' class="full-width"
                        @click="finalizaCompra" />
                </q-item-section>
            </q-item>
        </q-list>
    </q-drawer></template>