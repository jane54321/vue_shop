<template>
    <div class="home-header">
        <div>
            <img src="~assets/img/heima.png" alt="">
            <span>电商后台管理系统</span>
        </div>
        <div>
            <el-button type="info" @click="logout">退出</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HomeHeader",
        methods: {
            // 退出登录
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            }
        }
    }
</script>

<style lang="less" scoped>
    .home-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        div {
            display: flex;
            align-items: center;

            span {
                margin-left: 15px;
            }
        }
    }
</style>
