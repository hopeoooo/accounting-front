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
          <el-form-item :label="$t('Station-number')" prop="userName">
            <el-select v-model="queryParams.tableId" :placeholder="$t('Please-select')">
              <el-option
                v-for="item in tableOptions"
                :key="item.tableId"
                :label="item.tableId ? item.tableId : $t('All')"
                :value="item.tableId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item :label="$t('Membership-Card-Number')" prop="userName">
                        <el-input
                            v-model="queryParams.card"
                            placeholder=""
                            clearable
                            style="width: 240px; margin-right: 20px"
                        />
                    </el-form-item> -->
          <el-form-item  :label="$t('Collection-Time')">
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
              v-prclick
              >{{$t("Enq")}}</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
              v-prclick
              >{{$t("Rst")}}</el-button
            >

            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >{{$t("Export")}}</el-button
            >
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="userList" :empty-text="$t('no-data')">
          <el-table-column :label="$t('Station-number')" align="center" prop="tableId">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                @click="handleDetail(scope.row.tableId)"
                v-prclick
                >{{ scope.row.tableId }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column :label="'$'+ $t('Chip-Received')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.chip | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'$'+ $t('Cash-Receive')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cash | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'$'+ $t('Insurance-Chip-Receive')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insurance | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Chip-increase-reduce')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.chipAdd | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Cash-increase-reduce')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cashAdd | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Insurance-Chip-Increase-sub')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceAdd | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column     :label="'$' + $t('Rolling-Amount')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.water | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Win-Loss')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.win | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Insurance-Win-Loss')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceWin | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="'฿'+ $t('Chip-Received')"  align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.chipTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'฿'+ $t('Cash-Receive')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cashTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="'฿'+ $t('Insurance-Chip-Receive')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('Chip-increase-reduce')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.chipAddTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('Cash-increase-reduce')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sumWaterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Insurance-Chip-Increase-sub')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cashAddTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Rolling-Amount')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Win-Loss')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sumWaterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Insurance-Win-Loss')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.winTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="$t('Collection-Time')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="$t('Operation-Remarks')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.remark || "--" }}</span>
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
import { listTable } from "@/api/sys/table";
import { listReceipt } from "@/api/report/report";
import moment from "moment";
import { MoneyFormat } from "@/filter";
export default {
  // 客户日报表
  name: "Receipt",
  data() {
    return {
      // 台号列表
      tableOptions: [],
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
        tableId: null,
        dateRange: [
          moment(new Date())
            .startOf("day")
            .format("YYYY-MM-DD"),
          moment(new Date())
            .endOf("day")
            .format("YYYY-MM-DD")
        ],
        pageSize: 30,
        pageNum: 1
      }
    };
  },

  created() {
    this.getList();
    this.getTableOptions();
  },

  methods: {
    /**
     * @description: 报表数据
     * @param {*}
     * @return {*}
     */
    getList() {
      let params = {
        tableId: this.queryParams.tableId,
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
      listReceipt(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });

      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
    },

    getTableOptions() {
      const params = {
        pageSize: 500,
        pageNum: 1
      };
      listTable(params).then(response => {
        this.tableOptions = response.rows;
        this.tableOptions.unshift({ tableId: null });
      });
    },

    /**
     * @description: 重置表单
     * @param {*}
     * @return {*}
     */
    reset() {
      this.form = {
        tableId: ""
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
        tableId: null,
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
    },
    /**
     * @description: 导出表格文件
     * @param {*}
     * @return {*}
     */
    handleExport() {
      // 表头对应关系
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        const tHeader = [
          this.$t("Station-number"),
          "$筹码-收",
          "$现金-收",
          "$保险筹码-收",
          "$筹码增减",
          "$现金增减",
          "$保险筹码增减",
          "$洗码量",
          "$输赢",
          "$保险输赢",
          "฿筹码-收",
          "฿现金-收",
          "฿保险筹码-收",
          "฿筹码增减",
          "฿现金增减",
          "฿保险筹码增减",
          "฿洗码量",
          "฿输赢",
          "฿保险输赢",
          "收码时间",
          "操作备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "tableId",
          "chip",
          "cash",
          "insurance",
          "chipAdd",
          "cashAdd",
          "insuranceAdd",
          "water",
          "win",
          "insuranceWin",
          "chipTh",
          "cashTh",
          "insuranceTh",
          "chipAddTh",
          "sumWaterTh",
          "cashAddTh",
          "waterTh",
          "sumWaterTh",
          "winTh",
          "createTime",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `收码报表-${time_str}`);
      });
    },
    /**
     * @description: 该方法负责将数组转化成二维数组
     * @param {*} filterVal 过滤参数
     * @param {*} jsonData  总数据
     * @return {*}
     */
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j == "type") {
            return v[j] == 5 ? this.$t("Signing") : this.$t("Returns");
          }
          if (j == "amount") {
            return `${v["amountBefore"]}→(${v["amount"]})→${v["amountAfter"]}
                 `;
          }
          if (j == "amountTh") {
            return `${v["amountBeforeTh"]}→(${v["amountTh"]})→${v["amountAfterTh"]}
                 `;
          }
          if (j == "amountType") {
            return v[j] == 0 ? this.$t("Chip") : this.$t("Cash");
          }
          return v[j];
        })
      );
    },
    // 点击“台号”，跳转到“点码报表”-查询该台号的“点码报表”数据
    handleDetail(tableId) {
      this.$router.push({ name: "PointCode", query: { tableId: tableId } });
    }
  }
};
</script>
<style lang="scss"></style>
