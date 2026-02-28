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
    } catch (error: any) {
        const apiResponse = error.response?.data;
        if (apiResponse && apiResponse.errors && Array.isArray(apiResponse.errors)) {
            apiResponse.errors.forEach((err: { message: string }) => {
                $q.notify({
                    type: 'negative',
                    message: err.message,
                    position: 'top',
                    timeout: 4000
                });
            });

        } else {
            $q.notify({
                type: 'negative',
                message: apiResponse?.message || 'Erro inesperado ao salvar o produto.',
                position: 'bottom'
            });
        }
    } finally {
        loading.value = false;
    }
}

</script>

<template>
    <q-page padding class="flex flex-center">

        <div class="full-width" style="max-width: 600px">
            <q-btn flat icon="arrow_back" label="Voltar" to="/" class="q-mb-md" />
            <q-card flat bordered class="shadow-2">
                <q-card-section>
                    <div class="text-h5 q-mb-lg text-primary text-weight-bold">
                        Cadastrar Novo Produto
                    </div>

                    <q-form @submit="handleSubmit" class="q-gutter-md">
                        <q-input v-model="form.name" label="Nome do Produto" outlined />

                        <div class="row q-col-gutter-sm">
                            <q-input v-model.number="form.price" label="Preço" type="number" outlined step="0.01"
                                prefix="R$" class="col-12 col-sm-6" />
                            <q-input v-model.number="form.stock" label="Estoque" type="number" outlined
                                class="col-12 col-sm-6" />
                        </div>

                        <q-input v-model="form.description" label="Descrição" type="textarea" outlined />
                        <q-input v-model="form.category" label="Categoria" outlined />
                        <div class="row justify-end q-mt-lg">
                            <q-btn label="Cancelar" flat color="grey" to="/" class="q-mr-sm" />
                            <q-btn label="Salvar Produto" color="primary" type="submit" :loading="loading" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>