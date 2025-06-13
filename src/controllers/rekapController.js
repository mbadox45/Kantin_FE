// API
import AbsenService from '@/api/AbsenService';

export const getDataByPeriod = async (start, end) => {
    try {
        const response = await AbsenService.getAbsenByPeriod(start, end)
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const postAbsenKantin = async (data) => {
    try {
        const response = await AbsenService.postAbsenKantin(data)
        const load = response.data;
        return load;
    } catch (error) {
        const response = error.response.data
        console.log(response)
        return {
            code: response.code,
            status: response.status,
            message: response.message,
            data: response.data,
        }
    }
}