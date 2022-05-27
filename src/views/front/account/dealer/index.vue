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
          style="width: 150px;margin-right:20px;"
        >
          <el-option :label="$t('Job-Search')" value="userName"></el-option>
          <el-option :label="$t('Name-Search')" value="nickName"></el-option>
        </el-select>
        <el-input
          v-model="queryParams.value"
          placeholder=""
          clearable
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item  :label="$t('Ent-Tm')">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          :start-placeholder="$t('start-time')"
          :end-placeholder="$t('end-time')"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >{{$t("Enq")}}</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >{{$t("Rst")}}</el-button
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
          >{{$t('Add-New')}}</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="employeeList">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column :label="$t('Work Number')" prop="userName" />
      <el-table-column  :label="$t('Name')"  prop="nickName" />
      <!-- <el-table-column :label="$t('Position')" prop="post">
        <template slot-scope="scope">
          <span v-if="scope.row.post">{{ scope.row.post }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('Gender')" prop="sex">
        <template slot-scope="scope">
          {{ scope.row.sex == 0 ? $t('male') : scope.row.sex == 2 ? $t('unknown') : $t('female') }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Age')" prop="brithday">
        <template slot-scope="scope">
          {{ scope.row.brithday ? getYear - scope.row.brithday : "--" }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('Origin')" prop="address">
        <template slot-scope="scope">
          <span v-if="scope.row.address">{{ scope.row.address }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column  :label="$t('Contact-details')" prop="phonenumber">
        <template slot-scope="scope">
          <span v-if="scope.row.phonenumber">{{ scope.row.phonenumber }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
         :label="$t('Ent-Tm')"
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
         :label="$t('Opr')"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >{{$t('Edit')}}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >{{$t('Del')}}</el-button
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      @close="onDialogClose"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="150px"
        v-if="open"
      >
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('Work Number')" prop="userName">
              <el-input
                v-model="form.userName"
                :placeholder="$t('enter-work-no')"
                :disabled="openType == 'edit'"

              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  :label="$t('Name')"  prop="nickName">
              <el-input v-model="form.nickName"  :placeholder="$t('enter-name')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('Gender')" prop="sex">
              <el-select v-model="form.sex" placeholder="">
                <el-option :label="$t('male')" :value="0"></el-option>
                <el-option :label="$t('female')" :value="1"></el-option>
                <!-- <el-option label="未知" :value="2"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Contact-details')" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                :placeholder="$t('enter-contact')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 密码和确认密码，如果是修改员工，只有超级管理员可现 -->
      
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('Origin')" prop="address">
              <el-input v-model="form.address" :placeholder="$t('enter-origin')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Position')" prop="post">
              <el-input v-model="form.post" :placeholder="$t('enter-position')"  />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
  
          <el-col :span="12">
            <el-form-item :label="$t('Ent-Tm')" prop="joinTime">
              <el-date-picker
                style="width:180px"
                v-model="form.joinTime"
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="$t('Please-select')"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
       
          <el-col :span="12">
            <el-form-item :label="$t('Y0B')" prop="brithday">
              <el-date-picker
                v-model="form.brithday"
                type="year"
                value-format="yyyy"
                style="width:180px"
                 :placeholder="$t('Please-select')"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="submitForm">{{$t('OK')}}</el-button>
        <el-button @click="resetBtn">{{$t("Rst")}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
  getDealerList,
  addDealer,
  updateDealer,
  delDealer
} from "@/api/account/dealer";
import { getRoleList } from "@/api/account/role";

export default {
  name: "Dealer",

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
      // 初始化的表单参数，用于重置时还原
      initForm: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getFullYear() > new Date().getFullYear();
        }
      }
    };
  },
  created() {
    this.getList();
    this.getRole();
  },
  computed: {
    ...mapState("user", ["user"]),
    rules() {
      // 表单校验规则
      return {
        userName: [
          { required: true, message:this.$t("The-job-number-cannot-be-empty"), trigger: "blur" }
        ],
        nickName: [
          { required: true, message: this.$t("Name-cannot-be-empty"), trigger: "blur" }
        ],
        password: [
          {
            required: this.openType == "add" ? true : false,
            message: this.$t("Password-cannot-be-empty"),
            trigger: "blur"
          }
          // { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        rawPassword: [
          {
            required: this.openType == "add" ? true : false,
            message: this.$t("Confirm-password-cannot-be-empty"),
            trigger: "blur"
          },
          { validator: this.equalToPassword, trigger: "blur" }
        ],
        roleId: [
          { required: true, message: this.$t("Please-select-the-role-of-authority"), trigger: "change" }
        ],
        joinTime: [
          { required: true, message:this.$t("Please-select-a-start-date"), trigger: "change" }
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
        callback(new Error( this.$t("Password-entered-twice-does-not-match")));
      } else {
        callback();
      }
    },
    // 查询角色列表
    getRole() {
      let params = { pageNum: 1, pageSize: 50 };
      getRoleList(params).then(response => {
        this.roleList = response.rows;
        console.log(response.rows);
      });
    },
    /** 查询员工列表 */
    getList() {
      let type = this.queryParams.type;
      let value = this.queryParams.value;
      let beginTime = "";
      let endTime = "";
      if (this.dateRange) {
        beginTime = this.addDateRange(this.dateRange)[0];
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
      params["beginTime"] = beginTime;
      params["endTime"] = endTime;
      this.loading = true;
      getDealerList(params).then(response => {
        this.employeeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 弹窗里的重置按钮
    resetBtn() {
      if (this.openType == "edit") {
        this.form = Object.assign({}, this.initForm);
      }
      if (this.openType == "add") {
        this.reset();
      }
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 弹窗关闭时
    onDialogClose() {
      this.openType = "";
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
      this.openType = "add";
      this.open = true;
      this.title = this.$t('Add-new-employee');

      // this.getRole();
      setTimeout(() => {
        // 移除表单校验结果
        this.$refs.form && this.$refs.form.clearValidate();
      }, 100);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.openType = "edit";
      this.open = true;
      this.title =this.$t('Edit-employee');
      // this.form = Object.assign({}, row);
      this.form = { ...this.form, ...row };
      this.initForm = { ...this.form, ...row };
      // this.getRole();
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
            updateDealer(this.form).then(response => {
              this.$modal.msgSuccess(this.$t("Modified-successfully"));
              this.open = false;
              this.getList();
            });
          } else {
            addDealer(this.form).then(response => {
              this.$modal.msgSuccess(this.$t("Add-success"));
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
        .confirm( this.$t("confirmed-delete-employee")+ userName + '？')
        .then(function() {
          return delDealer({ userId: userId });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("Deletion-successful"));
        })
        .catch(() => {});
    }
  }
};
</script>
