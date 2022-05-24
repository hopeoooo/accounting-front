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
          label-width="68px"
        >
          <el-form-item :label="$t('Membership-Card-Number')" prop="userName">
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 240px; margin-right: 20px"
            />
          </el-form-item>
          <el-form-item :label="$t('Statistical-time')">
            <el-date-picker
              v-model="queryParams.dateRange"
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

        <el-table
          v-loading="loading"
          :data="userList"
          show-summary
          :sum-text="$t('Subtotal')"
          :summary-method="getSummaries1"
        >
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
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Date')"
            align="center"
            key="date"
            prop="date"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.date || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Win-Loss')"
            align="center"
            key="winLose"
            prop="winLose"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Card-Cumulative-Win-Loss')"
            align="center"
            key="sumWinLose"
            prop="sumWinLose"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWinLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Rolling-Amount')"
            align="center"
            key="water"
            prop="water"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.water | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Cumulative-rolling-amount')"
            align="center"
            key="sumWater"
            prop="sumWater"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWater | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Win-Loss')"
            align="center"
            key="winLoseTh"
            prop="winLoseTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLoseTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Card-Cumulative-Win-Loss')"
            align="center"
            key="sumWinLoseTh"
            prop="sumWinLoseTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWinLoseTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="'฿' + $t('Rolling-Amount')"
            align="center"
            key="waterTh"
            prop="waterTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="'฿' + $t('Cumulative-rolling-amount')"
            align="center"
            key="sumWaterTh"
            prop="sumWaterTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWaterTh | MoneyFormat }}</span>
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
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Date')"
            align="center"
            key="date"
            prop="date"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.date || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Win-Loss')"
            align="center"
            key="winLose"
            prop="winLose"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLose || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Card-Cumulative-Win-Loss')"
            align="center"
            key="sumWinLose"
            prop="sumWinLose"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWinLose || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Rolling-Amount')"
            align="center"
            key="water"
            prop="water"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.water || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Cumulative-rolling-amount')"
            align="center"
            key="sumWater"
            prop="sumWater"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWater || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Win-Loss')"
            align="center"
            key="chipWinLoseTh"
            prop="chipWinLoseTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWinLoseTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="฿累计输赢"
            align="center"
            key="winLoseTh"
            prop="winLoseTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLoseTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Rolling-Amount')"
            align="center"
            key="waterTh"
            prop="waterTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWaterTh || 0 }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="฿累计洗码量"
            align="center"
            key="sumWaterTh"
            prop="sumWaterTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sumWaterTh || 0 }}</span>
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
import { listReport, totalReport } from "@/api/report/report";
import { MoneyFormat } from "@/filter";
export default {
  // 客户日报表
  name: "MemberDay",
  data() {
    return {
      //总计
      userTotal: {},
      // 总条数
      total: 0,
      //加载
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 用户表格数据
      userList: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      queryParams: {
        card: null,
        isAdmin: 0,
        cardType: 0,
        dateRange: [],
        pageNum: 1,
        pageSize: 30
      }
    };
  },

  created() {
    // this.getList();
  },

  methods: {
    //  小计规则
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t("Subtotal");
          // return;
        } else if (index == 3 || index == 5 || index == 7 || index == 9) {
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
            // sums[index] += "";
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
    /**
     * @description: 报表底部总计
     * @param {*} param
     * @return {*}
     */
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t("Tot");
          return;
        }
        if (index === 3) {
          sums[index] = MoneyFormat(this.userTotal.winLose);
          return;
        }

        if (index === 5) {
          sums[index] = MoneyFormat(this.userTotal.water);
          return;
        }

        if (index === 7) {
          sums[index] = MoneyFormat(this.userTotal.winLoseTh);
          return;
        }

        if (index === 9) {
          sums[index] = MoneyFormat(this.userTotal.waterTh);
          return;
        }
      });
      return sums;
    },
    /**
     * @description: 报表数据
     * @param {*}
     * @return {*}
     */
    getList() {
      let params = {
        card: this.queryParams.card,
        startTime:
          this.queryParams.dateRange && this.queryParams.dateRange.length > 0
            ? this.queryParams.dateRange[0]
            : "",
        endTime:
          this.queryParams.dateRange && this.queryParams.dateRange.length > 0
            ? this.queryParams.dateRange[1]
            : "",
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };

      this.loading = true;
      /**
       * @description: 列表
       * @param {*}
       * @return {*}
       */
      listReport(params)
        .then(response => {
          this.userList = response.rows || [];
          this.total = response.total || 0;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      /**
       * @description: 总计
       * @param {*}
       * @return {*}
       */
      totalReport(params)
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

    /**
     * @description: 重置表单
     * @param {*}
     * @return {*}
     */
    reset() {
      this.form = {
        card: null,
        userName: "",
        signedAmount: "",
        remark: ""
      };
      this.resetForm("form");
    },

    /**
     * @description: 查询按钮
     * @param {*}
     * @return {*}
     */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /**
     * @description: 重置按钮
     * @param {*}
     * @return {*}
     */
    resetQuery() {
      this.queryParams = {
        card: null,
        pageNum: 1,
        dateRange: [],
        pageSize: this.queryParams.pageSize
      };
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
<style lang="scss">
.el-table.table2 {
  .el-table__header-wrapper,
  .el-table__body-wrapper {
    display: none;
  }
}
</style>
