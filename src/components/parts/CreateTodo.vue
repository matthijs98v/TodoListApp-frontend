<template>
    <button class="btn btn-primary" @click="createTodoRef.openModal">Create Todo</button>
    <FormModal
        ref="createTodoRef"
        modalId="createTodoList" 
        @doRequest="createTodoRequest"
        @hidden="clear"
    >
        <template #header>
            <h1 class="modal-title fs-5" id="createTodoModalLabel">Create todo</h1>
        </template>

        <Alert v-if="errors?.alert">{{errors.alert}}</Alert>

        <div class="mb-3">
            <label for="todo_list_name" class="col-form-label">Name</label>
            <input type="text" :class="{'is-invalid' : errors?.todoListName}" v-model="todoListName" placeholder="Name" class="form-control" id="todo_list_name">
            <div class="invalid-feedback">{{ errors?.todoListName }}</div>
        </div>

    </FormModal>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import FormModal from '../modal/formModal.vue';
    import Alert from '../alert.vue';
    import { useTodoListStore } from '@/stores/todoListStore';

    const errors = ref({});
    const todoListName = ref("");
    const createTodoRef = ref(null);

    let todoListStore = useTodoListStore();

    function doValidation() {
        // Reset errors before
        errors.value = {};

        // Do the validation
        if  ( todoListName.value == "" ) {
            errors.value.todoListName = "Todolist name is required";
        }

        if ( Object.keys(errors.value).length == 0 ) {
            return true;
        }

        return false;
    }

    function clear() {
        errors.value = {};
        todoListName.value = "";
    }

    async function createTodoRequest() {
        if (!doValidation()) {
            return;
        }

        // Set the state to loading
        createTodoRef.value.setIsloading(true);

        await axios.post(`${import.meta.env.VITE_API_URL}/api/todolists/`,{
            Name: todoListName.value
        }, {
            withCredentials: true
        })
        .then(async function (response) {
          
            switch (response.status) {
                case 200:
                    // Reload todos
                    await todoListStore.loadTodoLists();
                    // Close the modal
                    createTodoRef.value.closeModal();
                    break;
            }
        })
        .catch(function (err) {
            console.log(err);
            errors.value.alert = err.response?.data.Message || err.response?.data.title;
        }).finally(() => {
            // Loading state is done
            createTodoRef.value.setIsloading(false);
        });

           
    }
</script>