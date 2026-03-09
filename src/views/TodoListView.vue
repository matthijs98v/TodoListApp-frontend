<template>
    <dashboardLayout>
        <div class="row justify-content-center h-100">
            <div class="col-md-8 col-lg-6 col-xxl-4 justify-content-center bg-white p-4 rounded shadow-sm d-flex flex-column ">

                <div class="row">
                    <div class="col-12 d-inline-flex justify-content-between mb-4">
                        <h1>{{ todoListStore.currentTodoList.name }}</h1>
                        <AddMember v-if="todoListStore.currentTodoList.isCreator" />
                    </div>
                </div>
                
                <alert v-if="errors?.alert">{{ errors.alert }}</alert>

                <ul ref="todoListItems" class="sort">
                    <li 
                        class="my-2 cursor-pointer align-items-center d-flex justify-content-between sortable-drag"
                        v-for="todoItem in todoListStore.todoListItems" :key="todoItem.id"
                        :data-id="todoItem.id"
                    >
                        <input 
                            v-model="checkedTodos" 
                            @change="toggleTodoItem(todoItem.id)" 
                            class="form-check-input" type="checkbox" 
                            :value="todoItem.id"
                        >
                        <span @click="openUpdateTodoItemModal(todoItem.id)"
                            :class="{ 'text-muted text-decoration-line-through' : todoItem.status}" 
                        >
                            {{ todoItem.title }}
                        </span>
                        <button class="btn-transparent" @click="deleteTodoItem(todoItem.id)">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </li>
                </ul>
                
                <formModal
                    ref="updateTodoItemRef"
                    modalId="updateTodoItemModal" 
                    isUpdate="true"
                    @doRequest="updateTodoItemTitle"
                    @hidden="clearSelected"
                >
                    <template #header>
                        <h1 class="modal-title fs-5" id="updateTodoItemLabel">Update todo item</h1>
                    </template>

                    <alert v-if="errors?.alert">{{errors.alert}}</alert>

                    <div class="mb-3">
                        <label for="todo_list_name" class="col-form-label">Name</label>
                        <input type="text" :class="{'is-invalid' : errors?.todoListItemName}" v-model="todoListItemName" placeholder="Name" class="form-control" id="todo_list_name">
                        <div class="invalid-feedback">{{ errors?.todoListItemName }}</div>
                    </div>
                </formModal>
                
                <CreateTodoItem/>
            </div>
        </div>
    </dashboardLayout>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, nextTick } from 'vue';
    import Sortable from 'sortablejs';
    import dashboardLayout from '@/components/dashboardLayout.vue';
    import { useTodoListStore } from '@/stores/todoListStore';
    import { useMemberStore } from '@/stores/memberStore';
    import { useWebsocketStore } from '@/stores/websocketStore';
    import CreateTodoItem from '@/components/parts/CreateTodoItem.vue';
    import formModal from '@/components/modal/formModal.vue';
    import AddMember from '@/components/parts/AddMember.vue';
    import alert from '@/components/alert.vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';
    
    let todoListStore = useTodoListStore();
    let membersStore = useMemberStore();
    let websocketStore = useWebsocketStore();
    let route = useRoute();
    const errors = ref({});
    const checkedTodos = ref([]);

    const updateTodoItemRef = ref(null);
    const todoListItemName = ref("");
    const selectedItemId = ref(null);
    const todoListItems = ref(null);

    async function toggleTodoItem(id) {
        errors.value = {};

        await axios.put(`${import.meta.env.VITE_API_URL}/api/todoitems/${id}`, {
            Status : checkedTodos.value.includes(id) ? 1 : 0
        },{
            withCredentials: true
        })
        .then(async function (response) {
          
            switch (response.status) {
                case 200:
                    // Reload todos
                    await todoListStore.loadTodoItems(route.params.todoListId);
                    break;
            }
        })
        .catch(function (err) {
            console.log(err);
            errors.value.alert = err.response?.data.message || err.response?.data.title;
        })
    }

    function calcTodoChecked() {
        // recalcelate
        checkedTodos.value = [];
        todoListStore.todoListItems.forEach(element => {
            if (element.status == 1) {
                checkedTodos.value.push(element.id);
            }
        });
    }

    async function deleteTodoItem(id) {
        errors.value = {};

        await axios.delete(`${import.meta.env.VITE_API_URL}/api/todoitems/${id}`, {
            withCredentials: true
        })
        .then(async function (response) {
          
            switch (response.status) {
                case 200:
                    // Reload todos
                    await todoListStore.loadTodoItems(route.params.todoListId);
                    break;
            }
        })
        .catch(function (err) {
            console.log(err);
            errors.value.alert = err.response?.data.message || err.response?.data.title;
        })
    }

    function setSelected(id) {
        selectedItemId.value = id;
    }

    function clearSelected() {
        selectedItemId.value = null;
        errors.value = {};

        // for the edit part
        todoListItemName.value = "";
    }

    function doValidationForUpdateTodo() {
      // Reset errors before
      errors.value = {};

      // Do the validation
      if  ( todoListItemName.value == "" ) {
          errors.value.todoListItemName = "Todolist name is required";
      }

      if ( Object.keys(errors.value).length == 0 ) {
          return true;
      }

      return false;
    }

    async function openUpdateTodoItemModal(todoItemId) {
        setSelected(todoItemId);

        // Do request for current todo
        await axios.get(`${import.meta.env.VITE_API_URL}/api/todoitems/${todoItemId}`, {
            withCredentials: true
        })
        .then(function (response) {
            // Asign all the data
            todoListItemName.value = response.data.todoItem.title;
        })
        .catch(function (err) {
            console.log(err);
        });

        updateTodoItemRef.value.openModal()
    }

    async function updateTodoItemTitle() {
        if (!doValidationForUpdateTodo()) {
            return;
        }

        
        await axios.put(`${import.meta.env.VITE_API_URL}/api/todoitems/${selectedItemId.value}`, {
            Title : todoListItemName.value
        },{
            withCredentials: true
        })
        .then(async function (response) {
          
            switch (response.status) {
                case 200:
                    // Reload todos
                    updateTodoItemRef.value.closeModal();
                    await todoListStore.loadTodoItems(route.params.todoListId);
                    break;
            }
        })
        .catch(function (err) {
            console.log(err);
            errors.value.alert = err.response?.data.message || err.response?.data.title;
        })
    }

    onMounted( async () => {

        await todoListStore.loadTodoList(route.params.todoListId);
        await todoListStore.loadTodoItems(route.params.todoListId);
        await membersStore.loadMembers(route.params.todoListId);

        calcTodoChecked();

        // quick signal r implementation
        websocketStore.connection.invoke('JoinTodoList', Number(route.params.todoListId))
        websocketStore.setLastGroup(Number(route.params.todoListId));

        websocketStore.connection.on("ReceiveMessage", async (data) => {
            switch (data.method) {
                case "loadTodoItems" :
                    await todoListStore.loadTodoItems(route.params.todoListId);
                    calcTodoChecked();
                    break;
            }
        });

        // For draggeble
        nextTick(() => {
            var sortable = new Sortable(todoListItems.value, {
                dataIdAttr: 'data-id',
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                direction: 'vertical',
                swapThreshold: 0.65,
                forceFallback: true,
                onStart: function (event) {
                    selectedItemId.value = event.item.dataset.id;
                },
                onSort: async function (event) {
                    await axios.put(`${import.meta.env.VITE_API_URL}/api/todoitems/${selectedItemId.value}`, {
                        Order : event.newIndex
                    },{
                        withCredentials: true
                    })
                    .then(async function (response) {
                    
                        switch (response.status) {
                            case 200:
                                await todoListStore.loadTodoItems(route.params.todoListId);
                                break;
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
                },
                onEnd: function (event) {
                    selectedItemId.value = null;
                },
            });
        });
    });

    onUnmounted( async () => {
        websocketStore.connection.off('ReceiveMessage');
        websocketStore.connection.invoke('LeaveTodoList', websocketStore.lastGroup)
    });


</script>