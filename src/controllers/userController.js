import AuthService from '@/api/AuthService';

export const postUserKantin = async (data) => {
    try {
        const response = await AuthService.registerUser(data)
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