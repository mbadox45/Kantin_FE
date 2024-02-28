<script setup>
    import { ref, onMounted } from 'vue';

    // API
    import UserService from '@/api/UserService';
    import {formUserAkun} from '@/api/DataVariable';

    // Variable
    const form = ref(formUserAkun)
    const setpassword = ref(true)
    const messages = ref([]);
    let count = ref(0);

    // Function
    onMounted(() => {
        load_user()
    })

    const load_user = async() => {
        try {
            const local = JSON.parse(localStorage.getItem('payload'));
            const response = await UserService.getUsersID(local.id)
            const load = response.data.data
            form.value = {
                id: load.id,
                name: load.name,
                email: load.email,
                roles: load.roles,
                jabatan: load.jabatan,
                username: load.username,
                password: '',
            }
        } catch (error) {
            form.value = {
                id: null,
                name: '',
                email: '',
                roles: '',
                jabatan: '-',
                username: '',
                password: '',
            }
        }
    }

    const onSubmit = async() => {
        if (form.value.name != '' && form.value.email != '' && form.value.roles != '' && form.value.jabatan != '' && form.value.username != '') {
            const response = await UserService.updateUser(form.value)
            const load = response.data;
            if (load.code == 200) {
                messages.value = [
                    { severity: 'success', content: 'Data berhasil diupdate.', id: count.value++ }
                ];
                load_user()
                setTimeout(function() {
                    messages.value = []
                }, 2000);
            } else {
                messages.value = [
                    { severity: 'error', content: load.msg, id: count.value++ }
                ];
                setTimeout(function() {
                    messages.value = []
                }, 2000);
            }
        } else {

        }
    }

</script>

<template>
    <div class="flex flex-column gap-5">

        <!-- Components -->
        <div class="flex justify-content-between align-items-center">
            <strong class="text-3xl font-medium uppercase">Profil User</strong>
            <small class="flex align-items-center">Home <strong class="mx-2">/</strong> <i class="mx-2 text-sm pi pi-user"></i>Profil User</small>
        </div>

        <div class="flex justify-content-center align-items-center gap-3">
            <div class="w-full flex flex-column bg-white p-3 border-round shadow-2 gap-3">
                <transition-group name="p-message" tag="div">
                    <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
                </transition-group>
                <form @submit="onSubmit">
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="name" class="font-semibold w-8rem">Nama <span class="text-red-500">*</span></label>
                        <InputText id="name" v-model="form.name" placeholder="Anonymous" class="w-full sm:w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="email" class="font-semibold w-8rem">Email <span class="text-red-500">*</span></label>
                        <InputText id="email" type="email" v-model="form.email" placeholder="@gmail.com" class="w-full sm:w-full"/>
                    </div>
                    <Divider/>
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="username" class="font-semibold w-8rem">Username <span class="text-red-500">*</span></label>
                        <InputText id="username" v-model="form.username" placeholder="Username" class="w-full sm:w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-5 gap-3">
                        <label for="password" class="font-semibold w-8rem">Password <span class="text-red-500">*</span></label>
                        <div class="p-inputgroup">
                            <InputText id="password" :type="setpassword == true ? 'password' : 'text'" v-model="form.password" placeholder="****" class="w-full sm:w-full"/>
                            <Button :class="`${status_form == 'add' ? 'border-round-right' : ''}`" :icon="`pi pi-eye${setpassword == true ? '' : '-slash'}`" severity="secondary" @click="setpassword = !setpassword"/>
                        </div>
                    </div>
                    <div class="flex justify-content-end align-items-center gap-3">
                        <Button label="Save" @click="onSubmit" severity="success"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>