import http from './http-common'
import httpAuth from './http-auth'

export default new class AksesService{

    // Akses Kartu
    getAllRfidCard(){
        return httpAuth.get(`v1/master-kartu/`);
    }
    // checkPenggunaRfidCard(data){
    //     return http.post('v1/api/akses/cek', data);
    // }
    postRfidCard(data){
        return httpAuth.post('v1/master-kartu', data);
    }
    putRfidCard(id,data){
        return httpAuth.put(`v1/master-kartu/${id}`, data);
    }

    // Master Bagian
    getAllBagian(){
        return httpAuth.get(`v1/master-bagian/`);
    }
    getByIDBagian(id){
        return httpAuth.get(`v1/master-bagian/${id}`);
    }
    createBagian(data){
        return httpAuth.post('v1/master-bagian/', data);
    }
    updateBagian(id, data){
        return httpAuth.put(`v1/master-bagian/${id}`, data);
    }
    deleteBagian(id){
        return httpAuth.delete(`v1/master-bagian/${id}`);
    }

}