import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useTodoListStore = defineStore('todolist', () => {
  const todoLists = ref([]);

  // My todolist
  const myTodoLists = computed(() => {
    return todoLists.value.filter( (el) => {
      return el.isCreator
    });
  });

  // Other todolist
  const otherTodoLists = computed(() => {
    return todoLists.value.filter( (el) => {
      return !el.isCreator
    });
  });

  const todoListItems = ref([]);
  const currentTodoList = ref({});

  async function loadTodoLists() {
    await axios.get(`${import.meta.env.VITE_API_URL}/api/todolists/`, {
      withCredentials: true
    })
    .then(function (response) {
      todoLists.value = response.data.todoLists;
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  async function loadTodoList(todoListId) {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/todolists/${todoListId}`, {
          withCredentials: true
      })
      .then(function (response) {
          currentTodoList.value = response.data.todoList;
      })
      .catch(function (err) {
          console.log(err);
      });
  }

  async function loadTodoItems(todoListId) {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/todolists/${todoListId}/items`, {
            withCredentials: true
        })
        .then(function (response) {
            // Asign all the data
            todoListItems.value = response.data.todoListItems;
        })
        .catch(function (err) {
            console.log(err);
        });
    }

  return { loadTodoLists, loadTodoItems, loadTodoList, todoLists, todoListItems, currentTodoList, myTodoLists, otherTodoLists}
})