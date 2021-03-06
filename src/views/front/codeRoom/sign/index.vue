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
          label-width="80px"
        >
          <el-form-item :label="$t('Membership-Card-Number')" prop="card">
            <el-input
              v-model="fromSearch.card"
              placeholder=""
              clearable
              style="width: 240px;margin-right:20px"
            />
            <el-checkbox v-model="fromSearch.isAdmin">{{
              $t("Filter-internal-card")
            }}</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >{{ $t("Enq") }}</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
              $t("Rst")
            }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >{{ $t("Export") }}</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          show-summary
          :summary-method="getSummaries1"
          @sort-change="onSortChange"
          ref="dataTable"
          :empty-text="$t('no-data')"
        >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
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
           :width="currentLanguage == 'zh' ? '' : '120px'"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">{{ $t("Normal") }}</span>
              <span v-else style="color:red">{{ $t("Deactivated") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Signed-amount')"
            align="center"
            sortable="custom"
            key="signedAmount"
            prop="signedAmount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.signedAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Signed-amount')"
            align="center"
            sortable="custom"
            key="signedAmountTh"
            prop="signedAmountTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.signedAmountTh | MoneyFormat }}</span>
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
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleSign(scope.row)"
                >{{ $t("Signing") }}</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row)"
                >{{ $t("Returns") }}</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleDetail(scope.row.card)"
                >{{ $t("Breakdown") }}</el-button
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      :width="currentLanguage == 'zh' ? '500px' : '600px'"
      append-to-
      :close-on-click-modal="false"
      v-if="open"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :show-message="true"
        :label-width="currentLanguage == 'zh' ? '100px' : '200px'"
      >
        <el-form-item :label="$t('Card-number')" prop="card">
          <el-input
            v-model="form.card"
            placeholder=""
            style="width:150px"
            :disabled="true"
          />
        </el-form-item>
        <!-- 签单 -->
        <el-form-item
          :label="'$' + $t('Signed-amount')"
          prop="amount"
          v-if="openType == 'sign'"
        >
          <el-input
            v-model="form.amount"
            placeholder=""
            style="width:150px"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          />
        </el-form-item>
        <el-form-item
          :label="'฿' + $t('Signed-amount')"
          prop="amountTh"
          v-if="openType == 'sign'"
        >
          <el-input
            v-model="form.amountTh"
            placeholder=""
            style="width:150px"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          />
        </el-form-item>

        <!-- 还单 -->
        <div style="display:flex" v-if="openType == 'back'">
          <el-form-item :label="'$' + $t('Signed-amount')" prop="signedAmount">
            <el-input
              v-model="form.signedAmount"
              placeholder=""
              :disabled="true"
            />
          </el-form-item>
          <el-form-item :label="'$' + $t('Return-amount')" prop="amount">
            <el-input
              v-model="form.amount"
              placeholder=""
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              :disabled="form.signedAmount == 0"
            />
          </el-form-item>
        </div>

        <div style="display:flex" v-if="openType == 'back'">
          <el-form-item
            :label="'฿' + $t('Signed-amount')"
            prop="signedAmountTh"
          >
            <el-input
              v-model="form.signedAmountTh"
              placeholder=""
              :disabled="true"
            />
          </el-form-item>
          <el-form-item :label="'฿' + $t('Return-amount')" prop="amountTh">
            <el-input
              v-model="form.amountTh"
              placeholder=""
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              :disabled="form.signedAmountTh == 0"
            />
          </el-form-item>
        </div>

        <el-form-item :label="$t('Operation-Remarks')" prop="remark">
          <el-input
            type="textarea"
            :rows="7"
            :placeholder="$t('Please-enter-content')"
            v-model="form.remark"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="
            openType == 'back' &&
              form.signedAmount == 0 &&
              form.signedAmountTh == 0
          "
          >{{ $t("Confirm") }}</el-button
        >
        <el-button @click="cancel">{{ $t("Cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSign,
  listSignTotal,
  addSigned,
  addReturnOrder
} from "@/api/coderoom/sign";
import { MoneyFormat } from "@/filter";
import { mapState, mapMutations } from "vuex";
const fieldMap = {
  amount: "signedAmount",
  amountTh: "signedAmountTh"
};
export default {
  // 签单
  name: "Sign",
  data() {
    return {
      // 添加卡号
      isMain: false,
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
      // 弹窗类型:sign 签单; back 还单
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
      fromSearch: {
        card: "",
        isAdmin: false
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        orderByColumn: null,
        isAsc: null
      }
    };
  },
  computed: {
    ...mapState("app", ["currentLanguage"]),
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
            validator: this.amountValitor,
            trigger: "blur"
          }
        ]
      };
    }
  },
  watch: {
    // 根据名称筛选部门树
  },
  created() {
    this.getList();
  },
  methods: {
    amountValitor(rule, value, callback) {
      // 签单/还单数字校验
      if (this.openType == "sign") {
        // 签单的校验规则
        if (!this.form.amount && !this.form.amountTh) {
          callback(new Error(this.$t("Please-enter-the-amount-of-your-order")));
        } else if (value && value <= 0) {
          callback(new Error(this.$t("Please-enter-a-No-greater-than-0")));
        } else {
          callback();
        }
      } else {
        // 还单的校验规则
        const field = fieldMap[rule.field];
        if (!this.form.amount && !this.form.amountTh) {
          callback(
            new Error(this.$t("Please-enter-the-amount-of-the-return-order"))
          );
        } else if (value && value <= 0) {
          callback(new Error(this.$t("Please-enter-a-No-greater-than-0")));
        } else if (value && value > this.form[field]) {
          callback(new Error(this.$t("Please-enter-the-correct-amount")));
        } else {
          callback();
        }
      }
    },
    /** 查询用户列表 */
    getList() {
      let params = Object.assign({}, this.fromSearch, this.queryParams);
      params["isAdmin"] = this.fromSearch.isAdmin == false ? 0 : 1;
      this.loading = true;
      listSign(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      listSignTotal(params)
        .then(response => {
          this.userTotal = response.data;

          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
    },

    // status_change: function (row) {
    //         if (row.row.signedAmount > 0) {
    //           return 'table-info-red'
    //         }
    // },

    // 小计规则
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          const html1 = (
            <div style="margin-bottom:15px ">{this.$t("Subtotal")}</div>
          );
          const html2 = <div>{this.$t("Tot")}</div>;
          sums[index] = [html1, html2];
          return;
        }
        if (index === 1 || index === 2 || index === 5) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          let num1 = ""; // 小计结果
          let num2 = ""; // 总计结果
          num1 = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              const pel = prev + curr; // 主要代码
              return pel;
            } else {
              // return prev;
              const pel = prev; // 主要代码
              return pel;
            }
          }, 0);

          if (index === 3) {
            num1 = MoneyFormat(num1);
            num2 = MoneyFormat(this.userTotal.signedAmount);
          }
          if (index === 4) {
            num1 = MoneyFormat(num1);
            num2 = MoneyFormat(this.userTotal.signedAmountTh);
          }

          if (index == 3 || index == 4) {
            const html1 = <div style="margin-bottom:15px ">{num1}</div>;
            const html2 = <div>{num2}</div>;
            sums[index] = [html1, html2];
          }else {
            sums[index] = "";
          }
        } else {
          // sums[index] = 'N/A';
        }
      });
      return sums;
    },
    // 排序改变时
    onSortChange({ column, prop, order }) {
      this.queryParams.isAsc = order;
      this.queryParams.orderByColumn = prop;
      this.getList();
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
        remark: "",
        amount: "",
        amountTh: ""
      };
      this.resetForm("form");
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.fromSearch.isAdmin = 0;
      this.fromSearch.card = "";
      this.queryParams.isAsc = null;
      this.queryParams.orderByColumn = null;
      this.$refs.dataTable.clearSort();
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 签单 */
    handleSign(row) {
      this.reset();
      const { card, status, signedAmount, signedAmountTh } = row;
      this.form = {
        ...this.form,
        ...{ card, status, signedAmount, signedAmountTh }
      };
      this.open = true;
      this.openType = "sign";
      this.title = this.$t("Signing");
    },

    /** 还单 */
    handleBack(row) {
      this.reset();
      const { card, status, signedAmount, signedAmountTh } = row;
      this.form = {
        ...this.form,
        ...{ card, status, signedAmount, signedAmountTh }
      };
      this.open = true;
      this.openType = "back";
      this.title = this.$t("Returns");
    },
    // 明细
    handleDetail(card) {
      //TODO: 前往明细表
      this.$router.push({ name: "SignInfo", query: { card: card } });
    },
    /** 导出按钮操作 */
    handleExport() {
      // 表头对应关系
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        const tHeader = [
         this.$t('Membership-Card-Number'),
         this.$t('Name'),
         this.$t('Staus'),
         '$' + this.$t('Signed-amount'),
         '฿' + this.$t('Signed-amount'),
         this.$t('Remarks')
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "userName",
          "status",
          "signedAmount",
          "signedAmountTh",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, this.$t('Sign-Up-List')+`-${time_str}`);
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j == "status") {
            return v["status"] == 0
              ? this.$t("Normal")
              : this.$t("Deactivated");
          } else {
            return v[j];
          }
        })
      );
    },

    /** 提交按钮 */
    submitForm: function() {
      if (this.openType == "sign") {
        if (this.form.status == 1) {
          this.$modal.msgError(this.$t("card-deactivated"));
          return;
        }
      }
      // if (this.openType == "back") {
      //   if (this.form.signedAmount == 0 && this.form.signedAmountTh == 0) {
      //     this.$modal.msgError("当前无需还单金额");
      //     return;
      //   }
      // }
      this.$refs["form"].validate((valid, res) => {
        if (valid) {
          if (this.openType == "back") {
            // 还单
            this.form["amount"] = Number(this.form["amount"]);
            this.form["amountTh"] = Number(this.form["amountTh"]);
            addReturnOrder(this.form)
              .then(response => {
                this.$modal.msgSuccess("还单成功");
                this.open = false;
                this.openType = "";
                this.getList();
              })
              .catch(err => {
                // this.$modal.msgError("还单失败");
              });
          } else {
            // 签单
            this.form["amount"] = Number(this.form["amount"]);
            this.form["amountTh"] = Number(this.form["amountTh"]);
            addSigned(this.form)
              .then(response => {
                this.$modal.msgSuccess("签单成功");
                this.open = false;
                this.openType = "";
                this.getList();
              })
              .catch(err => {
                // this.$modal.msgError("签单失败");
              });
          }
        } else {
          //提示校验错误
          // this.$modal.msgError(Object.values(res)[0][0].message);
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
  // background: rgb(199, 135, 135);
}
.el-table__row.table-info-red.hover-row td {
  // background-color: transparent !important;
  background: rgb(199, 135, 135) !important;
  cursor: pointer;
}
</style>
