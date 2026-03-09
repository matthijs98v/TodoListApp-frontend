<template>
    <button class="btn btn-primary mt-auto" @click="createTodoItemRef.openModal"> <i class="ri-task-line"></i> Add Todo Item </button>

    <FormModal
        ref="createTodoItemRef"
        modalId="createTodoListItem" 
        @doRequest="createTodoItemRequest"
        @hidden="clear"
    >
        <template #header>
            <h1 class="modal-title fs-5" id="createTodoItemModalLabel">Create todo</h1>
        </template>

        <Alert v-if="errors?.alert">{{errors.alert}}</Alert>

        <div class="mb-3">
            <label for="todo_list_name" class="col-form-label">Name</label>
            <input type="text" :class="{'is-invalid' : errors?.todoItemName}" v-model="todoItemName" placeholder="Name" class="form-control" id="todo_list_name">
            <div class="invalid-feedback">{{ errors?.todoListName }}</div>
        </div>

    </FormModal>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    import FormModal from '../modal/formModal.vue';
    import Alert from '../alert.vue';
    import { useTodoListStore } from '@/stores/todoListStore';

    const errors = ref({});
    const todoItemName = ref("");
    const createTodoItemRef = ref(null);

    let route = useRoute();

    let todoListStore = useTodoListStore();

    function doValidation() {
        // Reset errors before
        errors.value = {};

        // Do the validation
        if  ( todoItemName.value == "" ) {
            errors.value.todoListName = "TodoItem name is required";
        }

        if ( Object.keys(errors.value).length == 0 ) {
            return true;
        }

        return false;
    }

    function clear() {
        errors.value = {};
        todoItemName.value = "";
    }

    async function createTodoItemRequest() {
        if (!doValidation()) {
            return;
        }

        // Set the state to loading
        createTodoItemRef.value.setIsloading(true);

        await axios.post(`${import.meta.env.VITE_API_URL}/api/todoitems`,{
            TodoListId: route.params.todoListId,
            Title: todoItemName.value,
            Status: 0
        }, {
            withCredentials: true
        })
        .then(async function (response) {
          
            switch (response.status) {
                case 200:
                    // Reload todos
                    await todoListStore.loadTodoItems(route.params.todoListId);
                    // Close the modal
                    createTodoItemRef.value.closeModal();
                    break;
            }
        })
        .catch(function (err) {
            console.log(err);
            errors.value.alert = err.response?.data.message || err.response?.data.title;
        }).finally(() => {
            // Loading state is done
            createTodoItemRef.value.setIsloading(false);
        });
           
    }
</script>