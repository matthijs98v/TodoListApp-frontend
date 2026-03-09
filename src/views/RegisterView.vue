<template>
  <div class="bg-primary">
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-md-8 col-lg-6 col-xxl-4 bg-white rounded shadow">
          <form class="mt-3 mb-3" @submit.prevent="registerUser">
            <h1 class="text-center mb-3">Register</h1>
            <div class="mb-3">
              <label class="form-label" for="user">Username</label>
              <input :class="{'is-invalid' : errors?.name}" class="form-control" v-model="name" type="text" placeholder="Name">
              <div class="invalid-feedback">{{ errors?.name }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label" for="user">Email</label>
              <input :class="{'is-invalid' : errors?.email}" class="form-control" v-model="email" type="text" placeholder="Email">
              <div class="invalid-feedback">{{ errors?.email }}</div>
            </div>
            
            <div class="mb-3">
              <label class="form-label" for="user">Password</label>
              <input :class="{'is-invalid' : errors?.password}" class="form-control" v-model="password" type="password" placeholder="Password">
              <div class="invalid-feedback">{{ errors?.password }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label" for="user">Password repeat</label>
              <input :class="{'is-invalid' : errors?.repeat_password}" class="form-control" v-model="repeat_password" type="password" placeholder="Repeat password">
              <div class="invalid-feedback">{{ errors?.repeat_password }}</div>
            </div>

            <div class="col-12 mb-2">
              <RouterLink to="/login">Already an account?</RouterLink>
            </div>

            <button type="submit" class="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { RouterLink, useRouter} from 'vue-router';
  import { ref } from 'vue';
  import axios from 'axios';

  const name = ref("");
  const email = ref("");
  const password = ref("");
  const repeat_password = ref("");
  const errors = ref({});

  let router = useRouter();

  function registerUser() {
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

    // Do the validation
    if  ( name.value == "" ) {
      errors.value.name = "Username is required";
    }

    if ( email.value == "" ) {
      errors.value.email = "Email is required";
    } else if( !email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) ) {
      errors.value.email = "Email format is invalid";
    }

    if ( password.value == "") {
      errors.value.password = "Password is required";
    }

    if ( repeat_password.value == "" ) {
      errors.value.repeat_password = "Password repeat is required";
    }

    if ( password.value != repeat_password.value ) {
      errors.value.password = "Password must be the same as password repeat";
    }

    if ( Object.keys(errors.value).length == 0 ) {
      return true;
    }

    return false;
  }

  function doRequest() {
    axios.post(`${import.meta.env.VITE_API_URL}/api/users/`, {
        Name : name.value,
        Email : email.value,
        Password : password.value
    })
    .then(function (response) {

      switch (response.status) {
        case 200:
          router.push({name : "login"})
          break;
      }

    })
    .catch(function (err) {
      switch (err.status) {
        case 409: 
          let field = err.response.data.Message.split(" ")[0].toLowerCase();
          errors.value[field] = err.response.data.Message;
          break;
      }
    });
  }

</script>