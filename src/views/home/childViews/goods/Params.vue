<template>
    <div class="params">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 头部警告区域 -->
            <el-alert title="注意：只允许为第三级分类设置相关参数！"
                      type="warning" :closable="false" show-icon/>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader
                            v-model="selectedKeys"
                            :options="cateList"
                            :props="cateProps"
                            @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" @click="addParamDiaLog = true" :disabled="isDisabled">添加参数
                    </el-button>
                    <el-table :data="manyList" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag
                                        :key="i"
                                        v-for="(tag, i) in scope.row.attr_vals"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(tag, scope.row, i)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index"/>
                        <el-table-column label="参数名称" prop="attr_name"/>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" size="mini" @click="showEditParam(scope.row.attr_id)" icon="el-icon-edit">修改</el-button>
                                <el-button type="danger" size="mini" @click="delParam(scope.row.attr_id)" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" @click="addParamDiaLog = true" :disabled="isDisabled">添加属性
                    </el-button>
                    <el-table :data="onlyList" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag
                                        :key="i"
                                        v-for="(tag, i) in scope.row.attr_vals"
                                        closable
                                        :disable-transitions="false"
                                        @close="handleClose(tag, scope.row, i)">
                                    {{tag}}
                                </el-tag>
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index"/>
                        <el-table-column label="属性名称" prop="attr_name"/>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" size="mini" @click="showEditParam(scope.row.attr_id)" icon="el-icon-edit">修改</el-button>
                                <el-button type="danger" size="mini" @click="delParam(scope.row.attr_id)" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog
                :title="'添加' + titleText"
                :visible.sync="addParamDiaLog"
                width="50%"
                @close="addParamClose">
            <el-form :model="addParamForm" label-width="80px" ref="addParamRef" :rules="rules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addParamForm.attr_name"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamDiaLog = false">取 消</el-button>
                <el-button type="primary" @click="addParam">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
        <el-dialog
                :title="'修改' + titleText"
                :visible.sync="editParamDiaLog"
                width="50%"
                @close="editParamClose">
            <el-form :model="editParamForm" label-width="80px" ref="editParamRef" :rules="rules">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editParamForm.attr_name"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamDiaLog = false">取 消</el-button>
                <el-button type="primary" @click="editParam">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getCategories, getCateData, addParamData, getParamById, editParamData, delParamData} from 'network/goods'

    export default {
        name: "Params",
        data() {
            return {
                cateList: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 级联选择器选中的值
                selectedKeys: [],
                // 默认选中的标签页名称
                activeName: 'many',
                // 动态参数列表数据
                manyList: [],
                // 静态属性列表数据
                onlyList: [],
                addParamDiaLog: false,
                addParamForm: {
                    attr_name: ''
                },
                rules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'}
                    ]
                },
                editParamForm: {},
                editParamDiaLog: false
            }
        },
        created() {
            this.getCateList();
        },
        methods: {
            async getCateList() {
                const {data: res} = await getCategories();
                if (res.meta.status !== 200) return this.$message.error('获取分类列表失败');
                this.cateList = res.data;
            },
            // 级联选择框，选中项变化触发的函数
            handleChange() {
                this.getParamsData();
            },
            // 选项卡切换事件
            handleTabClick() {
                this.getParamsData();
            },
            // 获取参数的列表数据
            async getParamsData() {
                if (this.selectedKeys.length !== 3) {
                    this.selectedKeys = [];
                    this.manyList = [];
                    this.onlyList = [];
                    return;
                }
                const {data: res} = await getCateData(this.cateId, this.activeName);
                if (res.meta.status !== 200) return this.$message.error('获取参数列表失败');
                res.data.forEach(item => {
                   if (item.attr_vals !== '') {
                       item.attr_vals = item.attr_vals.split(' ');
                   } else {
                       item.attr_vals = [];
                   }

                   // 控制文本框的显示与隐藏
                    item.inputVisible = false;
                   //文本框中输入的内容
                    item.inputValue = '';
                });
                if (this.activeName === 'many') {
                    this.manyList = res.data;
                } else {
                    this.onlyList = res.data;
                }
            },
            // 添加参数
            addParam() {
                this.$refs.addParamRef.validate(async valid => {
                    if (!valid) return ;
                    const obj = {
                        id: this.cateId,
                        attr_name: this.addParamForm.attr_name,
                        attr_sel: this.activeName
                    };
                    const {data: res} = await addParamData(obj);
                    if (res.meta.status !== 201) return this.$message.error('添加参数失败');
                    this.getParamsData();
                    this.addParamDiaLog = false;
                    this.$message.success('添加参数成功');
                });
            },
            addParamClose() {
                this.$refs.addParamRef.resetFields();
            },
            async showEditParam(id) {
                const {data: res} = await getParamById(this.cateId, id, this.activeName);
                if (res.meta.status !== 200) return this.$message.error('获取参数信息失败');
                this.editParamForm = res.data;
                this.editParamDiaLog = true;
            },
            editParam() {
                this.$refs.editParamRef.validate(async valid => {
                    if (!valid) return ;
                    const {data: res} = await editParamData(this.editParamForm);
                    if (res.meta.status !== 200) return this.$message.error('修改参数失败');
                    this.editParamDiaLog = false;
                    this.getParamsData();
                    this.$message.success('修改参数成功');
                })
            },
            editParamClose() {
                this.$refs.editParamRef.resetFields();
            },
            async delParam(attrId) {
                const result = await this.$confirm('此操作将永久删除该参数，是否继续?', '提示', {
                    type: 'warning'
                }).catch(err => err);

                if (result !== 'confirm') return this.$message.info('取消操作');
                const {data: res} = await delParamData(this.cateId, attrId);
                if (res.meta.status !== 200) return this.$message.error('删除分类失败');
                this.getParamsData();
                this.$message.success('删除分类成功');
            },
            // 点击按钮显示input框
            showInput(params) {
                params.inputVisible = true;
                // 让文本框自动获得焦点
                // $nextTick方法的作用, 就是当页面上元素被重新渲染之后才会执行回调函数中的代码
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 文本框失去焦点，或按下了enter键都会触发
            async handleInputConfirm(param) {
                if (param.inputValue.trim().length === 0) {
                    param.inputVisible = false;
                    param.inputValue = '';
                    return ;
                }
                param.attr_vals.push(param.inputValue.trim());
                param.inputVisible = false;
                param.inputValue = '';
                const obj = {
                    cat_id : param.cat_id,
                    attr_id: param.attr_id,
                    attr_name: param.attr_name,
                    attr_sel: param.attr_sel,
                    attr_vals: param.attr_vals.join(' ')
                };
                const {data: res} = await editParamData(obj);
                if (res.meta.status !== 200) return this.$message.error('添加参数标签失败');
                this.$message.success('添加参数标签成功');
            },
            // 关闭标签,删除对应的标签可选项
            async handleClose(tag, param, index) {
                const result = await this.$confirm('此操作将永久删除该标签,是否继续?', '提示', {
                    type: "warning"
                }).catch(err => err);

                const attrVals = param.attr_vals.filter((item, i) => {
                    return i !== index;
                });

                const obj = {
                    cat_id : param.cat_id,
                    attr_id: param.attr_id,
                    attr_name: param.attr_name,
                    attr_sel: param.attr_sel,
                    attr_vals: attrVals.join(' ')
                };
                if (result !== 'confirm') return this.$message.info('取消操作');
                const {data: res} = await editParamData(obj);
                if (res.meta.status !== 200) return this.$message.error('删除参数标签失败');
                param.attr_vals.splice(param.attr_vals.indexOf(tag), 1);
                this.$message.success('删除参数标签成功');
            }
        },
        computed: {
            // 是否禁用添加参数/属性按钮
            isDisabled() {
                if (this.selectedKeys.length !== 3) {
                    return true;
                }
                return false;
            },
            // 当前选中的三级分类的id
            cateId() {
                if (this.selectedKeys.length === 3) {
                    return this.selectedKeys[this.selectedKeys.length - 1];
                }
                return null;
            },
            titleText() {
                return this.activeName === 'many' ? '动态参数' : '静态属性';
            }
        }
    }
</script>

<style lang="less" scoped>
    .cat_opt {
        margin: 15px 0;
    }

    .el-tag {
        margin: 5px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
    }
</style>
