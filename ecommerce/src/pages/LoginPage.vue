<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar(); // notificações

const loading = ref(false);
const form = ref({
  username: '',
  password: ''
});

async function handleLogin() {
  loading.value = true;
  try {
    // chama login do store
    await authStore.login(form.value.username, form.value.password);

    $q.notify({
      type: 'positive',
      message: `Bem-vindo, ${form.value.username}! Você entrou como ${authStore.role}.`,
      position: 'top'
    });

    // redireciona para a home 
    console.log('Indo para a home...')
    router.push('/');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Falha no login. Verifique usuário e senha.',
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card style="width: 100%; max-width: 400px; border-radius: 12px shadow-3">
      <q-card-section class="bg-primary text-white text-center q-pa-lg">
        <div class="text-h5 text-bold">DBA Ecommerce</div>
        <div class="text-subtitle2 q-mt-sm">Entre com suas credenciais</div>
      </q-card-section>

      <q-card-section class="q-pa-xl">
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input v-model="form.username" label="Usuário" outlined bg-color="white"
            :rules="[val => !!val || 'O usuário é obrigatório']">
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input v-model="form.password" label="Senha" type="password" outlined bg-color="white"
            :rules="[val => !!val || 'A senha é obrigatória']">
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <div class="q-mt-lg">
            <q-btn label="Entrar" type="submit" color="primary" class="full-width text-bold" size="lg"
              :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>
