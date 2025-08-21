<template>
    <section :id="id" ></section>
    <div class="text-center font-bold">
        {{text}}
    </div>
</template> 

<script setup>
defineProps({
    id: {
        type: String,
        required: true
    },
    text:{
        type: String
    }
})
</script>