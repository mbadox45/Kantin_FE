<script setup>
    // Vue Component
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';

    // API
    import {getAllBagian, postBagian, putBagian} from '@/controllers/masterBagianController'
    // import { ProductService } from '@/service/ProductService';

    // Variable
    
    const jenis_user = ref(true);
    const visible_dialog = ref(false);
    const header_dialog = ref('');
    const list_user_akses = ref([])
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    
    // Notifikasi
    let count = ref(0);
    const messages = ref([]);

    // Forms
    const form = ref({
        id: null,
        nama: null,
    })
    const status_form = ref('add')

    const toast = useToast();

    // Function
    onMounted(() => {
        loadData()
        // load_data()
    })

    const loadData = async() => {
        try {
            const response = await getAllBagian()
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
        form.value = {
            id: null,
            nama: null,
        };
        messages.value = [];
    }

    const show_dialog = (status,data) => {
        status_form.value= status
        if (status == 'add') {
            header_dialog.value = 'Add Data';
            reset_form()
        } else {
            header_dialog.value = 'Edit Data';
            form.value = {
                id: data.id,
                nama: data.nama,
            };
            messages.value = [];
        }
        visible_dialog.value = true
    }

    const post_data_input = async() => {
        try {
            if (form.value.nama != null) {
                if (status_form.value == 'add') {
                    const response = await postBagian(form.value)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: `Data berhasil didaftarkan`, id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            loadData()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'warn', content: `${response.message}`, id: count.value++ }
                        ];
                    }
                } else {
                    const response = await putBagian(form.value.id, form.value)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: `Data berhasil diupdate`, id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            loadData()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'warn', content: `${response.message}`, id: count.value++ }
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
                { severity: 'error', content: `Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.`, id: count.value++ }
            ];
        }
    }

</script>

<template>
    <div class="flex flex-column gap-5">
        <Toast/>
        <div class="flex justify-content-between align-items-center">
            <strong class="text-3xl font-medium uppercase">Master Bagian</strong>
            <small class="flex align-items-center">Master <strong class="mx-2">/</strong> <i class="mx-2 text-sm pi pi-bolt"></i>Bagian</small>
        </div>

        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :style="{ width: '600px' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex flex-column gap-3">
                <div class="flex flex-column justify-content-between w-full gap-1">
                    <label for="username" class="font-semibold">Nama Bagian</label>
                    <InputText id="username" v-model="form.nama" class="w-full" autocomplete="off" />
                </div>
                <div class="flex justify-content-end gap-2">
                    <div class="flex gap-2">
                        <Button type="button" label="Cancel"  outlined severity="secondary" @click="visible_dialog = false"></Button>
                        <Button type="button" label="Save" severity="success" @click="post_data_input"></Button>
                    </div>
                </div>

            </div>
        </Dialog>

        <div class="flex justify-content-center align-items-center gap-3">
            <div class="w-full flex flex-column bg-white p-3 border-round shadow-2 gap-3">
                <div class="flex justify-content-between align-items-center">
                    <strong class="uppercase text-md font-medium w-full"><i class="pi pi-list mr-3"></i>List Jadwal Makan</strong>
                    <div class="p-inputgroup">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-search"></i>
                        </span>
                        <InputText v-model="filters['global'].value" placeholder="Search" class="w-full md:w-20rem"/>
                        <Button icon="pi pi-plus" size="small" @click="show_dialog('add',null)"/>
                    </div>
                </div>
                <div class="w-full flex flex-column">
                    <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10"
                        :globalFilterFields="['nama']" tableStyle="min-width: 50rem">
                        <Column header="Nama Bagian" sortable sortField="nama">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <div class="flex flex-column gap-1">
                                        <strong class="uppercase">{{ data.nama }}</strong>
                                    </div>
                                </div>
                            </template>
                        </Column>
                        <Column header="">
                            <template #body="{ data }">
                                <div class="flex justify-content-center align-items-center gap-2">
                                    <Button icon="pi pi-pencil" severity="warning" size="small" text rounded @click="show_dialog('edit',data)"/>
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