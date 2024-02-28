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
    }
</script>

<template>
    <div>
        <div class="flex align-items-center justify-content-between mb-5 gap-3">
            <div class="p-inputgroup w-full">
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
            <template #empty> No customers found. </template>
        </DataTable>
    </div>
</template>