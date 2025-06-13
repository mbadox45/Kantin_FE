<script setup>
    // Vue Component
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import moment from 'moment'
    import * as XLSX from 'xlsx';

    // API
    import {getAllUserKantin} from '@/controllers/userKantinController'
    import {getAllShift} from '@/controllers/masterShiftController'
    import {getByPeriodJadwalKerjaKaryawan, postJadwalKerjaKaryawan, putJadwalKerjaKaryawan, postBulkJadwalKerjaKaryawan} from '@/controllers/jadwalKerjaKaryawanController'

    // Variable
    const menu = ref();
    const visible_dialog = ref(false);
    const visible_dialog1 = ref(false);
    const statusDialog = ref('format');
    const header_dialog = ref('');
    const header_dialog2 = ref('');
    const list_user_akses = ref([])
    const listImport = ref([])
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const listUserKantin = ref([])
    const listShift = ref([])
    const loadingTable = ref(false)
    const minDate = ref(new Date());
    const fileInput = ref(null);
    
    // Notifikasi
    let count = ref(0);
    const messages = ref([]);

    const datePeriod = ref({
        start: moment(moment().format('YYYY-MM-01')).toDate(),
        end: moment().toDate(),
    })
    // Forms
    const form = ref({
        id:null,
        user_kantin_id:null,
        shift_id:null,
        tanggal_mulai:null,
        tanggal_selesai:null,
    })

    const formExport = ref([])

    const status_form = ref('add')
    const items = ref([
        { label: 'Add by Person', icon: 'pi pi-user', command: () => {show_dialog('add',null)} },
        { label: 'Add to Many', icon: 'pi pi-users', command: () => {triggerFileInput()} },
        { label: 'Download Format Import Data', icon: 'pi pi-download', command: () => {formatDataImport()}},
        { label: 'Export Data', icon: 'pi pi-file-excel', command: () => {exportToExcel()} },
    ]);

    const toast = useToast();

    // Function
    onMounted(() => {
        loadData()
        changeMinDate()
        loadUserKantin()
        loadShift()
    })

    const changeMinDate = () => {
        minDate.value.setDate(datePeriod.value.start.getDate());
        minDate.value.setMonth(datePeriod.value.start.getMonth());
        minDate.value.setFullYear(datePeriod.value.start.getFullYear());
    }

    const loadData = async() => {
        loadingTable.value = true
        try {
            const response = await getByPeriodJadwalKerjaKaryawan(moment(datePeriod.value.start).format('YYYY-MM-DD'), moment(datePeriod.value.end).format('YYYY-MM-DD'))
            if (response != null) {
                list_user_akses.value = response
            } else {
                list_user_akses.value = []
            }
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
            list_user_akses.value = []
        }
    }

    const loadUserKantin = async() => {
        try {
            const response = await getAllUserKantin()
            if (response != null) {
                listUserKantin.value = response
            } else {
                listUserKantin.value = []
            }
        } catch (error) {
            listUserKantin.value = []
        }
    }

    const loadShift = async() => {
        try {
            const response = await getAllShift()
            if (response != null) {
                listShift.value = response
            } else {
                listShift.value = []
            }
        } catch (error) {
            listShift.value = []
        }
    }

    const reset_form = () => {
        form.value = {
            id:null,
            user_kantin_id:null,
            shift_id:null,
            tanggal_mulai:null,
            tanggal_selesai:null,
        };
        messages.value = [];
    }

    const show_dialog = (status,data) => {
        status_form.value= status
        if (status == 'add') {
            header_dialog.value = 'Tambah Jadwal Shift Karyawan';
            reset_form()
        } else {
            header_dialog.value = 'Edit Jadwal Shift Karyawan';
            form.value = {
                id: data.id,
                user_kantin_id: data.user_kantin_id,
                shift_id: data.shift_id,
                tanggal_mulai: moment(data.tanggal_mulai).toDate(),
                tanggal_selesai: moment(data.tanggal_selesai).toDate(),
            };
            messages.value = [];
        }
        visible_dialog.value = true
    }

    const toggle = (event) => {
        menu.value.toggle(event);
    };

    const formatDataImport = () => {
        visible_dialog1.value = true
        header_dialog2.value = 'Ambil file format data'
        statusDialog.value = "format";
        messages.value = []
    };

    const triggerFileInput = () => {
        header_dialog2.value = 'Import Data Jadwal Shift Karyawan'
        messages.value = []
        statusDialog.value = "import";
        visible_dialog1.value = true
        listImport.value = []
        fileInput.value?.click();
    };

    const handleImportExcel = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Contoh struktur jsonData, silakan sesuaikan dengan Excel kamu
            const list = []
            console.log(jsonData)
            for (let i = 0; i < jsonData.length; i++) {
                const user = listUserKantin.value.find(item => item.nrk == jsonData[i].NRK)
                const shift = listShift.value.find(item => item.nama_shift.toLowerCase() == jsonData[i].Shift.toLowerCase())
                list.push({
                    user_kantin_id: user == null ? null : user.id, // pastikan field sesuai Excel
                    user_id: user == null ? null : user.id, // pastikan field sesuai Excel
                    nrk: user == null ? null : user.nrk, // pastikan field sesuai Excel
                    nama: user == null ? null : user.nama,
                    shift: shift == null ? null : shift.nama_shift,
                    shift_id: shift == null ? null : shift.id,
                    tanggal_mulai: jsonData[i].Tanggal_Mulai == null ? null : moment(jsonData[i].Tanggal_Mulai).format('YYYY-MM-DD'),
                    tanggal_selesai: jsonData[i].Tanggal_Selesai == null ? null : moment(jsonData[i].Tanggal_Selesai).format('YYYY-MM-DD'),
                })
            }
            listImport.value = list

            // Reset input file agar bisa import file yang sama dua kali
            event.target.value = '';
        };
        reader.readAsArrayBuffer(file);
    };

    const postImportExcel = async() => {
        try {
            const data = listImport.value;
            console.log(data)
            let status;
            for (let i = 0; i < data.length; i++) {
                if (data[i].user_kantin_id != null && data[i].nrk != null && data[i].nama != null && data[i].shift_id != null && data[i].tanggal_mulai != null && data[i].tanggal_selesai != null) {
                    status = true
                    continue;
                } else {
                    status = false
                    break;
                }
            }
            console.log(data)
            if (status == false) {
                messages.value = [
                    { severity: 'warn', content: 'Silahkan lengkapi data anda.', id: count.value++ }
                ];
            } else {
                const response = await postBulkJadwalKerjaKaryawan(data)
                if (response.status == true) {
                    messages.value = [
                        { severity: 'success', content: `${response.message}`, id: count.value++ }
                    ];
                    setTimeout(function() {
                        visible_dialog1.value = false
                        loadData()
                    }, 2000);
                } else {
                    messages.value = [
                        { severity: 'warn', content: `${response.message}`, id: count.value++ }
                    ];
                }
            }
        } catch (error) {
            messages.value = [
                { severity: 'error', content: `Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.`, id: count.value++ }
            ];
        }
    }

    const exportFormatData = () => {
        console.log('Data untuk export:', formExport.value);

        if (formExport.value.length > 0) {
            const dataToExport = formExport.value.map(item => ({
                NRK: item.nrk,
                Nama: item.nama,
                Shift: '',
                Tanggal_Mulai: '',
                Tanggal_Selesai: '',
                '* Catatan, untuk shift pilih salah satu (general, shift 1, shift 2, shift 3). Untuk tanggal buat format (mm-dd-yyyy)': '',
            }));

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Format Jadwal Shift");

            const filename = `format-data-jadwal-shift-karyawan-${moment().format('YYYYMMDDHHmmss')}.xlsx`;
            XLSX.writeFile(workbook, filename);

            console.log(`Export berhasil: ${filename}`);
            visible_dialog1.value = false
        } else {
            messages.value = [
                { severity: 'warn', content: 'Silahkan pilih nama karyawan', id: count.value++ }
            ];
        }
    };

    const exportToExcel = () => {
        const dataToExport = list_user_akses.value.map(item => ({
            NRK: item.user_kantin.nrk,
            Nama: item.user_kantin.nama,
            Bagian: item.user_kantin.bagian,
            Jabatan: item.user_kantin.jabatan,
            Shift: item.shift.nama_shift,
            'Periode Mulai': item.tanggal_mulai,
            'Periode Sampai': item.tanggal_selesai,
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data Jadwal Shift Karyawan");

        XLSX.writeFile(workbook, `data-jadwal-shift-karyawan-${moment().format('YYYYMMDDHHmmss')}.xlsx`);
    }

    const post_data_input = async() => {
        try {
            if (form.value.shift_id != null && form.value.user_kantin_id != null && form.value.tanggal_mulai != null && form.value.tanggal_selesai != null) {
                form.value.tanggal_mulai = moment(form.value.tanggal_mulai).format('YYYY-MM-DD')
                form.value.tanggal_selesai = moment(form.value.tanggal_selesai).format('YYYY-MM-DD')
                if (status_form.value == 'add') {
                    const response = await postJadwalKerjaKaryawan(form.value)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: response.message, id: count.value++ }
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
                    const response = await putJadwalKerjaKaryawan(form.value.id, form.value)
                    if (response.status == true) {
                        messages.value = [
                            { severity: 'success', content: `${response.message}`, id: count.value++ }
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
            <strong class="text-3xl font-medium uppercase">Jadwal Shift Karyawan</strong>
            <small class="flex align-items-center">Main Menu <strong class="mx-2">/</strong> <i class="mx-2 text-sm pi pi-th-large"></i>Jadwal Shift Karyawan</small>
        </div>

        <Dialog v-model:visible="visible_dialog1" modal :header="header_dialog2" :style="{ width: '600px' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex flex-column gap-5 mt-2" v-if="statusDialog == 'format'">
                <div class="flex align-items-start gap-4">
                    <div class="flex flex-column justify-content-between w-full gap-2">
                        <label for="username" class="font-semibold">Silahkan pilih file</label>
                        <MultiSelect v-model="formExport" :options="listUserKantin" filter optionLabel="nama" placeholder="Select Karyawan" class="w-full" />
                    </div>
                </div>
                <div class="flex justify-content-end gap-2">
                    <div class="flex gap-2">
                        <Button type="button" label="Cancel"  outlined severity="secondary" @click="visible_dialog1 = false"></Button>
                        <Button type="button" label="Export" severity="success" @click="exportFormatData"></Button>
                    </div>
                </div>
            </div>
            <div class="flex flex-column gap-3 mt-2" v-else>
                <div class="flex align-items-start gap-4">
                    <div class="flex flex-column justify-content-between w-full gap-2">
                        <label for="username" class="font-semibold">Silahkan pilih file</label>
                        <input type="file" ref="fileInput" accept=".xlsx, .xls" @change="handleImportExcel" />
                    </div>
                    <Button icon="pi pi-refresh" size="small" @click="()=>{listImport = []; messages = []}"/>
                </div>
                <div class="w-full">
                    <DataTable :value="listImport" paginator :rows="10">
                        <template #empty> Data tidak tersedia. </template>
                        <Column header="User ID" sortable sortField="user_kantin_id">
                            <template #body="{ data }">
                                <div class="flex flex-column gap-2">
                                    <span>{{ data.user_kantin_id }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Nama" sortable sortField="nama">
                            <template #body="{ data }">
                                <div class="flex flex-column gap-2">
                                    <small :class="data.nrk == null ? 'text-red-600' : ''">{{ data.nrk }}</small>
                                    <small :class="data.nama == null ? 'text-red-600' : ''" class="text-semibold">{{ data.nama }}</small>
                                </div>
                            </template>
                        </Column>
                        <Column header="Periode" sortField="tanggal_mulai">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2 text-sm">
                                    <span :class="data.tanggal_mulai == null ? 'text-red-600' : ''" >{{ moment(data.tanggal_mulai).format('DD MMM YY') }}</span>
                                    <span class="font-semibold">s/d</span>
                                    <span :class="data.tanggal_selesai == null ? 'text-red-600' : ''">{{ moment(data.tanggal_selesai).format('DD MMM YY') }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Shift">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <span :class="data.shift == null ? 'text-red-600' : ''">{{ data.shift }}</span>
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
                <div class="flex justify-content-end gap-2">
                    <div class="flex gap-2">
                        <Button type="button" label="Cancel"  outlined severity="secondary" @click="visible_dialog1 = false"></Button>
                        <Button type="button" label="Save" severity="success" @click="postImportExcel"></Button>
                    </div>
                </div>
            </div>
        </Dialog>

        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :style="{ width: '600px' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex flex-column gap-3">
                <div class="flex flex-column justify-content-between w-full gap-1">
                    <label for="username" class="font-semibold">Nama Karyawan</label>
                    <Dropdown id="username" v-model="form.user_kantin_id" :options="listUserKantin" optionLabel="nama" filter optionValue="id" placeholder="Pilih nama Karyawan" class="w-full"/>
                </div>
                <div class="flex flex-column justify-content-between w-full gap-1">
                    <label for="status" class="font-semibold w-6rem">Shift</label>
                    <Dropdown id="status" v-model="form.shift_id" :options="listShift" optionLabel="nama_shift" optionValue="id" placeholder="Pilih jadwal shift" class="w-full"/>
                </div>
                <div class="flex gap-3">
                    <div class="flex flex-column justify-content-between w-full gap-1">
                        <label for="tgl_mulai" class="font-semibold w-6rem">Mulai</label>
                        <Calendar id="tgl_mulai" v-model="form.tanggal_mulai" dateFormat="yy-mm-dd" />
                    </div>
                    <div class="flex flex-column justify-content-between w-full gap-1">
                        <label for="tgl_selesai" class="font-semibold w-6rem">Sampai</label>
                        <Calendar id="tgl_selesai" v-model="form.tanggal_selesai" dateFormat="yy-mm-dd" />
                    </div>
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
                    <strong class="uppercase text-md font-medium"><i class="pi pi-list mr-3"></i>List Jadwal Shift</strong>
                    <Button type="button" icon="pi pi-cog" rounded size="small" severity="info" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
                    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
                    <!-- <Button icon="pi pi-plus" label="Tambah Jadwal Shift" size="small" @click="show_dialog('add',null)"/> -->
                </div>
                <div class="flex flex-column md:flex-row justify-content-between align-items-center gap-3">
                    <div class="w-full md:w-auto">
                        <div class="p-inputgroup">
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-cog"></i>
                            </span>
                            <Calendar id="tgl_mulai" v-model="datePeriod.start" dateFormat="yy-mm-dd" @change="changeMinDate()" />
                            <Calendar id="tgl_mulai" v-model="datePeriod.end" :minDate="minDate" dateFormat="yy-mm-dd" />
                            <Button size="small" icon="pi pi-check" severity="success" @click="loadData"/>
                        </div>
                    </div>
                    <div class="w-full md:w-auto">
                        <div class="p-inputgroup">
                            <InputText v-model="filters['global'].value" placeholder="Search" class="w-full md:w-20rem"/>
                            <span class="p-inputgroup-addon">
                                <i class="pi pi-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="w-full flex flex-column">
                    <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10"
                        :globalFilterFields="['user_kantin.nama', 'shift.nama_shift','user_kantin.nrk']" tableStyle="min-width: 50rem" :loading="loadingTable">
                        <template #loading> Loading data. Please wait. </template>
                        <Column header="Nama" sortable sortField="user_kantin.nama">
                            <template #body="{ data }">
                                <div class="flex flex-column gap-2">
                                    <small>{{ data.user_kantin.nrk }}</small>
                                    <strong>{{ data.user_kantin.nama }}</strong>
                                </div>
                            </template>
                        </Column>
                        <Column header="Periode" sortField="keterangan">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2 text-sm">
                                    <span class="">{{ moment(data.tanggal_mulai).format('DD MMM YY') }}</span>
                                    <span class="font-semibold">s/d</span>
                                    <span class="">{{ moment(data.tanggal_selesai).format('DD MMM YY') }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column header="Shift">
                            <template #body="{ data }">
                                <div class="flex align-items-center gap-2">
                                    <span class="">{{ data.shift.nama_shift }}</span>
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