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
          <el-form-item label="台号" prop="userName">
            <el-select v-model="queryParams.tableId" placeholder="请选择">
              <el-option
                v-for="item in tableOptions"
                :key="item.tableId"
                :label="item.tableId?item.tableId:'全部'"
                :value="item.tableId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="会员卡号" prop="userName">
                        <el-input
                            v-model="queryParams.card"
                            placeholder=""
                            clearable
                            style="width: 240px; margin-right: 20px"
                        />
                    </el-form-item> -->
          <el-form-item label="收码时间">
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
              v-prclick
              >查询</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
              v-prclick
              >重置</el-button
            >

            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="userList">
          <el-table-column label="台号" align="center" prop="tableId">
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
          <el-table-column label="$筹码-收" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.chip }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$现金-收" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cash }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$保险筹码-收" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insurance || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$筹码增减" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.chipAdd || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$现金增减" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cashAdd || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$保险筹码增减" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceAdd || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$洗码量" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.water || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$输赢" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.win || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="$保险输赢" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceWin || 0 }}</span>
            </template>
          </el-table-column>

          <el-table-column label="฿筹码-收" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.chipTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿现金-收" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cashTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿保险筹码-收" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿筹码增减" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.chipAddTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿现金增减" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sumWaterTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿保险筹码增减" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cashAddTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿洗码量" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿输赢" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sumWaterTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="฿保险输赢" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.winTh || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收码时间" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作备注" align="center">
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
          moment()
            .subtract(1, "days")
            .startOf("day")
            .format("YYYY-MM-DD"),
          moment()
            .subtract(1, "days")
            .endOf("day")
            .format("YYYY-MM-DD")
        ],
        pageSize:30,
        pageNum:1
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
      listReceipt(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(err=>{
        this.loading = false;
      })

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
         this.tableOptions.push({tableId:null})
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
          moment()
            .subtract(1, "days")
            .startOf("day")
            .format("YYYY-MM-DD"),
          moment()
            .subtract(1, "days")
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
          "台号",
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
        export_json_to_excel(tHeader, data, `收码明细列表-${time_str}`);
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
            return v[j] == 5 ? "签单" : "还单";
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
            return v[j] == 0 ? "筹码" : "现金";
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
