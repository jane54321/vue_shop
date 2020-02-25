<template>
    <div class="roles">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-button type="primary">添加角色</el-button>
            <el-table :data="rolesList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template v-slot="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop': '', 'vcenter']" v-for="(one, i1) in scope.row.children" :key="one.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row, one.id)" closable>
                                    {{one.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[i2 !== 0 ? 'bdtop': '', 'vcenter']" v-for="(two, i2) in one.children" :key="two.id">
                                    <el-col :span="6">
                                        <el-tag type="success" @close="removeRightById(scope.row, two.id)" closable>
                                            {{two.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag @close="removeRightById(scope.row, three.id)" closable type="warning" v-for="(three, i3) in two.children" :key="three.id">
                                            {{three.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="#" type="index"/>
                <el-table-column label="角色名称" prop="roleName"/>
                <el-table-column label="角色描述" prop="roleDesc"/>
                <el-table-column label="操作" width="300px">
                    <template v-slot="scope">
                        <el-button type="primary" @click="editUserData(scope.row.id)" size="mini" icon="el-icon-edit">编辑</el-button>
                        <el-button type="danger" @click="delUser(scope.row.id)" size="mini" icon="el-icon-delete">删除</el-button>
                        <el-button type="warning" @click="showSetRightDialog(scope.row)" size="mini" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog
                title="分配权限"
                :visible.sync="rightDialog"
                width="50%"
                @close="setRightDialogClose">
            <el-tree ref="treeRef" :default-checked-keys="defKeys" default-expand-all node-key="id" show-checkbox :data="rightsList" :props="treeProps"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rightDialog = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getRolesData, removeRightData, getRightsData, roleAuthorization } from "network/power";

    export default {
        name: "Roles",
        data() {
            return {
                // 所有角色列表数据
                rolesList: [],
                rightDialog: false,
                // 获取所有权限的数据
                rightsList: [],
                // 树形控件的属性绑定对象
                treeProps: {
                    children: 'children',
                    label: 'authName'
                },
                // 默认选中
                defKeys: [],
                // 当前即将分配权限的角色id
                roleId: ''
            }
        },
        created() {
            this.getRolesList();
        },
        methods: {
            async getRolesList() {
                const {data: res} = await getRolesData();
                if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
                this.rolesList = res.data;
            },
            /**
             * 根据id删除三级分类
             * @param role number 角色数据
             * @param rightId number 权限id
             */
            async removeRightById(role, rightId) {
                const result = await this.$confirm('此操作会永久删除该权限,是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (result !== 'confirm') return this.$message.info('取消操作');
                const {data: res} = await removeRightData(role.id, rightId);
                if (res.meta.status !== 200) return this.$message.error('删除权限失败');
                role.children = res.data;
                this.$message.success('删除权限成功');
            },
            // 点击分配全选,弹出对话框
            async showSetRightDialog(role) {
                // 获取所有权限的数据
                const {data: res} = await getRightsData('tree');
                if (res.meta.status !== 200) return this.$message.error('获取权限数据失败');
                this.rightsList = res.data;
                this.roleId = role.id;
                this.getLeafKeys(role, this.defKeys);
                this.rightDialog = true;
            },
            // 通过递归的形式, 获取角色下所有三级权限id
            getLeafKeys(node, arr) {
                // 是3级节点，将id加入到数组中
                if (!node.children) return arr.push(node.id);
                for (let item of node.children) {
                    this.getLeafKeys(item, arr);
                }
            },
            setRightDialogClose() {
                this.defKeys = [];
            },
            // 点击为角色分配权限
            async allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ];
                const idStr = keys.join(','); // 以,号分割组成字符串
                const {data: res} = await roleAuthorization(this.roleId, idStr);
                if (res.meta.status !== 200) return this.$message.error('更新权限失败');
                this.getRolesList();
                this.rightDialog = false;
                this.$message.success('更新权限成功');
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>
