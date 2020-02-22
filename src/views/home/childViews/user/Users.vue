<template>
    <div class="user">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-input v-model="queryInfo.query" placeholder="请输入内容" @clear="clearQuery" clearable>
                        <el-button slot="append" @click="searchUser" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <el-table :data="userList" border stripe>
                <el-table-column label="#" type="index"/>
                <el-table-column label="姓名" prop="username"/>
                <el-table-column label="邮箱" prop="email"/>
                <el-table-column label="电话" prop="mobile"/>
                <el-table-column label="角色" prop="role_name"/>
                <el-table-column label="状态">
                    <template v-slot="scope">
                        <el-switch @change="userStatus(scope.row)" v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" @click="editUserData(scope.row.id)" size="mini" icon="el-icon-edit"/>
                        <el-button type="danger" @click="delUser(scope.row.id)" size="mini" icon="el-icon-delete"/>
                        <el-tooltip :enterable="false" content="分配角色" placement="top" effect="dark">
                            <el-button type="warning" @click="setUser(scope.row.id)" size="mini"
                                       icon="el-icon-setting"/>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
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

        <!-- 添加用户对话框 -->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogCLose">

            <!-- 添加用户的内容主体 -->
            <el-form :model="addUserFrom" label-width="70px" :rules="userFromRules" ref="addUserFromRef">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserFrom.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserFrom.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserFrom.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addUserFrom.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%"
                @close="editDialogCLose">

            <!-- 修改用户的内容主体 -->
            <el-form :model="editUserFrom" label-width="70px" :rules="userFromRules" ref="editUserFromRef">
                <el-form-item label="用户名">
                    <el-input :value="editUserFrom.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserFrom.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editUserFrom.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getUsersData, modifyStatus, addUserData, getUserData, editUserData, delUserData} from "network/user";

    export default {
        name: "Users",
        data() {
            // 自定义校验规则(必须放上面)
            // 手机号码的验证规则
            let checkMobile = (rule, value, callback) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (!regMobile.test(value)) {
                    callback(new Error('请输入正确的手机号码'));
                }
                callback();
            };
            return {
                // 获取用户列表的参数对象
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                userList: [],
                total: 0,
                state: false,
                // 添加用户对话框显示与隐藏
                addDialogVisible: false,
                // 添加用户表单数据
                addUserFrom: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                //添加表单验证
                userFromRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入用户密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['change', 'blur'] }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机号码', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }
                    ]
                },
                // 修改用户对话框显示与隐藏
                editDialogVisible: false,
                // 点击编辑展示用户表单数据
                editUserFrom: {}
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            async getUserList() {
                const {data: res} = await getUsersData(this.queryInfo);
                if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!');
                this.userList = res.data.users;
                this.total = res.data.total;
            },
            // 点击确定添加用户
            addUser() {
                // 表单预校验
                this.$refs.addUserFromRef.validate(async valid => {
                    if(!valid) return;
                    // 发起添加用户的网络请求
                    const {data: res} = await addUserData(this.addUserFrom);
                    if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
                    this.$message.success('添加用户成功');
                    this.getUserList(); // 重新获取用户列表数据
                    this.addDialogVisible = false; // 关闭对话框
                })
            },
            // 点击编辑按钮,弹出对话框并展示当前用户信息
            async editUserData(id) {
                const {data: res} = await getUserData(id);
                if (res.meta.status !== 200) return this.$message.error('查询用户信息失败');
                this.editUserFrom = res.data;
                this.editDialogVisible = true;
            },
            // 编辑用户
            editUser() {
                // 表单预校验
                this.$refs.editUserFromRef.validate(async valid => {
                    if(!valid) return;
                    // 发起添加用户的网络请求
                    const {data: res} = await editUserData(this.editUserFrom);
                    if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                    this.editDialogVisible = false; // 关闭对话框
                    this.$message.success('修改用户成功');
                    this.getUserList(); // 重新获取用户列表数据
                })
            },
            // 删除用户
            async delUser(id) {
                const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

                if (result !== 'confirm') return this.$message.info('取消删除');
                const {data: res} = await delUserData(id);
                if (res.meta.status !== 200) return this.$message.error('删除用户失败');
                this.$message.success('删除用户成功');
                this.queryInfo.pagenum = 1;
                this.getUserList();
            },
            // 监听用户状态改变
            async userStatus(userInfo) {
                const {data: res} = await modifyStatus(userInfo);
                if (res.meta.status !== 200) {
                    userInfo.mg_state = !userInfo.mg_state;
                    return this.$message.error('修改用户状态失败!');
                }
                this.$message.success('修改用户状态成功!');
            },
            // 设置用户
            setUser(id) {
                console.log(id);
            },
            // 修改每页显示条数时触发
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            // 切换页码时触发
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList();
            },
            // 清空搜索内容
            clearQuery() {
                this.getUserList();
            },
            // 搜索用户
            searchUser() {
                this.queryInfo.pagenum = 1;
                this.getUserList();
            },
            // 监听关闭对话框,重置表单
            addDialogCLose() {
                this.$refs.addUserFromRef.resetFields();
            },
            editDialogCLose() {
                this.$refs.editUserFromRef.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
