<template>
    <div class="epidemic">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>国内疫情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 初始化eCharts 需要个有宽高的盒子 -->
            <div ref="mapBox" style="width: 600px; height: 400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import 'echarts/map/js/china' // 引入中国地图
    import jsonp from 'jsonp'

    // 使用地图，需要先注册
    let option = {
        title: {
            text: '国内疫情', // 地图标题
            subtext: '武汉加油! 中国加油!' // 副标题
        },
        // 地图配置
        series: [{
            name: '确诊人数',
            type: 'map', // 告诉echarts要去渲染的是一个地图
            mapType: 'china',  // 告诉echarts要渲染的是什么地图
            label: {
                show: true, // 显示各地方名称
                color: '#333', // 控制地区名字体颜色
                fontSize: 10 // 字体大小
            },
            // 控制地图板块的颜色和边框
            itemStyle: {
                areaColor: '#eee', // 控制地图颜色
                //borderColor: '#333' // 地图边框线颜色
            },
            zoom: 1.2, // 控制地图的放大缩小
            // 控制鼠标显示高亮背景色和字体颜色
            emphasis: {
                label: {
                    color: '#fff',
                    fontSize: 12
                },
                itemStyle: {
                    areaColor: '#83b5e7'
                }
            },
            // 用来展示后台数据
            data: [],
            roam: true, // 可放大缩小，可拖动
        }],
        // 分类配置
        visualMap: [{
            type: 'piecewise',
            show: true,
            //splitNumber: 5// 分几段
            pieces: [
                // 分段
                {min: 10000},
                {min: 1000, max: 9999},
                {min: 100, max: 999},
                {min: 10, max: 99},
                {min: 1, max: 9}
            ],
            //align: 'right', // 控制方块的位置(默认left)
            //orient: 'horizontal', // 控制小方块水平还是垂直显示
            //left right top bottom // 这些属性控制分段所在的位置
            //showLabel: false // 控制文字显示隐藏
            inRange: {
                symbol: 'rect', // 控制方块的显示样式
                color: ['#ffc0b1', '#9c0505'], //控制方块的颜色
            },
            itemWidth: 20, // 控制方块的大小
            itemHeight: 10 // 控制方块的大小
        }],
        // 鼠标放上显示人数
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                dataView: {readOnly: false},
                restore: {},
                saveAsImage: {}
            }
        },
    };

    export default {
        name: "Epidemic",
        data() {
            return {}
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                jsonp('http://interface.sina.cn/news/wap/fymap2020_data.d.json?_=1580892522427', {}, (err, data) => {
                    if (err) return this.$message.error('获取疫情数据失败');
                    let list = data.data.list.map(item => ({name: item.name, value: item.value}));
                    option.series[0].data = list;
                    let myChat = echarts.init(this.$refs.mapBox);
                    myChat.setOption(option);
                })
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
