import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ 'views/login/Login');
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ 'views/home/Home');
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ 'views/home/childViews/Welcome');

const Users = () => import(/* webpackChunkName: "users_rights_roles" */ 'views/user/Users');
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ 'views/power/Rights');
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ 'views/power/Roles');

const Category = () => import(/* webpackChunkName: "cate_params" */ 'views/goods/Cate');
const Params = () => import(/* webpackChunkName: "cate_params" */ 'views/goods/Params');

const List = () => import(/* webpackChunkName: "goodsList" */ 'views/goods/List');
const AddGoods = () => import(/* webpackChunkName: "goodsList" */ 'views/goods/AddGoods');
const EditGoods = () => import(/* webpackChunkName: "goodsList" */ 'views/goods/EditGoods');

const Order = () => import(/* webpackChunkName: "order_report_epidemic" */ 'views/order/Order');
const Report = () => import(/* webpackChunkName: "order_report_epidemic" */ 'views/report/Report');
const Epidemic = () => import(/* webpackChunkName: "order_report_epidemic" */ 'views/report/Epidemic');

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
            },
            {
                path: '/goods',
                component: List,

            },
            {
                path: '/goods/add',
                component: AddGoods
            },
            {
                path: '/goods/edit/:id',
                component: EditGoods
            },
            {
                path: '/orders',
                component: Order
            },
            {
                path: '/reports',
                component: Report
            },
            {
                path: '/epidemic',
                component: Epidemic
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
