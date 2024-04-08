<script setup>
    // Vue Component
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';

    // API
    import AksesService from '@/api/AksesService';
    import {formKartu} from '@/api/DataVariable';
    import moment from 'moment';

    // Components
    import TblBanding from '@/views/kantin/rekap/components/TblBanding.vue';
    import TblUser from '@/views/kantin/rekap/components/TblUser.vue';
    import TblVisitor from '@/views/kantin/rekap/components/TblVisitor.vue';

    // Variable
    const jenis_user = ref('banding');
    const active = ref(1);
    const visible_dialog = ref(false);
    const header_dialog = ref('');
    const list_user_akses = ref([])
    const date = ref({start:moment(new Date()).format('YYYY-MM-01'), end:moment(new Date()).format('YYYY-MM-DD')})
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    
    // Notifikasi
    let count = ref(0);
    const messages = ref([]);

    // Forms
    const form = ref(formKartu)
    const status_form = ref('add')
    const list_jenis_user = ref([
        { name: 'Data Banding', code: 'banding' },
        { name: 'Kehadiran User', code: 'user' },
        { name: 'Kehadiran Visitor', code: 'visitor' },
    ]);
    const list_kategori = ref([
        { name: 'Karyawan', code: 'karyawan' },
        { name: 'Outsourcing', code: 'outsource' },
        { name: 'Internship', code: 'internship' },
    ]);

    const toast = useToast();

    // Function
    onMounted(() => {
        // load_user()
        // load_data()
    })

    const load_user = async() => {
        try {
            const response = await AksesService.getAllRfidCard()
            const load = response.data.data
            const list = []
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    id: load[i].id,
                    rfid_code: load[i].rfid_code,
                    kategori: load[i].kategori,
                    status: load[i].status,
                }
            }
            if (jenis_user.value == null) {
                list_user_akses.value = list
            } else {
                list_user_akses.value = list.filter(item => item.status == jenis_user.value)
            }
        } catch (error) {
            list_user_akses.value = []
        }
    }

    const reset_form = () => {
        form.value = {
            rfid_code: '',
            kategori: null,
            status: true,
        };
        messages.value = [];
    }

    const show_dialog = (status,data) => {
        status_form.value= status
        if (status == 'add') {
            header_dialog.value = 'Add RFID Card';
            reset_form()
        } else {
            header_dialog.value = 'Edit RFID Card';
            form.value = {
                id: data.id,
                rfid_code: data.rfid_code,
                kategori: data.kategori,
                status: data.status,
            };
            messages.value = [];
        }
        visible_dialog.value = true
    }

    const post_data_input = async() => {
        if (status_form.value == 'add') {
            if (form.value.rfid_code != '' && form.value.kategori != null && form.value.kategori != null) {
                const response = await AksesService.createRfidCard(form.value)
                const load = response.data;
                if (load.code == 200) {
                    messages.value = [
                        { severity: 'success', content: `Akses Kartu berhasil didaftarkan`, id: count.value++ }
                    ];
                    setTimeout(function() {
                        visible_dialog.value = false
                        load_user()
                    }, 3000);
                } else if (load.code == 201) {
                    messages.value = [
                        { severity: 'warn', content: 'Akses Kartu sudah terdaftar', id: count.value++ }
                    ];
                } else {
                    messages.value = [
                        { severity: 'error', content: `${load.msg}`, id: count.value++ }
                    ];
                    setTimeout(function() {
                        visible_dialog.value = false
                    }, 3000);
                }
            } else {
                messages.value = [
                    { severity: 'warn', content: 'Silahkan lengkapi data anda.', id: count.value++ }
                ];
            }
        } else if (status_form.value == 'edit') {
            if (form.value.rfid_code != '' && form.value.kategori != null && form.value.kategori != null) {
                const response = await AksesService.updateRfidCard(form.value)
                const load = response.data;
                if (load.code == 200) {
                    messages.value = [
                        { severity: 'success', content: `Akses Kartu berhasil diupdate`, id: count.value++ }
                    ];
                    setTimeout(function() {
                        visible_dialog.value = false
                        load_user()
                    }, 3000);
                } else {
                    messages.value = [
                        { severity: 'error', content: `${load.msg}`, id: count.value++ }
                    ];
                    setTimeout(function() {
                        visible_dialog.value = false
                    }, 3000);
                }
            } else {
                toast.add({ severity: 'warn', summary: 'Warning', detail: `Silahkan lengkapi data anda.`, life: 3000 });
            }
        } else {
            
        }
    }

</script>

<template>
    <div class="flex flex-column gap-5">
        <Toast/>
        <div class="flex justify-content-between align-items-center">
            <strong class="text-3xl font-medium uppercase">Rekap Kehadiran User</strong>
            <small class="flex align-items-center">Administrator <strong class="mx-2">/</strong> <i class="mx-2 text-sm pi pi-th-large"></i>Akses Kartu</small>
        </div>

        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :style="{ width: '500px' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex justify-content-between align-items-center gap-3 my-3">
                <label for="username" class="font-semibold w-6rem">RFID</label>
                <InputText id="username" v-model="form.rfid_code" class="w-full sm:w-20rem" autocomplete="off" />
            </div>
            <div class="flex justify-content-between align-items-center gap-3 mb-3">
                <label for="kategori" class="font-semibold w-6rem">Kategori</label>
                <Dropdown id="kategori" v-model="form.kategori" :options="list_kategori" optionLabel="name" optionValue="code" placeholder="Kategori" class="w-full md:w-20rem"/>
            </div>
            <div class="flex justify-content-between align-items-center gap-3 mb-5">
                <label for="status" class="font-semibold w-6rem">Status</label>
                <ToggleButton id="status" v-model="form.status" onIcon="pi pi-check" offIcon="pi pi-times text-white" onLabel="Active" offLabel="Non Active" invalid class="w-full sm:w-20rem text-white" :class="`${form.status == true ? 'bg-cyan-500' : 'bg-red-500'}`" aria-label="Confirmation" />
            </div>
            <div class="flex justify-content-between gap-2">
                <Button type="button" label="Reset" severity="warning" @click="reset_form"></Button>
                <div class="flex gap-2">
                    <Button type="button" label="Cancel"  outlined severity="secondary" @click="visible_dialog = false"></Button>
                    <Button type="button" label="Save" severity="success" @click="post_data_input"></Button>
                </div>
            </div>
        </Dialog>

        <div class="flex justify-content-center align-items-center gap-3">
            <div class="w-full flex flex-column bg-white p-3 border-round shadow-2 gap-3">
                <div class="flex flex-column md:flex-row justify-content-between align-items-center">
                    <strong class="uppercase text-md font-medium"><i class="pi pi-list mr-3"></i>List Rekap</strong>
                    <div class="flex justify-content-between gap-2">
                        <button @click="active = 0" :class="`${active !== 0 ? 'bg-teal-500 text-white hover:bg-teal-700' : 'bg-white text-teal-500 hover:bg-teal-500 hover:text-white'} transition-all transition-ease-in-out transition-duration-400 shadow-2 border-round-sm px-3 py-2 border-none flex gap-2 align-items-center uppercase font-medium`"><strong :class="`px-1 bg-white text-teal-500 border-circle`">1</strong>Data Banding</button>
                        <button @click="active = 1" :class="`${active !== 1 ? 'bg-teal-500 text-white hover:bg-teal-700' : 'bg-white text-teal-500 hover:bg-teal-500 hover:text-white'} transition-all transition-ease-in-out transition-duration-400 shadow-2 border-round-sm px-3 py-2 border-none flex gap-2 align-items-center uppercase font-medium`"><strong class="px-1 bg-white text-teal-500 border-circle">2</strong>kehadiran user</button>
                        <button @click="active = 2" :class="`${active !== 2 ? 'bg-teal-500 text-white hover:bg-teal-700' : 'bg-white text-teal-500 hover:bg-teal-500 hover:text-white'} transition-all transition-ease-in-out transition-duration-400 shadow-2 border-round-sm px-3 py-2 border-none flex gap-2 align-items-center uppercase font-medium`"><strong class="px-1 bg-white text-teal-500 border-circle">3</strong>kehadiran visitor</button>
                    </div>
                </div>
                <div class="w-full flex flex-column">
                    <div v-show="active == 0">
                        <tbl-banding/>
                    </div>
                    <div v-show="active == 1">
                        <tbl-user/>
                    </div>
                    <div v-show="active == 2">
                        <tbl-visitor/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>