import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './plugins/treeTable.js' // 多功能表格
import './plugins/vueQuillEditor' // 适用于vue的富文本编辑器
// 导入字体图标
import 'assets/fonts/iconfont.css'
// 导入全局样式表
import 'assets/css/global.css'

// 设置当前入口文件时开发模式还是生产模式
Vue.config.productionTip = true;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
