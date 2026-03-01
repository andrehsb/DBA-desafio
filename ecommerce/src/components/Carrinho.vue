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

            <q-item v-for="prod in cart.items" :key="prod.id" class="q-py-md">
                <q-item-section avatar>
                    <q-img :src="prod.image" style="width: 50px; height: 50px" />
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
                            @click="prod.id && cart.removeFromCart(prod.id)" />

                        <div class="text-primary text-weight-bold q-px-xs">
                            {{ formatPrice(prod.price * prod.quantidade) }}
                        </div>

                        <q-btn flat round dense icon="add" size="sm" color="black"
                            @click="prod.id && cart.addToCart(prod)" />

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