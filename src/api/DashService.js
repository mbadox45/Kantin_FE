import http from './http-common'

export default new class DashService{

    // Absen Kantin
    getCountForCards(start, end){
        return http.get(`v1/api/dash/cards/${start}/${end}`);
    }
}