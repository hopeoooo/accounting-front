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
          <el-form-item label="统计时间">
            <el-date-picker
              v-model="queryParams.dateRange"
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

        <el-table
          v-loading="loading"
          :data="userList"
          show-summary
          sum-text="总计"
          :summary-method="getSummaries"
        >
          <el-table-column
            label="台号"
            align="center"
            key="tableId"
            prop="tableId"
          />
          <el-table-column label="$筹码输赢" align="center" key="chipWinLose">
            <template slot-scope="scope">
              <span>{{ scope.row.chipWinLose || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$现金输赢" align="center" key="cashWinLose">
            <template slot-scope="scope">
              <span>{{ scope.row.cashWinLose || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$合计输赢" align="center" key="winLose">
            <template slot-scope="scope">
              <span>{{ scope.row.winLose || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$保险输赢" align="center" key="winLose">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceWinLose || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$洗码量" align="center" key="water">
            <template slot-scope="scope">
              <span>{{ scope.row.water || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿筹码输赢" align="center" key="chipWinLoseTh">
            <template slot-scope="scope">
              <span>{{ scope.row.chipWinLoseTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿现金输赢" align="center" key="cashWinLoseTh">
            <template slot-scope="scope">
              <span>{{ scope.row.cashWinLoseTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿保险输赢" align="center" key="winLose">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceWinLoseTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿合计输赢" align="center" key="winLoseTh">
            <template slot-scope="scope">
              <span>{{ scope.row.winLoseTh || 0 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="฿洗码量" align="center" key="waterTh">
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh || 0 }}</span>
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
import { listTablePlumbing, totalTablePlumbing } from "@/api/report/report";
export default {
  // 台面上下水
  name: "TableWater",
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
        userName: "",
        isAdmin: 0,
        cardType: 0,
        dateRange: [

        ]
      }
    };
  },

  created() {
    this.getList();
  },

  methods: {
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
          sums[index] = "总计";
          return;
        }
        if (index === 1) {
          sums[index] = this.userTotal.chipWinLose;
          return;
        }
        if (index === 2) {
          sums[index] = this.userTotal.cashWinLose;
          return;
        }
        if (index === 3) {
          sums[index] = this.userTotal.winLose;
          return;
        }
        if (index === 4) {
          sums[index] = this.userTotal.insuranceWinLose;
          return;
        }
        if (index === 5) {
          sums[index] = this.userTotal.water;
          return;
        }
        if (index === 6) {
          sums[index] = this.userTotal.chipWinLoseTh;
          return;
        }
        if (index === 7) {
          sums[index] = this.userTotal.cashWinLoseTh;
          return;
        }
        if (index === 8) {
          sums[index] = this.userTotal.insuranceWinLoseTh;
          return;
        }
        if (index === 9) {
          sums[index] = this.userTotal.winLoseTh;
          return;
        }
        if (index === 10) {
          sums[index] = this.userTotal.waterTh;
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
        startTime:
          this.queryParams.dateRange.length > 0
            ? this.queryParams.dateRange[0]
            : "",
        endTime:
          this.queryParams.dateRange.length > 0
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
      listTablePlumbing(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
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
      totalTablePlumbing(params)
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
        card: "",
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
        userName: "",
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
<style lang="scss"></style>
