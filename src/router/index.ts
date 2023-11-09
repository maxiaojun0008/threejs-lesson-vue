import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

const routes:RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/machineroom',
    },
    {
        path: '/machineroom',
        component:() => import('../views/MachineRoom.vue')
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router