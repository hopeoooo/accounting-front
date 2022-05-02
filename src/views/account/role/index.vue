<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >新增角色</el-button
            >
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="roleList">
          <el-table-column
            label="角色"
            align="center"
            key="roleName"
            prop="roleName"
            width="160"
          />
          <el-table-column
            label="描述"
            align="center"
            key="remark"
            prop="remark"
          />

          <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="260"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <!-- v-if  每次打开弹窗重新加载dom -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      v-if="open"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="角色" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="form.remark"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="菜单权限">
              <el-checkbox
                v-model="menuExpand"
                @change="handleCheckedTreeExpand($event)"
                >展开/折叠</el-checkbox
              >
              <el-checkbox
                v-model="menuNodeAll"
                @change="handleCheckedTreeNodeAll($event)"
                >全选/全不选</el-checkbox
              >
              <!-- <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event)">父子联动</el-checkbox> -->
              <el-tree
                class="tree-border"
                :data="treelist"
                show-checkbox
                ref="menu"
                node-key="id"
                :check-strictly="!form.menuCheckStrictly"
                empty-text="加载中，请稍候"
                :props="defaultProps"
              ></el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTree,
  getRoleList,
  getRoleMenuTree,
  addRole,
  updateRole,
  delRole
} from "@/api/account/role";
import { getToken } from "@/utils/auth";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      roleList: null,
      //获取菜单列表
      treelist: {},
      menuList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 获取角色菜单列表树
      treeRolelist: {},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30
      },
      // 表单校验
      rules: {},
      selectChangeAll: false,
      menuExpand: false,
      menuNodeAll: false
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.gettreelist();
  },
  methods: {
    // 获取菜单列表
    gettreelist() {
      this.loading = true;
      getTree().then(response => {
        this.treelist = response.data;
        this.loading = false;
      });
    },

    /** 查询角色列表 */
    getList() {
      this.loading = true;
      getRoleList().then(response => {
        this.roleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 节点点击
    handleNodeClick(data) {
      console.log(data);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        roleName: "",
        remark: "",
        menuIds: [],
        menuCheckStrictly: true
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      console.log(this.form, this.treelist);
      this.open = true;
      this.title = "新增角色";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = Object.assign({}, row);
      this.form["menuCheckStrictly"] = true;
      this.$nextTick(() => {
        getRoleMenuTree(row.roleId).then(response => {
          this.form["menuIds"] = response.checkedKeys;
          console.log(this.$refs.menu);
          this.form["menuIds"].forEach(v => {
            this.$nextTick(() => {
              this.$refs.menu.setChecked(v, true, false);
            });
          });
          this.loading = false;
        });
      });
      console.log(this.form);
      this.open = true;
      this.title = "角色修改";
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$delete(this.form, "menuCheckStrictly");
          this.form.menuIds = this.getMenuAllCheckedKeys();
          if (this.title == "角色修改") {
            this.$delete(this.form, "createTime");
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRole(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.roleId || this.ids;
      this.$modal
        .confirm("是否确认该角色？")
        .then(function() {
          return delRole({ roleId: userIds });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      let treeList = this.treelist;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedNodes(value ? this.treelist : []);
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value) {
      this.form.menuCheckStrictly = value ? true : false;
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    }
  }
};
</script>
