// API
import AbsenService from '@/api/AbsenService';

export const getAllUserKantin = async () => {
    try {
        const response = await AbsenService.getAllUserKantin()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const cekKartu = async (data) => {
    try {
        const response = await AbsenService.cekKartu(data)
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

export const postUserKantin = async (data) => {
    try {
        const response = await AbsenService.postUserKantin(data)
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

export const putUserKantin = async (id,data) => {
    try {
        const response = await AbsenService.putUserKantin(id,data)
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

export const deleteUserKantin = async (id) => {
    try {
        const response = await AbsenService.deleteUserKantin(id)
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