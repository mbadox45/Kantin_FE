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