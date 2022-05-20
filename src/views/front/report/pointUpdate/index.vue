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
                :label="item.tableId ? item.tableId : '全部'"
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
          <el-form-item label="修改时间">
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
          <el-table-column label="台号" fixed align="center" prop="tableId" />
          <el-table-column label="靴号" align="center" prop="bootNum" />
          <el-table-column label="$系统点码数" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.sysChip).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.sysChip }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$手动点码数" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.personChip).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.personChip }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$筹码差距" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.chipGap).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.chipGap || 0 }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$现金差距" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.cashGap).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.cashGap }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$筹码增减" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.chipAdd).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.chipAdd }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$现金增减" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.cashAdd).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.cashAdd }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$保险系统点码数" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.sysInsurance).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.sysInsurance }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$保险手动点码数" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.personInsurance).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.personInsurance }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$保险筹码差距" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.insuranceGap).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.insuranceGap }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$保险筹码增减" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.insuranceAdd).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.insuranceAdd }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$洗码量" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.water).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.water }}</span
              >
            </template>
          </el-table-column>

          <el-table-column label="$输赢" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.chipWin).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.chipWin }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="$保险输赢" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.insuranceWin).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.insuranceWin }}</span
              >
            </template>
          </el-table-column>

          <el-table-column label="฿系统点码数" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.sysChipTh).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.sysChipTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿手动点码数" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.personChipTh).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.personChipTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿筹码差距" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.chipGapTh).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.chipGapTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿现金差距" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.cashGapTh).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.cashGapTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿筹码增减" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.chipAddTh).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.chipAddTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿现金增减" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.cashAddTh).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.cashAddTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿保险系统点码数" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.sysInsuranceTh).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.sysInsuranceTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿保险手动点码数" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.personInsuranceTh).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.personInsuranceTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿保险筹码差距" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.insuranceGapTh).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.insuranceGapTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿保险筹码增减" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.insuranceAddTh).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.insuranceAddTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿洗码量" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.waterTh).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.waterTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿输赢" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.chipWinTh).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.chipWinTh }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="฿保险输赢" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.insuranceWinTh).indexOf('->') == -1
                    ? ''
                    : 'red'
                "
                >{{ scope.row.insuranceWinTh }}</span
              >
            </template>
          </el-table-column>

          <el-table-column label="修改时间" align="center">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.createTime).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.createTime }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作备注" align="center" fixed="right">
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.remark).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.remark }}</span
              >
            </template>
          </el-table-column>
          <!-- <el-table-column
                      label="操作"
                      align="center"
                      fixed="right"
                      class-name="small-padding fixed-width"
                      width="200px"
                    >
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          type="text"
                          icon="el-icon-edit"
                          @click="handleUpdate(scope.row)"
                          >点码修改</el-button
                        >
                      </template>
                    </el-table-column> -->
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
    <!-- <Dialog :title='title' :open='open' :formData='formData' @getOpen='openData'  v-if="open"/> -->
  </div>
</template>

<script>
import { listUpdatePorint } from "@/api/report/report";
import { tableIdComboBoxInfo } from "@/api/sys/table";
import { listTable } from "@/api/sys/table";
import moment from "moment";
// import Dialog from "./dialog.vue"
export default {
  // 客户日报表
  name: "PointUpdate",
  // components:{Dialog},
  data() {
    return {
      formData: {},
      //台号列表
      tableOptions: [],
      title: "点码修改",
      open: false,
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
            .format("YYYY-MM-DD HH:mm:ss"),
          moment(new Date())
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss")
        ],
        pageNum: 1,
        pageSize: 30
      }
    };
  },

  created() {
    this.getList();
    this.getTableOptions();
    // this.getTableList()
  },

  methods: {
    openData(data) {
      this.open = data;
      this.getList();
    },
    getTableList() {
      this.loading = true;
      tableIdComboBoxInfo()
        .then(response => {
          this.options = response.rows;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
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
      listUpdatePorint(params)
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
        tableId: null
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
    handleUpdate(row) {
      this.formData = row;
      this.open = true;
    },
    /**
     * @description: 重置按钮
     * @param {*}
     * @return {*}
     */
    resetQuery() {
      this.queryParams = {
        tableId: null, //台号
        pageNum: 1,
        dateRange: [
          moment(new Date())
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
          moment(new Date())
            .endOf("day")
            .format("YYYY-MM-DD HH:mm:ss")
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
          "靴号",
          "$系统点码数",
          "$手动点码数",
          "$筹码差距",
          "$现金差距",
          "$筹码增减",
          "$保险系统点码数",
          "$保险手动点码数",
          "$保险筹码差距",
          "$洗码量",
          "$输赢",
          "$保险输赢",
          "$保险筹码增减",
          "฿系统点码数",
          "฿手动点码数",
          "฿筹码差距",
          "฿现金差距",
          "฿筹码增减",
          "฿保险系统点码数",
          "฿保险手动点码数",
          "฿保险筹码差距",
          "฿洗码量",
          "฿输赢",
          "฿保险输赢",
          "฿保险筹码增减",
          "修改时间",
          "操作备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "tableId",
          "bootNum",
          "sysChip",
          "personChip",
          "chipGap",
          "cashGap",
          "chipAdd",
          "sysInsurance",
          "personInsurance",
          "insuranceGap",
          "water",
          "chipWin",
          "insuranceWin",
          "insuranceAdd",
          "sysChipTh",
          "personChipTh",
          "chipGapTh",
          "cashGapTh",
          "chipAddTh",
          "sysInsuranceTh",
          "personInsuranceTh",
          "insuranceGapTh",
          "waterTh",
          "chipWinTh",
          "insuranceWinTh",
          "insuranceAddTh",
          "createTime",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `点码修改记录列表-${time_str}`);
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
    }
  }
};
</script>
<style lang="scss">
.red {
  color: red;
}
</style>
