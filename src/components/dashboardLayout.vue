<template>
  <div class="min-vh-100 bg-custom">
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" :to="{name: 'home'}">Todo list app</RouterLink>
        <button class="navbar-toggler collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation">
          <svg>
              <line x1="33%" y1="50%" x2="67%" y2="50%" />
              <line x1="33%" y1="50%" x2="67%" y2="50%" />
              <line x1="33%" y1="50%" x2="67%" y2="50%" />
          </svg>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav d-lg-none">
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{name: 'home'}"><i class="ri-todo-line"></i> Todo Lists</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{name: 'info'}"><i class="ri-information-line"></i> App info</RouterLink>
            </li>
          </ul>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <button @click="logout" class="nav-link"><i class="ri-logout-box-line"></i> Logout</button>
            </li>
          </ul>

        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row align-items-stretch content-container">
        <div class="side-menu d-none d-lg-flex nav d-flex flex-column ">
            <RouterLink class="nav-link" :to="{name: 'home'}"><i class="ri-todo-line"></i> Todo Lists</RouterLink>
            <RouterLink class="nav-link" :to="{name: 'info'}"><i class="ri-information-line"></i> App info</RouterLink>
        </div>
        <div class="col content p-4">
          <slot></slot>
        </div>
      </div>
    </div>

  </div>
</template>
<script setup>
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  import { RouterLink } from 'vue-router';

  let router = useRouter();

  async function logout() {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true })
    .then(function (response) {
      router.push({name : 'login'});
    })
    .catch(function (err) {
      console.log(err);
    });
  }
</script>