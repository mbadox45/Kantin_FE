<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';
    import moment from 'moment';

    // API
    import AbsenService from '@/api/AbsenService';

    // Components
    const router = useRouter();
    const tgl = moment(new Date()).format('DD MMM YYYY');
    const value_rfid = ref('')
    const count_user = ref(null)
    const color_text_notif = ref('')
    const messages = ref({nama:'', msg:'',jam:moment().format('HH:mm:ss')})
    const list_user_hadir = ref([])

    // Function
    onMounted(() => {
        load_data_user()
        post_absen()
    })

    const auto_focus = () => {
        document.getElementById('inputRef').focus()
    }

    const link = (item) => {
        router.push(`/${item}`);
    }

    const post_absen = async() => {
        try {
            const response = await AbsenService.getTodayAbsenKantin(moment(new Date()).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'))
            const data = response.data.data
            count_user.value = data.length + ' Users';
        } catch (error) {
            count_user.value = '0 User';
        }
    }

    const load_data_user = async() => {
        try {
            const response = await AbsenService.getSessionAbsenKantin()
            const data = response.data.data
            const list = []
            for (let i = 0; i < data.length; i++) {
                list[i] = {
                    nrk: data[i].nrk,
                    nama: data[i].nama,
                    waktu: data[i].waktu
                }
            }
            list_user_hadir.value = list
        } catch (error) {
            list_user_hadir.value = []
        }
    }

    const post_tapping_card = async () => {
        if (value_rfid.value != '') {
            setTimeout(async() => {
                console.log(value_rfid.value)
                if (value_rfid.value.length >= 10) {
                    const response = await AbsenService.postAbsenKantin({rfid: value_rfid.value})
                    const data = response.data;
                    if (data.code == 200) {
                        const load = data.data;
                        const kondisi = 1
                        messages.value = {
                            nama: load.nama,
                            msg: data.status
                        }
                        if (kondisi == 1) {
                            color_text_notif.value = '#AD1457'
                        } else {
                            color_text_notif.value = '#0277BD'
                        }
                        setTimeout(() => {
                            value_rfid.value = ''
                            messages.value = {
                                nama: '',
                                msg: ''
                            }
                            load_data_user()
                            post_absen()
                        }, 2000);
                    } else {
                        messages.value = {
                            nama: 'Tidak Ada',
                            msg: 'Tidak Ada'
                        }
                        setTimeout(() => {
                            value_rfid.value = ''
                            messages.value = {
                                nama: '',
                                msg: ''
                            }
                        }, 2000);
                    }
                } else {
                    messages.value = {
                        nama: 'Belum Terdaftar !',
                        msg: 'Silahkan daftarkan ID Card anda!'
                    }
                    setTimeout(() => {
                        value_rfid.value = ''
                        messages.value = {
                            nama: '',
                            msg: ''
                        }
                    }, 2000);
                }
                console.log(value_rfid.value)
            }, 50)
        } else {
            setTimeout(async() => {
                value_rfid.value = ''
            }, 2000);
        }
    }

</script>

<template>
    <div class="flex flex-column bg-white h-screen" @click="auto_focus" @mousemove="auto_focus">
        <div class="fixed">
            <div class="flex p-3 bg-bluegray-600 text-white justify-content-start align-items-start gap-3 w-full" style="font-family: Times New Roman, Times, serif;">
                <img src="/layout/inl.png" alt="PT Industri Nabati Lestari" width="80">
                <div class="flex flex-column gap-1">
                    <strong class="uppercase font-bold font-italic text-1xl">PT. INDUSTRI NABATI LESTARI</strong>
                    <span class="font-italic">Palm Oil Refinery & Fractionation</span>
                </div>
            </div>
        </div>
        <div class="flex h-full">
            <div class="w-full flex flex-column gap-3 align-items-center justify-content-center">
                <div>
                    <h3 class="text-teal-700 font-medium text-4xl">Please Tap Your ID Card</h3>
                    <input type="text" v-model="value_rfid" id="inputRef" class="input-style" autofocus @input="post_tapping_card"/>
                    <!-- <InputText type="text" v-model="value_rfid" id="inputRef" class="text-white border-0 border-white p-0 focus:border-0 focus:border-white active:border-0 active:border-white" @input="post_absen"/> -->
                </div>
                <div class="my-7">
                    <img src="/rfid.png" alt="Gambar Tapping" class="fadeout animation-duration-1000 animation-iteration-infinite" width="190">
                </div>
                <div class="flex flex-column justify-content-center align-items-center h-6rem border-top-1 border-bluegray-100 w-full">
                    <span class="uppercase text-3xl font-semibold" v-show="value_rfid != ''">{{messages.nama}}</span>
                    <span class="uppercase text-2xl font-bold " v-show="value_rfid != ''" :style="`color:${color_text_notif}`">{{messages.msg}}</span>
                    <small class="uppercase text-md font-bold " v-show="value_rfid != ''">{{messages.jam}}</small>
                </div>
            </div>
            <div class="flex flex-column w-8 p-3 bg-bluegray-100 border-left-1 border-bluegray-100">
                <div class="flex justify-content-between">
                    <strong class="text-pink-400">Already Present <small class="font-normal">{{tgl}}</small></strong>
                    <strong class="text-gray-600">{{count_user}}</strong>
                </div>
                <div class="w-full flex flex-column gap-3 my-3 overflow-auto min-h-30rem">
                    <div class="flex align-items-center justify-content-between" v-for="(item, index) in list_user_hadir" :key="index">
                        <div class="flex align-items-center gap-2">
                            <Avatar icon="pi pi-user" size="large" shape="circle"  style="background-color: #34495E; color: #ffffff" />
                            <div class="flex flex-column gap-2">
                                <strong class="uppercase">{{ item.nama }}</strong>
                                <small class="uppercase flex align-items-center"> <i class="pi pi-clock mr-2"></i>{{ item.waktu }}</small>
                            </div>
                        </div>
                        <div>
                            <i class="pi pi-check font-bold text-green-500"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex align-items-center fixed bottom-0 w-full">
        <div class="w-full py-2 w-full bg-bluegray-400">
            <!--<span class="font-medium text-white" style="font-family: Times New Roman, Times, serif;"><span class='font-bold text-gray-300 uppercase'>rekan</span> - 2022 &copy; PT Industri Nabati Lestari</span> -->
            <marquee behavior="" direction="left" class="font-medium text-white" style="font-family: Times New Roman, Times, serif;"><span class='font-bold text-gray-300 uppercase'>rekan</span> - 2022 &copy; PT Industri Nabati Lestari</marquee>
        </div>
        <div class="w-3 flex">
            <span class="flex cursor-pointer w-full flex-row gap-2 transition-all transition-ease-in-out transition-duration-500 font-medium text-lg uppercase align-items-center justify-content-center px-3 py-2 border-0 text-white bg-teal-500 hover:bg-teal-300" @click="link('visitor')"><i class="pi pi-users"></i>Visitor</span>
            <span class="flex cursor-pointer w-full flex-row gap-2 transition-all transition-ease-in-out transition-duration-500 font-medium text-lg uppercase align-items-center justify-content-center px-3 py-2 border-0 text-white bg-pink-600 hover:bg-pink-400" @click="link('auth/login')"><i class="pi pi-sign-in"></i>sign in</span>
        </div>
    </div>
</template>

<style>
.input-style {
    /* Initial style */
    color: white;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid white; /* Bottom border only */
    transition: border-color 0.3s ease; /* Smooth transition for border color */

    /* When input is focused */
    outline: none; /* Remove default focus outline */
}

.input-style:focus {
    border-bottom-color: white; /* Change border color when focused */
}

.input-style::placeholder {
    color: white; /* Placeholder text color */
}
</style>