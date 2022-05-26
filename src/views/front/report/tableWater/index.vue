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
          :label-width="currentLanguage == 'zh' ? '68px' : '120px'"
        >
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
          :sum-text="$t('Tot')"
          :summary-method="getSummaries"
          :empty-text="$t('no-data')"
        >
          <el-table-column
            :label="$t('Station-number')"
            align="center"
            key="tableId"
            prop="tableId"
            :width="currentLanguage == 'zh' ? '' : '120px'"
          />
          <el-table-column
            :label="'$' + $t('chip-win-loss')"
            align="center"
            key="chipWinLose"
            :width="currentLanguage == 'zh' ? '' : '150px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.chipWinLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('cash-win-loss')"
            align="center"
            key="cashWinLose"
            :width="currentLanguage == 'zh' ? '' : '150px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cashWinLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Insurance-Win-Loss')"
            align="center"
            key="insuranceWinLose"
            :width="currentLanguage == 'zh' ? '' : '160px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceWinLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Tot-Win-Loss')"
            align="center"
            key="winLose"
            :width="currentLanguage == 'zh' ? '' : '150px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLose | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="'$' + $t('Rolling-Amount')"
            align="center"
            key="water"
            :width="currentLanguage == 'zh' ? '' : '150px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.water | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('chip-win-loss')"
            align="center"
            key="chipWinLoseTh"
            :width="currentLanguage == 'zh' ? '' : '150px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.chipWinLoseTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('cash-win-loss')"
            align="center"
            key="cashWinLoseTh"
            :width="currentLanguage == 'zh' ? '' : '150px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cashWinLoseTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Insurance-Win-Loss')"
            align="center"
            key="insuranceWinLoseTh"
            :width="currentLanguage == 'zh' ? '' : '180px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceWinLoseTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Tot-Win-Loss')"
            align="center"
            key="winLoseTh"
            :width="currentLanguage == 'zh' ? '' : '150px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLoseTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="'฿' + $t('Rolling-Amount')"
            align="center"
            key="waterTh"
            :width="currentLanguage == 'zh' ? '' : '150px'"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh | MoneyFormat }}</span>
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
import moment from "moment";
import { MoneyFormat } from "@/filter";
import { mapState, mapMutations } from "vuex";
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
          moment(new Date())
            .startOf("day")
            .format("YYYY-MM-DD"),
          moment(new Date())
            .endOf("day")
            .format("YYYY-MM-DD")
        ],
        pageNum: 1,
        pageSize: 30
      }
    };
  },
  computed: {
    ...mapState("app", ["currentLanguage"])
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
          sums[index] = this.$t("Tot");
          return;
        }
        if (index === 1) {
          sums[index] = MoneyFormat(this.userTotal.chipWinLose);
          return;
        }
        if (index === 2) {
          sums[index] = MoneyFormat(this.userTotal.cashWinLose);
          return;
        }
        if (index === 3) {
          sums[index] = MoneyFormat(this.userTotal.insuranceWinLose);
          return;
        }
        if (index === 4) {
          sums[index] = MoneyFormat(this.userTotal.winLose);
          return;
        }
        if (index === 5) {
          sums[index] = MoneyFormat(this.userTotal.water);
          return;
        }
        if (index === 6) {
          sums[index] = MoneyFormat(this.userTotal.chipWinLoseTh);
          return;
        }
        if (index === 7) {
          sums[index] = MoneyFormat(this.userTotal.cashWinLoseTh);
          return;
        }
        if (index === 8) {
          sums[index] = MoneyFormat(this.userTotal.insuranceWinLoseTh);
          return;
        }
        if (index === 9) {
          sums[index] = MoneyFormat(this.userTotal.winLoseTh);
          return;
        }
        if (index === 10) {
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
        startTime:
          this.queryParams.dateRange &&
          this.queryParams.dateRange &&
          this.queryParams.dateRange.length > 0
            ? this.queryParams.dateRange[0]
            : "",
        endTime:
          this.queryParams.dateRange &&
          this.queryParams.dateRange &&
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
        dateRange: [
          moment(new Date())
            .startOf("day")
            .format("YYYY-MM-DD"),
          moment(new Date())
            .endOf("day")
            .format("YYYY-MM-DD")
        ],
        pageSize: this.queryParams.pageSize
      };
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
<style lang="scss"></style>
