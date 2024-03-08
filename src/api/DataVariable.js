// Public Access
export const URL_WEB = 'https://e-survey.inl.co.id/';
// export const URL_WEB = 'http://36.92.181.10:3777/';
export const URL_API = 'http://36.92.181.10:3888/api/';
export const URL_WEB_Portal = 'https://portalapps.inl.co.id/';
export const URL_API_Portal = 'http://36.92.181.10:4763/api/';

// List for dropdown
export const listAkses = [
    { name: 1, level_akses: 1 },
    { name: 2, level_akses: 2 },
    { name: 3, level_akses: 3 },
    { name: 4, level_akses: 4 },
    { name: 5, level_akses: 5 },
    { name: 6, level_akses: 6 },
    { name: 7, level_akses: 7 },
    { name: 8, level_akses: 8 },
    { name: 9, level_akses: 9 },
    { name: 10, level_akses: 10 },
];

// Variable default Forms

export const formKartu = {
    id: null,
    rfid_code: '',
    kategori: null,
    status: true,
}

export const formPenggunaKartu = {
    id: null,
    user_id: '',
    rfid_code: '',
    nama: '',
    instansi: '',
    status: true,
}

export const formUserAkun = {
    id: null,
    name: '',
    email: '',
    roles: '',
    jabatan: '-',
    username: '',
    password: '',
}

export const formBanding = {
    id: null,
    tanggal: '',
    jumlah: '',
}