<template>
    <el-container class="home-container">
        <!--  头部区域  -->
        <el-header>
            <home-header/>
        </el-header>
        <!--  页面主体区域  -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? 64+'px' : 200+'px'">
                <div class="toggle-button" @click="toggleMenu">|||</div>
            <!-- 侧边栏菜单区域 -->
                <home-menu :collapse="isCollapse"/>
            </el-aside>

            <!-- 右侧内容主体 -->
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import HomeMenu from './childComps/HomeMenu'
    import HomeHeader from './childComps/HomeHeader'
    export default {
        name: 'Home',
        data() {
          return {
              isCollapse: false
          }
        },
        components: {
            HomeMenu,
            HomeHeader
        },
        methods: {
            // 点击按钮切换菜单的折叠与展开
            toggleMenu() {
                this.isCollapse = !this.isCollapse
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        background-color: #373D41;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #EAEDF1;
    }

    .toggle-button {
        background-color: #4A5064;
        color: #fff;
        font-size: 10px;
        line-height: 24px;
        text-align: center;
        letter-spacing: .2em;
        cursor: pointer;
    }
</style>
