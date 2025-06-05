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
    import {getAllUserKantin, cekKartu, postUserKantin, putUserKantin, deleteUserKantin} from '@/controllers/userKantinController';
    import {getAllBagian} from '@/controllers/masterBagianController';
    // import { ProductService } from '@/service/ProductService';

    // Variable
    const jenis_user = ref('karyawan');
    const list_user_akses = ref([])
    const listBagian = ref([])
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
    const formKartu = ref({
        rfid_code:null
    })
    const dataChecking = ref({
        id: null,
        nomor_kartu: null,
        status_kartu: null,
        nama: null,
    })


    const filters = ref(
        {
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        }
    );

    // Function
    onMounted(() => {
        loadData()
    })

    const loadData = async() => {
        try {
            const response = await getAllUserKantin()
            if (response != null) {
                list_user_akses.value = response
            } else {
                list_user_akses.value = []
            }
        } catch (error) {
            list_user_akses.value = []
        }
    }

    const loadBagian = async() => {
        try {
            const response = await getAllBagian()
            if (response != null) {
                listBagian.value = response
            } else {
                listBagian.value = []
            }
        } catch (error) {
            listBagian.value = []
        }
    }

    const loadCheckKartu = async() => {
        loading_cek_kartu.value = 'Loading...'
        try {
            const input = formKartu.value.rfid_code.toString() 
            const response = await cekKartu({nomor_kartu:input})
            if (response.status == true) {
                const data = response.data;
                dataChecking.value.id = data.id
                dataChecking.value.nomor_kartu = data.nomor_kartu
                dataChecking.value.status_kartu = data.status_kartu
                form.value.kartu_id = data.id
                if (data.digunakan_oleh_user == true) {
                    dataChecking.value.nama = data.user_kantin.nama
                    if (status_form.value == 'edit') {
                        disabled_form.value = false
                    } else {
                        disabled_form.value = true
                    }
                } else {
                    dataChecking.value.nama = "Belum digunakan"
                    disabled_form.value = false
                }
            } else {
                dataChecking.value.status_kartu = false
                dataChecking.value.nama = "Kartu tidak terdaftar"
                disabled_form.value = true
            }
            loading_cek_kartu.value = null
        } catch (error) {
            loading_cek_kartu.value = null
            dataChecking.value.status_kartu = false
            dataChecking.value.nama = "Kartu tidak terdaftar"
            disabled_form.value = true
        }
    }

    const reset_form = () => {
        data_kartu.value = null
        form.value = {
            id: null,
            nrk: null,
            nama: null,
            jabatan: null,
            bagian: null,
            kartu_id: null,
        };
        messages.value = [];
        disabled_form.value = true
        dataChecking.value = {
            id: null,
            nomor_kartu: null,
            status_kartu: null,
            nama: null,
        }
    }

    const show_dialog = (status,data) => {
        status_form.value= status
        loadBagian()
        if (status == 'add') {
            formKartu.value.rfid_code = null
            header_dialog.value = 'Form Akses User';
            reset_form()
            messages.value = [];
        } else if (status == 'delete') {
            header_dialog.value = 'Delete Akses User';
            form.value = {
                id: data.id,
                nama: data.nama,
                nrk: data.nrk,
                jabatan: data.jabatan,
                bagian: data.bagian,
                kartu_id: data.kartu_id,
            };
            messages.value = [];
        } else {
            // Bagian pengecekan Kartu
            disabled_form.value = false
            formKartu.value.rfid_code = data.kartu.nomor_kartu
            dataChecking.value.nomor_kartu = data.kartu.nomor_kartu
            dataChecking.value.status_kartu = data.kartu.status
            dataChecking.value.nama = data.nama
            // Bagian form user
            header_dialog.value = 'Edit RFID Card';
            form.value = {
                id: data.id,
                nama: data.nama,
                nrk: data.nrk,
                jabatan: data.jabatan,
                bagian: data.bagian,
                kartu_id: data.kartu_id,
            };
            messages.value = [];
        }
        visible_dialog.value = true
    }

    const post_data = async () => {
        try {
            if (form.value.nama != null && form.value.nrk != null && form.value.jabatan != null && form.value.kartu_id != null && form.value.bagian != null) {
                if (status_form.value == 'add') {
                    const response = await postUserKantin(form.value)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: 'Data berhasil ditambahkan.', id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            loadData()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'warn', content: response.message, id: count.value++ }
                        ];
                    }
                } else if (status_form.value == 'edit') {
                    const response = await putUserKantin(form.value.id, form.value)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: 'Data berhasil di update.', id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            loadData()
                        }, 2000);
                    } else {
                        messages.value = [
                            { severity: 'warn', content: response.message, id: count.value++ }
                        ];
                    }
                } else {
                    const response = await deleteUserKantin(form.value.id)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: 'Data berhasil dihapus.', id: count.value++ }
                        ];
                        setTimeout(function() {
                            visible_dialog.value = false
                            loadData()
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
        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :style="{ width: '900px' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex w-full gap-2 my-3" v-if="status_form != 'delete'">
                <div class="w-full flex flex-column gap-2">
                    <div class="p-inputgroup">
                        <InputText v-model="formKartu.rfid_code" id="input" class="w-full" placeholder="Silahkan cek kartu" autofocus/>
                        <Button icon="pi pi-refresh" id="input" severity="secondary" @click="reset_form"/>
                        <Button icon="pi pi-search" id="input" severity="info" v-tooltip.top="'Cek Status'" @click="loadCheckKartu"/>
                        <!-- <InputText v-model="start" placeholder="Jenis User"/> -->
                    </div>
                    <div class="flex gap-2 align-items-center w-full">
                        <i class="pi pi-credit-card text-8xl"></i>
                        <strong v-show="loading_cek_kartu != null">{{ loading_cek_kartu }}</strong>
                        <div class="flex flex-column gap-2 w-full" v-if="dataChecking.nama != null && loading_cek_kartu == null">
                            <span class="flex justify-content-between">Status Kartu<strong :class="`${dataChecking.status_kartu == true ? 'text-green-500' : 'text-red-500'}`">{{dataChecking.status_kartu == true ? 'Aktif' : 'Tidak Aktif'}}</strong></span>
                            <span class="flex justify-content-between">Kepemilikan <strong class="uppercase font-medium text-right">{{dataChecking.nama}}</strong></span>
                            <!-- <span class="flex justify-content-between">Kategori <strong class="uppercase text-right">{{kategori_user}}</strong></span> -->
                        </div>
                    </div>
                </div>
                <Divider layout="vertical" />
                <div class="flex flex-column gap-2 w-full">
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="username" class="font-semibold w-6rem">Nama</label>
                        <InputText id="username" v-model="form.nama" :disabled="disabled_form" class="w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="nrk" class="font-semibold w-6rem">NRK</label>
                        <InputText id="nrk" v-model="form.nrk" :disabled="disabled_form == true ? true : false" class="w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="jabatan" class="font-semibold w-6rem">Jabatan</label>
                        <InputText id="jabatan" v-model="form.jabatan" :disabled="disabled_form == true ? true : false" class="w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="bagian" class="font-semibold w-6rem">Bagian</label>
                        <Dropdown v-model="form.bagian" :options="listBagian" optionLabel="nama" optionValue="nama" filter :disabled="disabled_form == true ? true : false" placeholder="Select a Division" class="w-full" />
                    </div>
                </div>
            </div>
            <div class="flex w-full gap-2 my-3" v-else>
                <div class="w-full flex align-items-center gap-3">
                    <i class="pi pi-credit-card text-8xl"></i>
                    <span>Akses Kartu akan di <span class="text-red-500 font-medium">non-aktifkan</span>, apabila akses user di hapus.</span>
                </div>
                <Divider layout="vertical" />
                <div class="flex flex-column gap-2 w-full">
                    <h6 class="text-center">Apakah anda ingin menghapus Akses User ini ?</h6>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="username" class="font-semibold w-6rem">Nama</label>
                        <InputText id="username" v-model="form.nama" :disabled="true" class="w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="username" class="font-semibold w-6rem">NRK</label>
                        <InputText id="username" v-model="form.nrk" :disabled="true" class="w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="username" class="font-semibold w-6rem">Jabatan</label>
                        <InputText id="username" v-model="form.jabatan" :disabled="true" class="w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center gap-3">
                        <label for="username" class="font-semibold w-6rem">Bagian</label>
                        <InputText id="username" v-model="form.bagian" :disabled="true" class="w-full"/>
                    </div>
                </div>
            </div>
            <div :class="`flex justify-content-end gap-2`">
                <div class="flex gap-2">
                    <Button type="button" label="Cancel"  outlined severity="secondary" @click="visible_dialog = false"></Button>
                    <Button type="button" label="Save" severity="success" :disabled="disabled_form" @click="post_data" v-if="status_form != 'delete'"></Button>
                    <Button type="button" label="Delete" severity="danger" @click="post_data" v-else></Button>
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
                    <div class="w-full">
                    </div>
                    <div class="w-full">
                        <div class="p-inputgroup">
                            <InputText v-model="filters['global'].value" placeholder="Search" class="w-full"/>
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-column">
                    <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10" :globalFilterFields="['nama', 'nrk', 'kartu.nomor_kartu', 'bagian']" tableStyle="min-width: 50rem">
                        <Column header="Nama" sortable sortField="nama">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-id-card text-7xl"></i>
                                    <div class="flex flex-column gap-1">
                                        <small>{{ data.nrk }}</small>
                                        <span class="uppercase">{{ data.nama }}</span>
                                    </div>
                                </div>
                            </template>
                        </Column>
                        <Column header="Kode RFID" sortable sortField="kartu.nomor_kartu">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <strong>{{ data.kartu.nomor_kartu }}</strong>
                                </div>
                            </template>
                        </Column>
                        <Column header="Bagian" sortable sortField="bagian">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <span>{{ data.bagian }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Status">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <i :title="data.status" class="pi pi-check text-green-500  font-semibold text-2xl" v-if="data.kartu.status == true"></i>
                                    <i :title="data.status" class="pi pi-times text-red-500  font-semibold text-2xl" v-else></i>
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