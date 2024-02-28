<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import moment from 'moment';

    // API
    import AksesService from '@/api/AksesService';
    import {formPenggunaKartu} from '@/api/DataVariable';
    // import { ProductService } from '@/service/ProductService';

    // Variable
    const jenis_user = ref('karyawan');
    const list_user_akses = ref([])
    const list_jenis_user = ref([
        { name: 'Karyawan', code: 'karyawan' },
        { name: 'Outsource', code: 'outsource' },
        { name: 'Internship', code: 'internship' },
    ]);
    
    // Dialog
    const visible_dialog = ref(false);
    const data_kartu = ref(null)
    const disabled_form = ref(true)
    const form = ref(formPenggunaKartu)
    let count = ref(0);
    const messages = ref([]);
    const status_form = ref('add')
    const kategori_user = ref(null)
    const header_dialog = ref('');
    const loading_cek_kartu = ref(null)


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
            if (jenis_user.value == 'karyawan') {
                response = await AksesService.getAllKaryawan()
            } else if (jenis_user.value == 'outsource') {
                response = await AksesService.getAllOutsource()
            } else {
                response = await AksesService.getAllInternship()
            }
            const load = response.data.data
            const list = []
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    id: load[i].id,
                    user_id: jenis_user.value == 'karyawan' ? load[i].nrk : load[i].barcode,
                    rfid_code: jenis_user.value == 'karyawan' ? load[i].rfid : load[i].barcode,
                    nama: load[i].nama,
                    instansi: jenis_user.value == 'karyawan' ? 'PT Industri Nabati Lestari' : load[i].instansi,
                    status: load[i].status,
                }
            }
            list_user_akses.value = list
            console.log(jenis_user.value,list)
        } catch (error) {
            list_user_akses.value = []
        }
    }

    const cek_status_penggunaa_kartu = () => {
        try {
            const input = form.value.rfid_code.toString()
            if (input != '' && input.length > 8) {
                loading_cek_kartu.value = 'Loading...'
                setTimeout(async function (){
                    let test;
                    if (input.length > 8) {
                        const response = await AksesService.checkPenggunaRfidCard({rfid_code:form.value.rfid_code})
                        const load = response.data
                        if (load.code == 200) {
                            data_kartu.value = {
                                nama:load.data.nama,
                                status:load.data.status,
                            }
                            // Form
                            if (load.data.nama != 'Belum ada') {
                                form.value.id = load.data.id;
                                form.value.user_id = load.kategori == 'karyawan' ? load.data.nrk : load.data.barcode;
                                form.value.nama = load.data.nama;
                                form.value.instansi = load.kategori == 'karyawan' ? 'PT Industri Nabati Lestari' : load.data.instansi;
                                form.value.status = load.data.status;
                                status_form.value = 'edit';
                            } else {
                                form.value.user_id = load.kategori == 'karyawan' ? '' : form.value.rfid_code;
                                form.value.nama = '';
                                form.value.instansi = load.kategori == 'karyawan' ? 'PT Industri Nabati Lestari' : '';
                                status_form.value = 'add';
                            }

                            kategori_user.value = load.kategori
                            loading_cek_kartu.value = null
                            disabled_form.value = false
                        } else {
                            data_kartu.value = {
                                nama:load.data,
                                status:false,
                            }
                            loading_cek_kartu.value = null
                        }
                    } 
                    else {
                        data_kartu.value = null
                        loading_cek_kartu.value = null
                    }
                    console.log(input)
                }, 1000);
            } else {
                reset_form()
            }
        } catch (error) {
            loading_cek_kartu.value = null
            data_kartu.value = null
        }
    }

    const reset_form = () => {
        data_kartu.value = null
        form.value = {
            user_id: '',
            id: null,
            rfid_code: '',
            nama: '',
            instansi: '',
            status: true,
        };
        messages.value = [];
        disabled_form.value = true
    }

    const show_dialog = (status,data) => {
        status_form.value= status
        if (status == 'add') {
            header_dialog.value = 'Form Akses User';
            reset_form()
        } else {
            header_dialog.value = 'Edit RFID Card';
            form.value = {
                user_id: data.user_id,
                rfid_code: '',
                nama: '',
                instansi: '',
                status: true,
            };
            messages.value = [];
        }
        visible_dialog.value = true
    }

    const post_data = async () => {
        try {
            if (form.value.user_id != '' && form.value.rfid_code != '' && form.value.nama != '' && form.value.instansi != '') {
                if (status_form.value == 'add') {
                    let response;
                    if (kategori_user.value == 'karyawan') {
                        response = await AksesService.createKaryawan(form.value)
                    } else if (kategori_user.value == 'internship') {
                        response = await AksesService.createInternship(form.value)
                    } else {
                        response = await AksesService.createOutsource(form.value)
                    }

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
                    if (kategori_user.value == 'karyawan') {
                        response = await AksesService.updateKaryawan(form.value)
                    } else if (kategori_user.value == 'internship') {
                        response = await AksesService.updateInternship(form.value)
                    } else {
                        response = await AksesService.updateOutsource(form.value)
                    }
                    
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
        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :style="{ width: '900px' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex w-full gap-2 my-3">
                <div class="w-full flex flex-column gap-2">
                    <div class="p-inputgroup">
                        <InputText v-model="form.rfid_code" id="input" class="w-full" :disabled="disabled_form == false ? true : false" placeholder="Silahkan cek kartu" autofocus @input="cek_status_penggunaa_kartu"/>
                        <Button icon="pi pi-refresh" id="input" severity="secondary" @click="() => {disabled_form = true; form.rfid_code = ''}"/>
                        <!-- <InputText v-model="start" placeholder="Jenis User"/> -->
                    </div>
                    <div class="flex gap-2 align-items-center w-full">
                        <i class="pi pi-credit-card text-8xl"></i>
                        <strong v-show="loading_cek_kartu != null">{{ loading_cek_kartu }}</strong>
                        <div class="flex flex-column gap-2 w-full" v-if="data_kartu != null && loading_cek_kartu == null">
                            <span class="flex justify-content-between">Status <strong :class="`${data_kartu.status == true ? 'text-green-500' : 'text-red-500'}`">{{data_kartu.status == true ? 'Aktif' : 'Tidak Aktif'}}</strong></span>
                            <span class="flex justify-content-between">Kepemilikan <strong class="uppercase font-medium text-right">{{data_kartu.nama}}</strong></span>
                            <span class="flex justify-content-between">Kategori <strong class="uppercase text-right">{{kategori_user}}</strong></span>
                        </div>
                    </div>
                </div>
                <Divider layout="vertical" />
                <div class="flex flex-column gap-2 w-full">
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="username" class="font-semibold w-6rem">Nama</label>
                        <InputText id="username" v-model="form.nama" :disabled="disabled_form" class="w-full sm:w-20rem"/>
                    </div>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="username" class="font-semibold w-6rem">User ID</label>
                        <InputText id="username" v-model="form.user_id" :disabled="disabled_form == true ? true : kategori_user == 'karyawan' ? false : true" class="w-full sm:w-20rem"/>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-5 gap-3">
                        <label for="username" class="font-semibold w-6rem">Instansi</label>
                        <InputText id="username" v-model="form.instansi" :disabled="disabled_form == true ? true : kategori_user != 'karyawan' ? false : true" class="w-full sm:w-20rem"/>
                    </div>
                </div>
            </div>
            <div class="flex justify-content-between gap-2">
                <Button type="button" label="Reset" severity="warning" @click="reset_form"></Button>
                <div class="flex gap-2">
                    <Button type="button" label="Cancel"  outlined severity="secondary" @click="visible_dialog = false"></Button>
                    <Button type="button" label="Save" severity="success" :disabled="disabled_form" @click="post_data"></Button>
                </div>
            </div>
        </Dialog>

        <!-- Components -->
        <div class="flex justify-content-between align-items-center">
            <strong class="text-3xl font-medium uppercase">Akses Kartu</strong>
            <small class="flex align-items-center">Administrator <strong class="mx-2">/</strong> <i class="mx-2 text-sm pi pi-th-large"></i>Akses Kartu</small>
        </div>

        <div class="flex justify-content-center align-items-center gap-3">
            <div class="w-full flex flex-column bg-white p-3 border-round shadow-2 gap-3">
                <div class="flex justify-content-between align-items-center">
                    <strong class="uppercase text-md font-medium"><i class="pi pi-chart-line mr-3"></i>Graph</strong>
                    <Button icon="pi pi-plus" label="Form Access" size="small" @click="show_dialog('add', null)"/>
                </div>
                <div class="flex justify-content-between align-items-center gap-3">
                    <div class="">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-cog"></i>
                            </span>
                            <Dropdown v-model="jenis_user" :options="list_jenis_user" optionLabel="name" optionValue="code" placeholder="Jenis User" class="w-full md:w-20rem" @change="load_user"/>
                            <!-- <InputText v-model="start" placeholder="Jenis User"/> -->
                        </div>
                    </div>
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
                    <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10" :globalFilterFields="['nama', 'id_user', 'rfid_code', 'instansi']" tableStyle="min-width: 50rem">
                        <Column header="Nama" sortable sortField="nama">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-id-card text-7xl"></i>
                                    <div class="flex flex-column gap-1">
                                        <small>{{ data.user_id }}</small>
                                        <span class="uppercase">{{ data.nama }}</span>
                                    </div>
                                </div>
                            </template>
                        </Column>
                        <Column header="Kode RFID" sortable sortField="rfid_code">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <strong>{{ data.rfid_code }}</strong>
                                </div>
                            </template>
                        </Column>
                        <Column header="Instansi" sortable sortField="instansi">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <span>{{ data.instansi }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Status">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <i :title="data.status" class="pi pi-check text-green-500  font-semibold text-2xl" v-if="data.status == true"></i>
                                    <i :title="data.status" class="pi pi-times text-red-500  font-semibold text-2xl" v-else></i>
                                </div>
                            </template>
                        </Column>
                        <Column header="">
                            <template #body="{ data }">
                                <div class="flex justify-content-center align-items-center gap-2">
                                    <Button icon="pi pi-pencil" severity="warning" size="small" text rounded @click="show_dialog('edit', data)"/>
                                    <!-- <Button icon="pi pi-trash" severity="danger" size="small" text rounded @click="post_data(data)"/> -->
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