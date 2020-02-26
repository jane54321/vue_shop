<template>
    <div class="cate">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-button type="primary" @click="showAddCate">添加分类</el-button>

            <tree-table class="tree-table"
                        :expand-type="false"
                        :selection-type="false"
                        :data="cateList"
                        :columns="columns"
                        show-index
                        index-text="#"
                        :show-row-hover="false"
                        border>
                <template slot="isok" slot-scope="scope">
                    <i v-if="!scope.row.cat_deleted" style="color: lightgreen;" class="el-icon-success"></i>
                    <i v-else class="el-icon-error" style="color: red;"></i>
                </template>

                <template slot="sort" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>

                <template slot="operation" slot-scope="scope">
                    <el-button type="primary" @click="showEditCate(scope.row.cat_id)" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" @click="showDelCate(scope.row.cat_id)" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类 -->
        <el-dialog
                title="添加分类"
                :visible.sync="addCateDialog"
                width="50%"
                @close="addCateClose">
            <el-form :model="addCateForm" ref="addCateRef" :rules="rules" label-width="90px">
                <el-form-item prop="cat_name" label="分类名称:">
                    <el-input v-model="addCateForm.cat_name"/>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- options 用来指定数据源 -->
                    <!-- props 用来指定配置对象 -->
                    <el-cascader
                            :clearable="true"
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialog = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改分类 -->
        <el-dialog
                title="修改分类"
                :visible.sync="editCateDialog"
                width="50%"
                @close="editCateClose">
            <el-form :model="editCateForm" ref="editCateRef" :rules="rules" label-width="90px">
                <el-form-item prop="cat_name" label="分类名称:">
                    <el-input v-model="editCateForm.cat_name"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialog = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getCategories, getParentCateData, addCateData, geteditCateData, editCateData, delCateData} from "network/goods";

    export default {
        name: "Cate",
        data() {
            return {
                cateList: [],
                queryInfo: {
                    type: 3,
                    pagesize: 5,
                    pagenum: 1
                },
                total: 0, // 总条数
                // 为table指定列的定义
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name',
                    },
                    {
                        label: '是否有效',
                        type: 'template', // 将当前列定义为模板列
                        template: 'isok' // 表示当前列使用的模板名称
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'sort'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'operation'
                    }
                ],
                addCateDialog: false,
                // 添加分类的表单数据
                addCateForm: {
                    cat_name: '',
                    cat_pid: 0, // 父级分类id
                    cat_level: 0 // 分类等级
                },
                // 验证规则
                rules: {
                    cat_name: [
                        {required: true, message: '分类名称不能为空', trigger: 'blur'}
                    ]
                },
                // 父级分类数据列表
                parentCateList: [],
                // 指定级联选择器的配置对象
                cascaderProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly: true // 允许任意一级选择
                },
                // 选中的父级分类的id数组
                selectedKeys: [],
                // 编辑对话框显示隐藏
                editCateDialog: false,
                editCateForm: {}
            }
        },
        created() {
            this.getCateData();
        },
        methods: {
            async getCateData() {
                const {data: res} = await getCategories(this.queryInfo);
                if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败');
                this.cateList = res.data.result;
                this.total = res.data.total;
            },
            // 监听 pagesize 改变
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getCateData();
            },
            // 监听 pagenum 改变
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getCateData();
            },
            // 点击添加分类弹出对话框
            showAddCate() {
                this.getParentCateList();
                this.addCateDialog = true;
            },
            // 获取父级分类的数据列表
            async getParentCateList() {
                const {data: res} = await getParentCateData();
                if (res.meta.status !== 200) return this.$message.error('获取分类数据失败');
                this.parentCateList = res.data;
            },
            // 监听级联选择器选择项发生变化
            parentCateChange() {
                this.addCateForm.cat_level = this.selectedKeys.length;
                if (this.selectedKeys.length === 0) {
                    this.addCateForm.cat_pid = 0;
                } else {
                    this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
                }
            },
            // 点击确定按钮添加新的分类
            addCate() {
                this.$refs.addCateRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await addCateData(this.addCateForm);
                    if (res.meta.status !== 201) return this.$message.error('添加分类失败');
                    this.getCateData();
                    this.addCateDialog = false;
                    this.$message.success('添加分类成功!');
                })
            },
            // 添加分类对话框关闭,重置表单
            addCateClose() {
                this.$refs.addCateRef.resetFields();
                this.selectedKeys = [];
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            },
            // 编辑对话框
            async showEditCate(id) {
                const {data: res} = await geteditCateData(id);
                if (res.meta.status !== 200) return this.$message.error('查询分类信息失败');
                this.editCateForm = res.data;
                this.editCateDialog = true;
            },
            // 修改
            editCate() {
                this.$refs.editCateRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await editCateData(this.editCateForm);
                    if (res.meta.status !== 200) return this.$message.error('修改分类信息失败');
                    this.getCateData();
                    this.editCateDialog = false;
                    this.$message.success('修改分类信息成功');
                })
            },
            // 删除对话框
            async showDelCate(id) {
                const result = await this.$confirm('此操作会永久删除该分类，是否继续?','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (result !== 'confirm') return this.$message.info('取消操作')
                const {data: res} = await delCateData(id);
                if (res.meta.status !== 200) return this.$message.error('删除分类失败');
                this.queryInfo.pagenum = 1;
                this.getCateData();
                this.$message.success('删除分类成功');
            },
            // 编辑对话框关闭
            editCateClose() {
                this.$refs.editCateRef.resetFields();
            }
        }
    }
</script>

<style lang="less" scoped>
    .tree-table {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
