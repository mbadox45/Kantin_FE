<script setup>
    import { useRouter } from 'vue-router';
    const router = useRouter();

    const link = () => {
        router.back()
    }

</script>

<template>
    <div class="flex flex-column h-screen gap-2 bg-white align-items-center justify-content-center">
        <i class="pi pi-cog text-7xl"></i>
        <strong class="text-5xl font-normal">Mohon Maaf</strong>
        <strong class="text-3xl">Aplikasi sedang dalam pengembangan</strong>
        <Button label="Kembali" link @click="link"/>
    </div>
</template>