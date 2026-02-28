<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits(['update-filter']);

const searchTerm = ref('');
const allProducts = ref<any[]>([]);
const autocomplete = ref<any[]>([]);
const textoDigitado = ref('');

onMounted(async () => {
    try {
        const response = await api.get('/products');
        allProducts.value = response.data;
    } catch (error) {
        console.error("Erro ao buscar produtos", error);
    }
});

const filter = (val: string, update: any) => {
    if (val === '' || val.length < 2) {
        update(() => { autocomplete.value = []; });
        return;
    }
    update(() => {
        const search = val.toLowerCase();
        autocomplete.value = allProducts.value
            .filter(v => v.name.toLowerCase().includes(search))
            .slice(0, 5);
    });
};

const onSelect = (item: any) => {
    if (item && item.id) {
        router.push(`/produto/${item.id}`);
        searchTerm.value = '';
        emit('update-filter', '');
    }
};
//filtra produtos no grid
const buscaGeral = () => {
    const texto = typeof searchTerm.value === 'object' && searchTerm.value !== null
        ? (searchTerm.value as any).name
        : searchTerm.value;

    emit('update-filter', textoDigitado.value);
    autocomplete.value = [];
};

const limparPesquisa = () => {
    searchTerm.value = '';
    textoDigitado.value = '';
    autocomplete.value = [];
    emit('update-filter', '');
};
</script>

<template>
    <q-select v-model="searchTerm" use-input hide-selected fill-input input-debounce="0" hide-dropdown-icon
        label="Procurar produto por nome..." label-color="white" :options="autocomplete" option-label="name"

        @filter="filter" @update:model-value="onSelect" @input-value="(val) => textoDigitado = val"
        @keyup.enter="buscaGeral" outlined rounded dense bg-color="grey-6" >

        <template v-slot:append>
            <q-icon v-if="textoDigitado !== ''" name="close" @click="limparPesquisa" class="cursor-pointer q-mr-sm " />
            <q-icon name="search" @click="buscaGeral" />
        </template>

        <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
                <q-item-section>
                    <q-item-label class="text-black text-bold">{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.category }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                    <q-item-label caption>R$ {{ scope.opt.price }}</q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>