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
          <el-form-item :label="$t('Chip-counting-time')">
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
              >{{$t("Enq")}}</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
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

        <el-table v-loading="loading" :data="userList">
          <el-table-column :label="$t('Station-number')" fixed align="center" prop="tableId" />
          <el-table-column :label="$t('Boot-number')" align="center" prop="bootNum" />
          <el-table-column :label="'$' + $t('system-chip-counts')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.sysChip | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('manual-chip-counts')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.personChip | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Chip-Gap')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.chipGap | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Cash-gap')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.cashGap | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Chip-increase-reduce')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.chipAdd | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Cash-increase-reduce')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.cashAdd | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Insurance-system-chip-counts')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.sysInsurance | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('manual-insurance-chip-counts')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.personInsurance | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'$' + $t('Insurance-Chip-Gap')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceGap | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Insurance-Chip-Increase-sub')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceAdd | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column     :label="'$' + $t('Rolling-Amount')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.water | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column  :label="'$' + $t('Win-Loss')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.chipWin | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'$' + $t('Insurance-Win-Loss')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceWin | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('system-chip-counts')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.sysChipTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('manual-chip-counts')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.personChipTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('Chip-Gap')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.chipGapTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('Cash-Gap')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.cashGapTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('Chip-increase-reduce')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.chipAddTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('Cash-increase-reduce')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.cashAddTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('Insurance-system-chip-counts')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.sysInsuranceTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column  :label="'฿' + $t('Insurance-manual-chip-counts')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.personInsuranceTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Insurance-Chip-Gap')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceGapTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Insurance-Chip-Increase-sub')" align="center" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceAddTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Rolling-Amount')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Win-Loss')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.chipWinTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Insurance-Win-Loss')" align="center" width="100px">
            <template slot-scope="scope">
              <span>{{ scope.row.insuranceWinTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column   :label="'฿' + $t('Chip-counting-time')" align="center" width="180px">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column
              :label="$t('Operation-Remarks')"
            align="center"
            width="180px"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.remark || "--" }}</span>
            </template>
          </el-table-column>
          <el-table-column
             :label="$t('Operation')"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
            width="200px"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >{{title}}</el-button
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
    <Dialog
      :title="title"
      :open="open"
      :formData="formData"
      @getOpen="openData"
      v-if="open"
    />
  </div>
</template>

<script>
import { listPorint } from "@/api/report/report";
import { tableIdComboBoxInfo } from "@/api/sys/table";
import Dialog from "./dialog.vue";
import { listTable } from "@/api/sys/table";
import moment from "moment";
import { MoneyFormat } from "@/filter";
export default {
  // 客户日报表
  name: "PointCode",
  components: { Dialog },
  data() {
    return {
      formData: {},
      //台号列表
      tableOptions: [],

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
        tableId: this.$route.query.tableId ? this.$route.query.tableId : null,
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
  computed: {
     title(){
      //点码修改
       return this.$t("Chip-counting-modification")
     },
  },

  created() {
    this.getList();
    this.getTableOptions();
    // this.getTableList();
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
      listPorint(params)
        .then(response => {
          this.userList = response.list.rows;
          this.total = response.list.total;
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
        tableId: null //台号
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
      if(row.chipAdd>0){
        row['chipSub'] =0
      }else if(row.chipAdd==0){
        row['chipSub'] =0
      }else{
        row['chipSub'] = -row.chipAdd
        row.chipAdd =0
      }
      if(row.cashAdd>0){
        row['cashSub'] =0
      }else if(row.cashAdd==0){
        row['cashSub'] =0
      }else{
        row['cashSub'] = -row.cashAdd
        row.cashAdd =0
      }
      if(row.insuranceAdd>0){
        row['insuranceSub'] =0
      }else if(row.insuranceAdd==0){
        row['insuranceSub'] =0
      }else{
        row['insuranceSub'] = -row.insuranceAdd
        row.insuranceAdd =0
      }
        if(row.chipAddTh>0){
        row['chipSubTh'] =0
      }else if(row.chipAddTh==0){
        row['chipSubTh'] =0
      }else{
        row['chipSubTh'] = -row.chipAddTh
        row.chipAddTh =0
      }
      if(row.cashAddTh>0){
        row['cashSubTh'] =0
      }else if(row.cashAddTh==0){
        row['cashSubTh'] =0
      }else{
        row['cashSubTh'] = -row.cashAddTh
        row.cashAddTh =0
      }
      if(row.insuranceAddTh>0){
        row['insuranceSubTh'] =0
      }else if(row.insuranceAddTh=0){
        row['insuranceSubTh'] =0
      }else{
        row['insuranceSubTh'] = -row.insuranceAddTh
        row.insuranceAddTh =0
      }
      row['totalGap']=row.chipGap+row.cashGap
      row['totalGapTh']=row.chipGapTh+row.cashGapTh
      row['insurance']=row.personInsurance
      row['insuranceTh']=row.personInsuranceTh
      // this.formData = row;
      this.formData = Object.assign({},row)
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
          this.$t("Station-number"),
          this.$t("Boot-number"),
          "$"+this.$t("system-chip-counts"),
          "$"+this.$t("manual-chip-counts"),
          "$"+this.$t("Chip-Gap"),
          "$现金差距",
          "$筹码增减",
          "$现金增减",
          "$保险系统点码数",
          "$保险手动点码数",
          "$保险筹码差距",
          "$保险筹码增减",
          "$洗码量",
          "$输赢",
          "$保险输赢",
          "฿系统点码数",
          "฿手动点码数",
          "฿筹码差距",
          "฿现金差距",
          "฿筹码增减",
          "฿现金增减",
          "฿保险系统点码数",
          "฿保险手动点码数",
          "฿保险筹码差距",
          "฿保险筹码增减",
          "฿洗码量",
          "฿输赢",
          "฿保险输赢",
          "点码时间",
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
          "cashAdd",
          "sysInsurance",
          "personInsurance",
          "insuranceGap",
          "insuranceAdd",
          "water",
          "chipWin",
          "insuranceWin",
          "sysChipTh",
          "personChipTh",
          "chipGapTh",
          "cashGapTh",
          "chipAddTh",
          "cashAddTh",
          "sysInsuranceTh",
          "personInsuranceTh",
          "insuranceGapTh",
          "insuranceAddTh",
          "waterTh",
          "chipWinTh",
          "insuranceWinTh",
          "createTime",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `点码记录列表-${time_str}`);
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
    }
  }
};
</script>
<style lang="scss"></style>
