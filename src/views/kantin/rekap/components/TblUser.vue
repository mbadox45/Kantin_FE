<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import moment from 'moment';
    import * as XLSX from 'xlsx';

    // API
    import AbsenService from '@/api/AbsenService';
    import {getDataByPeriod} from '@/controllers/rekapController'

    // Variable
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const list_user_akses = ref([])
    const visible_dialog = ref(false)
    const header_dialog = ref('')
    const statusForm = ref('')
    const date = ref({start:moment(new Date()).format('YYYY-MM-01'), end:moment(new Date()).format('YYYY-MM-DD')})

    // Function
    onMounted(() => {
        loadData()
    })

    const loadUser = async() => {
        try {
            const response = await getAllUserKantin()
            if (response != null) {
                listUser.value = response
            } else {
                listUser.value = []
            }
        } catch (error) {
            listUser.value = []
        }
    }

    const loadData = async() => {
        try {
            const response = await getDataByPeriod(date.value.start, date.value.end)
            if (response != null) {
                const list = response.map((item, index) => {
                    return {
                        no: index + 1,
                        id: item.id,
                        nama: item.nama,
                        tanggal: item.tanggal,
                        nrk: item.nrk,
                        rfid: item.nomor_kartu,
                        sesi: item.sesi,
                        waktu: item.waktu_tapping,
                    }
                })
                list_user_akses.value = list
            } else {
                list_user_akses.value = []
            }
        } catch (error) {
            list_user_akses.value = []
        }
    }

    const show_dialog = (status,data) => {
        visible_dialog.value = true
        header_dialog.value = 'Form Pengunjung'
        visible_dialog.value = true
        statusForm.value = status
    }

    const exportToExcel = () => {
        const dataToExport = list_user_akses.value.map(item => ({
            No: item.no,
            Nama: item.nama,
            RFID: item.rfid,
            NRK: item.nrk,
            Tanggal: item.tanggal,
            Waktu: item.waktu,
            Sesi: item.sesi,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kehadiran Karyawan");

        XLSX.writeFile(workbook, `data-kehadiran-karyawan-${moment().format('YYYYMMDDHHmmss')}.xlsx`);
    }

    const post_data = async () => {
        try {
            
        } catch (error) {
            
        }
    }
</script>

<template>
    <div>
        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :style="{ width: '500px' }">
            <div class="flex flex-column gap-3 w-full">
                <div class="flex flex-column gap-3 w-full" v-if="statusForm != 'delete'">
                    <div class="flex flex-column  gap-1 w-full">
                        <label for="nama" class="font-semibold w-full">Check Kartu</label>
                        <!-- <Dropdown v-model="form.nama" :options="listUser" filter optionValue="nama" optionLabel="nama" placeholder="Select a name" class="w-full"></Dropdown> -->
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="lembaga" class="font-semibold w-full">Lembaga</label>
                        <!-- <InputText id="lembaga" v-model="form.institusi" class="w-full" autocomplete="off" /> -->
                    </div>
                    <div class="flex flex-row gap-3">
                        <div class="flex flex-column  gap-1 w-full">
                            <label for="tanggal" class="font-semibold w-full">Tanggal</label>
                            <!-- <Calendar id="tanggal" v-model="form.tanggal_kunjungan" dateFormat="yy-mm-dd"/> -->
                        </div>
                        <div class="flex flex-column gap-1 w-full">
                            <label for="total" class="font-semibold w-full">Total</label>
                            <!-- <InputNumber id="total" v-model="form.total" class="w-full" inputId="locale-german" locale="de-DE" :minFractionDigits="0" /> -->
                        </div>
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="keperluan" class="font-semibold w-full">Keperluan</label>
                        <!-- <Textarea id="keperluan" v-model="form.keperluan" rows="5" cols="30" /> -->
                    </div>
                </div>
                <div class="w-full justify-content-center" v-else>
                    <span>Apakah anda ingin hapus data visitor?</span>
                </div>
                <div class="flex justify-content-end gap-2">
                    <div class="flex gap-2">
                        <Button type="button" size="xsmall" label="Cancel"  outlined severity="secondary" @click="visible_dialog = false"></Button>
                        <Button type="button" size="xsmall" label="Save" severity="success" @click="postData"></Button>
                    </div>
                </div>
            </div>
        </Dialog>
        <div class="flex align-items-center justify-content-between mb-5 gap-3">
            <div class="p-inputgroup w-full">
                <Button type="button" label="Tambah Kehadiran" icon="pi pi-plus" size="small" severity="info" @click="show_dialog('add', null)"></Button>
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText id="search" v-model="filters['global'].value" placeholder="Search" class="w-full sm:w-auto" autocomplete="off"/>
            </div>
            <div class="flex gap-2">
            </div>
            <div class="w-full flex gap-2">
                <div class="p-inputgroup">
                    <InputText id="start" type="date" v-model="date.start" class="w-full sm:w-auto" autocomplete="off" @input="loadData"/>
                    <InputText id="end" type="date" v-model="date.end" class="w-full sm:w-auto" autocomplete="off" @input="loadData"/>
                    <Button type="button" icon="pi pi-download" size="small" severity="success" @click="exportToExcel"></Button>
                </div>
            </div>
        </div>
        <Divider align="center"><strong class="uppercase">table kehadiran user</strong></Divider>
        <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10"
            :globalFilterFields="['nama', 'rfid', 'nrk', 'waktu', 'sesi']" tableStyle="min-width: 50rem">
            <Column header="Nama" sortable sortField="nama">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-credit-card text-7xl"></i>
                        <div class="flex flex-column gap-1">
                            <small class="uppercase">{{ data.rfid }}</small>
                            <strong class="uppercase">{{ data.nama }}</strong>
                        </div>
                    </div>
                </template>
            </Column>
            <Column header="Tanggal" sortable sortField="tanggal">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span class="uppercase">{{ data.tanggal }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Jam" sortable sortField="jam">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span class="uppercase">{{ data.waktu }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Sesi" sortable sortField="sesi">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <strong class="uppercase">{{ data.sesi }}</strong>
                    </div>
                </template>
            </Column>
            <Column header="#" >
                <template #body="{ data }">
                    <Button @click="show_dialog('delete',data)" severity="danger" text icon="pi pi-trash" />
                </template>
            </Column>
            <template #empty> No customers found. </template>
        </DataTable>
    </div>
</template>