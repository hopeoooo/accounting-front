<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          :label-width="currentLanguage == 'zh' ? '' : '80px'"
        >
          <el-form-item :label="$t('Membership-Card-Number')" prop="card">
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 120px;margin-right:10px"
            />

            <el-checkbox v-model="queryParams.isAdmin">{{
              $t("Filter-internal-card")
            }}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('Operation')" prop="type">
            <el-select
              v-model="queryParams.type"
              :placeholder="$t('All')"
              style="width:120px"
            >
              <el-option :label="$t('All')" :value="null"></el-option>
              <el-option :label="$t('Remit-in')" :value="11"></el-option>
              <el-option :label="$t('Remit-out')" :value="12"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('currency-Type')" prop="type">
            <el-select
              v-model="queryParams.operationType"
              :placeholder="$t('All')"
              style="width:120px"
            >
              <el-option :label="$t('All')" :value="null"></el-option>
              <el-option :label="$t('Chip')" :value="0"></el-option>
              <el-option :label="$t('Cash')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('operation-time')"
            :label-width="currentLanguage == 'zh' ? '' : '120px'"
          >
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
          :sum-text="$t('Subtotal')"
          :summary-method="getSummaries1"
          :empty-text="$t('no-data')"
        >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column
            :label="$t('Membership-Card-Number')"
            align="center"
            key="card"
            prop="card"
            :width="currentLanguage == 'zh' ? '100px' : '100px'"
          />
          <el-table-column
            :label="$t('Name')"
            align="center"
            key="userName"
            prop="userName"
            :width="currentLanguage == 'zh' ? '100px' : '110px'"
          />
          <el-table-column
            :label="$t('Type')"
            align="center"
            key="type"
            prop="type"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type == '11'">{{ $t("Remit-in") }}</span>
              <span v-if="scope.row.type == '12'">{{ $t("Remit-out") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('currency-Type')"
            align="center"
            key="operationType"
            prop="operationType"
            :width="currentLanguage == 'zh' ? '100px' : '100px'"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.operationType == 0">{{ $t("Chip") }}</span>
              <span v-if="scope.row.operationType == 1">{{ $t("Cash") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Amount')"
            align="center"
            key="amount"
            prop="amount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.amount | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="'฿' + $t('Amount')"
            align="center"
            key="amountTh"
            prop="amountTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.amountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('operation-time')"
            align="center"
            key="operationTime"
            prop="operationTime"
          />

          <el-table-column
            :label="$t('Operator')"
            align="center"
            key="createBy"
            prop="createBy"
          />

          <el-table-column
            :label="$t('Operation-Remarks')"
            align="center"
            key="remark"
            prop="remark"
            :width="currentLanguage == 'zh' ? '150px' : '180px'"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.remark" style="text-align:center">{{
                scope.row.remark
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 用于渲染总计 -->
        <el-table
          v-loading="loading"
          :data="userList"
          class="table2"
          show-summary
          :sum-text="$t('Tot')"
          :summary-method="getSummaries"
        >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column
            :label="$t('Membership-Card-Number')"
            align="center"
            key="card"
            prop="card"
            :width="currentLanguage == 'zh' ? '100px' : '100px'"
          />
          <el-table-column
            :label="$t('Name')"
            align="center"
            key="userName"
            prop="userName"
            :width="currentLanguage == 'zh' ? '100px' : '110px'"
          />
          <el-table-column
            :label="$t('Type')"
            align="center"
            key="type"
            prop="type"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type == '11'">{{ $t("Remit-in") }}</span>
              <span v-if="scope.row.type == '12'">{{ $t("Remit-out") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('currency-Type')"
            align="center"
            key="operationType"
            prop="operationType"
            :width="currentLanguage == 'zh' ? '100px' : '100px'"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.operationType == 0">{{ $t("Chip") }}</span>
              <span v-if="scope.row.operationType == 1">{{ $t("Cash") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Amount')"
            align="center"
            key="amount"
            prop="amount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.amount | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="'฿' + $t('Amount')"
            align="center"
            key="amountTh"
            prop="amountTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.amountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('operation-time')"
            align="center"
            key="operationTime"
            prop="operationTime"
          />

          <el-table-column
            :label="$t('Operator')"
            align="center"
            key="createBy"
            prop="createBy"
          />

          <el-table-column
            :label="$t('Operation-Remarks')"
            align="center"
            key="remark"
            prop="remark"
            :width="currentLanguage == 'zh' ? '150px' : '180px'"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.remark" style="text-align:center">{{
                scope.row.remark
              }}</span>
              <span v-else>--</span>
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
  </div>
</template>

<script>
import {
  listRemittanceDetailed,
  listRemittanceDetailedTotal
} from "@/api/report/report";
import { MoneyFormat } from "@/filter";
import moment from "moment";
import { mapState, mapMutations } from "vuex";
export default {
  // 汇款明细表
  name: "TransferInfo",
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
      detailOpen: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围 默认今日
      dateRange: [
        moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD"),
        moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD")
      ],
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
      queryParams: {
        card: this.$route.query.card ? this.$route.query.card : "",
        isAdmin: 0,
        type: null,
        operationType: null,
        // dateRange: [],
        pageNum: 1,
        pageSize: 30
      }
    };
  },
  computed: {
    ...mapState("app", ["currentLanguage"])
  },
  watch: {
    // 根据名称筛选部门树
  },
  created() {
    this.getList();
  },

  methods: {
    /** 查询明细列表 */
    getList() {
      let params = {
        card: this.queryParams.card,
        type: this.queryParams.type,
        isAdmin: this.queryParams.isAdmin == false ? 0 : 1,
        operationType: this.queryParams.operationType,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        startTime: this.dateRange ? this.addDateRange(this.dateRange)[0] : null,
        endTime: this.dateRange ? this.addDateRange(this.dateRange)[1] : null
      };

      this.loading = true;
      listRemittanceDetailed(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      listRemittanceDetailedTotal(params)
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

    //  小计规则
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t("Subtotal");
          // return;
        } else if (index == 4 || index == 5) {
          // 只有第4、5列的金额 才需要小计
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
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
            sums[index] += "";
            if (index == 4 || index == 5) {
              // 结算洗码费金额需要保留两位小数点
              sums[index] = MoneyFormat(sums[index]);
            }
          } else {
            // sums[index] = 'N/A';
          }
        } else {
          sums[index] = "";
        }
      });
      return sums;
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
          sums[index] = MoneyFormat(this.userTotal.amount);
          return;
        }
        if (index === 5) {
          sums[index] = MoneyFormat(this.userTotal.amountTh);
          return;
        }
      });
      return sums;
    },

    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [
        moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD"),
        moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD")
      ];
      this.queryParams = {
        card: "",
        isAdmin: 0,
        type: null,
        operationType: null,
        pageNum: 1,
        pageSize: this.queryParams.pageSize
      };
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 导出按钮操作 */
    handleExport() {
      // 表头对应关系
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        const tHeader = [
          "会员卡号",
          "姓名",
          "类型",
          "货币类型",
          "$金额",
          "฿金额",
          "操作时间",
          "操作员",
          "操作备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "userName",
          "type",
          "operationType",
          "amount",
          "amountTh",
          "operationTime",
          "createBy",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `汇款明细列表-${time_str}`);
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j == "type") {
            let result = "";
            switch (v[j]) {
              case 11:
                result = this.$t("Remit-in");
                break;
              case 12:
                result = this.$t("Remit-out");
                break;
              default:
                break;
            }
            return result;
          }
          if (j == "operationType") {
            let result = "";
            switch (v[j]) {
              case 0:
                result = this.$t("Chip");
                break;
              case 1:
                result = this.$t("Cash");
                break;
              default:
                break;
            }
            return result;
          }

          return v[j];
        })
      );
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
.wanfa {
  display: inline-block;
  width: 50%;
}
</style>
