// API
import AksesService from '@/api/AksesService';

export const getAllBagian = async () => {
    try {
        const response = await AksesService.getAllBagian()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const postBagian = async (data) => {
    try {
        const response = await AksesService.createBagian(data)
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

export const putBagian = async (id, data) => {
    try {
        const response = await AksesService.updateBagian(id, data)
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

export const deleteBagian = async (id) => {
    try {
        const response = await AksesService.deleteBagian(id)
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