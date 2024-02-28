import http from "./http-common";

class AuthService{
    postSignIn(data){
        return http.post('v1/auth/signin',data);
    }
}

export default new AuthService;