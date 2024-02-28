<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';

    // API
    import DashService from '@/api/DashService';

    // Variable
    const start = ref(moment(new Date).format('YYYY-MM-01'));
    const end = ref(moment(new Date).format('YYYY-MM-DD'));
    const value_cards = ref({karyawan:0, internship:0, outsource:0, visitor:0})
    const chartData = ref();
    const chartOptions = ref();

    // Function
    onMounted(() => {
        load_data_pengunjung()
    })

    const load_data_pengunjung = async() => {
        const response = await DashService.getCountForCards(start.value, end.value)
        const load = response.data.data
        value_cards.value = {
            karyawan: Number(load.karyawan),
            internship: Number(load.internship),
            outsource: Number(load.outsource),
            visitor: Number(load.visitor),
        }
        console.log(load)
        chartData.value = setChartData(value_cards.value);
        chartOptions.value = setChartOptions();
    }

    // Chart Funtion
    const setChartData = (data) => {
        return {
            labels: ['Karyawan', 'Outsource', 'Internship', 'Visitor'],
            datasets: [
                {
                    label: 'Sales',
                    data: [data.karyawan, data.outsource, data.internship, data.visitor],
                    backgroundColor: ['rgba(249, 115, 22, 0.2)', 'rgba(6, 182, 212, 0.2)', 'rgb(107, 114, 128, 0.2)', 'rgba(139, 92, 246 0.2)'],
                    borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                    borderWidth: 1
                }
            ]
        };
    }; 
    const setChartOptions = () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        return {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }
</script>

<template>
    <div class="flex flex-column gap-5">
        <div class="flex justify-content-between align-items-center">
            <strong class="text-3xl font-medium uppercase">Dashboard</strong>
            <small class="flex align-items-center"><i class="mx-2 pi pi-th-large"></i>Dashboard</small>
        </div>

        <!-- Input Date -->
        <div class="flex justify-content-center align-items-center gap-2">
            <div class="w-full">
                <label for="start" class="font-medium">Start Date</label>
                <InputText id="start" type="date" placeholder="Date" class="w-full mt-2" style="padding: 1rem" v-model="start" autocomplete="off" @input="load_data_pengunjung"/>
            </div>
            <div class="w-full">
                <label for="end" class="font-medium">End Date</label>
                <InputText id="end" type="date" placeholder="Date" class="w-full mt-2" style="padding: 1rem" v-model="end" autocomplete="off" @input="load_data_pengunjung"/>
            </div>
        </div>

        <!-- Cards -->
        <div class="flex flex-column md:flex-row justify-content-center align-items-center gap-3">
            <div class="w-full flex justify-content-between align-items-center bg-cyan-500 p-3 text-white border-round shadow-2">
                <div class="flex flex-column gap-2 w-full">
                    <strong class="uppercase text-xl font-medium">Karyawan</strong>
                    <strong class="text-3xl border-top-1">{{value_cards.karyawan}}</strong>
                </div>
                <div class="p-3">
                    <i class="pi pi-user text-6xl"></i>
                </div>
            </div>
            <div class="w-full flex justify-content-between align-items-center bg-cyan-500 p-3 text-white border-round shadow-2">
                <div class="flex flex-column gap-2 w-full">
                    <strong class="uppercase text-xl font-medium">Outsource</strong>
                    <strong class="text-3xl border-top-1">{{value_cards.outsource}}</strong>
                </div>
                <div class="p-3">
                    <i class="pi pi-user text-6xl"></i>
                </div>
            </div>
            <div class="w-full flex justify-content-between align-items-center bg-cyan-500 p-3 text-white border-round shadow-2">
                <div class="flex flex-column gap-2 w-full">
                    <strong class="uppercase text-xl font-medium">Internship</strong>
                    <strong class="text-3xl border-top-1">{{value_cards.internship}}</strong>
                </div>
                <div class="p-3">
                    <i class="pi pi-user text-6xl"></i>
                </div>
            </div>
            <div class="w-full flex justify-content-between align-items-center p-3 border-round shadow-2">
                <div class="flex flex-column gap-2 w-full">
                    <strong class="uppercase text-xl font-medium">Visitor</strong>
                    <strong class="text-3xl border-top-1">{{value_cards.visitor}}</strong>
                </div>
                <div class="p-3">
                    <i class="pi pi-users text-6xl"></i>
                </div>
            </div>
        </div>

        <!-- Charts -->
        <div class="flex justify-content-center align-items-center gap-3">
            <div class="w-full flex flex-column bg-white p-3 border-round shadow-2">
                <div>
                    <strong class="uppercase text-md font-medium"><i class="pi pi-chart-line mr-3"></i>Graph</strong>
                </div>
                <div>
                    <Chart type="bar" :data="chartData" :options="chartOptions" />
                </div>
            </div>
        </div>
    </div>
</template>