import http from './http-auth'

export default new class UserService{
    getUsers(){
        return http.get('v1/auth/all');
    }
    getUsersID(id){
        return http.get(`v1/auth/user/${id}`);
    }
    activeUser(id){
        return http.get(`user/active/${id}`);
    }
    resetPasswordUser(id){
        return http.get(`reset-password/${id}`);
    }

    addUser(data){
        return http.post(`v1/auth/add`, data);
    }
    updateUser(data){
        return http.post(`v1/auth/update`, data);
    }
    deleteUser(id){
        return http.delete(`v1/auth/delete/${id}`);
    }
    logoutUser(){
        return http.post(`logout`);
    }
}