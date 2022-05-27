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
          :label-width="currentLanguage == 'zh' ? '' : '120px'"
        >
          <el-form-item
            :label="$t('dealer-work-number')"
            prop="userName"
            :label-width="currentLanguage == 'zh' ? '' : '130px'"
          >
            <el-input
              v-model="queryParams.userName"
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
          :empty-text="$t('no-data')"
        >
          <el-table-column :label="$t('Work Number')" prop="userName" />
          <el-table-column :label="$t('Name')" prop="nickName" />
          <el-table-column
            :label="$t('baccarat-win-loss')"
            align="center"
            key="chipWinLose"
          >
            <template slot-scope="scope">
              <div>$ {{ scope.row.bccaratWnLose | MoneyFormat }}</div>
              <div>฿ {{ scope.row.bccaratWnLoseTh | MoneyFormat }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('dt-win-loss')"
            align="center"
            key="cashWinLose"
          >
            <template slot-scope="scope">
              <div>$ {{ scope.row.dTWnLose | MoneyFormat }}</div>
              <div>฿ {{ scope.row.dTWnLoseTh | MoneyFormat }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('sg-win-loss')"
            align="center"
            key="insuranceWinLose"
          >
            <template slot-scope="scope">
              <div>$ {{ scope.row.gongWnLose | MoneyFormat }}</div>
              <div>฿ {{ scope.row.gongWnLoseTh | MoneyFormat }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('niu-win-loss')"
            align="center"
            key="winLose"
          >
            <template slot-scope="scope">
              <div>$ {{ scope.row.niuWnLose | MoneyFormat }}</div>
              <div>฿ {{ scope.row.niuWnLoseTh | MoneyFormat }}</div>
            </template>
          </el-table-column>

          <el-table-column
            :label="$t('tui-win-loss')"
            align="center"
            key="water"
            :minwidth="currentLanguage == 'zh' ? '' : '200px'"
          >
            <template slot-scope="scope">
              <div>$ {{ scope.row.TuiWnLose | MoneyFormat }}</div>
              <div>฿ {{ scope.row.TuiWnLoseTh | MoneyFormat }}</div>
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
import { dealerWaterList } from "@/api/report/report";
import moment from "moment";
import { MoneyFormat } from "@/filter";
import { mapState, mapMutations } from "vuex";
export default {
  // 荷官上下水
  name: "DealerWater ",
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
     * @description: 报表数据
     * @param {*}
     * @return {*}
     */
    getList() {
      let params = {
        userName: this.queryParams.userName,
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
      dealerWaterList(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
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
