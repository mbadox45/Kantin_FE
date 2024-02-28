import http from './http-common'

export default new class AksesService{

    // Akses Kartu
    getAllRfidCard(){
        return http.get(`v1/api/akses/kartu-all/`);
    }
    checkPenggunaRfidCard(data){
        return http.post('v1/api/akses/cek', data);
    }
    createRfidCard(data){
        return http.post('v1/api/akses/tambah-kartu', data);
    }
    updateRfidCard(data){
        return http.post('v1/api/akses/edit-kartu', data);
    }

    // Akses Karyawan
    getAllKaryawan(){
        return http.get(`v1/api/internal/karyawan-all/`);
    }
    createKaryawan(data){
        return http.post('v1/api/internal/tambah-karyawan', data);
    }
    updateKaryawan(data){
        return http.post('v1/api/internal/edit-karyawan', data);
    }

    // Akses Outsource
    getAllOutsource(){
        return http.get(`v1/api/outsource/karyawan-all/`);
    }
    createOutsource(data){
        return http.post('v1/api/outsource/tambah-karyawan', data);
    }
    updateOutsource(data){
        return http.post('v1/api/outsource/edit-karyawan', data);
    }

    // Akses Internship
    getAllInternship(){
        return http.get(`v1/api/internship/karyawan-all/`);
    }
    createInternship(data){
        return http.post('v1/api/internship/tambah-karyawan', data);
    }
    updateInternship(data){
        return http.post('v1/api/internship/edit-karyawan', data);
    }
}