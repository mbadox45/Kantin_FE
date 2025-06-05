import http from './http-auth'

export default new class UserService{
    getUsers(){
        return http.get('v1/auth');
    }
    getUsersID(id){
        return http.get(`v1/auth/${id}`);
    }
    activeUser(id){
        return http.get(`user/active/${id}`);
    }
    resetPasswordUser(id){
        return http.get(`reset-password/${id}`);
    }

    registerUser(data){
        return http.post(`v1/auth/register`, data);
    }
    updateUser(id,data){
        return http.put(`v1/auth/${id}`, data);
    }
    changePasswordUser(id,data){
        return http.put(`v1/auth/${id}/password`, data);
    }
    deleteUser(id){
        return http.delete(`v1/auth/delete/${id}`);
    }
    logoutUser(){
        return http.post(`logout`);
    }
}