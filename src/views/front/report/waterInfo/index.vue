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
          label-width="80px"
        >
          <el-form-item :label="$t('Membership-Card-Number')" prop="card">
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 240px;margin-right:20px"
            />
            <el-checkbox
              v-model="queryParams.cardType"
              :disabled="!queryParams.card"
              >{{ $t("Include-sub-cards") }}</el-checkbox
            >
            <el-checkbox v-model="queryParams.isAdmin">{{
              $t("Filter-internal-card")
            }}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('settlement-time')" label-width="150px">
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
          <!-- <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handlePrint"
            >打印</el-button>
          </el-col> -->
          <!-- <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-c-scale-to-original"
              size="mini"
              @click="handleDetail"
              >{{$t('Breakdown')}}</el-button
            >
          </el-col> -->
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
          />
          <el-table-column
            :label="$t('Name')"
            align="center"
            key="name"
            prop="name"
          />
          <el-table-column
            :label="$t('Settlement-for-Currency')"
            align="center"
            key="operationType"
            prop="operationType"
            width="180px"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.operationType == 0 ? $t("Chip") : $t("Cash")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Settlement-for-rolling-amount')"
            align="center"
            key="water"
            prop="water"
             width="220px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.water | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Settlement-for-rolling-Fee')"
            align="center"
            key="waterAmount"
            prop="waterAmount"
             width="180px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Actual-Settlement-for-rolling-fee')"
            align="center"
            key="actualWaterAmount"
            prop="actualWaterAmount"
             width="250px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.actualWaterAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Settlement-for-rolling-amount')"
            align="center"
            key="waterTh"
            prop="waterTh"
             width="220px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Settlement-for-rolling-Fee')"
            align="center"
            key="waterAmountTh"
            prop="waterAmountTh"
             width="190px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Actual-Settlement-for-rolling-fee')"
            align="center"
            key="actualWaterAmountTh"
            prop="actualWaterAmountTh"
             width="250px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.actualWaterAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
           :label="$t('Cut-off-Time')"
            align="center"
            key="deadline"
            prop="deadline"
             width="150px"
          />
          <el-table-column
            :label="$t('settlement-time')"
            align="center"
            key="createTime"
            prop="createTime"
             width="150px"
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
        </el-table>

        <!-- 用于渲染总计 -->
        <el-table
          v-loading="loading"
          :data="userList"
          class="table2"
          show-summary
          :summary-method="getSummaries"
          :sum-text="$t('Tot')"
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
            key="name"
            prop="name"
          />
          <el-table-column
            :label="$t('Settlement-for-Currency')"
            align="center"
            key="operationType"
            prop="operationType"
            width="180px"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.operationType == 0 ? $t("Chip") : $t("Cash")
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Settlement-for-rolling-amount')"
            align="center"
            key="water"
            prop="water"
             width="220px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.water | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Settlement-for-rolling-Fee')"
            align="center"
            key="waterAmount"
            prop="waterAmount"
             width="180px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Actual-Settlement-for-rolling-fee')"
            align="center"
            key="actualWaterAmount"
            prop="actualWaterAmount"
             width="250px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.actualWaterAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Settlement-for-rolling-amount')"
            align="center"
            key="waterTh"
            prop="waterTh"
             width="220px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Settlement-for-rolling-Fee')"
            align="center"
            key="waterAmountTh"
            prop="waterAmountTh"
             width="190px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Actual-Settlement-for-rolling-fee')"
            align="center"
            key="actualWaterAmountTh"
            prop="actualWaterAmountTh"
             width="250px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.actualWaterAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
           :label="$t('Cut-off-Time')"
            align="center"
            key="deadline"
            prop="deadline"
             width="150px"
          />
          <el-table-column
            :label="$t('settlement-time')"
            align="center"
            key="createTime"
            prop="createTime"
             width="150px"
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
import { listWaterDetailed, totalWaterDetailed } from "@/api/report/report";
import { MoneyFormat } from "@/filter";
import moment from "moment";
export default {
  // 洗码费结算明细表
  name: "WaterInfo",
  data() {
    return {
      // 添加卡号
      isMain: false,
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
        cardType: 0,
        pageSize: 30,
        pageNum: 1
        // dateRange: []
      }
    };
  },
  watch: {},
  created() {
    this.getList();
  },

  methods: {
    /** 查询明细列表 */
    getList() {
      let params = {
        card: this.queryParams.card,
        cardType: this.queryParams.cardType == false ? 0 : 1,
        isAdmin: this.queryParams.isAdmin == false ? 0 : 1,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        startTime: this.dateRange ? this.addDateRange(this.dateRange)[0] : null,
        endTime: this.dateRange ? this.addDateRange(this.dateRange)[1] : null
      };

      this.loading = true;
      listWaterDetailed(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      totalWaterDetailed(params)
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
        } else if (
          index == 3 ||
          index == 4 ||
          index == 5 ||
          index == 6 ||
          index == 7 ||
          index == 8
        ) {
          // 只有第3、4、5、6、7、8、列的结算洗码量和结算洗码费 才需要小计
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
            // sums[index] = Number(sums[index]).toFixed(2);
            sums[index] = MoneyFormat(sums[index]);
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
        if (index === 3) {
          sums[index] = MoneyFormat(this.userTotal.sumWater);
          return;
        }
        if (index === 4) {
          sums[index] = MoneyFormat(this.userTotal.sumWaterAmount);
          return;
        }
        if (index === 5) {
          sums[index] = MoneyFormat(this.userTotal.actualWaterAmount);
          return;
        }
        if (index === 6) {
          sums[index] = MoneyFormat(this.userTotal.sumWaterTh);
          return;
        }
        if (index === 7) {
          sums[index] = MoneyFormat(this.userTotal.sumWaterAmountTh);
          return;
        }
        if (index === 8) {
          sums[index] = MoneyFormat(this.userTotal.actualWaterAmountTh);
          return;
        }
      });
      return sums;
    },

    // 表单重置
    reset() {
      this.form = {
        card: null,
        userName: "",
        signedAmount: "",
        remark: ""
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
        cardType: 0,
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
          "结算币种",
          "$结算洗码量",
          "$应结算洗码费",
          "$实际结算洗码费",
          "฿结算洗码量",
          "฿应结算洗码费",
          "฿实际结算洗码费",
          "截止时间",
          "结算时间",
          "操作员",
          "操作备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "name",
          "operationType",
          "water",
          "waterAmount",
          "actualWaterAmount",
          "waterTh",
          "waterAmountTh",
          "actualWaterAmountTh",
          "deadline",
          "createTime",
          "createBy",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `洗码费结算明细列表-${time_str}`);
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j == "operationType") {
            return v[j] == 0 ? this.$t("Chip") : this.$t("Cash");
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
