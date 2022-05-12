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
          label-width="68px"
        >
          <el-form-item label="会员卡号" prop="card">
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 150px; "
            />
          </el-form-item>
          <el-form-item label="台号" prop="tableId">
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

          <el-form-item label="游戏类型" prop="gameId">
            <el-select v-model="queryParams.gameId" placeholder="请选择">
              <el-option
                v-for="item in Gameoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="币种类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="靴号" prop="bootNum">
            <el-input
              v-model="queryParams.bootNum"
              placeholder=""
              clearable
              style="width: 100px; "
            />
          </el-form-item>
          <el-form-item label="局号" prop="gameNum">
            <el-input
              v-model="queryParams.gameNum"
              placeholder=""
              clearable
              style="width: 100px; "
            />
          </el-form-item>
          <el-form-item label="操作员" prop="createBy">
            <el-input
              v-model="queryParams.createBy"
              placeholder=""
              clearable
              style="width: 100px; "
            />
          </el-form-item>
          <el-form-item label="修改时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 400px"
              value-format="yyyy-MM-dd hh:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              v-for="(item, index) in TimeList"
              :key="'Time' + index"
              style="margin-right: 10px"
              type="primary"
              :plain="Datatype == index ? false : true"
              size="mini"
              @click="TimeCheck(index, item.val)"
              >{{ item.name }}</el-button
            >
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
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column
            label="会员卡号"
            align="center"
            key="card"
            prop="card"
          >
            <template slot-scope="scope">
              <span
                :class="String(scope.row.card).indexOf('->') == -1 ? '' : 'red'"
                >{{ scope.row.card }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="台号"
            align="center"
            key="tableId"
            prop="tableId"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.tableId).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.tableId }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="靴号"
            align="center"
            key="bootNum"
            prop="bootNum"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.bootNum).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.bootNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="局号"
            align="center"
            key="gameNum"
            prop="gameNum"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.gameNum).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.gameNum }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="游戏类型"
            align="center"
            key="gameId"
            prop="gameId"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.gameId).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ getGameName(scope.row.gameId) }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="下注玩法"
            align="center"
            key="option"
            prop="option"
            width="250px"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.option).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.option }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            label="币种"
            align="center"
            key="type"
            prop="type"
            width="150px"
          >
            <template slot-scope="scope">
              <span
                :class="String(scope.row.type).indexOf('->') == -1 ? '' : 'red'"
                >{{ scope.row.type }}</span
              >
            </template>
          </el-table-column>

          <el-table-column
            label="下注金额"
            align="center"
            key="amount"
            prop="amount"
            width="200px"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.amount).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.amount }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="开牌结果"
            align="center"
            key="result"
            prop="result"
            width="150px"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.result).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.result }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="输赢"
            align="center"
            key="win"
            prop="win"
            width="200px"
          >
            <template slot-scope="scope">
              <span
                :class="String(scope.row.win).indexOf('->') == -1 ? '' : 'red'"
                >{{ scope.row.win }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="下注时间"
            align="center"
            key="betTime"
            prop="betTime"
            width="200px"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.betTime).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.betTime }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="操作员"
            align="center"
            key="createBy"
            prop="createBy"
            width="200px"
          >
            <template slot-scope="scope">
              <span
                :class="
                  String(scope.row.createBy).indexOf('->') == -1 ? '' : 'red'
                "
                >{{ scope.row.createBy }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="最近修改时间"
            align="center"
            key="updateTime"
            prop="updateTime"
            width="200px"
          />
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
import {
  listSign,
  listSignTotal,
  addSigned,
  addReturnOrder
} from "@/api/coderoom/sign";
import { listTable } from "@/api/sys/table";
import {
  listBetRecord,
  listBetRecordTotal,
  editBetRecord,
  repairBetRecord,
  listBetUpdate
} from "@/api/report/report";
import moment from "moment";

const betOptionList = {
  4: "庄",
  1: "闲",
  7: "和",
  8: "庄对",
  5: "闲对",
  3: "庄保险", //庄保险
  0: "闲保险", //闲保险
  9: "大",
  6: "小",
  龙: "龙",
  虎: "虎",
  和: "和",
  "-": "-"
};

// 百家乐
const optionMap = {
  banker: "4",
  player: "1",
  tie: "7",
  bankerPair: "8",
  playerPair: "5",
  bankerIns: "3", //庄保险
  playerIns: "0", //闲保险
  big: "9",
  small: "6"
};
// 龙虎
const longhuOptionMap = {
  dragon: "龙",
  tiger: "虎",
  tie: "和" //和
};
export default {
  // 注单修改记录
  name: "BetResive",
  data() {
    return {
      // 添加卡号
      isMain: false,
      // 遮罩层
      loading: true,
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

      userTotal: {},
      //会员详情
      memlist: {},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 弹窗类型:edit 编辑；repair 补录
      openType: "",
      // 弹窗游戏
      openGame: "",
      detailOpen: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围 默认今日
      dateRange: [
        moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss")
      ],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      // 开牌结果，用于表单
      gameResultList: [],

      formOption: {
        banker: "",
        player: "",
        bankerIns: "", //庄保险
        playerIns: "", //闲保险
        tie: "",
        playerPair: "",
        bankerPair: "",
        big: "",
        small: ""
      },
      longhuFormOption: {
        dragon: "",
        tiger: "",
        tie: ""
      },

      formBetMoney: null,

      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        card: "", //会员姓名
        tableId: null, //台号
        gameId: "", //游戏类型
        type: null, //	币种()
        bootNum: "", //靴号
        gameNum: "", //局号
        createBy: "", //操作员
        startTime: moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss")
      },

      //台号列表
      tableOptions: [],
      // 游戏类型列表
      Gameoptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "百家乐"
        },
        {
          value: 2,
          label: "龙虎"
        },
        {
          value: 3,
          label: "牛牛"
        },
        {
          value: 4,
          label: "三公"
        },
        {
          value: 5,
          label: "推筒子"
        }
      ],
      // 币种类型列表
      typeOptions: [
        {
          value: null,
          label: "全部"
        },
        {
          value: 0,
          label: "$筹码"
        },
        {
          value: 1,
          label: "$现金"
        },
        {
          value: 2,
          label: "฿筹码"
        },
        {
          value: 3,
          label: "฿现金"
        },

        {
          value: 4,
          label: "$筹码+$现金"
        },
        {
          value: 5,
          label: "฿筹码+฿现金"
        }
      ],
      // 币种类型列表
      typeOptions2: [
        {
          value: 0,
          label: "$筹码"
        },
        {
          value: 1,
          label: "$现金"
        },
        {
          value: 2,
          label: "฿筹码"
        },
        {
          value: 3,
          label: "฿现金"
        }
      ],
      Datatype: 0,
      TimeList: [
        {
          name: "今日",
          val: [
            moment(new Date())
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment(new Date())
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss")
          ]
        },
        {
          name: "昨日",
          val: [
            moment()
              .subtract(1, "days")
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment()
              .subtract(1, "days")
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss")
          ]
        }
      ],

      checkList: []
    };
  },
  computed: {
    rules() {
      if (this.openType == "edit") {
        return {
          card: [{ require: true }]
        };
      }
    }
  },
  watch: {},
  created() {
    this.getList();
    this.getTableOptions();
  },

  methods: {
    TimeCheck(index, time) {
      this.Datatype = index;
      this.queryParams["startTime"] = time[0];
      this.queryParams["endTime"] = time[1];
      this.dateRange = [time[0], time[1]];
    },
    getTableOptions() {
      const params = {
        pageSize: 500,
        pageNum: 1
      };
      listTable(params).then(response => {
        this.tableOptions = response.rows;
        this.tableOptions.push({ tableId: null });
      });
    },
    /** 查询用户列表 */
    getList() {
      const { tableId, gameId, type, bootNum, gameNum } = this.queryParams;
      let params = {
        card: this.queryParams.card, //卡号
        tableId: tableId ? Number(tableId) : null, //台号
        gameId: gameId ? Number(gameId) : null, //游戏类型
        // type: type ? Number(type) : null, //	币种(0 筹码 1现金)
        bootNum: bootNum ? Number(bootNum) : null, //靴号
        gameNum: gameNum ? Number(gameNum) : null, //局号
        createBy: this.queryParams.createBy, //操作员
        startTime: this.dateRange ? this.addDateRange(this.dateRange)[0] : null,
        endTime: this.dateRange ? this.addDateRange(this.dateRange)[1] : null,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };
      this.loading = true;
      listBetUpdate(params)
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

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [
        moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss")
      ];
      this.Datatype = 0;
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
          "台号",
          "靴号",
          "局号",
          "游戏类型",
          "下注玩法",
          "币种",
          "下注金额",
          "开牌结果",
          "输赢",
          "下注时间",
          "操作员",
          "最近修改时间"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "tableId",
          "bootNum",
          "gameNum",
          "gameId",
          "option",
          "type",
          "amount",
          "result",
          "win",
          "betTime",
          "createBy",
          "updateTime"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const time_str = this.$getCurrentTime();
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, `注单修改记录列表-${time_str}`);
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j == "gameId") {
            // 游戏类型
            return this.getGameName(v[j]);
          }
          return v[j];
        })
      );
    },
    getGameName(gameId) {
      if (gameId) {
        //通过gameId 得到游戏名称 gameName
        const game = this.Gameoptions.filter(item => item.value == gameId)[0];
        return game.label;
      } else {
        return "百家乐";
      }
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

.bet-form-box {
  width: 80%;
  margin: 0 auto;
  .bet-form-row {
    display: flex;
    justify-content: space-between;
    .bet-form-item {
      width: 40%;
      height: 35px;
      margin-bottom: 10px;
      .el-form-item__label {
        text-align: left;
      }
    }
  }
  .niuniu-box {
    .el-form-item__label {
      text-align: left;
    }
  }
  // 百家乐
  .bjl-box {
    .bet-amount-box {
      text-align: center;
      border: 1px solid rgb(172, 166, 166);
      margin: 10px auto;
      padding-top: 22px;
      .el-form-item__label {
        text-align: right;
      }
      .bet-amount-container {
        display: flex;
      }
      .amount-left-box {
        width: 50%;
        .el-form-item__label {
          // text-align: left;
        }
      }
    }
    .game-result-box {
      text-align: left;
      border: 1px solid rgb(172, 166, 166);
      margin: 10px auto;
      padding: 10px;
    }
    .box-label {
      margin-bottom: 10px;
      text-align: center;
    }
  }

  .bet-time {
    margin: 10px 0;
  }
  // 龙虎
  .longhu-box {
    display: flex;
    justify-content: space-between;
    .longhu-amount-box {
      width: 40%;
      text-align: center;
      border: 1px solid rgb(172, 166, 166);
      // margin: 10px auto;
      padding: 10px;
    }
    .longhu-result-box {
      width: 40%;
      text-align: center;
      border: 1px solid rgb(172, 166, 166);
      // margin: 10px auto;
      padding: 10px;
      .result-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .el-radio {
          margin: 18px auto;
        }
      }
    }
  }
}
.red {
  color: red;
}
</style>
