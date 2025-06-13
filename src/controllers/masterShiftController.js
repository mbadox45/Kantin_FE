// API
import AksesService from '@/api/AksesService';

export const getAllShift = async () => {
    try {
        const response = await AksesService.getAllShift()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const postShift = async (data) => {
    try {
        const response = await AksesService.createShift(data)
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

export const putShift = async (id, data) => {
    try {
        const response = await AksesService.updateShift(id, data)
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