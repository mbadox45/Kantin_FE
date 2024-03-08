<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { FilterMatchMode, FilterOperator } from 'primevue/api';
    import moment from 'moment';

    // API
    import AbsenService from '@/api/AbsenService';
    import {formBanding} from '@/api/DataVariable';

    // Variable
    const filters = ref({global: { value: null, matchMode: FilterMatchMode.CONTAINS }});
    const list_user_akses = ref([])
    const jenis_user = ref(null);
    const date = ref({start:moment(new Date()).format('YYYY-MM-01'), end:moment(new Date()).format('YYYY-MM-DD')})

    // Dialog
    const visible_dialog = ref(false);
    const data_kartu = ref(null)
    const disabled_form = ref(true)
    const form = ref(formBanding)
    let count = ref(0);
    const messages = ref([]);
    const status_form = ref('add')
    const kategori_user = ref(null)
    const header_dialog = ref('');

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

    const reset_form = () => {
        data_kartu.value = null
        form.value = {
            id: null,
            tanggal: '',
            jumlah: '',
        };
        messages.value = [];
        disabled_form.value = true
    }

    const show_dialog = (status,data) => {
        status_form.value= status
        if (status == 'add') {
            header_dialog.value = 'Add Data Banding';
            reset_form()
        } else if (status == 'edit') {
            header_dialog.value = 'Edit Data Banding';
            form.value = {
                id: null,
                tanggal: '',
                jumlah: '',
            };
            messages.value = [];
        } else {
            header_dialog.value = 'Delete Data Banding';
            form.value = {
                id: data.id,
                tanggal: '',
                jumlah: '',
            };
            messages.value = [];
        }
        visible_dialog.value = true
    }

    const post_data = async () => {}

</script>

<template>
    <div>
        <!-- Dialog -->
        <Dialog v-model:visible="visible_dialog" modal :header="header_dialog" :style="{ width: '700px' }">
            <transition-group name="p-message" tag="div">
                <Message v-for="msg of messages" :key="msg.id" :severity="msg.severity">{{ msg.content }}</Message>
            </transition-group>
            <div class="flex w-full gap-2 my-3">
                <div class="flex flex-column gap-2 w-full" v-if="status_form != 'delete'">
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="name" class="font-semibold w-9rem">Tanggal <span class="text-red-500">*</span></label>
                        <InputText id="name" type="date" v-model="form.tanggal" class="w-full sm:w-full"/>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-2 gap-3">
                        <label for="email" class="font-semibold w-9rem">Jumlah Visitor <span class="text-red-500">*</span></label>
                        <InputText id="email" type="number" v-model="form.jumlah" class="w-full sm:w-full"/>
                    </div>
                </div>
                <div class="w-full text-center" v-else>
                    <span class="font-medium uppercase">Apakah anda ingin <span class="text-red-500">hapus</span> akun user tersebut ?</span>
                </div>
            </div>
            <div :class="`flex ${status_form != 'delete' ? 'justify-content-between' : 'justify-content-center mt-5'} gap-2`">
                <Button type="button" label="Reset" severity="warning" @click="reset_form" v-show="status_form != 'delete'"></Button>
                <div class="flex gap-2">
                    <Button type="button" label="Cancel"  outlined severity="secondary" @click="visible_dialog = false"></Button>
                    <Button type="button" :label="status_form != 'delete' ? 'Save' : 'Delete'" :severity="status_form != 'delete' ? 'success' : 'danger'" @click="post_data"></Button>
                </div>
            </div>
        </Dialog>

        <!-- Components -->
        <div class="flex align-items-center justify-content-between mb-5 gap-3">
            <div class="w-full md:w-full flex gap-2">
                <Button type="button" icon="pi pi-plus" size="small" severity="info" @click="show_dialog('add', null)" rounded></Button>
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