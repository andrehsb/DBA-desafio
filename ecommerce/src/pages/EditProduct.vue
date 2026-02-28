<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const loading = ref(false);
const inicializando = ref(true);
const form = ref({
    id: null,
    name: '',
    price: 0,
    stock: 0,
    description: '',
    category: '',
    image: ''
});

const loadProduct = async () => {
    try {
        const id = route.params.id;
        const response = await api.get(`/products/${id}`);
        form.value = response.data;
    } catch (error) {
        $q.notify({ type: 'negative', message: 'Erro ao carregar dados do produto.' });
        router.push('/');
    } finally {
        inicializando.value = false;
    }
};

async function handleEdit() {
    loading.value = true;
    try {
        await api.put(`/products/${form.value.id}`, form.value);

        $q.notify({
            message: 'Produto atualizado com sucesso!',
            color: 'positive',
            icon: 'check'
        });
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

onMounted(loadProduct);
</script>
<template>
    <q-page padding class="flex flex-center">
        <div class="full-width" style="max-width: 600px">
            <q-btn flat icon="arrow_back" label="Voltar" to="/" class="q-mb-md" />

            <div v-if="inicializando" class="text-center">
                <q-spinner-dots color="primary" size="40px" />
            </div>

            <q-card v-else flat bordered class="shadow-2">
                <q-card-section>
                    <div class="text-h5 q-mb-lg text-primary text-weight-bold">
                        Editar Produto: {{ form.name }}
                    </div>

                    <q-form @submit="handleEdit" class="q-gutter-md">
                        <q-input v-model="form.name" label="Nome do Produto" outlined
                            :rules="[val => !!val || 'Obrigatório']" />

                        <div class="row q-col-gutter-sm">
                            <q-input v-model.number="form.price" label="Preço" type="number" outlined step="0.01"
                                prefix="R$" class="col-12 col-sm-6" />
                            <q-input v-model.number="form.stock" label="Estoque" type="number" outlined
                                class="col-12 col-sm-6" />
                        </div>

                        <q-input v-model="form.description" label="Descrição" type="textarea" outlined />
                        <q-input v-model="form.category" label="Categoria" outlined />
                        <q-input v-model="form.image" label="URL da Imagem" outlined />

                        <div v-if="form.image" class="text-center q-mt-md">
                            <q-img :src="form.image" style="max-height: 100px; max-width: 100px" />
                        </div>

                        <div class="row justify-end q-mt-lg">
                            <q-btn label="Cancelar" flat color="grey" to="/" class="q-mr-sm" />
                            <q-btn label="Salvar Alterações" color="primary" type="submit" :loading="loading" />
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>