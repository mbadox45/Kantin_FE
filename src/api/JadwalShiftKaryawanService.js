import httpAuth from './http-auth'

export default new class JadwalShiftKaryawanService{
    // Kehadiran Visitor
    getAllJadwalKaryawan(){
        return httpAuth.get(`v1/shift-karyawan/`);
    }
    getPeriodJadwalKaryawan(start, end){
        return httpAuth.get(`v1/shift-karyawan/by-period?start=${start}&end=${end}`);
    }
    postJadwalKaryawan(data){
        return httpAuth.post('v1/shift-karyawan/', data);
    }
    postBulkJadwalKaryawan(data){
        return httpAuth.post('v1/shift-karyawan/bulk', data);
    }
    putJadwalKaryawan(id, data){
        return httpAuth.put(`v1/shift-karyawan/${id}`, data);
    }
    deleteJadwalKaryawan(id){
        return httpAuth.delete(`v1/shift-karyawan/${id}`);
    }

}