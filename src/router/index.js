import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('views/login/Login');
const Home = () => import('views/home/Home');
const Welcome = () => import('views/home/childViews/Welcome');
const Users = () => import('views/home/childViews/user/Users');
const Rights = () => import('views/home/childViews/power/Rights');
const Roles = () => import('views/home/childViews/power/Roles');
const Category = () => import('views/home/childViews/goods/Cate');
const Params = () => import('views/home/childViews/goods/Params');

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: Category
            },
            {
                path: '/params',
                component: Params
            }
        ]
    }
];

const router = new VueRouter({
    routes
});

// 前置钩子(路由跳转完成之前)，用于判断当前用户是否登录
router.beforeEach((to, from, next) => {
    // to:将要访问的路由
    // from:从哪个路由跳转而来
    // next:是一个函数，表示放行
    // next() 放行，next(路由地址) 强制跳转
    if (to.path === '/login') return next();
    const token = window.sessionStorage.getItem('token');
    if (!token) return next('/login');
    next()
});

export default router
