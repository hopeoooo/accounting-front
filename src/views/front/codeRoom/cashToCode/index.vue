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
          :row-class-name="status_change"
          show-summary
          sum-text="小计"
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
            :label="$t('is-cash-out')"
            align="center"
            key="isCash"
            prop="isCash"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isCash == 0 ? $t("No") : $t("Yes") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Chip-Balance')"
            align="center"
            sortable="custom"
            key="chipAmount"
            prop="chipAmount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.chipAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Chip-Balance')"
            align="center"
            sortable="custom"
            key="chipAmountTh"
            prop="chipAmountTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.chipAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('Remarks')"
            align="center"
            key="remark"
            prop="remark"
            width="150px"
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
            :width="currentLanguage == 'zh' ? '250px' : '300px'"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleBuy(scope.row)"
                >{{ $t("Buy-codes") }}</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleExchange(scope.row)"
                >{{ $t("Cash-Out") }}</el-button
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
      v-if="open"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :show-message="true"
        :label-width="currentLanguage == 'zh' ? '120px' : '200px'"
      >
        <el-form-item :label="$t('Card-number')" prop="card">
          <el-input
            v-model="form.card"
            placeholder=""
            style="width:150px"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          :label="'$' + $t('Buy-in-Chip-Amount')"
          prop="chipAmount"
          v-if="openType == 'buy'"
        >
          <el-input
            v-model="form.chipAmount"
            placeholder=""
            style="width:150px"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          />
        </el-form-item>
        <el-form-item
          :label="'฿' + $t('Buy-in-Chip-Amount')"
          prop="chipAmountTh"
          v-if="openType == 'buy'"
        >
          <el-input
            v-model="form.chipAmountTh"
            placeholder=""
            style="width:150px"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          />
        </el-form-item>
        <el-form-item
          :label="'$' + $t('Cash-Exchange-Amount')"
          prop="chipAmount"
          v-if="openType == 'exchange'"
        >
          <el-input
            v-model="form.chipAmount"
            placeholder=""
            style="width:150px"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          />
        </el-form-item>
        <el-form-item
          :label="'฿' + $t('Cash-Exchange-Amount')"
          prop="chipAmountTh"
          v-if="openType == 'exchange'"
        >
          <el-input
            v-model="form.chipAmountTh"
            placeholder=""
            style="width:150px"
            oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          />
        </el-form-item>

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
        <el-button type="primary" @click="submitForm">{{
          $t("Confirm")
        }}</el-button>
        <el-button @click="cancel">{{ $t("Cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCashChip,
  listCashChipTotal,
  addBuyCode,
  addCashExchange
} from "@/api/coderoom/cashToCode";
import { MoneyFormat } from "@/filter";
import { mapState, mapMutations } from "vuex";
export default {
  name: "CashToCode",
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
      // 弹窗类型:bug 买房; exchange 换现
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
        pageSize: 30,
        orderByColumn: null,
        isAsc: null
      },
      fromSearch: {
        card: "",
        isAdmin: false
      }
    };
  },
  computed: {
    ...mapState("app", ["currentLanguage"]),
    rules() {
      // 表单校验
      return {
        chipAmount: [
          {
            validator: this.chipAmountValitor,
            trigger: "blur"
          }
        ],
        chipAmountTh: [
          {
            validator: this.chipAmountThValitor,
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
    chipAmountValitor(rule, value, callback) {
      if (!this.form.chipAmount && !this.form.chipAmountTh) {
        const errMsg =
          this.openType == "buy"
            ? this.$t("Please-enter-the-amount-of-chip-purchased")
            : this.$t(
                "Please-enter-the-amount-of-cash-you-would-like-to-exchange"
              );
        callback(new Error(errMsg));
      } else if (this.form.chipAmount && this.form.chipAmount <= 0) {
        callback(new Error(this.$t("Please-enter-a-No-greater-than-0")));
      } else {
        if (
          !this.form.chipAmountTh ||
          (this.form.chipAmountTh && this.form.chipAmountTh > 0)
        ) {
          this.$refs["form"].clearValidate("chipAmountTh");
        }
        callback();
      }
    },
    chipAmountThValitor(rule, value, callback) {
      if (!this.form.chipAmount && !this.form.chipAmountTh) {
        const errMsg =
          this.openType == "buy"
            ? this.$t("Please-enter-the-amount-of-chip-purchased")
            : this.$t(
                "Please-enter-the-amount-of-cash-you-would-like-to-exchange"
              );
        callback(new Error(errMsg));
      } else if (this.form.chipAmountTh && this.form.chipAmountTh <= 0) {
        callback(new Error(this.$t("Please-enter-a-No-greater-than-0")));
      } else {
        if (
          !this.form.chipAmount ||
          (this.form.chipAmount && this.form.chipAmount > 0)
        ) {
          this.$refs["form"].clearValidate("chipAmount");
        }
        callback();
      }
    },
    /** 查询用户列表 */
    getList() {
      let params = Object.assign({}, this.fromSearch, this.queryParams);
      params["isAdmin"] = this.fromSearch.isAdmin == false ? 0 : 1;
      this.loading = true;
      listCashChip(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      listCashChipTotal(params)
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
    status_change: function(row) {
      if (row.row.signedAmount > 0) {
        return "table-info-red";
      }
    },
    //总计规则
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t("Tot");
          return;
        }
        if (index === 4) {
          sums[index] = MoneyFormat(this.userTotal.chipAmount);
          return;
        }
        if (index === 5) {
          sums[index] = MoneyFormat(this.userTotal.chipAmountTh);
          return;
        }
      });
      return sums;
    },
    // 小计
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
        if (index == 1 || index == 2 || index == 3 || index == 6) {
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
          if (index === 4) {
            num1 = MoneyFormat(num1);
            num2 = MoneyFormat(this.userTotal.chipAmount);

          }
          if (index === 5) {
            num1 = MoneyFormat(num1);
            num2 = MoneyFormat(this.userTotal.chipAmountTh);

          }
          if (index == 4 || index == 5) {
            const html1 = <div style="margin-bottom:15px ">{num1}</div>;
            const html2 = <div>{num2}</div>;
            sums[index] = [html1, html2];
          } else {
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
        userName: "",
        chipAmount: "",
        chipAmountTh: "",
        isCash: "",
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
      this.fromSearch.isAdmin = 0;
      this.fromSearch.card = "";
      this.queryParams.isAsc = null;
      this.queryParams.orderByColumn = null;
      this.$refs.dataTable.clearSort();
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 买码 */
    handleBuy(row) {
      this.reset();
      // this.form = Object.assign({},row)
      this.form["card"] = row.card;
      this.form["isCash"] = row.isCash;
      this.form["status"] = row.status;
      this.open = true;
      this.openType = "buy";

      this.title = this.$t("Buy-codes");
    },

    /** 换现 */
    handleExchange(row) {
      this.reset();
      // this.form = Object.assign({},row)
      this.form["card"] = row.card;
      this.form["isCash"] = row.isCash;
      this.form["status"] = row.status;
      this.open = true;
      this.openType = "exchange";

      this.title = this.$t("Cash-Out");
    },
    /** 导出按钮操作 */
    handleExport() {
      // 表头对应关系
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        const tHeader = [
          "会员卡号",
          "姓名",
          "状态",
          "$筹码余额",
          "฿筹码余额",
          "是否可换现",
          "备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "userName",
          "status",
          "chipAmount",
          "chipAmountTh",
          "isCash",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `买码换现列表-${time_str}`);
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
          } else if (j == "isCash") {
            return v["isCash"] == 0 ? this.$t("No") : this.$t("Yes");
          } else {
            return v[j];
          }
        })
      );
    },

    // 明细
    handleDetail(card) {
      this.$router.push({ name: "CashInfo", query: { card: card } });
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.openType == "exchange") {
        // 换现
        if (this.form.status == 1) {
          this.$modal.msgError(this.$t("card-deactivated"));
          return;
        } else if (this.form.isCash == 0) {
          this.$modal.msgError("当前会员不可换现");
          return;
        } else {
          this.form["chipAmount"] = Number(this.form["chipAmount"]);
          this.form["chipAmountTh"] = Number(this.form["chipAmountTh"]);
          this.$refs["form"].validate((valid, res) => {
            if (valid) {
              addCashExchange(this.form)
                .then(response => {
                  this.$modal.msgSuccess("换现成功");
                  this.open = false;
                  this.getList();
                })
                .catch(err => {
                  // this.$modal.msgError("换现失败");
                });
            } else {
              //提示校验错误
              // this.$modal.msgError(Object.values(res)[0][0].message);
            }
          });
        }
      } else {
        // 买码
        this.form["chipAmount"] = Number(this.form["chipAmount"]);
        this.form["chipAmountTh"] = Number(this.form["chipAmountTh"]);
        this.$refs["form"].validate((valid, res) => {
          if (valid) {
            addBuyCode(this.form)
              .then(response => {
                this.$modal.msgSuccess("买码成功");
                this.open = false;
                this.getList();
              })
              .catch(err => {
                // this.$modal.msgError("买码失败");
              });
          } else {
            //提示校验错误
            // this.$modal.msgError(Object.values(res)[0][0].message);
          }
        });
      }
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
  background: rgb(199, 135, 135) !important;
  cursor: pointer;
}
</style>
