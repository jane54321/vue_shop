<template>
    <div class="add-goods">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"/>
            <el-steps :space="200" align-center :active="activeIndex-0" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addGoodsForm" label-position="top" :rules="addGoodsRules" ref="addGoodsRef">
                <el-tabs @tab-click="tabClicked" v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"/>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodsForm.goods_price" type="number"/>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodsForm.goods_weight" type="number"/>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodsForm.goods_number" type="number"/>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                    v-model="addGoodsForm.goods_cat"
                                    :options="cateList"
                                    :props="cateProps"
                                    @change="handleChange">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyList" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="title" border v-for="title in item.attr_vals"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.id">
                            <el-input v-model="item.attr_vals"/>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action: 表示图片要上传到后台api地址 -->
                        <el-upload
                                :action="uploadURL"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :headers="headerObj"
                                :on-success="handleSuccess"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addGoodsForm.goods_introduce"/>
                        <el-button class="addBtn" type="primary" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览图 -->
        <el-dialog
                title="图片预览"
                width="50%"
                :visible.sync="imgDiaLog">
            <img class="previewImg" :src="showImgURL" alt="图片预览">
        </el-dialog>
    </div>
</template>

<script>
    import {getCategories, getCateData, addGoodsData} from 'network/goods'
    import _ from 'lodash'

    export default {
        name: "AddGoods",
        data() {
            return {
                activeIndex: '0',
                addGoodsForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    // 商品所属的分类数组
                    goods_cat: [],
                    // 所有图片上传的临时路径
                    pics: [],
                    // 商品详情
                    goods_introduce: '',
                    // 存放动态参数和静态属性
                    attrs: []
                },
                addGoodsRules: {
                    goods_name: [
                        { required: true, message: '请输入商品名称', trigger: 'blur' }
                    ],
                    goods_price: [
                        { required: true, message: '请输入商品价格', trigger: 'blur' }
                    ],
                    goods_weight: [
                        { required: true, message: '请输入商品重量', trigger: 'blur' }
                    ],
                    goods_number: [
                        { required: true, message: '请输入商品数量', trigger: 'blur' }
                    ],
                    goods_cat: [
                        { required: true, message: '请选择商品分类', trigger: 'blur' }
                    ]
                },
                cateList: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 动态参数列表数组
                manyList: [],
                // 静态属性列表数组
                onlyList: [],
                // 图片上传的url地址
                uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
                // 图片上传的header请求头
                headerObj: {
                    Authorization : window.sessionStorage.getItem('token')
                },
                // 预览图片url地址
                showImgURL: '',
                // 图片预览图对话框显示与隐藏
                imgDiaLog: false
            }
        },
        created() {
            this.getCateList();
        },
        methods: {
            async getCateList() {
               const {data: res} = await getCategories();
               if (res.meta.status !== 200) return this.$message.error('获取分类数据失败');
               this.cateList = res.data;
            },
            handleChange() {
                if (this.addGoodsForm.goods_cat.length !== 3) {
                    this.addGoodsForm.goods_cat = [];
                }
            },
            // 切换标签之前
            beforeTabLeave(newTab, oldTab) {
                // newTab: 即将进入标签页的名字
                // oldTab: 即将离开标签页的名字
                if (oldTab === '0' && this.addGoodsForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类');
                    return false;
                }
            },
            tabClicked() {
                if (this.activeIndex === '1') {
                    this.getParamsList('many');
                } else if (this.activeIndex === '2') {
                    this.getParamsList('only');
                }
            },
            async getParamsList(type) {
                const {data: res} = await getCateData(this.cateId, type);
                if(res.meta.status !== 200) return this.$message.error('获取参数列表失败');
                if (type === 'many') {
                    res.data.forEach(item => {
                        if (item.attr_vals !== '') {
                            item.attr_vals = item.attr_vals.split(' ');
                        } else {
                            item.attr_vals = [];
                        }
                    });
                    this.manyList = res.data;
                } else {
                    this.onlyList = res.data;
                }
            },
            // 监听点击上传的图片事件
            handlePreview(file) {
                this.showImgURL = file.response.data.url;
                this.imgDiaLog = true;
            },
            // 监听上传图片的移除
            handleRemove(file) {
                const filePath = file.response.data.tmp_path;
                const index = this.addGoodsForm.pics.findIndex(item => {
                    return item.pic === filePath;
                });
                this.addGoodsForm.pics.splice(index, 1);
            },
            // 文件上传成功钩子
            handleSuccess(response) {
                if (response.meta.status !== 200) return this.$message.error('上传图片失败');
                // 拼接得到一个图片对象信息
                // 将图片对象信息push到pics数组中
                const picInfo = {
                    pic : response.data.tmp_path
                };
                this.addGoodsForm.pics.push(picInfo);
            },
            // 添加商品
            addGoods() {
                this.$refs.addGoodsRef.validate(async valid => {
                    if (!valid) return this.$message.error('请填写必要表单信息');
                    this.manyList.forEach(item => {
                        const manyObj = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(' ')
                        };
                        this.addGoodsForm.attrs.push(manyObj);
                    });

                    this.onlyList.forEach(item => {
                        const onlyObj = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals
                        };
                        this.addGoodsForm.attrs.push(onlyObj);
                    });

                    // lodash插件 cloneDeep(obj)深拷贝方法
                    const addForm = _.cloneDeep(this.addGoodsForm);
                    addForm.goods_cat = addForm.goods_cat.join(',');

                    // 发送请求
                    const {data: res} = await addGoodsData(addForm);
                    if (res.meta.status !== 201) return this.$message.error('添加商品失败');
                    this.$message.success('添加商品成功');
                    this.$router.push('/goods');
                });

            }
        },
        computed: {
            cateId() {
                if (this.addGoodsForm.goods_cat.length === 3) {
                    return this.addGoodsForm.goods_cat[this.addGoodsForm.goods_cat.length - 1];
                }
                return null;
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-checkbox {
        margin: 0;
    }

    .previewImg {
        width: 100%;
    }

    .addBtn {
        margin-top: 15px;
    }
</style>
