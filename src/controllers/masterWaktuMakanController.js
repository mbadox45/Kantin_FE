// API
import AksesService from '@/api/AksesService';

export const getAllWaktuMakan = async () => {
    try {
        const response = await AksesService.getAllWaktuMakan()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const postWaktuMakan = async (data) => {
    try {
        const response = await AksesService.createWaktuMakan(data)
        const load = response.data;
        return load;
    } catch (error) {
        return {
            code: 500,
            status: false,
            message: 'Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.'
        }
    }
}

export const putWaktuMakan = async (id, data) => {
    try {
        const response = await AksesService.updateWaktuMakan(id, data)
        const load = response.data;
        return load;
    } catch (error) {
        return {
            code: 500,
            status: false,
            message: 'Terjadi kesalahan sistem, silahkan dicoba beberapa saat lagi.'
        }
    }
}