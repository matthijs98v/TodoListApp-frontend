<template>
    <div class="modal fade" ref="modalRef" :id="props.modalId" tabindex="-1" :aria-labelledby="props.modalId+'Label'" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header"></slot>
                </div>

                <form @submit.prevent="$emit('doRequest')">
                    <div class="modal-body">
                       <slot></slot>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button v-if="!isUpdate" type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? "Creating..." : "Create" }}
                        </button>
                        <button v-else type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? "Updating..." : "Update" }}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, nextTick, onMounted } from 'vue';
    import { Modal } from 'bootstrap'

    let isLoading = ref(false);

    const props = defineProps({
        modalId : String,
        isUpdate: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits([
        'hidden',
        'doRequest'
    ]);

    defineExpose({
        openModal,
        closeModal,
        setIsloading
    });

    const errors = ref({});
    const modalRef = ref(null);
    let instance = null;

    onMounted(() => {
        nextTick(() => {
            // Setup the instance
            instance = new Modal(modalRef.value);
            // Setup event listener
            modalRef.value.addEventListener('hidden.bs.modal', event => {
                errors.value = {};
                emit('hidden');
            });
        });
    });

    function setIsloading(state) {
        isLoading.value = state;
    }

    function openModal() {
        instance.show()
    }

    function closeModal() {
        instance.hide()
    }

</script>