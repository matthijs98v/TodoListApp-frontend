<template>
    <div class="modal fade" ref="modalRef" :id="props.modalId" tabindex="-1" :aria-labelledby="props.modalId+'Label'" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <slot name="header"></slot>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, nextTick, onMounted } from 'vue';
    import { Modal } from 'bootstrap'

    const props = defineProps({
        modalId : String
    });

    const emit = defineEmits([
        'hidden',
    ]);

    defineExpose({
        openModal,
        closeModal,
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

    function openModal() {
        instance.show()
    }

    function closeModal() {
        instance.hide()
    }

</script>