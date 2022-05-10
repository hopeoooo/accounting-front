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
                :label="item.tableId"
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
          <el-form-item label="录入时间">
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

        <el-table
          v-loading="loading"
          :data="userList"
          show-summary
          sum-text="小计"
          :summary-method="getSummaries1"
          @selection-change="handleSelectionChange"
        >
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
          />
          <el-table-column
            label="靴号"
            align="center"
            key="bootNum"
            prop="bootNum"
          />
          <el-table-column
            label="局号"
            align="center"
            key="gameNum"
            prop="gameNum"
          />
          <el-table-column
            label="下注玩法"
            align="center"
            key="option"
            prop="option"
            width="180px"
          >
            <template slot-scope="scope">
              <span
                v-for="(e, key) in scope.row.option"
                :key="key"
                class="wanfa"
              >
                {{ getText(e.betOption) }}:{{ e.betMoney }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="币种" align="center" key="type" prop="type">
            <template slot-scope="scope" class="wanfabox">
              <span>{{ scope.row.type == 0 ? "筹码 " : "现金" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="下注金额"
            align="center"
            key="betMoney"
            prop="betMoney"
          />
          <el-table-column
            label="开牌结果"
            align="center"
            key="gameResult"
            prop="gameResult"
          >
            <template slot-scope="scope">
              <span>{{ gameResult(scope.row.gameResult) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="输赢"
            align="center"
            key="winLose"
            prop="winLose"
          />
          <el-table-column
            label="下注时间"
            align="center"
            key="createTime"
            prop="createTime"
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
            width="260"
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

        <!-- 渲染总计 -->
        <el-table
          v-loading="loading"
          :data="userList"
          show-summary
          sum-text="总计"
          class="table2"
          :summary-method="getSummaries"
          @selection-change="handleSelectionChange"
        >
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
          />
          <el-table-column
            label="靴号"
            align="center"
            key="bootNum"
            prop="bootNum"
          />
          <el-table-column
            label="局号"
            align="center"
            key="gameNum"
            prop="gameNum"
          />
          <el-table-column
            label="下注玩法"
            align="center"
            key="option"
            prop="option"
          >
            <template slot-scope="scope"> </template>
          </el-table-column>
          <el-table-column label="币种" align="center" key="type" prop="type">
            <template slot-scope="scope">
              <span>{{ scope.row.type == 0 ? "筹码 " : "现金" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="下注金额"
            align="center"
            key="betMoney"
            prop="betMoney"
          />
          <el-table-column
            label="开牌结果"
            align="center"
            key="gameResult"
            prop="gameResult"
          />
          <el-table-column
            label="输赢"
            align="center"
            key="winLose"
            prop="winLose"
          />
          <el-table-column
            label="下注时间"
            align="center"
            key="createTime"
            prop="createTime"
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
            width="260"
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
      width="600px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <div style="display:flex">
          <el-form-item label="卡号:" prop="card">
            <el-input
              v-model="form.card"
              placeholder=""
              :disabled="true"
              style="width:150px"
            />
          </el-form-item>
          <div>
            <span>台号:</span> <span>{{ form.tableId }}</span>
          </div>
        </div>
        <div style="display:flex">
          <div>
            <span>靴号:</span> <span>{{ form.bootNum }}</span>
          </div>
          <div>
            <span>局号:</span> <span>{{ form.gameNum }}</span>
          </div>
        </div>
        <div style="display:flex">
          <div>
            <span>输赢:</span> <span>{{ form.bootNum }}</span>
          </div>
          <el-form-item label="币种:" prop="type">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div>下注时间: {{ form.createTime }}</div>

        <!-- 龙虎 -->
        <div v-if="openGame == '龙虎'" style="display:flex">
          <!-- 下注金额 -->
          <div>
            <div>下注金额</div>
            <div>
              <el-form-item label="龙:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="虎:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="和:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
            </div>
          </div>

          <!-- 开牌结果 -->
          <div>
            <div>开牌结果</div>
            <el-radio-group v-model="form.radio">
              <el-radio :label="3">龙</el-radio>
              <el-radio :label="6">虎</el-radio>
              <el-radio :label="9">和</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 牛牛/三公/推筒子 -->
        <div
          v-if="
            openGame == '牛牛' || openGame == '三公' || openGame == '推筒子'
          "
        >
          <el-form-item label="下注金额:">
            <el-input
              v-model="form.betMoney"
              placeholder=""
              style="width:150px"
            />
          </el-form-item>
          <el-form-item label="开牌结果:" prop="gameResult">
            <el-radio-group v-model="form.gameResult">
              <el-radio :label="0">赢</el-radio>
              <el-radio :label="1">输</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 百家乐 -->
        <div v-if="openGame == '百家乐'">
          <!-- 下注金额 -->
          <div>
            <div>下注金额</div>
            <div>
              <el-form-item label="庄:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="闲:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="和:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="庄对:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="闲对:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="庄保险:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="闲保险:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="大:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
              <el-form-item label="小:">
                <el-input
                  v-model="form.card"
                  placeholder=""
                  style="width:150px"
                />
              </el-form-item>
            </div>
          </div>

          <!-- 开牌结果 -->
          <div>
            <div>开牌结果</div>
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="4">庄</el-checkbox>
              <el-checkbox label="1">闲</el-checkbox>
              <el-checkbox label="7">和</el-checkbox>
              <el-checkbox label="5">庄对</el-checkbox>
              <el-checkbox label="8">闲对</el-checkbox>
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
import { listBetRecord, listBetRecordTotal } from "@/api/report/report";
import moment from "moment";

const betList = [{}];
export default {
  // 注单记录
  name: "BetRecord",
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

      userTotal: "",
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
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        card: "", //会员姓名
        tableId: "", //台号
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
      tableOptions: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        }
      ],
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
      rules: {},
      checkList: []
    };
  },

  watch: {
    checkList(newVal, oldVal) {
      return newVal.join("");
    }
  },
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
      });
    },
    /** 查询用户列表 */
    getList() {
      const { tableId, gameId, type, bootNum, gameNum } = this.queryParams;
      let params = {
        card: this.queryParams.card, //卡号
        tableId: tableId ? Number(tableId) : null, //台号
        gameId: gameId ? Number(gameId) : null, //游戏类型
        type: type ? Number(type) : null, //	币种(0 筹码 1现金)
        bootNum: bootNum ? Number(bootNum) : null, //靴号
        gameNum: gameNum ? Number(gameNum) : null, //局号
        createBy: this.queryParams.createBy, //操作员
        startTime: this.dateRange ? this.addDateRange(this.dateRange)[0] : null,
        endTime: this.dateRange ? this.addDateRange(this.dateRange)[1] : null,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };
      this.loading = true;
      listBetRecord(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listBetRecordTotal(params).then(response => {
        this.userTotal = response.data;

        this.loading = false;
      });
      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    //总计规则
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        if (index === 6) {
          sums[index] = this.userTotal.betMoney;
          return;
        }
        if (index === 8) {
          sums[index] = this.userTotal.winLose;
          return;
        }
      });
      return sums;
    },
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "小计";
          return;
        }
        if (
          index == 1 ||
          index == 2 ||
          index == 3 ||
          index == 4 ||
          index == 5 ||
          index == 7
        ) {
          sums[index] = "";
          return;
        }

        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              const pel = prev + curr; // 主要代码
              return pel;
            } else {
              // return prev;
              const pel = prev; // 主要代码
              return pel;
            }
          }, 0);
          sums[index] += "";
        } else {
          // sums[index] = 'N/A';
        }
      });
      return sums;
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
      this.openType = "";
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getGameName(gameNum) {
      // 通过gameNum 得到游戏名称 gameName
      const game = this.Gameoptions.filter(item => item.value == gameNum)[0];
      return game.label;
    },

    /** 编辑 */
    handleEdit(row) {
      // this.reset();
      this.form = Object.assign({}, row);
      this.open = true;
      this.openType = "edit";
      const gameName = this.getGameName(row.gameNum);
      this.openGame = gameName;
      this.title = `${gameName}注单修改`;
    },

    /** 补录 */
    handleRepair(row) {
      // this.reset();
      this.form = Object.assign({}, row);
      this.open = true;
      this.openType = "repair";

      const gameName = this.getGameName(row.gameNum);
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
          "游戏类型",
          "币种",
          "靴号",
          "局号",
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
          "gameId",
          "type",
          "bootNum",
          "gameNum",
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
      return jsonData.map(v => filterVal.map(j => v[j]));
    },

    // 下注玩法
    getText(a) {
      switch (a) {
        case "1":
          return "闲";
        case "3":
          return "庄保险";
        case "0":
          return "闲保险";

        case "4":
          return "庄";

        case "7":
          return "和";

        case "5":
          return "闲对";

        case "8":
          return "庄对";

        case "9":
          return "大";

        case "6":
          return "小";

        default:
          break;
        // code block
      }
    },
    // 开牌结果
    gameResult(c) {
      let arr1 = [];
      let arr = c.split("");
      console.log(arr);
      arr.forEach(e => {
        if (e == 1) {
          arr1.push("闲");
        } else if (e == 0) {
          arr1.push("闲保险");
        } else if (e == 3) {
          arr1.push("庄保险");
        } else if (e == 4) {
          arr1.push("庄");
        } else if (e == 7) {
          arr1.push("和");
        } else if (e == 5) {
          arr1.push("闲对");
        } else if (e == 8) {
          arr1.push("庄对");
        } else if (e == 9) {
          arr1.push("大");
        } else if (e == 6) {
          arr1.push("小");
        }
      });
      return arr1.toString();
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.title);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == "还单") {
            addReturnOrder(this.form).then(response => {
              this.$modal.msgSuccess("还单编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form["cardType"] = 1;
            addSigned(this.form).then(response => {
              this.$modal.msgSuccess("签单编辑成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
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
</style>
