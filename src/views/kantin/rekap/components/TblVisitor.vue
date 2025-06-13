<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import moment from 'moment';
    import { useToast } from 'primevue/usetoast';
    import * as XLSX from 'xlsx';

    const toast = useToast();

    // Controller
    import AbsenService from '@/api/AbsenService';
    import {getVisitorByPeriod, postVisitor, putVisitor, deleteVisitor} from '@/controllers/visitorController'
    import {getAllUserKantin} from '@/controllers/userKantinController'

    // Variable
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const list_user_akses = ref([])
    const jenis_user = ref(null);
    const visible_dialog = ref(false)
    const header_dialog = ref('')
    const listUser = ref([])
    const statusForm = ref('')
    const date = ref({start:moment(new Date()).format('YYYY-MM-01'), end:moment(new Date()).format('YYYY-MM-DD')})
    const roles = ref(localStorage.getItem('roles'));

    const form = ref({
        id: null,
        nama: null,
        institusi: null,
        tanggal_kunjungan: moment(new Date()).toDate(),
        keperluan: null,
        total: null,
    })

    // Function
    onMounted(() => {
        loadData()
        loadUser()
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
            const response = await getVisitorByPeriod(date.value.start, date.value.end)
            if (response != null) {
                const list = response.map((item, index) => {
                    return {
                        no: index + 1,
                        id: item.id,
                        nama: item.nama,
                        tanggal: item.tanggal_kunjungan,
                        keperluan: item.keperluan,
                        institusi: item.institusi,
                        total: item.total,
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

    const exportToExcel = () => {
        const dataToExport = list_user_akses.value.map(item => ({
            No: item.no,
            'Nama PIC': item.nama,
            Tanggal: item.tanggal,
            Lembaga: item.institusi,
            'Total Pengunjung (Org)': item.total,
            Keperluan: item.keperluan,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kehadiran Visitor");

        XLSX.writeFile(workbook, `data-kehadiran-visitor-${moment().format('YYYYMMDDHHmmss')}.xlsx`);
    }

    const show_dialog = async(status,data) => {
        visible_dialog.value = true
        header_dialog.value = 'Form Visitor'
        visible_dialog.value = true
        statusForm.value = status
        console.log(data)
        if (data != null) {
            form.value = {
                id: data.id,
                nama: data.nama,
                institusi: data.institusi,
                tanggal_kunjungan: moment(data.tanggal_kunjungan).toDate(),
                keperluan: data.keperluan,
                total: data.total,
            }
        } else {
            formReset()
        }
    }

    const formReset = () => {
        form.value = {
            id: null,
            nama: null,
            institusi: null,
            tanggal_kunjungan: moment(new Date()).toDate(),
            keperluan: null,
            total: null,
        }
    }

    const postData = async() => {
        try {
            if (form.value.institusi == null && form.value.nama == null && form.value.keperluan == null && form.value.total == null && form.value.tanggal_kunjungan == null) {
                toast.add({ severity: 'warn', summary: 'Perhatian', detail: `Data harap dilengkapi`, life: 3000 });
            } else {
                if (statusForm.value == 'add') {
                    const response = await postVisitor(form.value)
                    if (response.status === true) {
                        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data berhasil ditambahkan`, life: 3000 });
                        setTimeout(function () {
                            loadData()
                            visible_dialog.value = false
                        }, 1000);
                    } else {
                        toast.add({ severity: 'warn', summary: 'Perhatian', detail: `Silahkan dicoba beberapa saat lagi.`, life: 3000 });
                    }
                } else if (statusForm.value == 'delete') {
                    const response = await deleteVisitor(form.value.id)
                    if (response.status === true) {
                        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data berhasil dihapus`, life: 3000 });
                        setTimeout(function () {
                            loadData()
                            visible_dialog.value = false
                        }, 1000);
                    } else {
                        toast.add({ severity: 'warn', summary: 'Perhatian', detail: `Silahkan dicoba beberapa saat lagi.`, life: 3000 });
                    }
                } else {
                    const response = await putVisitor(form.value.id, form.value)
                    if (response.status === true) {
                        toast.add({ severity: 'success', summary: 'Successfully', detail: `Data berhasil disimpan`, life: 3000 });
                        setTimeout(function () {
                            loadData()
                            visible_dialog.value = false
                        }, 1000);
                    } else {
                        toast.add({ severity: 'warn', summary: 'Perhatian', detail: response.message, life: 3000 });
                    }
                }
            }
        } catch (error) {
            toast.add({ severity: 'danger', summary: 'Error', detail: 'Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.', life: 3000 });
        }
    }
</script>

<template>
    <div>
        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :closable="false" :style="{ width: '600px' }">
            <div class="flex flex-column gap-3 w-full">
                <div class="flex flex-column gap-3 w-full" v-if="statusForm != 'delete'">
                    <div class="flex flex-column  gap-1 w-full">
                        <label for="nama" class="font-semibold w-full">PIC</label>
                        <Dropdown v-model="form.nama" :options="listUser" filter optionValue="nama" optionLabel="nama" placeholder="Select a name" class="w-full"></Dropdown>
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="lembaga" class="font-semibold w-full">Lembaga</label>
                        <InputText id="lembaga" v-model="form.institusi" class="w-full" autocomplete="off" />
                    </div>
                    <div class="flex flex-row gap-3">
                        <div class="flex flex-column  gap-1 w-full">
                            <label for="tanggal" class="font-semibold w-full">Tanggal</label>
                            <Calendar id="tanggal" v-model="form.tanggal_kunjungan" dateFormat="yy-mm-dd"/>
                        </div>
                        <div class="flex flex-column gap-1 w-full">
                            <label for="total" class="font-semibold w-full">Total</label>
                            <InputNumber id="total" v-model="form.total" class="w-full" inputId="locale-german" locale="de-DE" :minFractionDigits="0" />
                        </div>
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="keperluan" class="font-semibold w-full">Keperluan</label>
                        <Textarea id="keperluan" v-model="form.keperluan" rows="5" cols="30" />
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
        <Divider align="center"><strong class="uppercase">table kehadiran visitor</strong></Divider>
        <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10"
            :globalFilterFields="['id','nama', 'institusi', 'keperluan', 'total']" tableStyle="min-width: 50rem">
            <Column header="PIC" sortable sortField="nama">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <i class="pi pi-users text-7xl"></i>
                        <div class="flex flex-column gap-1">
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
            <Column header="Lembaga" sortable sortField="institusi">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <strong class="uppercase">{{ data.institusi }}</strong>
                    </div>
                </template>
            </Column>
            <Column header="Jumlah Pengunjung" sortable sortField="total">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <strong class="uppercase">{{ data.total }}</strong>
                    </div>
                </template>
            </Column>
            <Column header="Keterangan" sortable sortField="keperluan">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span class="uppercase">{{ data.keperluan }}</span>
                    </div>
                </template>
            </Column>
            <Column header="" v-if="roles != 'user'">
                <template #body="{ data }">
                    <div class="flex items-content-center gap-3"></div>
                    <Button @click="show_dialog('update',data)" severity="warning" text icon="pi pi-pencil" />
                    <Button @click="show_dialog('delete',data)" severity="danger" text icon="pi pi-trash" />
                </template>
            </Column>
            <template #empty> No customers found. </template>
        </DataTable>
    </div>
</template>