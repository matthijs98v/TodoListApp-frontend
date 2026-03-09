import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useUserStore = defineStore('user', () => {

  const validUser = ref(false);
  const user = ref({});

  async function checkUser() {
    // Do check if authirized
    await axios.get(`${import.meta.env.VITE_API_URL}/api/users/current`, 
      { withCredentials: true }
    )
    .then(function (response) {
      validUser.value = true;
      user.value = response.data;
    })
    .catch(function (err) {
      validUser.value = false;
      user.value = {};
    });
  }

  return { checkUser, validUser, user }
})
