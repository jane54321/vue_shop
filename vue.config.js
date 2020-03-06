module.exports = {
    // 避免eslint的报错
    //lintOnSave: false,

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
    }
};
