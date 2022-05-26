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
          label-width="100px"
        >
          <el-form-item :label="$t('Membership-Card-Number')" prop="userName">
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 240px; margin-right: 20px"
            />
            <el-checkbox
              v-model="queryParams.cardType"
              :disabled="!queryParams.card"
              >{{ $t("Include-sub") }}</el-checkbox
            >
            <el-checkbox v-model="queryParams.isAdmin">{{
              $t("Filter-internal-card")
            }}</el-checkbox>
          </el-form-item>
          <el-form-item :label="$t('Station-number')" prop="userName">
            <el-select
              v-model="queryParams.tableId"
              :placeholder="$t('Please-select')"
            >
              <el-option
                v-for="item in tableOptions"
                :key="item.tableId"
                :label="item.tableId ? item.tableId : $t('All')"
                :value="item.tableId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('Game-Type')" prop="userName">
            <el-select
              v-model="queryParams.gameId"
              :placeholder="$t('Please-select')"
            >
              <el-option
                v-for="item in Gameoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <TableTime
            ref="TableTime"
            :query="queryParams"
            :label="$t('time-range')"
            :quickbtn="true"
            :alltime="true"
          />
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

            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >{{ $t("Export") }}</el-button
            >
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          :data="userList"
          show-summary
          :sum-text="$t('Subtotal')"
          :summary-method="getSummaries1"
          @sort-change="onSortChange"
          ref="dataTable"
          :empty-text="$t('no-data')"
        >
          <el-table-column
            :label="$t('Membership-Card-Number')"
            align="center"
            prop="card"
          />
          <el-table-column :label="$t('Name')" align="center" prop="name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Bet-amount')"
            align="center"
            key="betMoney"
            prop="betMoney"
            sortable="custom"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.betMoney | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Rolling-Amount')"
            align="center"
            key="water"
            prop="water"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.water | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Rolling-Fee')"
            align="center"
            key="waterAmount"
            prop="waterAmount"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('T-money')"
            align="center"
            key="tie"
            prop="tie"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.tie || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Comm')"
            align="center"
            key="pump"
            prop="pump"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.pump | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Win-Loss')"
            align="center"
            key="winLose"
            prop="winLose"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Bet-amount')"
            align="center"
            key="betMoneyTh"
            prop="betMoneyTh"
            sortable="custom"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.betMoneyTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Rolling-Amount')"
            align="center"
            key="waterTh"
            prop="waterTh"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="'฿' + $t('Rolling-Fee')"
            align="center"
            key="waterAmountTh"
            prop="waterAmountTh"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="tieTh"
            :label="'฿' + $t('T-money')"
            align="center"
            key="tieTh"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.tieTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pumpTh"
            :label="'฿' + $t('Comm')"
            align="center"
            key="pumpTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.pumpTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Win-Loss')"
            align="center"
            key="winLoseTh"
            prop="winLoseTh"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLoseTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-loading="loading"
          :data="userList"
          show-summary
          :sum-text="$t('Tot')"
          :summary-method="getSummaries"
          @sort-change="onSortChange"
          ref="dataTable"
          :empty-text="$t('no-data')"
          class="table2"
        >
          <el-table-column
            :label="$t('Membership-Card-Number')"
            align="center"
            prop="card"
          />
          <el-table-column :label="$t('Name')" align="center" prop="name">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Bet-amount')"
            align="center"
            key="betMoney"
            prop="betMoney"
            sortable="custom"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.betMoney | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Rolling-Amount')"
            align="center"
            key="water"
            prop="water"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.water | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Rolling-Fee')"
            align="center"
            key="waterAmount"
            prop="waterAmount"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('T-money')"
            align="center"
            key="tie"
            prop="tie"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.tie || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Comm')"
            align="center"
            key="pump"
            prop="pump"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.pump | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'$' + $t('Win-Loss')"
            align="center"
            key="winLose"
            prop="winLose"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Bet-amount')"
            align="center"
            key="betMoneyTh"
            prop="betMoneyTh"
            sortable="custom"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.betMoneyTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Rolling-Amount')"
            align="center"
            key="waterTh"
            prop="waterTh"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="'฿' + $t('Rolling-Fee')"
            align="center"
            key="waterAmountTh"
            prop="waterAmountTh"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="tieTh"
            :label="'฿' + $t('T-money')"
            align="center"
            key="tieTh"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.tieTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pumpTh"
            :label="'฿' + $t('Comm')"
            align="center"
            key="pumpTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.pumpTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="'฿' + $t('Win-Loss')"
            align="center"
            key="winLoseTh"
            prop="winLoseTh"
            width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLoseTh | MoneyFormat }}</span>
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
import { listReceipt, listWinLose, totalWinLose } from "@/api/report/report";
import moment from "moment";
import TableTime from "@/components/TableTime/";
import { MoneyFormat } from "@/filter";
import { listTable } from "@/api/sys/table";
export default {
  // 输赢
  name: "WinOrLose",
  components: { TableTime },
  data() {
    return {

      //台号列表
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
        card: "",
        tableId: null, //台号
        gameId: "",
        isAdmin: 0,
        cardType: 0,
        pageNum: 1,
        pageSize: 30,
        startDate: moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        endDate: moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        isAsc: null,
        orderByColumn: null
      }
    };
  },
  computed: {
    // 游戏类型列表
    Gameoptions() {
      return [
        {
          value: "",
          label: this.$t("All")
          // label: "全部"
        },
        {
          value: 1,
          label: this.$t("Baccarat")
          // label: "百家乐"
        },
        {
          value: 2,
          label: this.$t("DT")
          // label: "龙虎"
        },
        {
          value: 3,
          label: this.$t("Niu-Niu")
          // label: "牛牛"
        },
        {
          value: 4,
          label: this.$t("San-Gong")
          // label: "三公"
        },
        {
          value: 5,
          label: this.$t("Tui-Tong-Zi")
          // label: "推筒子"
        }
      ];
    },
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
        card: this.queryParams.card, //卡号
        gameId: this.queryParams.gameId, //游戏类型
        isAdmin: this.queryParams.isAdmin ? 1 : 0, //过滤内部卡号（0未勾选，1勾选）
        tableId: this.queryParams.tableId, //台号
        cardType: this.queryParams.cardType ? 1 : 0, //包含子卡号（0未勾选，1勾选）
        startTime: this.queryParams.startDate, //开始时间
        endTime: this.queryParams.endDate, //结束时间
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        isAsc: this.queryParams.isAsc,
        orderByColumn: this.queryParams.orderByColumn
      };

      this.loading = true;
      /**
       * @description: 列表
       * @param {*}
       * @return {*}
       */
      listWinLose(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      totalWinLose(params)
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

    /**
     * @description: 重置按钮
     * @param {*}
     * @return {*}
     */
    resetQuery() {
      this.queryParams = {
        gameId: "",
        card: "",
        tableId: null,
        isAdmin: 0,
        cardType: 0,
        pageNum: 1,
        pageSize: this.queryParams.pageSize,
        startDate: moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        endDate: moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        isAsc: null,
        orderByColumn: null
      };
      this.$refs.dataTable.clearSort();
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
          "会员卡号",
          "姓名",
          "$投注额",
          "$洗码量",
          "$洗码费",
          "$和钱",
          "$抽水",
          "$输赢",
          "฿投注额",
          "฿洗码量",
          "฿洗码费",
          "฿和钱",
          "฿抽水",
          "฿输赢"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "name",
          "betMoney",
          "water",
          "waterAmount",
          "tie",
          "pump",
          "winLose",
          "betMoneyTh",
          "waterTh",
          "waterAmountTh",
          "tieTh",
          "pumpTh",
          "winLoseTh"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `输赢报表-${time_str}`);
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
    /**
     * @description: 报表数据 小计统计
     * @param {*} param
     * @return {*}
     */
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t("Subtotal");
        } else if (index > 1) {
          const values = data.map(item => {
            return Number(item[column.property]);
          });
          // console.log(index, column, data, data.length, values);
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                const pel = prev + curr;
                return pel;
              } else {
                // return prev;
                const pel = prev;
                return pel;
              }
            }, 0);

            sums[index] = MoneyFormat(sums[index]);
          } else {
            sums[index] = "N/A";
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
          // const html1 = <div>小计</div>
          // const html2 = <div>总计</div>
          // sums[index] = [html1,html2];
          return;
        }
        if (index == 2) {
          sums[index] = this.userTotal
            ? MoneyFormat(this.userTotal.betMoney)
            : "";
          return;
        }
        if (index == 3) {
          sums[index] = this.userTotal ? MoneyFormat(this.userTotal.water) : "";
          return;
        }
        if (index == 4) {
          sums[index] = this.userTotal
            ? MoneyFormat(this.userTotal.waterAmount)
            : "";
          return;
        }
        if (index == 5) {
          sums[index] = this.userTotal ? MoneyFormat(this.userTotal.tie) : "";
          return;
        }
        if (index == 6) {
          sums[index] = this.userTotal ? MoneyFormat(this.userTotal.pump) : "";
          return;
        }
        if (index == 7) {
          sums[index] = this.userTotal
            ? MoneyFormat(this.userTotal.winLose)
            : "";
          return;
        }
        if (index == 8) {
          sums[index] = this.userTotal
            ? MoneyFormat(this.userTotal.betMoneyTh)
            : "";
          return;
        }
        if (index == 9) {
          sums[index] = this.userTotal
            ? MoneyFormat(this.userTotal.waterTh)
            : "";
          return;
        }
        if (index == 10) {
          sums[index] = this.userTotal
            ? MoneyFormat(this.userTotal.waterAmountTh)
            : "";
          return;
        }
        if (index == 11) {
          sums[index] = this.userTotal ? MoneyFormat(this.userTotal.tieTh) : "";
          return;
        }
        if (index == 12) {
          sums[index] = this.userTotal
            ? MoneyFormat(this.userTotal.pumpTh)
            : "";
          return;
        }
        if (index == 13) {
          sums[index] = this.userTotal
            ? MoneyFormat(this.userTotal.winLoseTh)
            : "";
          return;
        }
      });
      return sums;
    },
    // 排序改变时
    onSortChange({ column, prop, order }) {
      this.queryParams.isAsc = order;
      this.queryParams.orderByColumn = prop;
      this.getList();
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
