<template>
  <dashboardLayout>
    <h1>Hello {{ userStore.user.name }}</h1>

    <!-- Render todo items -->
    <div class="row">
     <div class="col-12 d-inline-flex justify-content-between mb-4">
        <h2 v-if="todoListStore.myTodoLists.length" >My Todo Lists</h2>
        <CreateTodo />
     </div>
    </div>
    
    <div class="row" v-if="todoListStore.myTodoLists.length">
      <div v-for="todoList in todoListStore.myTodoLists" class="col-lg-3 col-md-4 col-sm-6" :key="todoList.id">
        <todoItem 
          :title="todoList.name" 
          :todoListId="todoList.id"
          :isCreator="todoList.isCreator"
          @setDelete="openDeleteTodoModal"
          @setEdit="openEditTodoModal"
        />
      </div>
      
      <ConformationModal 
        ref="deleteTodoRef"
        modalId="deleteTodoList" 
        @doRequest="deleteTodoRequest"
        @hidden="clearSelected"
      >
      <template #header>
        <h1 class="modal-title fs-5" id="deleteTodoListLabel">Delete todolist</h1>
      </template>

      <alert v-if="errors?.alert">{{errors.alert}}</alert>
      <p>Are you sure?</p>

      </ConformationModal> 

      <FormModal
        ref="editTodoRef"
        modalId="editTodoList" 
        isUpdate="true"
        @doRequest="editTodoRequest"
        @hidden="clearSelected"
      >
        <template #header>
            <h1 class="modal-title fs-5" id="createTodoModalLabel">Update todo</h1>
        </template>

        <Alert v-if="errors?.alert">{{errors.alert}}</Alert>

        <div class="mb-3">
            <label for="todo_list_name" class="col-form-label">Name</label>
            <input type="text" :class="{'is-invalid' : errors?.todoListName}" v-model="todoListName" placeholder="Name" class="form-control" id="todo_list_name">
            <div class="invalid-feedback">{{ errors?.todoListName }}</div>
        </div>

      </FormModal>
    </div>

    <div class="row mt-3">
     <div class="col-12 d-inline-flex justify-content-between mb-2" v-if="todoListStore.otherTodoLists.length">
        <h2>Other Todo Lists</h2>
     </div>
    </div>

    <div class="row" v-if="todoListStore.otherTodoLists.length">
      <div v-for="todoList in todoListStore.otherTodoLists" class="col-lg-3 col-md-4 col-sm-6" :key="todoList.id">
        <todoItem 
          :title="todoList.name" 
          :todoListId="todoList.id"
          :isCreator="todoList.isCreator"
          @setDelete="openLeaveTodoModal"
        />
      </div>

      <ConformationModal 
        ref="leaveTodoRef"
        modalId="leaveTodoList" 
        @doRequest="leaveTodoRequest"
        @hidden="clearSelected"
      >
        <template #header>
          <h1 class="modal-title fs-5" id="leaveTodoListLabel">Leave todolist</h1>
        </template>

        <alert v-if="errors?.alert">{{errors.alert}}</alert>
        <p>Are you sure?</p>

      </ConformationModal> 
    </div>
    
  </dashboardLayout>
</template>
<script setup>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useTodoListStore } from '@/stores/todoListStore';
  import { useUserStore } from '@/stores/userStore';
  import { useMemberStore } from '@/stores/memberStore';
  import alert from '@/components/alert.vue';
  import dashboardLayout from '@/components/dashboardLayout.vue';
  import todoItem from '@/components/todoItem.vue';
  import ConformationModal from '@/components/modal/conformationModal.vue';
  import FormModal from '@/components/modal/formModal.vue';
  import CreateTodo from '@/components/parts/CreateTodo.vue'

  // Refs
  const errors = ref({});
  const selectedItemId = ref(null);
  const deleteTodoRef = ref(null);
  const leaveTodoRef = ref(null);
  const editTodoRef = ref(null);

  const todoListName = ref("");

  // Stores
  let userStore = useUserStore();
  let todoListStore = useTodoListStore();
  let memberStore = useMemberStore();

  onMounted(() => {
    todoListStore.loadTodoLists();
  });

  function openDeleteTodoModal(id) {
    deleteTodoRef.value.openModal();
    setSelected(id)
  }

  function openLeaveTodoModal(id) {
    leaveTodoRef.value.openModal();
    setSelected(id)
  }

  async function openEditTodoModal(id) {
    // load todo list here
    await todoListStore.loadTodoList(id);
    todoListName.value = todoListStore.currentTodoList.name;

    editTodoRef.value.openModal();
    setSelected(id)
  }

  function setSelected(id) {
    selectedItemId.value = id;
  }

  function clearSelected() {
    selectedItemId.value = null;
    errors.value = {};

    // for the edit part
    todoListName.value = "";
  }

  async function deleteTodoRequest() {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/todolists/${selectedItemId.value}`, {
        withCredentials: true
    })
    .then(async function (response) {
      switch (response.status) {
          case 200:
            deleteTodoRef.value.closeModal();
            // Reload todos
            await todoListStore.loadTodoLists();
            break;
      }
    })
    .catch(function (err) {
      errors.value.alert = err.response?.data.Message || err.response?.data.title;
    });
  }

  async function leaveTodoRequest() {
    // load the members to check the id
    await memberStore.loadMembers(selectedItemId.value);
    let memberListId = memberStore.membersList.find(x => x.userId == userStore.user.id).id;

    await axios.delete(`${import.meta.env.VITE_API_URL}/api/listmembers/${memberListId}`, {
        withCredentials: true
    })
    .then(async function (response) {
      switch (response.status) {
          case 200:
            // Close modal
            leaveTodoRef.value.closeModal();
            // Reload todos
            await todoListStore.loadTodoLists();
            break;
      }
    })
    .catch(function (err) {
      errors.value.alert = err.response?.data.Message || err.response?.data.title;
    });
  }

  function doValidationForEditTodo() {
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

  async function editTodoRequest() {
    if(!doValidationForEditTodo()) {
      return;
    }
    await axios.put(`${import.meta.env.VITE_API_URL}/api/todolists/${selectedItemId.value}`, {
      Name : todoListName.value
    },{
      withCredentials: true
    })
    .then(async function (response) {
      switch (response.status) {
        case 200:
          // Close modal
          editTodoRef.value.closeModal();
          // Reload todos
          await todoListStore.loadTodoLists();
          break;
      }
    })
    .catch(function (err) {
      errors.value.alert = err.response?.data.Message || err.response?.data.title;
    });
  }

</script>