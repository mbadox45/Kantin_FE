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
            const response = await AbsenService.getBanding(date.value.start, date.value.end)
            const load = response.data.data
            const list = []
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    no: i+1,
                    id: load[i].id,
                    jumlah: load[i].jumlah,
                    tanggal: load[i].tanggal,
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
            <div class="w-full md:w-full flex gap-2">
                <Button type="button" icon="pi pi-plus" size="small" severity="info" rounded></Button>
                <Button type="button" icon="pi pi-download" size="small" severity="success" rounded></Button>
            </div>
            <div class="flex gap-2">
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <label for="start">Start</label>
                    </span>
                    <InputText id="start" type="date" v-model="date.start" class="w-full sm:w-auto" autocomplete="off" @input="load_user"/>
                </div>
                <div class="p-inputgroup">
                    <span class="p-inputgroup-addon">
                        <label for="end">End</label>
                    </span>
                    <InputText id="end" type="date" v-model="date.end" class="w-full sm:w-auto" autocomplete="off" @input="load_user"/>
                </div>
            </div>
        </div>
        <Divider align="center"><strong class="uppercase">table banding</strong></Divider>
        <DataTable v-model:filters="filters" :value="list_user_akses" paginator :rows="10"
            :globalFilterFields="['rfid_code', 'kategori']" tableStyle="min-width: 50rem">
            <Column header="No" sortable sortField="no">
                <template #body="{ data }">
                    <span>{{ data.no }}</span>
                </template>
            </Column>
            <Column header="Tanggal" sortable sortField="tanggal">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span class="uppercase">{{ data.tanggal }}</span>
                    </div>
                </template>
            </Column>
            <Column header="Jumlah" sortable sortField="jumlah">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <strong class="uppercase">{{ data.jumlah }}</strong>
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
</template>