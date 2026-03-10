<template>
  <div class="bg-primary">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-8 col-lg-6 col-xxl-4 bg-white rounded shadow">
          <form class="mt-3 mb-3" @submit.prevent="loginUser">
            <img class="logo" src="/logo.svg" alt="">
            <h1 class="mb-3 text-center">Login</h1>
            <Alert v-if="errors?.alert">{{errors.alert}}</Alert>
            <div class="mb-3">
              <label class="form-label" for="user">User</label>
              <input autocomplete="username" v-model="name" :class="{'is-invalid' : errors?.name}" class="form-control" type="text" id="user" placeholder="Name">
              <div class="invalid-feedback">{{ errors?.name }}</div>
            </div>
            
            <div class="mb-3">
              <label class="form-label" for="password">Password</label>
              <input autocomplete="current-password" v-model="password" :class="{'is-invalid' : errors?.password}" class="form-control" type="password" id="password" placeholder="Password">
              <div class="invalid-feedback">{{ errors?.password }}</div>
            </div>

            <div class="col-12 mb-2">
              
              <RouterLink to="/register">No account yet?</RouterLink>
            </div>
            
            <button :disabled="loading" type="submit" class="btn btn-primary">{{loading ? "Loading..." : "Login"}}</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { RouterLink } from 'vue-router';
  import {ref} from "vue";
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import Alert from '@/components/alert.vue';

  const name = ref("");
  const password = ref("");
  const errors = ref({});
  const loading = ref(false);
  let router = useRouter();

  function loginUser() {
    // Do validation
    if( !doValidation() ) {
      return;
    }

    // Do the request
    doRequest();
  }

  function doValidation() {
    // Reset errors before
    errors.value = {};

    if  ( name.value == "" ) {
      errors.value.name = "Username is required";
    }

    if ( password.value == "") {
      errors.value.password = "Password is required";
    }

    if ( Object.keys(errors.value).length == 0 ) {
      return true;
    }

    return false;
  }

  async function doRequest() {
    loading.value = true;
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/`, {}, {
      auth: {
        username: name.value,
        password: password.value
      },
      withCredentials: true
    })
    .then(function (response) {
      switch (response.status) {
        case 200:
          router.push({name : "home"})
          break;
      }
    })
    .catch(function (err) {
      errors.value.alert = err.response?.data.message;
      password.value = "";
    }).finally(function () {
      loading.value = false;
    });
  }
</script>