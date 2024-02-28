<script setup>
import { onMounted, ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const payload = ref(JSON.parse(localStorage.getItem('payload')));
const token = localStorage.getItem('usertoken');
const roles = localStorage.getItem('roles');

const model = ref([]);

onMounted(() => {
    token;
    load();
    Menu();
});

const Menu = () => {
    // console.log(roles)
    if (roles == 'admin') {
        model.value = [
            {
                label: 'Menu',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/beranda' },
                ]
            },
            {
                label: 'Main Menu',
                items: [
                    { label: 'Rekap Data', icon: 'pi pi-fw pi-database', to: '/rekap' },
                    { label: 'Administrator', icon: 'pi pi-fw pi-cog', items:[
                        { label: 'User Akun', icon: 'pi pi-fw pi-users', to: '/akun' },
                        { label: 'RFID', icon: 'pi pi-fw pi-wifi', items:[
                            { label: 'Akses Kartu', icon: 'pi pi-fw pi-id-card', to: '/kartu' },
                            { label: 'List User', icon: 'pi pi-fw pi-user', to: '/akses' },
                        ]},
                    ] },
                    { label: 'Absen Finger', icon: 'pi pi-fw pi-thumbs-up', to: '/absen-finger' },
                    { label: 'Profil', icon: 'pi pi-fw pi-lock', to: '/profil' },
                ]
            },
        ];
    } else {
        model.value = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-th-large', to: '/beranda' },]
            },
            {
                label: 'Main Menu',
                items: [
                    { label: 'Rekap Data', icon: 'pi pi-fw pi-database', to: '/rekap' },
                    { label: 'Profil', icon: 'pi pi-fw pi-lock', to: '/profil' },
                ]
            },
        ]
    }
}

const load = () => {
    // console.log(token.value)
}
</script>

<template>
    <ul class="layout-menu">
        <li class="mb-3 text-center">
            <img src="/layout/inl.png" alt="Prime Blocks" class="w-6 mt-3" />
        </li>
        <li class="text-center">
            <strong>{{ payload.name }}</strong>
        </li>
        <li class="text-center mb-5">
            <span>{{ payload.email }}</span>
        </li>
        <Divider class="my-5" />
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
