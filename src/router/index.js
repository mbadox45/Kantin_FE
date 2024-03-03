import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
// import AppLayout2 from '@/layout/layout_sso/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect:'/home',
            children: [
                // Distributor
                {
                    path: '/beranda',
                    name: 'beranda',
                    component: () => import('@/views/kantin/dashboard/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                        admin:true,
                    }
                },
                {
                    path: '/akses',
                    name: 'akses',
                    component: () => import('@/views/kantin/akses/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/kartu',
                    name: 'kartu',
                    component: () => import('@/views/kantin/kartu/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/akun',
                    name: 'akun',
                    component: () => import('@/views/kantin/akun/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        admin:true,
                    }
                },
                {
                    path: '/rekap',
                    name: 'rekap',
                    component: () => import('@/views/kantin/rekap/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                        admin:true,
                    }
                },
                {
                    path: '/profil',
                    name: 'profil',
                    component: () => import('@/views/kantin/profil/Index.vue'),
                    meta:{
                        requiresAuth: true,
                        user:true,
                        admin:true,
                    }
                },
            ]
        },
        {
            path: '/home',
            name: 'Home',
            component: () => import('@/views/kantin/home/Index.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/visitor',
            name: 'visitor',
            component: () => import('@/views/kantin/visitor/Index.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/signout',
            name: 'signout',
            component: () => import('@/views/kantin/sign/SignOut.vue'),
            meta:{
                user:true,
                admin:true,
            }
        },
        // {
        //     path: '/',
        //     name: 'Home',
        //     component: () => import('@/views/portofolio/home/Index.vue'),
        //     meta:{
        //         guestOnly:true,
        //     }
        // },
        // {
        //     path: '/sign-out',
        //     name: 'signout',
        //     component: () => import('@/views/survey/administrator/sign/SignOut.vue'),
        //     meta:{
        //         requiresAuth: true,
        //         distributor:true,
        //         // admin:true,
        //     }
        // },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login2.vue'),
            meta:{
                guestOnly:true,
            }
        },
        // {
        //     path: '/:pathMatch(.*)*',
        //     name: 'notfound',
        //     component: () => import('@/views/survey/administrator/sign/NotFound.vue')
        // },
    ]
});

router.beforeEach((to, from, next) => {
    const tokens = localStorage.getItem('usertoken') != null;
    const roles = localStorage.getItem('roles');
    // console.log(roles);

    if (to.matched.some((route) => route.meta.requiresAuth)) {
        if (tokens) {
            if (roles == 'admin') {
                if (to.matched.some((route) => route.meta.admin)) {
                    next();
                } else {
                    next('/beranda');
                }
            } else {
                if (to.matched.some((route) => route.meta.user)) {
                    next();
                } else {
                    next('/beranda');
                }
            }
        } else {
            next('/auth/login');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            if (roles == 'admin') {
                next('/beranda');
            } else {
                next('/beranda');
            }
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
