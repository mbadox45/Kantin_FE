<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import moment from 'moment';

    // API
    import UserService from '@/api/UserService';
    import {formUserAkun} from '@/api/DataVariable';

    // Variable
    const list_user_akses = ref([])
    const setpassword = ref(true)
    const resetpassword = ref(false)
    const list_jenis_user = ref([
        { name: 'Admin', code: 'admin' },
        { name: 'User', code: 'user' },
    ]);

    // Dialog
    const visible_dialog = ref(false);
    const data_kartu = ref(null)
    const disabled_form = ref(true)
    const form = ref(formUserAkun)
    let count = ref(0);
    const messages = ref([]);
    const status_form = ref('add')
    const kategori_user = ref(null)
    const header_dialog = ref('');


    const filters = ref(
        {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        }
    );

    // Function
    onMounted(() => {
        load_user()
    })

    const load_user = async() => {
        try {
            let response;
            response = await UserService.getUsers()
            const load = response.data.data
            const list = []
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    id: load[i].id,
                    email: load[i].email,
                    jabatan: load[i].jabatan,
                    roles: load[i].roles,
                    name: load[i].name,
                    active: load[i].active,
                    username: load[i].username,
                }
            }
            list_user_akses.value = list
        } catch (error) {
            list_user_akses.value = []
        }
    }

    const reset_form = () => {
        data_kartu.value = null
        form.value = {
            id: null,
            name: '',
            email: '',
            roles: '',
            jabatan: '-',
            username: '',
            password: 'rahasia123',
        };
        messages.value = [];
        disabled_form.value = true
    }

    const reset_Password = () => {
        resetpassword.value = !resetpassword.value;
        if (resetpassword.value == true) {
            form.value.password = 'rahasia123'
        } else {
            form.value.password = ''
        }
    }

    const show_dialog = (status,data) => {
        status_form.value= status
        if (status == 'add') {
            header_dialog.value = 'Add Akun User';
            reset_form()
        } else if (status == 'edit') {
            header_dialog.value = 'Edit Akun User';
            form.value = {
                id: data.id,
                name: data.name,
                email: data.email,
                roles: data.roles,
                jabatan: '-',
                username: data.username,
                password: '',
            };
            messages.value = [];
        } else {
            header_dialog.value = 'Delete Akun User';
            form.value = {
                id: data.id,
                name: '',
                email: '',
                roles: '',
                jabatan: '',
                username: '',
                password: '',
            };
            messages.value = [];
        }
        visible_dialog.value = true
    }

    const post_data = async () => {
        try {
            if (form.value.name != '' && form.value.email != '' && form.value.roles != '' && form.value.jabatan != '' && form.value.username != '') {
                if (status_form.value == 'add') {
                    let response;
                    response = await UserService.addUser(form.value)

                    const load = response.data;
                    if (load.code == 200) {
                        messages.value = [
                            { severity: 'success', content: 'Data berhasil ditambahkan.', id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            load_user()
                        }, 2000);
                    } else if (load.code == 201) {
                        messages.value = [
                            { severity: 'warn', content: load.msg, id: count.value++ }
                        ];
                    } else {
                        messages.value = [
                            { severity: 'error', content: load.msg, id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                        }, 2000);
                    }
                } else {
                    let response;
                    response = await UserService.updateUser(form.value)
                    
                    const load = response.data;
                    if (load.code == 200) {
                        messages.value = [
                            { severity: 'success', content: 'Data berhasil diupdate.', id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            load_user()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'error', content: load.msg, id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                        }, 2000);
                    }
                }
            } else {
                if (status_form.value == 'delete') {
                    const response = await UserService.deleteUser(form.value.id)
                    
                    const load = response.data;
                    if (load.code == 200) {
                        messages.value = [
                            { severity: 'success', content: 'Data berhasil dihapus.', id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            load_user()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'error', content: load.msg, id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                        }, 2000);
                    }
                } else {
                    messages.value = [
                        { severity: 'warn', content: 'Silahkan lengkapi data anda.', id: count.value++ }
                    ];
                }
            }
        } catch (error) {
            messages.value = [
                { severity: 'error', content: 'Sistem Error', id: count.value++ }
            ];
        }
    }

</script>

<template>
    <div class="flex flex-column gap-5">
        <!-- Dialog -->
        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :style="{ width: '700px' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex w-full gap-2 my-3">
                <div class="flex flex-column gap-2 w-full" v-if="status_form != 'delete'">
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="name" class="font-semibold w-8rem">Nama <span class="text-red-500">*</span></label>
                        <InputText id="name" v-model="form.name" placeholder="Anonymous" class="w-full sm:w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="email" class="font-semibold w-8rem">Email <span class="text-red-500">*</span></label>
                        <InputText id="email" type="email" v-model="form.email" placeholder="@gmail.com" class="w-full sm:w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="roles" class="font-semibold w-8rem">Roles <span class="text-red-500">*</span></label>
                        <Dropdown v-model="form.roles" :options="list_jenis_user" optionLabel="name" optionValue="code" placeholder="Roles" class="w-full md:w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="jabatan" class="font-semibold w-8rem">Jabatan <span class="text-red-500">*</span></label>
                        <InputText id="jabatan" v-model="form.jabatan" disabled class="w-full sm:w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="username" class="font-semibold w-8rem">Username <span class="text-red-500">*</span></label>
                        <InputText id="username" v-model="form.username" placeholder="Username" class="w-full sm:w-full"/>
                    </div>
                    <Divider/>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="password" class="font-semibold w-8rem">Password <span class="text-red-500">*</span></label>
                        <div class="p-inputgroup">
                            <InputText id="password" :type="setpassword == true ? 'password' : 'text'" disabled v-model="form.password" placeholder="****" class="w-full sm:w-full"/>
                            <Button :class="`${status_form == 'add' ? 'border-round-right' : ''}`" :icon="`pi pi-eye${setpassword == true ? '' : '-slash'}`" severity="secondary" @click="setpassword = !setpassword"/>
                            <Button :class="`${status_form == 'add' ? 'hidden' : 'block'}`" :icon="`${resetpassword == true ? 'pi pi-check' : 'pi pi-refresh'}`" :severity="`${resetpassword == true ? 'info' : 'warning'}`" @click="reset_Password"/>
                        </div>
                    </div>
                </div>
                <div class="w-full text-center" v-else>
                    <span class="font-medium uppercase">Apakah anda ingin <span class="text-red-500">hapus</span> akun user tersebut ?</span>
                </div>
            </div>
            <div :class="`flex ${status_form != 'delete' ? 'justify-content-between' : 'justify-content-center mt-5'} gap-2`">
                <Button type="button" label="Reset" severity="warning" @click="reset_form" v-show="status_form != 'delete'"></Button>
                <div class="flex gap-2">
                    <Button type="button" label="Cancel"  outlined severity="secondary" @click="visible_dialog = false"></Button>
                    <Button type="button" :label="status_form != 'delete' ? 'Save' : 'Delete'" :severity="status_form != 'delete' ? 'success' : 'danger'" @click="post_data"></Button>
                </div>
            </div>
        </Dialog>

        <!-- Components -->
        <div class="flex justify-content-between align-items-center">
            <strong class="text-3xl font-medium uppercase">User Akun</strong>
            <small class="flex align-items-center">Administrator <strong class="mx-2">/</strong> <i class="mx-2 text-sm pi pi-user"></i>User Akun</small>
        </div>

        <div class="flex justify-content-center align-items-center gap-3">
            <div class="w-full flex flex-column bg-white p-3 border-round shadow-2 gap-3">
                <div class="flex justify-content-between align-items-center">
                    <strong class="uppercase text-md font-medium"><i class="pi pi-table mr-3"></i>List User</strong>
                    <Button icon="pi pi-plus" label="Add User" size="small" @click="show_dialog('add', null)"/>
                </div>
                <div class="flex justify-content-end align-items-center gap-3">
                    <div class="">
                        <div class="p-inputgroup">
                            <InputText v-model="filters['global'].value" placeholder="Search" class="w-full md:w-20rem"/>
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-column">
                    <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10" :globalFilterFields="['name', 'email', 'username', 'roles']" tableStyle="min-width: 50rem">
                        <Column header="Nama" sortable sortField="name">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-user text-7xl"></i>
                                    <div class="flex flex-column gap-1">
                                        <small>{{ data.email }}</small>
                                        <strong class="uppercase">{{ data.name }}</strong>
                                    </div>
                                </div>
                            </template>
                        </Column>
                        <Column header="Username" sortable sortField="username">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <span>{{ data.username }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Roles" sortable sortField="roles">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <strong class="uppercase">{{ data.roles }}</strong>
                                </div>
                            </template>
                        </Column>
                        <Column header="">
                            <template #body="{ data }">
                                <div class="flex justify-content-center align-items-center gap-2">
                                    <Button icon="pi pi-pencil" severity="warning" size="small" text rounded @click="show_dialog('edit', data)"/>
                                    <Button icon="pi pi-trash" severity="danger" size="small" text rounded @click="show_dialog('delete', data)"/>
                                </div>
                            </template>
                        </Column>
                        <template #empty> No customers found. </template>
                    </DataTable>
                </div>
            </div>
        </div>
    </div>
</template>