module.exports = {
    // 避免eslint的报错,关闭eslint
    //lintOnSave: false,

    // configureWebpack通过操作对象，来修改webpack配置
    // chainWebpack通过链式编程，来修改webpack配置
    configureWebpack: {
        resolve: {
            alias: {
                components: '@/components',
                content: 'components/content',
                common: 'components/common',
                assets: '@/assets',
                network: '@/network',
                views: '@/views'
            }
        }
    },
    chainWebpack: config => {
        // 配置生产模式下入口文件
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js');

            // 通过externals加载外部CDN资源
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            });

            // 给html插件新增一个isProd属性,实现首页自定义内容
            config.plugin('html').tap(args => {
                args[0].isProd = true;
                return args;
            })
        });

        // 配置开发模式下入口文件
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js');

            config.plugin('html').tap(args => {
                args[0].isProd = false;
                return args;
            })
        });
    }
}
