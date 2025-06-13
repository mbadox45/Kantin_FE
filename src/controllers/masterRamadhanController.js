// API
import AksesService from '@/api/AksesService';

export const getAllRamadan = async () => {
    try {
        const response = await AksesService.getAllRamadhan()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const postRamadan = async (data) => {
    try {
        const response = await AksesService.createRamadhan(data)
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

export const putRamadan = async (id, data) => {
    try {
        const response = await AksesService.updateRamadhan(id, data)
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