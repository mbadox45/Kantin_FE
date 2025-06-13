// API
import JadwalShiftKaryawanService from '@/api/JadwalShiftKaryawanService';

export const getAllJadwalKerjaKaryawan = async () => {
    try {
        const response = await JadwalShiftKaryawanService.getAllBagian()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const getByPeriodJadwalKerjaKaryawan = async (start,end) => {
    try {
        const response = await JadwalShiftKaryawanService.getPeriodJadwalKaryawan(start,end)
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const postJadwalKerjaKaryawan = async (data) => {
    try {
        const response = await JadwalShiftKaryawanService.postJadwalKaryawan(data)
        const load = response.data;
        return load;
    } catch (error) {
        // console.log(error)
        const response = error.response
        return {
            code: response.data.code,
            status: false,
            message: response.data.message
            // message: 'Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.'
        }
    }
}

export const postBulkJadwalKerjaKaryawan = async (data) => {
    try {
        const response = await JadwalShiftKaryawanService.postBulkJadwalKaryawan(data)
        const load = response.data;
        return load;
    } catch (error) {
        const response = error.response
        return {
            code: response.data.code,
            status: false,
            message: response.data.message
            // message: 'Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.'
        }
    }
}

export const putJadwalKerjaKaryawan = async (id, data) => {
    try {
        const response = await JadwalShiftKaryawanService.putJadwalKaryawan(id, data)
        const load = response.data;
        return load;
    } catch (error) {
        const response = error.response
        return {
            code: response.data.code,
            status: false,
            message: response.data.message
            // message: 'Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.'
        }
    }
}

export const deleteJadwalKerjaKaryawan = async (id) => {
    try {
        const response = await JadwalShiftKaryawanService.deleteJadwalKaryawan(id)
        const load = response.data;
        return load;
    } catch (error) {
        const response = error.response
        return {
            code: response.data.code,
            status: false,
            message: response.data.message
            // message: 'Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.'
        }
    }
}