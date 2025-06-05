<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted } from 'vue';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import moment from 'moment';

    // API
    import UserService from '@/api/UserService';
    import {formUserAkun} from '@/api/DataVariable';
    import {getAllUser, registerUser, updateUser, resetPasswordUser} from '@/controllers/userAkunController';

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
            const response = await getAllUser()
            if (response != null) {
                list_user_akses.value = response
            } else {
                list_user_akses.value = []
            }
        } catch (error) {
            list_user_akses.value = []
        }
    }

    const reset_form = () => {
        data_kartu.value = null
        form.value = {
            id: null,
            name: null,
            email: null,
            roles: null,
            status: true,
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
            form.value.password = null
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
                status: data.status == 'true' ? true : false,
                roles: data.roles,
            };
        } else {
            header_dialog.value = 'Delete Akun User';
            form.value = {
                id: data.id,
                name: data.name,
                email: data.email,
                status: data.status == 'true' ? true : false,
                roles: data.roles,
            };
        }
        messages.value = [];
        visible_dialog.value = true
    }

    const post_data = async () => {
        try {
            if (form.value.name != null && form.value.email != null && form.value.roles != null) {
                if (status_form.value == 'add') {
                    const response = await registerUser(form.value)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: 'Data berhasil ditambahkan.', id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            load_user()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'warn', content: response.messages, id: count.value++ }
                        ];
                    }
                } else if (status_form.value == 'edit') {
                    const response = await updateUser(form.value.id,form.value)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: response.message, id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            load_user()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'warn', content: response.message, id: count.value++ }
                        ];
                    }
                } else {
                    const response = await resetPasswordUser(form.value.id,{password})
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: response.message, id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            load_user()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'warn', content: response.message, id: count.value++ }
                        ];
                    }
                }
            } else {
                messages.value = [
                    { severity: 'warn', content: 'Silahkan lengkapi data anda.', id: count.value++ }
                ];
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
                        <label for="status" class="font-semibold w-8rem">Status <span class="text-red-500">*</span></label>
                        <ToggleButton id="status" v-model="form.status" onIcon="pi pi-check" offIcon="pi pi-times text-white" onLabel="Active" offLabel="Non Active" invalid class="w-full text-white" :class="`${form.status == true ? 'bg-cyan-500' : 'bg-red-500'}`" aria-label="Confirmation" />
                    </div>
                </div>
                <div class="w-full text-center" v-else>
                    <span class="font-medium uppercase">Apakah anda ingin <span class="text-red-500">reset password</span> akun user tersebut ?</span>
                </div>
            </div>
            <div :class="`flex w-full ${status_form != 'delete' ? 'justify-content-end' : 'justify-content-center mt-5'} gap-2`">
                <!-- <Button type="button" label="Reset" severity="warning" @click="reset_form" v-show="status_form != 'delete'"></Button> -->
                <div class="flex gap-2">
                    <Button type="button" :label="status_form != 'delete' ? 'Cancel' : 'No'"  outlined severity="secondary" @click="visible_dialog = false"></Button>
                    <Button type="button" :label="status_form != 'delete' ? 'Save' : 'Yes'" :severity="status_form != 'delete' ? 'success' : 'danger'" @click="post_data"></Button>
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
                    <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10" :globalFilterFields="['name', 'email', 'roles']" tableStyle="min-width: 50rem">
                        <Column header="Nama" sortable sortField="name">
                            <template #body="{ data }">
                                <div :class="data.status == 'false' ? 'text-red-600' : ''" class="flex align-items-center gap-2">
                                    <i class="pi pi-user text-7xl"></i>
                                    <div class="flex flex-column gap-1">
                                        <small>{{ data.email }}</small>
                                        <strong class="uppercase">{{ data.name }}</strong>
                                    </div>
                                </div>
                            </template>
                        </Column>
                        <Column header="Email" sortable sortField="email">
                            <template #body="{ data }">
                                <div :class="data.status == 'false' ? 'text-red-600' : ''" class="flex align-items-center gap-2">
                                    <span>{{ data.email }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Roles" sortable sortField="roles">
                            <template #body="{ data }">
                                <div :class="data.status == 'false' ? 'text-red-600' : ''" class="flex align-items-center gap-2">
                                    <strong class="uppercase">{{ data.roles }}</strong>
                                </div>
                            </template>
                        </Column>
                        <Column header="">
                            <template #body="{ data }">
                                <div class="flex justify-content-center align-items-center gap-2">
                                    <Button icon="pi pi-pencil" severity="warning" v-tooltip.bottom="'Update User'" size="small" text rounded @click="show_dialog('edit', data)"/>
                                    <Button icon="pi pi-refresh" v-tooltip.bottom="'Reset Password'" severity="success" size="small" text rounded @click="show_dialog('delete', data)"/>
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