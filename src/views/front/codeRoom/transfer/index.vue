<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="fromSearch"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item  :label="$t('Membership-Card-Number')" prop="card">
            <el-input
              v-model="fromSearch.card"
              placeholder=""
              clearable
              style="width: 240px;margin-right:20px"
            />

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

        <el-table
          v-loading="loading"
          :data="userList"
          :row-class-name="status_change"
        >
          <!-- <el-table-column
            fixed
            type="selection"
            key="userId"
            prop="userId"
            width="50"
            align="center"
          /> -->
          <el-table-column
             :label="$t('Membership-Card-Number')"
            align="center"
            key="card"
            prop="card"
          />
          <el-table-column
             :label="$t('Name')"
            align="center"
            key="userName"
            prop="userName"
          />
          <el-table-column
             :label="$t('Staus')"
            align="center"
            key="status"
            prop="status"
            width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">{{$t("Normal")}}</span>
              <span v-else style="color:red">{{$t("Deactivated")}}</span>
            </template>
          </el-table-column>
          <el-table-column
             :label="$t('is-remit')"
            align="center"
            key="isOut"
            prop="isOut"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isOut == 0 ? $t("No") : $t("Yes")}}</span>
            </template>
          </el-table-column>
          <el-table-column
               :label="$t('Remarks')"
            align="center"
            key="remark"
            prop="remark"
            width="150"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.remark" style="text-align:center">{{
                scope.row.remark
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
             :label="$t('Opr')"
            align="center"
            width="260"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope"  >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleIn(scope.row)"
                >{{$t("Remit-in")}}</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleOut(scope.row)"
                >{{$t("Remit-out")}}</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleDetail(scope.row.card)"
                >{{$t('Breakdown')}}</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      v-if="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item  :label="$t('Card-number')"  prop="card">
          <el-input
            v-model="form.card"
            placeholder=""
            style="width:150px"
            :disabled="true"
          />
        </el-form-item>

        <el-form-item
          :label="openType == 'in' ? '$汇入金额' : '$汇出金额'"
          prop="amount"
        >
          <el-input
            v-model="form.amount"
            placeholder=""
             style="width:150px"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          />
        </el-form-item>

        <el-form-item
          :label="openType == 'in' ? '฿汇入金额' : '฿汇出金额'"
          prop="amountTh"
        >
          <el-input
            v-model="form.amountTh"
            placeholder=""
             style="width:150px"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          />
        </el-form-item>

        <el-form-item
          :label="openType == 'in' ? '获取货币' : '使用货币'"
          prop="operationType"
        >
          <el-radio-group v-model="form.operationType">
            <el-radio :label="0">{{$t("Chip")}}</el-radio>
            <el-radio :label="1">{{$t("Cash")}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item   :label="$t('Operation-Remarks')" prop="remark">
          <el-input
            type="textarea"
            :rows="7"
            maxlength="100"
            show-word-limit
            :placeholder="$t('Please-enter-conten')"
            v-model="form.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">{{$t("Cancel")}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRemittance,
  listRemittanceTotal,
  addImport,
  addRemit
} from "@/api/coderoom/transfer";

export default {
  // 汇款
  name: "Transfer",
  data() {
    return {
      // 遮罩层
      loading: false,
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
      userList: [],

      userTotal: "",
      //会员详情
      memlist: {},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 弹窗类型:in 汇入; out 汇出
      openType: "",
      detailOpen: false,
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

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30
      },
      fromSearch: {
        card: null,

      }
    };
  },
  computed: {
    rules() {
      // 表单校验
      return {
        amount: [
          {
            validator: this.amountValitor,
            trigger: "blur"
          }
        ],
        amountTh: [
          {
            validator: this.amountThValitor,
            trigger: "blur"
          }
        ],
        operationType: [
          { required: true, message: "请选择币种", trigger: "change" }
        ]
      };
    }
  },
  watch: {
    // 根据名称筛选部门树
  },
  created() {
    // this.getList();
  },
  methods: {
    amountValitor(rule, value, callback) {
      if (!this.form.amount && !this.form.amountTh) {
        const errMsg =
          this.openType == "in" ? "请输入汇入金额" : "请输入汇出金额";
        callback(new Error(errMsg));
      } else if (this.form.amount && this.form.amount <= 0) {
        callback(new Error(this.$t("Please-enter-a-No-greater-than-0")));
      } else {
        if (
          !this.form.amountTh ||
          (this.form.amountTh && this.form.amountTh > 0)
        ) {
          this.$refs["form"].clearValidate("amountTh");
        }
        callback();
      }
    },
    amountThValitor(rule, value, callback) {
      if (!this.form.amount && !this.form.amountTh) {
        const errMsg =
          this.openType == "in" ? "请输入汇入金额" : "请输入汇出金额";
        callback(new Error(errMsg));
      } else if (this.form.amountTh && this.form.amountTh <= 0) {
        callback(new Error(this.$t("Please-enter-a-No-greater-than-0")));
      } else {
        if (!this.form.amount || (this.form.amount && this.form.amount > 0)) {
          this.$refs["form"].clearValidate("amount");
        }
        callback();
      }
    },
    /** 查询用户列表 */
    getList() {
      let params = Object.assign({}, this.fromSearch, this.queryParams);
      this.loading = true;
      listRemittance(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })
      //  listRemittanceTotal(params).then(response => {
      //     this.userTotal = response.data;

      //     this.loading = false;
      //   }
      // );
      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
    },

    status_change: function(row) {
      if (row.row.signedAmount > 0) {
        return "table-info-red";
      }
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.openType = "";
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        card: "",
        amount: "",
        amountTh: "",
        operationType: "",
        remark: ""
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
      this.fromSearch.card = null;
      this.total = 0;
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 汇入 */
    handleIn(row) {
      this.reset();
      // this.form = Object.assign({},row)
      const { card, status } = row;
      this.form = { ...this.form, ...{ card, status } };
      this.open = true;
      this.openType = "in";
      this.title = this.$t("Remit-in");
    },

    /** 汇出 */
    handleOut(row) {
      this.reset();
      const { card, status, isOut } = row;
      this.form = { ...this.form, ...{ card, status, isOut } };
      this.open = true;
      this.openType = "out";
      this.title = this.$t("Remit-out");
    },

    // 明细
    handleDetail(card) {
      // this.$router.push("TransferInfo")
      this.$router.push({ name: "TransferInfo", query: { card: card } });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.openType == "out") {
        if (this.form.status == 1) {
          // 如果卡号停用，则提示“该卡号已停用”
          this.$modal.msgError(this.$t("card-deactivated"));
          return;
        }

        if (this.form.isOut == 0) {
          // 如果用户不可汇出，则提交的时候，提示“当前用户不可汇出”
          this.$modal.msgError("当前用户不可汇出");
          return;
        }
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form["amount"] = Number(this.form["amount"]);
          this.form["amountTh"] = Number(this.form["amountTh"]);
          if (this.openType == "out") {
            addRemit(this.form)
              .then(response => {
                this.$modal.msgSuccess("汇出成功");
                this.open = false;
                this.getList();
              })
              .catch(err => {
                // this.$modal.msgError("汇入失败");
              });
          } else {
            addImport(this.form)
              .then(response => {
                this.$modal.msgSuccess("汇入成功");
                this.open = false;
                this.getList();
              })
              .catch(err => {
                // this.$modal.msgError("汇入失败");
              });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
.detailBox {
  border: 1px solid #bcbcbc;
  .list {
    border-bottom: 1px solid #bcbcbc;
    span {
      display: inline-block;
      text-align: center;
      width: 49%;
      &:nth-child(1) {
        border-right: 1px solid #bcbcbc;
        width: 50%;
      }
    }
  }
}
.el-table.table2 {
  .el-table__header-wrapper,
  .el-table__body-wrapper {
    display: none;
  }
}
.table-info-red td {
  background: rgb(199, 135, 135);
}
.el-table__row.table-info-red.hover-row td {
  // background-color: transparent !important;
   background: rgb(199, 135, 135)!important;
  cursor: pointer;
}
</style>
