<template>
    <div class="card mb-4 shadow-sm">
        <div class="card-body">
            <div class="row">
                <div class="col-12 d-inline-flex justify-content-between mb-4">
                    <h5 class="align-self-center card-title mb-0">{{props.title}}</h5>

                    <div>
                        <button 
                            v-if="isCreator"
                            class="btn-transparent" 
                            @click="$emit('setEdit', props.todoListId)"
                        >
                            <i class="ri-pencil-line"></i>
                        </button>

                        <button type="button" 
                            class="btn-transparent" 
                            @click="$emit('setDelete', props.todoListId)"
                        >
                            <i v-if="isCreator" class="ri-close-large-line"></i>
                            <i v-else class="ri-logout-box-line"></i>
                        </button>
                    </div>
                    
                </div>
            </div>
            <RouterLink :to="{name:'todoList', params: {todoListId: props.todoListId}}" class="btn btn-secondary">Go to todo</RouterLink>
        </div>
    </div>
</template>
<script setup>
    import { RouterLink } from 'vue-router';
    
    const props = defineProps({
        title:String,
        todoListId:Number,
        isCreator: Boolean
    })
</script>