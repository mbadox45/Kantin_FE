import http from "./http-common";
import httpAuth from "./http-common";

class AuthService{
    postSignIn(data){
        return http.post('v1/auth/login',data);
        // return http.post('v1/auth/signin',data);
    }
    registerUser(data){
        return http.post('v1/auth/register',data);
    }
}

export default new AuthService;