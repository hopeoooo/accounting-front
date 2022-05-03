<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="" prop="gameName">
        <el-select
          v-model="queryParams.type"
          placeholder=""
          style="width: 120px;margin-right:20px;"
        >
          <el-option label="工号查询" value="userName"></el-option>
          <el-option label="姓名查询" value="nickName"></el-option>
        </el-select>
        <el-input
          v-model="queryParams.value"
          placeholder=""
          clearable
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="入职时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="employeeList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="工号" prop="userName" />
      <el-table-column label="姓名" prop="nickName" />
      <el-table-column label="职位" prop="post">
        <template slot-scope="scope">
          <span v-if="scope.row.post">{{ scope.row.post }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="sex">
        <template slot-scope="scope">
          {{ scope.row.sex == 0 ? "男" : scope.row.sex == 2 ? "未知" : "女" }}
        </template>
      </el-table-column>
      <el-table-column label="年龄" prop="brithday">
        <template slot-scope="scope">
          {{ getYear - scope.row.brithday }}
        </template>
      </el-table-column>
      <el-table-column label="籍贯" prop="address">
        <template slot-scope="scope">
          <span v-if="scope.row.address">{{ scope.row.address }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="phonenumber">
        <template slot-scope="scope">
          <span v-if="scope.row.phonenumber">{{ scope.row.phonenumber }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        label="入职时间"
        align="center"
        prop="joinTime"
        width="180"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.joinTime">{{
            scope.row.joinTime.split("T")[0]
          }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-if="open">
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="工号" prop="userName">
              <el-input
                v-model="form.userName"
                placeholder="请输入工号"
                :disabled="openType == 'edit'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="">
                <el-option label="男" :value="0"></el-option>
                <el-option label="女" :value="1"></el-option>
                <el-option label="未知" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                placeholder="请输入联系方式"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 密码和确认密码，如果是修改员工，只有超级管理员可现 -->
        <el-row
          :gutter="0"
          v-if="(openType == 'edit' && user.userId == 1) || openType == 'add'"
        >
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="rawPassword">
              <el-input
                v-model="form.rawPassword"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="籍贯" prop="address">
              <el-input v-model="form.address" placeholder="请输入籍贯" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="post">
              <el-input v-model="form.post" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="权限角色" prop="roleId">
              <el-select v-model="form.roleId" placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期" prop="joinTime">
              <el-date-picker
                style="width:180px"
                v-model="form.joinTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item label="出生年份" prop="brithday">
              <el-date-picker
                v-model="form.brithday"
                type="year"
                value-format="yyyy"
                style="width:180px"
                placeholder="选择年"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="resetBtn">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  dataScope,
  changeRoleStatus
} from "@/api/system/role";
import {
  getEmployeeList,
  addEmployee,
  updateEmployee,
  delEmployee
} from "@/api/account/employee";
import { getRoleList } from "@/api/account/role";

export default {
  name: "employee",

  data() {
    return {
      //当前年份
      getYear: new Date().getFullYear(),
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
      // 角色表格数据
      roleList: [],
      employeeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 弹窗类型: add 新增; edit 修改
      openType: "",
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
        {
          value: "2",
          label: "自定数据权限"
        },
        {
          value: "3",
          label: "本部门数据权限"
        },
        {
          value: "4",
          label: "本部门及以下数据权限"
        },
        {
          value: "5",
          label: "仅本人数据权限"
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        type: "userName",
        value: ""
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapState("user", ["user"]),
    rules() {
      // 表单校验规则
      return {
        userName: [
          { required: true, message: "工号不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        password: [
          {
            required: this.openType == "add" ? true : false,
            message: "密码不能为空",
            trigger: "blur"
          }
          // { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        rawPassword: [
          {
            required: this.openType == "add" ? true : false,
            message: "确认密码不能为空",
            trigger: "blur"
          },
          { validator: this.equalToPassword, trigger: "blur" }
        ],
        roleId: [
          { required: true, message: "请选择权限角色", trigger: "change" }
        ],
        joinTime: [
          { required: true, message: "请选择入职日期", trigger: "change" }
        ]
      };
    }
  },
  methods: {
    equalToPassword(rule, value, callback) {
      if (
        this.form.password &&
        this.form.password != "" &&
        this.form.password !== value
      ) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },
    // 查询角色列表
    getRole() {
      let params = { pageNum: 1, pageSize: 30 };
      getRoleList(params).then(response => {
        this.roleList = response.rows;
        console.log(response.rows);
      });
    },
    /** 查询员工列表 */
    getList() {
      let type = this.queryParams.type;
      let value = this.queryParams.value;
      let createTime = "";
      let endTime = "";
      if (this.dateRange) {
        createTime = this.addDateRange(this.dateRange)[0];
        endTime = this.addDateRange(this.dateRange)[1];
      }

      let params = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };
      if (value) {
        params[type] = value;
      } else {
        params = params;
      }
      params["createTime"] = createTime;
      params["endTime"] = endTime;
      this.loading = true;
      getEmployeeList(params).then(response => {
        this.employeeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 弹窗里的重置按钮
    resetBtn() {
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userName: this.openType == "edit" ? this.form.userName : "",
        nickName: "",
        sex: 0,
        phonenumber: "",
        password: "",
        rawPassword: "",
        address: "",
        post: "",
        roleId: null,
        joinTime: "",
        brithday: "",
        userId: this.user.userId
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
      this.queryParams.value = "";
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.openType = "add";
      this.title = "新增员工";

      this.getRole();
      setTimeout(() => {
        // 移除表单校验结果
        this.$refs.form && this.$refs.form.clearValidate();
      }, 100);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.open = true;
      this.openType = "edit";
      this.title = "编辑员工";
      // this.form = Object.assign({}, row);
      this.form = { ...this.form, ...row };
      this.getRole();
      setTimeout(() => {
        // 移除表单校验结果
        this.$refs.form && this.$refs.form.clearValidate();
      }, 100);
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.openType == "edit") {
            updateEmployee(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEmployee(this.form).then(response => {
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
      const userName = row.userName;
      const userId = row.userId || this.ids;
      this.$modal
        .confirm('是否确认删除工号为"' + userName + '"的员工？')
        .then(function() {
          return delEmployee({ userId: userId });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    }
  }
};
</script>
