// 这是项目发布阶段需要用到babel插件
const prodPlugins = [];
// 判断是开发阶段还是发布阶段
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push('transform-remove-console');
}

module.exports = {
    "presets": [
        "@vue/cli-plugin-babel/preset"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        // 该插件用于打包时移除所有的console方法,开发阶段也会移除
        // 'transform-remove-console'

        // 发布阶段用到的插件数组
        ...prodPlugins,

        // 路由懒加载插件
        "@babel/plugin-syntax-dynamic-import"
    ]
}
