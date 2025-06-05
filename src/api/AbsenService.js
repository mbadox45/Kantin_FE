import http from './http-common'
import httpAuth from './http-auth'

export default new class AbsenService{

    // Absen Kantin
    postAbsenKantin(data) {
        return http.post('v1/absen-kantin/', data);
    }
    getAllAbsenKantin(){
        return http.get('v1/absen-kantin/');
    }
    getAbsenByPeriod(start, end){
        return http.get(`v1/absen-kantin/all?tanggal_awal=${start}&tanggal_akhir=${end}`);
    }

    // Kehadiran Visitor
    getVisitorByPeriod(start, end){
        return http.get(`v1/visitor/periode?start_date=${start}&end_date=${end}`);
    }
    postVisitor(data){
        return httpAuth.post('v1/visitor/', data);
    }
    putVisitor(id, data){
        return httpAuth.put(`v1/visitor/${id}`, data);
    }
    deleteVisitor(id){
        return httpAuth.delete(`v1/visitor/${id}`);
    }

    // User Kantin
    getAllUserKantin(){
        return httpAuth.get(`v1/user-kantin/`);
    }
    cekKartu(data){
        return httpAuth.post('v1/user-kantin/cek-kartu', data);
    }
    postUserKantin(data){
        return httpAuth.post('v1/user-kantin', data);
    }
    putUserKantin(id, data){
        return httpAuth.put(`v1/user-kantin/${id}`, data);
    }
    deleteUserKantin(id){
        return httpAuth.delete(`v1/user-kantin/${id}`);
    }

    // Rekap Banding
    getBanding(start, end){
        return http.get(`v1/api/rekap/banding/${start}/${end}`);
    }
    getPengunjungKantin(start, end){
        return http.get(`v1/api/rekap/user?start=${start}&end=${end}`);
    }
    getPengunjungKantin2(start, end){
        return http.get(`v1/api/rekap/pengunjung?start=${start}&end=${end}`);
    }
    getVisitor(start, end){
        return http.get(`v1/api/visitor/all/${start}/${end}`);
    }
    
}