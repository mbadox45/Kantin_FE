<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import moment from 'moment';

    // API
    import AbsenService from '@/api/AbsenService';

    // Variable
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const list_user_akses = ref([])
    const jenis_user = ref(null);
    const date = ref({start:moment(new Date()).format('YYYY-MM-01'), end:moment(new Date()).format('YYYY-MM-DD')})

    // Function
    onMounted(() => {
        load_user()
    })

    const load_user = async() => {
        try {
            const response = await AbsenService.getPengunjungKantin(date.value.start, date.value.end)
            const load = response.data.data
            const list = []
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    no: i+1,
                    id: load[i].id,
                    kategori: load[i].kategori,
                    nrk: load[i].nrk,
                    rfid: load[i].rfid,
                    tanggal: moment(load[i].tanggal).format('DD MMM YYYY'),
                    waktu: load[i].waktu,
                    createdAt: load[i].createdAt,
                    updatedAt: load[i].updatedAt,
                    nama: load[i].nama,
                    sesi: load[i].sesi,
                    instansi: load[i].instansi,
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

    const show_dialog = (status,data) => {
        console.log(status, data);
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
        <div class="flex align-items-center justify-content-between mb-5 gap-3">
            <div class="p-inputgroup w-full">
                <Button type="button" label="Tambah Kehadiran" icon="pi pi-plus" size="small" severity="info"></Button>
                <span class="p-inputgroup-addon bg-white">
                    <i class="pi pi-search"></i>
                </span>
                <InputText id="search" v-model="filters['global'].value" placeholder="Search" class="w-full sm:w-auto" autocomplete="off"/>
            </div>
            <div class="flex gap-2">
            </div>
            <div class="w-full flex gap-2">
                <div class="p-inputgroup">
                    <InputText id="start" type="date" v-model="date.start" class="w-full sm:w-auto" autocomplete="off" @input="load_user"/>
                    <InputText id="end" type="date" v-model="date.end" class="w-full sm:w-auto" autocomplete="off" @input="load_user"/>
                    <Button type="button" icon="pi pi-download" size="small" severity="success"></Button>
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