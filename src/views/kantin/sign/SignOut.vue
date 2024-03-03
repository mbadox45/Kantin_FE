<script setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    // Function
    onMounted(() => {
        localstorages()
    })

    const localstorages = () => {
        localStorage.removeItem('usertoken');
        localStorage.removeItem('payload');
        localStorage.removeItem('roles');
        router.push('/auth/login');
    }

</script>