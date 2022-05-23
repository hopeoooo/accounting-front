<template>
   
    <!-- 下注记录 -->
    <el-dialog title="注单记录" :visible.sync="isRecord" width="1500px" :before-close="handleClose" class="zhudanBox_dialog" append-to-body>
      <el-table v-loading="loading" :data="userList">
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column
            label="会员卡号"
            align="center"
            key="card"
            prop="card"
          />
          <el-table-column
            label="台号"
            align="center"
            key="tableId"
            prop="tableId"
            width="80px"
          />
          <el-table-column
            label="靴号"
            align="center"
            key="bootNum"
            prop="bootNum"
            width="60px"
          />
          <el-table-column
            label="局号"
            align="center"
            key="gameNum"
            prop="gameNum"
            width="60px"
          />
          <el-table-column
            label="游戏类型"
            align="center"
            key="gameId"
            prop="gameId"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{ getGameName(scope.row.gameId) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="下注玩法"
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
            label="币种"
            align="center"
            key="type"
            prop="type"
            width="80px"
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
            label="下注金额"
            align="center"
            key="betMoney"
            prop="betMoney"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.betMoney | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="开牌结果"
            align="center"
            key="gameResult"
            prop="gameResult"
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
            label="输赢"
            align="center"
            key="winLose"
            prop="winLose"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="下注时间"
            align="center"
            key="createTime"
            prop="createTime"
            width="180px"
          />
          <el-table-column
            label="操作员"
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
// 开牌结果映射
const betOptionList = {
  4: "庄",
  1: "闲",
  7: "和",
  8: "庄对",
  5: "闲对",
  3: "庄保险", //庄保险
  0: "闲保险", //闲保险
  2: "和保险", //和保险
  9: "大",
  6: "小",
  a: "幸运6（2张牌)",//幸运6(2张牌)
  b: "幸运6（3张牌)",//幸运6(3张牌)
  龙: "龙",
  虎: "虎",
  和: "和",
  输: "输",
  赢: "赢",
  "-": "-"
};

// 下注玩法映射
const playTextMap = {
  4: "庄",
  1: "闲",
  7: "和",
  8: "庄对",
  5: "闲对",
  3: "庄保险", //庄保险
  0: "闲保险", //闲保险
  2: "和保险", //和保险
  9: "大",
  6: "小",
  a: "幸运6",//幸运6
  龙: "龙",
  虎: "虎",
  和: "和",
  输: "输",
  赢: "赢",
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
  tieIns: "2", //和保险
  big: "9",
  small: "6",
  two: "a",//幸运6(两张牌)
  three: "b",//幸运6(三张牌)
  4: "banker",
  1: "player",
  7: "tie",
  8: "bankerPair",
  5: "playerPair",
  3: "bankerIns", //庄保险
  0: "playerIns", //闲保险
  2: "tieIns", //和保险
  9: "big",
  6: "small",
  a: "two",
  b: "three"
};
// 龙虎
const longhuOptionMap = {
  dragon: "龙",
  tiger: "虎",
  tie: "和", //和
  龙: "dragon",
  虎: "tiger",
  和: "tie"
};
export default {
  name: "BetRecord",
  props:['record'],
  data() {
    return {
      form: {},
      isRecord:this.record,
      rules:{},
      loading:false,
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
        typeMap: {
        0: "$筹码",
        1: "$现金",
        2: "฿筹码",
        3: "฿现金"
      },
      
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

    console.log(this.isRecord)
    this.getListRecord()
  },
  watch: {
      record (val) {
        this.isRecord = val
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
