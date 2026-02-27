<script setup lang="ts">
import { ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();
const loading = ref(false);

const form = ref({
    name: '',
    price: 0,
    description: '',
    category: '',
    image: '',
    stock: 0
});

async function handleSubmit() {
    try {
        loading.value = true;
        await api.post('/products', form.value);

        $q.notify({ type: 'positive', message: 'Produto cadastrado com sucesso!' });
        router.push('/');
    } catch (error) {
        $q.notify({ type: 'negative', message: 'Erro ao cadastrar. Apenas admins podem fazer isso.' });
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <q-page padding>
        <div class="text-h4 q-mb-md">Cadastrar Novo Produto</div>

        <q-card style="max-width: 600px">
            <q-card-section>
                <q-form @submit="handleSubmit" class="q-gutter-md">
                    <q-input v-model="form.name" label="Nome do Produto" outlined />
                    <q-input v-model.number="form.price" label="Preço" type="number" outlined step="0.01" prefix="R$" class="col" />
                    <q-input v-model="form.description" label="Descrição" type="textarea" outlined />
                    <q-input v-model="form.category" label="Categoria" outlined />
                    <q-input v-model="form.image" label="URL da Imagem" outlined />
                    <q-input v-model.number="form.stock" label="Quantidade em Estoque" type="number" outlined />
                    <div class="row justify-end">
                        <q-btn label="Cancelar" flat color="grey" to="/" />
                        <q-btn label="Salvar Produto" color="primary" type="submit" :loading="loading" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>