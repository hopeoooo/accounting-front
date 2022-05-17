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

          <el-form-item label="币种类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item label="下注时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 400px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              @change="setTimedata"
              clearable
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
            width="80px"
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

          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleRepair(scope.row)"
                >补录</el-button
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      v-if="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
      @close="onDialogClose"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="bet-form-box"
      >
        <div class="bet-form-row">
          <!-- 卡号、台号 -->
          <el-form-item
            label="卡号:"
            prop="card"
            class="bet-form-item"
            label-width="65px"
          >
            <el-input v-model="form.card" placeholder="" />
          </el-form-item>
          <el-form-item
            label="台号:"
            prop="tableId"
            class="bet-form-item"
            label-width="65px"
          >
            <el-input v-model="form.tableId" placeholder="" :disabled="true" />
          </el-form-item>
        </div>
        <!-- 靴号、局号 -->
        <div class="bet-form-row">
          <el-form-item
            label="靴号:"
            prop="bootNum"
            class="bet-form-item"
            label-width="65px"
          >
            <el-input v-model="form.bootNum" placeholder="" :disabled="true" />
          </el-form-item>
          <el-form-item
            label="局号:"
            prop="gameNum"
            class="bet-form-item"
            label-width="65px"
          >
            <el-input
              v-model="form.gameNum"
              placeholder=""
              :disabled="openType == 'edit'"
            />
          </el-form-item>
        </div>

        <!-- 输赢、币种 -->
        <div class="bet-form-row">
          <div class="bet-form-item" v-if="openType == 'edit'">
            <span class="winlose-label">输赢:</span>
            <span>{{ form.winLose }}</span>
          </div>
          <el-form-item
            label="币种:"
            prop="type"
            class="bet-form-item"
            label-width="65px"
          >
            <el-select v-model="form.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="bet-time">下注时间: {{ form.createTime }}</div>

        <!-- 龙虎 -->
        <div v-if="openGame == '龙虎'" class="longhu-box">
          <!-- 下注金额 -->
          <div class="longhu-amount-box">
            <div class="box-label"><i class="start-symbol">*</i>下注金额</div>
            <!-- <div> -->
            <el-form-item label="龙:" label-width="30px">
              <el-input
                v-model="longhuFormOption.dragon"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
            <el-form-item label="虎:" label-width="30px">
              <el-input
                v-model="longhuFormOption.tiger"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
            <el-form-item label="和:" label-width="30px">
              <el-input
                v-model="longhuFormOption.tie"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
            <!-- </div> -->
          </div>

          <!-- 开牌结果 -->
          <div class="longhu-result-box">
            <div class="box-label">开牌结果</div>
            <el-radio-group v-model="form.gameResult" class="result-list">
              <el-radio label="龙">龙</el-radio>
              <el-radio label="虎">虎</el-radio>
              <el-radio label="和">和</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 牛牛/三公/推筒子 -->
        <div
          class="niuniu-box"
          v-if="
            openGame == '牛牛' || openGame == '三公' || openGame == '推筒子'
          "
        >
          <el-form-item label="下注金额:" label-width="80px">
            <el-input
              v-model="form.betMoney"
              @change="onBetMoneyChange"
              placeholder=""
              style="width:150px"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
          <el-form-item label="开牌结果:" prop="gameResult" label-width="80px">
            <el-radio-group
              v-model="form.gameResult"
              @change="onNiuGameResultChange"
            >
              <el-radio label="赢">赢</el-radio>
              <el-radio label="输">输</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 百家乐 -->
        <div v-if="openGame == '百家乐'" class="bjl-box">
          <!-- 下注金额 -->
          <div class="bet-amount-box">
            <div class="box-label">下注金额</div>
            <div class="bet-amount-container">
              <div class="amount-left-box">
                <el-form-item label="庄:" label-width="60px">
                  <el-input
                    v-model="formOption.banker"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item label="闲:" label-width="60px">
                  <el-input
                    v-model="formOption.player"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item label="和:" label-width="60px">
                  <el-input
                    v-model="formOption.tie"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item label="庄对:" label-width="60px">
                  <el-input
                    v-model="formOption.bankerPair"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item label="闲对:" label-width="60px">
                  <el-input
                    v-model="formOption.playerPair"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="amount-left-box">
                <el-form-item label="庄保险:" label-width="60px">
                  <el-input
                    v-model="formOption.bankerIns"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item label="闲保险:" label-width="60px">
                  <el-input
                    v-model="formOption.playerIns"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item label="和保险:" label-width="60px">
                  <el-input
                    v-model="formOption.tieIns"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item label="大:" label-width="60px">
                  <el-input
                    v-model="formOption.big"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item label="小:" label-width="60px">
                  <el-input
                    v-model="formOption.small"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
            </div>
          </div>

          <!-- 开牌结果 -->
          <div class="game-result-box">
            <div class="box-label">开牌结果</div>
            <el-checkbox-group
              v-model="gameResultList"
              @change="onGameResultChange"
            >
              <el-checkbox label="4">庄</el-checkbox>
              <el-checkbox label="1">闲</el-checkbox>
              <el-checkbox label="7">和</el-checkbox>
              <el-checkbox label="8">庄对</el-checkbox>
              <el-checkbox label="5">闲对</el-checkbox>
              <el-checkbox label="9">大</el-checkbox>
              <el-checkbox label="6">小</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
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
import { MoneyFormat } from "@/filter";
import {
  listBetRecord,
  listBetRecordTotal,
  editBetRecord,
  repairBetRecord
} from "@/api/report/report";
import moment from "moment";
const _ = require("lodash");
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
  4: "banker",
  1: "player",
  7: "tie",
  8: "bankerPair",
  5: "playerPair",
  3: "bankerIns", //庄保险
  0: "playerIns", //闲保险
  2: "tieIns", //和保险
  9: "big",
  6: "small"
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
  // 注单记录
  name: "Bet",
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
      //原始的表单数据，用于提交时对比
      initForm: {},
      // 原始的下注金额
      originalOption: {},
      // 原始的开牌结果(排序后)
      originalGameResult: "",
      // 开牌结果，用于表单
      gameResultList: [],
      // 下注金额
      formOption: {
        banker: "",
        player: "",
        bankerIns: "", //庄保险
        playerIns: "", //闲保险
        tieIns: "", //和保险
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

      // 台号列表
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
          value: 1,
          label: "$筹码"
        },
        {
          value: 2,
          label: "$现金"
        },
        {
          value: 3,
          label: "฿筹码"
        },
        {
          value: 4,
          label: "฿现金"
        },

        {
          value: 5,
          label: "$筹码+$现金"
        },
        {
          value: 6,
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
      typeMap: {
        0: "$筹码",
        1: "$现金",
        2: "฿筹码",
        3: "฿现金"
      }
    };
  },
  computed: {
    rules() {
      if (this.openType == "edit") {
        return {
          card: [{ required: true }],
          type: [{ required: true }]
        };
      } else {
        return {
          card: [{ required: true }],
          gameNum: [{ required: true }],
          type: [{ required: true }]
        };
      }
    }
  },
  watch: {
    formOption: {
      handler(newVal, oldVal) {
        // 生成新的option,用于form提交
        console.log("生成新的百家乐option,用于form提交", newVal, oldVal);
        this.getNewOption(newVal);
      },
      deep: true,
      immediate: true
    },
    longhuFormOption: {
      handler(newVal, oldVal) {
        // 生成新的option,用于form提交
        console.log("生成新的龙虎option,用于form提交", newVal, oldVal);
        this.getNewLongHuOption(newVal);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.getList();
    this.getTableOptions();
  },

  methods: {
    /**
     * @description: 设置时间
     * @return *
     */
    setTimedata(Date) {
      if (Date) {
        this.Datatype = null;
        for (let index = 0; index < this.TimeList.length; index++) {
          const element = this.TimeList[index];
          if (Date[0] == element.val[0] && Date[1] == element.val[1]) {
            this.Datatype = index;
            break;
          }
        }
      } else {
        this.queryParams["startTime"] = "";
        this.queryParams["endTime"] = "";
        this.Datatype = null;
      }
    },
    TimeCheck(index, time) {
      this.Datatype = index;
      console.log(time);

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
        this.tableOptions.unshift({ tableId: null });
      });
    },
    /** 查询用户列表 */
    getList() {
      const { tableId, gameId, type, bootNum, gameNum } = this.queryParams;
      let params = {
        card: this.queryParams.card, //卡号
        tableId: tableId ? Number(tableId) : null, //台号
        gameId: gameId ? Number(gameId) : null, //游戏类型
        type: type != null ? Number(type) : null, //	币种(0 筹码 1现金)
        bootNum: bootNum ? Number(bootNum) : null, //靴号
        gameNum: gameNum ? Number(gameNum) : null, //局号
        createBy: this.queryParams.createBy, //操作员
        startTime: this.dateRange ? this.addDateRange(this.dateRange)[0] : null,
        endTime: this.dateRange ? this.addDateRange(this.dateRange)[1] : null,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };
      this.loading = true;
      listBetRecord(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      listBetRecordTotal(params)
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

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    onDialogClose() {
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.initForm = {};
      this.originalOption = {};
      this.resetForm("form");
      this.openType = "";
      this.gameResultList = [];
      this.formBetMoney = null;
      this.resetOption();
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

    /** 编辑 */
    handleEdit(row) {
      // this.reset();
      this.form = Object.assign({}, row);
      // this.form.option = {};

      this.open = true;
      this.openType = "edit";
      const gameName = this.getGameName(row.gameId);
      this.openGame = gameName;
      this.title = `${gameName}注单修改`;
      if (gameName == "百家乐") {
        // 初始化下注金额和开牌结果
        this.initOption(row.option);
        this.gameResultList = this.getFormGameResult(row.gameResult);
      }
      if (gameName == "龙虎") {
        this.initLongHuOption(row.option);
      }

      if (gameName != "百家乐" || gameName != "龙虎") {
        this.form.betMoney = row.betMoney;
      }
      // 复制一份原始的form，用于提交时对比差异
      this.initForm = Object.assign({}, row);
    },

    /** 补录 */
    handleRepair(row) {
      this.reset();
      this.form = Object.assign({}, row);
      this.form.card = "";
      this.form.gameNum = "";
      this.form.type = null;
      this.form.option = {};
      this.form.gameResult = "";
      this.form.betMoney = null;
      this.form.optionTime = row.createTime;
      this.open = true;
      this.openType = "repair";
      const gameName = this.getGameName(row.gameId);
      this.openGame = gameName;
      this.title = `${gameName}注单补录`;
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
          "操作员"
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
          "betMoney",
          "gameResult",
          "winLose",
          "createTime",
          "createBy"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const time_str = this.$getCurrentTime();
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, `注单记录列表-${time_str}`);
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
          if (j == "option") {
            // 下注玩法
            const option = this.getPlayText(v[j]);
            return option;
          }
          if (j == "type") {
            // 币种
            return this.typeMap[v[j]];
          }
          if (j == "gameResult") {
            return this.getGameResult(v[j]);
          }
          return v[j];
        })
      );
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
        const betName = betOptionList[betOption];
        if (betName) {
          const item = `${betName}:${betMoney}`;
          result.push(item);
        }
      }
      playText = result.join(" / ");
      return playText;
    },
    // 生成开牌结果(用于excel导出)
    getGameResult(c) {
      let arr1 = [];
      let arr = c.split("");

      arr.forEach(e => {
        arr1.push(betOptionList[e]);
      });
      return arr1.join(" / ");
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

    // 弹窗里的开牌结果
    getFormGameResult(c) {
      let arr1 = [];
      let arr = c.split("");
      // 将排序后的开牌结果存起来。提交的时候对比差异
      const sortGameResult = _.sortBy(arr)
      this.originalGameResult = sortGameResult.join("")
      return arr;
    },
    // 开牌结果选择变化
    onGameResultChange(val) {
      console.log("开牌结果选择变化", val);
      //
      const newResult =  _.sortBy(val)
      this.gameResultList = newResult;
      this.form.gameResult = newResult.join("");
    },
    initOption(options) {
      // 百家乐：将下注金额带入表单，生成初始化的formOption，用于百家乐的表单里的下注金额数据绑定
      for (let index = 0; index < options.length; index++) {
        const element = options[index];
        // betOption数字4变成英文banker : 4->banker ,对应formOption里的banker
        const key = optionMap[element.betOption];
        // {banker:20}
        this.formOption[key] = element.betMoney;
      }

      // 复制一份下注金额.用于提交时对比差异
      this.originalOption = Object.assign({}, this.formOption);
    },
    // 百家乐:生成新的百家乐的option,用于form提交
    getNewOption(formOption) {
      // 比如 formOption = {"banker":20}
      let newOption = {};
      let betAmount = 0;
      for (const key in formOption) {
        if (formOption.hasOwnProperty(key)) {
          //例如 value 是20
          const value = Number(formOption[key]);

          if (value) {
            // 比如formOption的里key是banker,对应到optionMap里的值是4
            const optionKey = optionMap[key];
            // {4:20}
            newOption[optionKey] = value;
            betAmount += Number(value);
          }
        }
      }
      // 生成新的百家乐的option,用于form提交
      this.form.option = newOption;
      // 计算下注金额
      this.formBetMoney = betAmount;
    },

    initLongHuOption(options) {
      //龙虎：将下注金额带入表单，生成初始化的formOption，用于龙虎的表单里的下注金额数据绑定
      for (let index = 0; index < options.length; index++) {
        const element = options[index];
        // betOption中文 "龙"变成英文 "dragon" : "龙"->"dragon" ,对应longhuFormOption里的dragon
        const key = longhuOptionMap[element.betOption];
        // {dragon:20}
        this.longhuFormOption[key] = element.betMoney;
      }
      // 复制一份下注金额.用于提交时对比差异
      this.originalOption = Object.assign({}, this.longhuFormOption);
    },

    //龙虎: 生成新的龙虎的option,用于form提交
    getNewLongHuOption(formOption) {
      // 比如 formOption = {"dragon":20}
      let newOption = {};
      let betAmount = 0;
      for (const key in formOption) {
        if (formOption.hasOwnProperty(key)) {
          //例如 value 是20
          const value = Number(formOption[key]);

          if (value) {
            // 比如formOption的里key是dragon,对应到longhuOptionMap里的值是"龙"
            const optionKey = longhuOptionMap[key];
            // {"龙":20}
            newOption[optionKey] = value;
            betAmount += Number(value);
          }
        }
      }
      // 生成新的option,用于form提交
      this.form.option = newOption;
      // 计算下注金额
      this.formBetMoney = betAmount;
    },

    // 牛牛/三公/推筒子:当betMoney变化时生成option
    onBetMoneyChange(val) {
      if (this.form.gameResult) {
        this.form.option = {
          [this.form.gameResult]: Number(val)
        };
      }
    },
    // 牛牛/三公/推筒子:当gameResulty变化时生成option
    onNiuGameResultChange(val) {
      if (this.form.betMoney) {
        this.form.option = {
          [val]: Number(this.form.betMoney)
        };
      }
    },
    resetOption() {
      // 重置百家乐option
      this.formOption = {
        banker: "",
        player: "",
        bankerIns: "", //庄保险
        playerIns: "", //闲保险
        tierIns: "", //和保险
        tie: "",
        playerPair: "",
        bankerPair: "",
        big: "",
        small: ""
      };
      // 重置龙虎option
      this.longhuFormOption = {
        dragon: "",
        tiger: "",
        tie: ""
      };
    },

    // 对比下注金额的数据是否与原始数据相等
    equalOption(originalOption,formOption) {
      // 因为formOption的值类型是string,originalOption值类型是Number
      if (originalOption == Number(formOption)) {
        return true
      }
    },

    /** 提交按钮 */
    submitForm: function() {
      if (this.openType == "edit") {
        /** 对比是否有修改 */
        if (this.openGame == "百家乐") {
          if (
            this.form.card == this.initForm.card &&
            this.form.type == this.initForm.type &&
            this.form.gameResult == this.originalGameResult &&
            _.isEqualWith(this.originalOption, this.formOption,this.equalOption)
          ) {
            // 没有修改东西,不调接口
            this.$modal.msgError("本次未做任何修改");
            return;
          }
        }
        if (this.openGame == "龙虎") {
          if (
            this.form.card == this.initForm.card &&
            this.form.type == this.initForm.type &&
            this.form.gameResult == this.initForm.gameResult &&
             _.isEqualWith(this.originalOption, this.longhuFormOption,this.equalOption)
          ) {
            // 没有修改东西,不调接口
            this.$modal.msgError("本次未做任何修改");
            return;
          }
        }
        if (
          this.openGame == "牛牛" ||
          this.openGame == "三公" ||
          this.openGame == "推筒子"
        ) {
          if (
            this.form.card == this.initForm.card &&
            this.form.type == this.initForm.type &&
            this.form.gameResult == this.initForm.gameResult &&
            this.form.betMoney == this.initForm.betMoney
          ) {
            // 没有修改东西,不调接口
            this.$modal.msgError("本次未做任何修改");
            return;
          }
        }
        /** 是否有录入完整注单数据 */
        if (
          (this.openGame == "百家乐" || this.openGame == "龙虎") &&
          (!this.form.card || !this.formBetMoney || this.form.gameResult == "")
        ) {
          // 百家乐 、龙虎
          this.$modal.msgError("请录入完整注单数据");
          return;
        }

        if (
          (this.openGame == "牛牛" ||
            this.openGame == "三公" ||
            this.openGame == "推筒子") &&
          (!this.form.card || !this.form.betMoney || this.form.gameResult == "")
        ) {
          // 、牛牛、三公、推筒子
          this.$modal.msgError("请录入完整注单数据");
          return;
        }
        // 注单修改
        editBetRecord(this.form).then(response => {
          this.$modal.msgSuccess("注单修改成功");
          this.open = false;
          this.reset();
          this.getList();
        });
      } else {
        // 补录
        if (
          (this.openGame == "百家乐" || this.openGame == "龙虎") &&
          (!this.form.card ||
            !this.form.gameNum ||
            !this.formBetMoney ||
            this.form.type == null ||
            !this.form.gameResult)
        ) {
          this.$modal.msgError("请录入完整注单数据");
          return;
        }
        if (
          (this.openGame == "牛牛" ||
            this.openGame == "三公" ||
            this.openGame == "推筒子") &&
          (!this.form.card ||
            !this.form.gameNum ||
            !this.form.betMoney ||
            this.form.type == null ||
            !this.form.gameResult)
        ) {
          this.$modal.msgError("请录入完整注单数据");
          return;
        }
        // 注单补录
        repairBetRecord(this.form).then(response => {
          this.$modal.msgSuccess("注单补录成功");
          this.open = false;
          this.reset();
          this.getList();
        });
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
  width: 90%;
  margin: 0 auto;

  .start-symbol {
    color: red;
  }
  .bet-form-row {
    display: flex;
    justify-content: space-between;
    .bet-form-item {
      width: 40%;
      height: 35px;
      margin-bottom: 10px;
      .winlose-label {
        display: inline-block;
        width: 65px;
        font-size: 14px;
        color: #606266;
        font-weight: 500;
        text-align: right;
        padding-right: 12px;
        margin-right: 15px;
      }
      .el-form-item__label {
        // text-align: left;
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
      &::before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
      }
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
.result-long-banker {
  color: red;
}
.result-hu-player {
  color: blue;
}
.result-tie {
  color: green;
}
</style>
