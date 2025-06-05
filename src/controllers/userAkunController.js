// API
import UserService from '@/api/UserService';

export const getAllUser = async () => {
    try {
        const response = await UserService.getUsers()
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null
    }
}

export const registerUser = async (data) => {
    try {
        const response = await UserService.registerUser(data)
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

export const updateUser = async (id, data) => {
    try {
        const response = await UserService.updateUser(id, data)
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

export const resetPasswordUser = async (id, data) => {
    try {
        const response = await UserService.changePasswordUser(id, data)
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