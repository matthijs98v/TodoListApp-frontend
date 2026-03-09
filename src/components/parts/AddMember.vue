<template>
    <button class="btn btn-primary" @click="memberRef.openModal"><i class="ri-user-settings-line"></i></button>
    <ViewModal
        ref="memberRef"
        modalId="MemberModal" 
        @hidden="clear"
    >
        <template #header>
            <h1 class="modal-title fs-5" id="MemberModalLabel">Manage members</h1>
        </template>

        <Alert v-if="errors?.alert">{{errors.alert}}</Alert>

        <div class="row">
            <h2>Members</h2>
            <div class="col-12 pt-1 pb-1" v-for="member in memberLsitStore.membersList" :key="member.id">
                <!-- TODO Fix members of list here -->
                 <div class="d-flex justify-content-between align-items-center">
                    <span>{{ member.name }}</span>
                    <button
                        class="btn-transparent"
                        @click="deleteMember(member.id, route.params.todoListId)"
                    >
                       <i class="ri-user-minus-line"></i>
                    </button>
                 </div>
                
            </div>
        </div>

        <div class="row">
            <h2>Add members</h2>
            <div class="col-12 pt-1 pb-2">
                <input 
                    @change="searchForName" 
                    v-model="search" 
                    class="form-control" 
                    type="text" 
                    placeholder="Search members"
                >
            </div>
            <div class="overflow-auto col-12"> 
                <div class="mb-2" v-for="result in results">
                    <div class="d-flex justify-content-between align-items-center">
                        <span>{{ result.name }}</span>
                        <button
                            class="btn-transparent"
                            @click="addMember(result.id, route.params.todoListId)"
                        >
                            <i class="ri-user-add-line"></i>
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    </ViewModal>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import ViewModal from '../modal/viewModal.vue';
    import { useMemberStore } from '@/stores/memberStore';
    import Alert from '../alert.vue';
    import { useRoute } from 'vue-router';

    const errors = ref({});
    const memberRef = ref(null);
    const search = ref("");
    const results = ref([]);

    let route = useRoute();

    let memberLsitStore = useMemberStore();

    function clear() {
        errors.value = {};
        results.value = {};
        search.value = "";
    }

    async function deleteMember(memberId, todoListId) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/listmembers/${memberId}`,
        {
            withCredentials: true
        })
        .then(function (response) {
            if (response.status == 200) {
                memberLsitStore.loadMembers(todoListId);
            }
        })
        .catch(function (err) {
            errors.value.alert = err.response?.data.Message || err.response?.data.title;
        }).finally(() => {});
    }

    async function addMember(userId, todoListId) {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/listmembers`,{
            UserId: userId,
            TodoListId: todoListId
        }, {
            withCredentials: true
        })
        .then(function (response) {
            if (response.status == 200) {
                memberLsitStore.loadMembers(todoListId);
            }
          
        })
        .catch(function (err) {
            errors.value.alert = err.response?.data.Message || err.response?.data.title;
        }).finally(() => {});
    }

    async function searchForName() {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/users/search`,{
            Name: search.value
        }, {
            withCredentials: true
        })
        .then(async function (response) {
            if (response.status == 200) {
                results.value = response.data.users;
                errors.value({});
            }
          
        })
        .catch(function (err) {
            errors.value.alert = err.response?.data.Message || err.response?.data.title;
        }).finally(() => {});
    }

</script>