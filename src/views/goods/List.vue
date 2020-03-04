<template>
    <div class="list">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input @clear="getGoodsList()" clearable placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" @click="handleCurrentChange(1)" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddGoods">添加商品</el-button>
                </el-col>
            </el-row>

            <el-table :data="goodsList" border stripe>
                <el-table-column label="#" type="index"/>
                <el-table-column label="商品名称" prop="goods_name"/>
                <el-table-column label="商品价格(元)" prop="goods_price"/>
                <el-table-column label="商品重量" prop="goods_weight"/>
                <el-table-column label="创建时间">
                    <template v-slot="scope">
                        {{scope.row.add_time | format}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" size="mini" @click="goEditGoods(scope.row.goods_id)" icon="el-icon-edit"/>
                        <el-button type="danger" size="mini" @click="delGoods(scope.row.goods_id)" icon="el-icon-delete"/>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    import {getGoodsData, delGoodsData} from 'network/goods'
    import {forMatMixin} from "@/common/mixin";

    export default {
        name: "List",
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                goodsList: [],
                total: 0
            }
        },
        created() {
            this.getGoodsList();
        },
        mixins: [forMatMixin],
        methods: {
            async getGoodsList() {
                const {data: res} = await getGoodsData(this.queryInfo);
                if (res.meta.status !== 200) return this.$message.error('获取商品列表失败');
                this.goodsList = res.data.goods;
                this.total = res.data.total;
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getGoodsList();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getGoodsList();
            },
            async delGoods(id) {
                const result = await this.$confirm('此操作将永久删除该商品,是否继续?', '提示', {
                    type: 'warning'
                }).catch(err => err);
                if (result !== 'confirm') return this.$message.info('取消操作');
                const {data: res} = await delGoodsData(id);
                if (res.meta.status !== 200) return this.$message.error('删除商品失败');
                this.getGoodsList();
                this.$message.success('删除商品成功');
            },
            goAddGoods() {
                this.$router.push('/goods/add');
            },
            goEditGoods(id) {
                this.$router.push(`/goods/edit/${id}`);
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
