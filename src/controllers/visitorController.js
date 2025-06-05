// API
import AbsenService from '@/api/AbsenService';

export const getVisitorByPeriod = async (start, end) => {
    try {
        const response = await AbsenService.getVisitorByPeriod(start, end)
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const postVisitor = async (data) => {
    try {
        const response = await AbsenService.postVisitor(data)
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

export const putVisitor = async (id, data) => {
    try {
        const response = await AbsenService.putVisitor(id, data)
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
        const response = await AbsenService.deleteVisitor(id)
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