import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useMemberStore = defineStore('members', () => {
    const membersList = ref([]);

    async function loadMembers(todoListId) {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/listmembers/${todoListId}`, {
            withCredentials: true
        })
        .then(function (response) {
            // Asign all the data
            membersList.value = response.data.listMembers;
        })
        .catch(function (err) {
            console.log(err);
        });
    }

    return { loadMembers, membersList}
})