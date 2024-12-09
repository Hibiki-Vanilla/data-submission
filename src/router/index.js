const routes = [
    {
        path: '/management',
        name: 'management',
        meta: {
            title: 'management'
        },
        component: () => import('@/views/editList/index.vue'),
    },
    {
        path: '/formEdit',
        name: 'formEdit',
        meta: {
            title: 'formEdit'
        },
        component: () => import('@/views/formEdit/index.vue'),
    },
    {
        path: '/infoEdit/:id',
        name: 'infoEdit',
        meta: {
            title: 'infoEdit'
        },
        component: () => import('@/views/formEdit/index.vue'),
    },
    {
        path: '/listInfo/:id',
        name: 'listInfo',
        meta: {
            title: 'listInfo'
        },
        component: () => import('@/views/listInfo/index.vue'),
    },
    {
        path: '/details/:topId/:id',
        name: 'Details',
        meta: {
            title: 'Details'
        },
        component: () => import('@/views/details/index.vue'),
    },
    {
        path: '/detailsUpdate/:topId/:id',
        name: 'DetailsUpdate',
        meta: {
            title: 'Details'
        },
        component: () => import('@/views/detailsUpdate/index.vue'),
    },
    {
        path: '/fillIn',
        name: 'fillIn',
        meta: {
            title: 'fillIn'
        },
        component: () => import('@/views/fillIn/index.vue'),
    },
    {
        path: '/fillIn/:id',
        name: 'fillInEdit',
        meta: {
            title: 'fillInEdit'
        },
        component: () => import('@/views/fillInEdit/index.vue'),
    },
    {
        path: '/fillIn/:id/:copyId',
        name: 'fillInEditCopy',
        meta: {
            title: 'fillInEditCopy'
        },
        component: () => import('@/views/fillInEdit/index.vue'),
    },
    {
        path: '/fillInList/:id',
        name: 'fillInList',
        meta: {
            title: 'fillInList'
        },
        component: () => import('@/views/fillInList/index.vue'),
    },
    {
        path: '/fillDetails/:topId/:id',
        name: 'fillDetails',
        meta: {
            title: 'fillDetails'
        },
        component: () => import('@/views/fillDetails/index.vue'),
    },
    {
        path: '/fillInUpdate/:topId/:id',
        name: 'fillInUpdate',
        meta: {
            title: 'fillInUpdate'
        },
        component: () => import('@/views/fillInUpdate/index.vue'),
    },
    {
        path: '/internal',
        name: 'internal',
        meta: {
            title: 'internal account'
        },
        component: () => import('@/views/internal/index.vue'),
        
    },
    {
        path: '/external',
        name: 'external',
        meta: {
            title: 'external account'
        },
        component: () => import('@/views/external/index.vue'),

    },
];


export default routes;
