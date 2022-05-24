<template>
   
    <!-- 下注记录 -->
    <el-dialog :title="$t('bet.betRecord')" :visible.sync="isRecord" width="1700px" :before-close="handleClose" class="zhudanBox_dialog" append-to-body>
      <el-table v-loading="loading" :data="userList" :empty-text="$t('no-data')">
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column
            :label="$t('Membership-Card-Number')"
            align="center"
            key="card"
            prop="card"
          />
          <el-table-column
            :label="$t('Station-number')"
            align="center"
            key="tableId"
            prop="tableId"
          />
          <el-table-column
            :label="$t('Boot-number')"
            align="center"
            key="bootNum"
            prop="bootNum"
          />
          <el-table-column
            :label="$t('Game-number')"
            align="center"
            key="gameNum"
            prop="gameNum"
          />
          <el-table-column
            :label="$t('Game-Type')"
            align="center"
            key="gameId"
            prop="gameId"
          >
            <template slot-scope="scope">
              <span>{{ getGameName(scope.row.gameId) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bets-to-play')"
            align="center"
            key="option"
            prop="option"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <!--百家乐、龙虎 -->
              <span v-if="scope.row.gameId == 1 || scope.row.gameId == 2">{{
                getPlayText(scope.row.option)
              }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('currency')"
            align="center"
            key="type"
            prop="type"
          >
            <template slot-scope="scope" class="wanfabox">
              <!-- 币种(0美元筹码 1美元现金 2泰铢筹码 3泰铢现金) -->
              <!-- <span v-if="scope.row.type == 0">$筹码</span>
              <span v-if="scope.row.type == 1">$现金</span>
              <span v-if="scope.row.type == 2">฿筹码</span>
              <span v-if="scope.row.type == 3">฿现金</span> -->
              <span>{{ typeMap[scope.row.type] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bet-money')"
            align="center"
            key="betMoney"
            prop="betMoney"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.betMoney | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Result')"
            align="center"
            key="gameResult"
            prop="gameResult"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div>
                <span
                  v-for="(item, index) in scope.row.gameResult"
                  :key="index"
                  :class="getResultStyle(item)"
                >
                  {{ getGameResult2(item, index) }}
                </span>
              </div>
              <!-- <span>{{ getGameResult(scope.row.gameResult) }}</span> -->
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Win-Loss')"
            align="center"
            key="winLose"
            prop="winLose"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Betting-Time')"
            align="center"
            key="createTime"
            prop="createTime"
            width="180px"
          />
          <el-table-column
            :label="$t('Operator')"
            align="center"
            key="createBy"
            prop="createBy"
          />
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getListRecord"
        />
    </el-dialog>
</template>

<script>
import {baccaratRecord} from "@/api/bet/baccarat";
import i18n from "@/locales";
// 开牌结果映射
const betOptionList = {
  4: i18n.t("B"), //庄
  1: i18n.t("P"), //闲
  7: i18n.t("T"), //和
  8: i18n.t("B-P"), //庄对
  5: i18n.t("P-P"), //闲对
  3: i18n.t("B-Ins"), //庄保险
  0: i18n.t("P-Ins"), //闲保险
  2: i18n.t("T-Ins"), //和保险
  9: i18n.t("BIG"), //大
  6: i18n.t("S"), //小
  a: i18n.t("Lucky-2-cards"), //幸运6(2张牌)
  b: i18n.t("Lucky-3-cards"), //幸运6(3张牌)
  龙: i18n.t("D"), //
  虎: i18n.t("TYG"), //
  和: i18n.t("T"), //
  输: i18n.t("Loss"), //
  赢: i18n.t("Win"), //
  "-": "-" //
};

// 下注玩法映射
const playTextMap = {
  4: i18n.t("B"), //庄
  1: i18n.t("P"), //闲
  7: i18n.t("T"), //和
  8: i18n.t("B-P"), //庄对
  5: i18n.t("P-P"), //闲对
  3: i18n.t("B-Ins"), //庄保险
  0: i18n.t("P-Ins"), //闲保险
  2: i18n.t("T-Ins"), //和保险
  9: i18n.t("BIG"), //大
  6: i18n.t("S"), //小
  a: i18n.t("Lucky-6"), //幸运6
  龙: i18n.t("D"), //
  虎: i18n.t("TYG"), //
  和: i18n.t("T"), //
  输: i18n.t("Loss"), //
  赢: i18n.t("Win"), //
  "-": "-" //
};

// 百家乐
const optionMap = {
  banker: "4", //
  player: "1", //
  tie: "7", //
  bankerPair: "8", //
  playerPair: "5", //
  bankerIns: "3", //庄保险
  playerIns: "0", //闲保险
  tieIns: "2", //和保险
  big: "9", //
  small: "6", //
  two: "a", //幸运6(两张牌)
  three: "b", //幸运6(三张牌)
  4: "banker", //
  1: "player", //
  7: "tie", //
  8: "bankerPair", //
  5: "playerPair", //
  3: "bankerIns", //庄保险
  0: "playerIns", //闲保险
  2: "tieIns", //和保险
  9: "big", //
  6: "small", //
  a: "two", //
  b: "three" //
};
// 龙虎
const longhuOptionMap = {
  dragon: "龙", //龙
  tiger: "虎", //虎
  tie: "和", //和
  龙: "dragon", //龙
  虎: "tiger", //虎
  和: "tie" //和
};
const gameResult1 = ["4", "1", "7"]; //庄闲和
const gameResult2 = ["8", "5"]; //庄对、闲对
const gameResult3 = ["9", "6"]; //大小
const gameResult4 = ["a", "b"]; // 幸运6(2张牌)/幸运6(3张牌)
export default {
  name: "BetRecord",
  props:['record'],
  data() {
    return {
      form: {},
      isRecord:this.record,
      rules:{},
      loading:false, 
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      userList:[],
      total: 0,
    };
  },
  created() {
  },
  computed: {
    // 游戏类型列表
    Gameoptions() {
      return [
        {
          value: "",
          label: i18n.t("All")
          // label: "全部"
        },
        {
          value: 1,
          label: i18n.t("Baccarat")
          // label: "百家乐"
        },
        {
          value: 2,
          label: i18n.t("DT")
          // label: "龙虎"
        },
        {
          value: 3,
          label: i18n.t("Niu-Niu")
          // label: "牛牛"
        },
        {
          value: 4,
          label: i18n.t("San-Gong")
          // label: "三公"
        },
        {
          value: 5,
          label: i18n.t("Tui-Tong-Zi")
          // label: "推筒子"
        }
      ];
    },
    // 币种类型列表
    typeOptions() {
      return [
        {
          value: null,
          label: i18n.t("All")
          // label: "全部"
        },
        {
          value: 1,
          label: `$${i18n.t("Chip")}`
          // label: "$筹码"
        },
        {
          value: 2,
          label: `$${i18n.t("Cash")}`
          // label: "$现金"
        },
        {
          value: 3,
          label: `฿${i18n.t("Chip")}`
          // label: "฿筹码"
        },
        {
          value: 4,
          label: `฿${i18n.t("Cash")}`
          // label: "฿现金"
        },

        {
          value: 5,
          label: `$${i18n.t("Chip")}+$${i18n.t("Cash")}`
          // label: "$筹码+$现金"
        },
        {
          value: 6,
          label: `฿${i18n.t("Chip")}+฿${i18n.t("Cash")}`
          // label: "฿筹码+฿现金"
        }
      ];
    },
    typeOptions2() {
      return [
        {
          value: 0,
          label: `$${i18n.t("Chip")}`
          // label: "$筹码"
        },
        {
          value: 1,
          label: `$${i18n.t("Cash")}`
          // label: "$现金"
        },
        {
          value: 2,
          label: `฿${i18n.t("Chip")}`
          // label: "฿筹码"
        },
        {
          value: 3,
          label: `฿${i18n.t("Cash")}`
          // label: "฿现金"
        }
      ];
    },
    typeMap(){
      return {
        0: `$${i18n.t("Chip")}`,
        1: `$${i18n.t("Cash")}`,
        2: `฿${i18n.t("Chip")}`,
        3: `฿${i18n.t("Cash")}`
      }
    },
    TimeList() {
      return [
        {
          name: this.$t("Today"),
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
          name: this.$t("Yesterday"),
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
      ];
    },
  },  
  watch: {
      record (val) {
        this.isRecord = val
        if(val ==true)
        this.getListRecord()
      }
    },
  methods: {
     // 注单记录
    getListRecord() {
      this.loading = true;
      baccaratRecord(this.queryParams)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    getGameName(gameId) {
      if (gameId) {
        //通过gameId 得到游戏名称 gameName
        const game = this.Gameoptions.filter(item => item.value == gameId)[0];
        // console.log("通过gameId 得到游戏名称 gameName", game, gameId);

        return game.label;
      } else {
        return "百家乐";
      }
    },
     // 生成下注玩法
    getPlayText(option = []) {
      if (!option || option.length == 0) {
        return "-";
      }
      let playText = "";
      let result = [];
      for (let index = 0; index < option.length; index++) {
        const element = option[index];
        const { betOption, betMoney } = element;
        const betName = playTextMap[betOption];
        if (betName) {
          const item = `${betName}:${betMoney}`;
          result.push(item);
        }
      }
      playText = result.join(" / ");
      return playText;
    },
    // 生成开牌结果(用于表格渲染)
    getGameResult2(result, index) {
      if (index == 0) {
        return betOptionList[result];
      } else {
        return `/ ${betOptionList[result]}`;
      }
    },
    //开牌结果样式
    getResultStyle(option) {
      if (option == 4 || option == "龙") {
        // 龙/庄（红色）
        return "result-long-banker";
      }
      if (option == 1 || option == "虎") {
        // 虎/闲（蓝色）
        return "result-hu-player";
      }
      if (option == 7) {
        // 和（绿色）
        return "result-tie";
      }
      return "";
    },
    
      // 取消按钮
    handleClose() {
      this.isRecord= !this.isRecord
      this.$emit('getRecord',this.isRecord)

    },
  
  },
};
</script>

<style lang="scss">
  .zhudanBox_dialog{
      .el-table{
        font-size: 20px;
        .el-table__header-wrapper{
          th{
            font-size: 20px;
          }
        }
      }
    .el-pagination span:not([class*=suffix]), .el-pagination button{
      font-size: 18px;
        height: 40px;
        line-height:40px;
        min-width: 40px;
    }
    .el-pagination__sizes .el-input .el-input__inner{
      font-size: 18px;
    }
    .el-pager li{
      font-size: 18px;
        line-height:40px;
        height: 40px;
    }
    .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li{
      min-width: 40px;
    }
    .el-input--medium{
      font-size: 18px;
    }
  }

</style>
