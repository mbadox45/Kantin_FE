import http from './http-common'

export default new class AbsenService{

    // Absen Kantin
    postAbsenKantin(data) {
        return http.post('v1/api/presence/user', data);
    }
    getAllAbsenKantin(){
        return http.get('v1/api/absen/all');
    }
    getSessionAbsenKantin(){
        return http.get('v1/api/absen/session');
    }
    getTodayAbsenKantin(start, end){
        return http.get(`v1/api/absen/today/${start}/${end}`);
    }

    // User Kantin
    getAllUserKantin(data){
        return http.get(`v1/api/userkantin/all/${data}`);
    }
    getUserKantinByID(data){
        return http.get(`v1/api/userkantin/usr/${data}`);
    }
    postUserKantin(data){
        return http.post('v1/api/userkantin/all', data);
    }

    // Rekap Banding
    getBanding(start, end){
        return http.get(`v1/api/rekap/banding/${start}/${end}`);
    }
    getPengunjungKantin(start, end){
        return http.get(`v1/api/rekap/user/${start}/${end}`);
    }
}