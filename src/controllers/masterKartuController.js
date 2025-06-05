// API
import AksesService from '@/api/AksesService';

export const getAllRfidCard = async () => {
    try {
        const response = await AksesService.getAllRfidCard()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const postRfidCard = async (data) => {
    try {
        const response = await AksesService.postRfidCard(data)
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

export const putRfidCard = async (id, data) => {
    try {
        const response = await AksesService.putRfidCard(id, data)
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

export const deleteVisitor = async (id) => {
    try {
        const response = await AksesService.deleteVisitor(id)
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