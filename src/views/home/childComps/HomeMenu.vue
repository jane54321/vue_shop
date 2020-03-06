<template>
    <el-menu
            background-color="#333744"
            text-color="#fff"
            unique-opened
            :collapse="collapse"
            router
            :collapse-transition="false"
            :default-active="path"
            active-text-color="#409EFF">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id + ''" :key="item.id" v-for="item in menuList">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" @click="saveNavState(subItem.path)" :key="subItem.id" v-for="subItem in item.children">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                </template>
            </el-menu-item>
        </el-submenu>
    </el-menu>
</template>

<script>
    import {getMenuList} from "network/home";

    export default {
        name: "HomeMenu",
        props: {
            collapse: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // 左侧菜单数据
                menuList: [],
                iconsObj: {
                    125: 'iconfont icon-user',
                    103: 'iconfont icon-tijikongjian',
                    101: 'iconfont icon-shangpin',
                    102: 'iconfont icon-danju',
                    145: 'iconfont icon-baobiao'
                },
                path: ''
            }
        },
        created() {
            this.getMenuAll();

            this.path = window.sessionStorage.getItem('path');
        },
        methods: {
            async getMenuAll() {
                const {data: res} = await getMenuList();
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                let obj = {
                    id: 666,
                    authName: '国内疫情',
                    path: 'epidemic'
                };
                res.data[4].children.push(obj);
                this.menuList = res.data;
            },
            // 保存连接的激活状态
            saveNavState(path) {
                window.sessionStorage.setItem('path', '/' + path);
                this.path = window.sessionStorage.getItem('path');
            }
        }
    }
</script>

<style scoped>
    .iconfont {
        margin-right: 10px;
    }

    .el-menu {
        border-right: none;
    }
</style>
