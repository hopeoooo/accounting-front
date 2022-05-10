<template>
  <div class="app-container washcode-managemant">
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
          <el-form-item label="会员卡号" prop="card">
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 240px;margin-right:20px"
            />
            <el-checkbox
              v-model="queryParams.cardType"
              :disabled="!queryParams.card"
              >包含子卡号</el-checkbox
            >
            <el-checkbox v-model="queryParams.isAdmin"
              >过滤内部卡号</el-checkbox
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
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-c-scale-to-original"
              size="mini"
              @click="handleBatch"
              v-prclick
              >批量结算</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-prclick
              >导出</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
          :row-class-name="status_change"
          show-summary
          :summary-method="getSummaries1"
          style="min-height:450px;"
          empty-text="暂无数据"
          ref="washCodeList"
        >
          <el-table-column
            fixed
            type="selection"
            width="80"
            align="center"
            :selectable="onSelectable"
          />
          <el-table-column
            label="会员卡号"
            align="center"
            key="card"
            prop="card"
          />
          <el-table-column label="姓名" align="center" key="name" prop="name" />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            prop="status"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">正常</span>
              <span v-else style="color:red">停用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否可结算洗码"
            align="center"
            key="isSettlement"
            prop="isSettlement"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isSettlement == 0 ? "否" : "是" }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="$未结算洗码量"
            align="center"
            sortable
            key="water"
            prop="water"
          />
          <el-table-column
            label="$未结算洗码费"
            align="center"
            sortable
            key="waterAmount"
            prop="waterAmount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="฿未结算洗码量"
            align="center"
            sortable
            key="waterTh"
            prop="waterTh"
          />
          <el-table-column
            label="฿未结算洗码费"
            align="center"
            sortable
            key="waterAmountTh"
            prop="waterAmountTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="备注"
            align="center"
            key="remark"
            prop="remark"
            width="150"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.remark" style="text-align:center">{{
                scope.row.remark
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
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
                @click="handleSettlement(scope.row)"
                :disabled="disabledSet(scope.row)"
                >结算</el-button
              >

              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleDetail(scope.row.card)"
                >明细</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 用于渲染总计 -->
        <el-table
          v-loading="loading"
          :data="userList"
          :row-class-name="status_change"
          show-summary
          :summary-method="getSummaries"
          class="summary-table"
        >
          <el-table-column
            fixed
            type="selection"
            key="userId"
            prop="userId"
            width="80"
            align="center"
          />
          <el-table-column
            label="会员卡号"
            align="center"
            key="card"
            prop="card"
          />
          <el-table-column
            label="姓名"
            align="center"
            key="userName"
            prop="name"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            prop="status"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">正常</span>
              <span v-else style="color:red">停用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否可结算洗码"
            align="center"
            key="isSettlement"
            prop="isSettlement"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isSettlement == 0 ? "否" : "是" }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="$未结算洗码量"
            align="center"
            sortable
            key="water"
            prop="water"
          />
          <el-table-column
            label="$未结算洗码费"
            align="center"
            sortable
            key="waterAmount"
            prop="waterAmount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="฿未结算洗码量"
            align="center"
            sortable
            key="waterTh"
            prop="waterTh"
          />
          <el-table-column
            label="฿未结算洗码费"
            align="center"
            sortable
            key="waterAmountTh"
            prop="waterAmountTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.waterAmountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="备注"
            align="center"
            key="remark"
            prop="remark"
            width="150"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.remark" style="text-align:center">{{
                scope.row.remark
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
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
                @click="handleSettlement(scope.row.card)"
                >结算</el-button
              >

              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleDetail(scope.row.card)"
                >明细</el-button
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
      width="800px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="结算卡号:" prop="card" v-if="openType == 'set'">
          <span>{{ form.card }}</span>
        </el-form-item>
        <el-form-item
          label="合计卡号数:"
          prop="card"
          v-if="openType == 'batch'"
        >
          <span>{{ this.cards.length }}</span>
        </el-form-item>
        <el-form-item label="$应结洗码量:" prop="water">
          <span>{{ form.water }}</span>
        </el-form-item>
        <el-form-item label="฿应结洗码量:" prop="water">
          <span>{{ form.waterTh }}</span>
        </el-form-item>
        <el-form-item label="$应结洗码费:" prop="waterAmount">
          <span>{{ form.waterAmount | MoneyFormat }}</span>
        </el-form-item>
        <el-form-item label="฿应结洗码费:" prop="waterAmount">
          <span>{{ form.waterAmountTh | MoneyFormat }}</span>
        </el-form-item>
        <el-form-item label="$实际结算洗码费:" prop="actualWaterAmount">
          <span>{{ form.actualWaterAmount }}</span>
        </el-form-item>
        <el-form-item label="฿实际结算洗码费:" prop="actualWaterAmount">
          <span>{{ form.actualWaterAmountTh }}</span>
        </el-form-item>
        <el-form-item label="结算币种:" prop="operationType">
          <el-radio-group v-model="form.operationType">
            <el-radio :label="0">筹码</el-radio>
            <el-radio :label="1">现金</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="操作备注:" prop="remark" v-if="openType == 'set'">
          <el-input
            type="textarea"
            :rows="7"
            maxlength="100"
            show-word-limit
            placeholder="请输入内容"
            v-model="form.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button type="primary" @click="submitForm">确认结算</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listWashCode,
  listWashCodeTotal,
  settlementWater,
  batchSettlementWater
} from "@/api/coderoom/washCode";
import { listOdds } from "@/api/sys/odds";
import { MoneyFormat } from "@/filter";
export default {
  // 洗码费结算
  name: "WashCode",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      cards: [],
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
      // 弹窗类型:batch 批量结算; set 结算洗码
      openType: "",
      detailOpen: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {
        card: "",
        actualWaterAmount: 0,
        waterAmount: 0,
        water: 0,
        actualWaterAmountTh: 0,
        waterAmountTh: 0,
        waterTh: 0,
        operationType: null,
        remark: ""
      },
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        card: "",
        isAdmin: 0,
        cardType: 0
      },
      rules: {
        operationType: [
          {
            required: true,
            message: "请选择结算币种",
            trigger: "change"
          }
        ]
      },
      rollingCommissionRounding: false //洗码佣金取整 0 false 1 true
    };
  },
  computed: {},
  created() {
    this.getList();
  },
  methods: {
    disabledSet(row) {
      if (
        row.isSettlement == 0 ||
        row.status == 1 ||
        (row.waterAmount == 0 && row.waterAmountTh == 0)
      ) {
        return true;
      }
      return false;
    },
    /** 查询赔率设置列表 */
    getOddsList() {
      listOdds().then(response => {
        // this.oddsList = response.data;
        if (response.data.rollingCommissionRounding == 0) {
          this.rollingCommissionRounding = false;
        } else {
          this.rollingCommissionRounding = true;
        }
      });
    },
    /** 查询用户列表 */
    getList() {
      let params = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };

      params["card"] = this.queryParams.card;
      params["isAdmin"] = this.queryParams.isAdmin == false ? 0 : 1;
      params["cardType"] = this.queryParams.cardType == false ? 0 : 1;
      this.loading = true;
      listWashCode(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listWashCodeTotal(params).then(response => {
        this.userTotal = response.data;

        this.loading = false;
      });
      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
    },

    // 实际结算洗码费取整
    roundingFormat(value) {
      if (this.rollingCommissionRounding) {
        // 取整
        return parseInt(value);
      } else {
        // 保留两位小数点
        return MoneyFormat(value);
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.cards = selection;
      // this.onSelectedCardsChange(selection);
      // this.single = selection.length != 1;
      // this.multiple = !selection.length;
    },
    // 遍历选中的行
    onSelectedCardsChange(cards) {
      for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        this.form["water"] += card.water;
        this.form["waterAmount"] += card.waterAmount;
        this.form["actualWaterAmount"] += card.actualWaterAmount;
        this.form["waterTh"] += card.waterTh;
        this.form["waterAmountTh"] += card.waterAmountTh;
        this.form["actualWaterAmountTh"] += card.actualWaterAmountTh;
      }
    },
    // 决定这一行的 CheckBox 是否可以勾选
    onSelectable(row, index) {
      // 如果该会员是不可结算洗码状态/卡号停用/洗码费为0，“结算”按钮置灰，并且不可选中该会员
      if (row.isSettlement == 0 || row.status == 1 || (row.waterAmount == 0 && row.waterAmountTh == 0)) {
        return false;
      } else {
        return true;
      }
    },
    status_change: function(row) {
      if (row.row.signedAmount > 0) {
        return "table-info-red";
      }
    },

    // 小计规则
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "小计";
          // return;
        } else if (index == 5 || index == 6 || index == 7 || index == 8) {
          // 只有未结算洗码量和未结算洗码费 才需要小计
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
            sums[index] = Number(sums[index]).toFixed(2);
            if (index == 6 || index == 8) {
              // 未结算洗码费金额需要保留两位小数点
              sums[index] = MoneyFormat(sums[index]);
            }
          } else {
            // sums[index] = 'N/A';
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
          sums[index] = "总计";
          // return;
        }
        if (index === 5) {
          // 未结算洗码量
          sums[index] = this.userTotal.water;
          // return;
        }
        if (index === 6) {
          // 未结算洗码费
          sums[index] = MoneyFormat(this.userTotal.waterAmount);
          // return;
        }
        if (index === 7) {
          // 未结算洗码量
          sums[index] = this.userTotal.waterTh;
          // return;
        }
        if (index === 8) {
          // 未结算洗码费
          sums[index] = MoneyFormat(this.userTotal.waterAmountTh);
          // return;
        }
      });
      return sums;
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.openType = "";
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        card: "",
        actualWaterAmount: 0,
        waterAmount: 0,
        water: 0,
        actualWaterAmountTh: 0,
        waterAmountTh: 0,
        waterTh: 0,
        operationType: null,
        remark: ""
      };
      this.resetForm("form");
    },
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.isAdmin = 0;
      this.queryParams.cardType = 0;
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 结算洗码 */
    handleSettlement(row) {
      // 如果该会员是不可结算洗码状态/卡号停用/洗码费为0，“结算”按钮置灰，并且不可选中该会员
      if (row.isSettlement == 0 || row.status == 1 || row.waterAmount == 0) {
        return false;
      }

      this.reset();
      // this.form ={...this.form,...row};
      this.form["card"] = row.card;
      this.form["water"] = row.water;
      this.form["waterAmount"] = row.waterAmount;
      this.form["actualWaterAmount"] = row.actualWaterAmount;
      this.form["waterTh"] = row.waterTh;
      this.form["waterAmountTh"] = row.waterAmountTh;
      this.form["actualWaterAmountTh"] = row.actualWaterAmountTh;
      this.open = true;
      this.openType = "set";
      this.title = "结算洗码";
      if (this.cards.length > 0) {
        // 清空多选
        this.$refs.washCodeList.clearSelection();
      }
    },
    /** 批量结算 */
    handleBatch() {
      this.reset();
      // this.form = Object.assign({},row)
      // this.form["card"] = row;
      if (this.cards.length < 2) {
        this.$modal.msgError("请选择至少2个会员");
        return;
      }
      this.open = true;
      this.openType = "batch";
      this.title = "批量结算";
      this.onSelectedCardsChange(this.cards);
    },

    /** 导出按钮操作 */
    handleExport() {
      // 表头对应关系
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        const tHeader = [
          "会员卡号",
          "姓名",
          "状态",
          "是否可结算洗码",
          "$未结算洗码量",
          "฿未结算洗码量",
          "$未结算洗码费",
          "฿未结算洗码费",
          "备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "name",
          "status",
          "isSettlement",
          "water",
          "waterTh",
          "waterAmount",
          "waterAmountTh",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `洗码费结算列表-${time_str}`);
      });
    },

    // 该方法负责将数组转化成二维数组
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          let result = "";
          if (j == "status") {
            result = v["status"] == 0 ? "正常" : "停用";
          } else if (j == "isSettlement") {
            result = v["isSettlement"] == 0 ? "否" : "是";
          } else if (j == "waterAmount") {
            result = MoneyFormat(v["waterAmount"]);
          } else if (j == "waterAmountTh") {
            result = MoneyFormat(v["waterAmountTh"]);
          } else {
            result = v[j];
          }
          return result;
        })
      );
    },

    // 明细
    handleDetail(card) {
      //TODO: 前往明细表
      this.$router.push({ name: "WaterInfo", query: { card: card } });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.openType == "set") {
            // 结算洗码
            settlementWater(this.form)
              .then(response => {
                this.$modal.msgSuccess("结算洗码成功”");
                this.open = false;
                this.getList();
              })
              .catch(err => {
                // this.$modal.msgError("结算失败");
              });
          } else {
            // 批量结算
            const params = {
              list: this.cards,
              operationType: this.form.operationType
            };
            batchSettlementWater(params)
              .then(response => {
                this.$modal.msgSuccess("结算洗码成功”");
                this.open = false;
                this.getList();
              })
              .catch(err => {
                console.log(err);

                // this.$modal.msgError("结算失败");
              });
          }
        } else {
          this.$modal.msgError("请选择结算币种");
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

.table-info-red td {
  background: rgb(199, 135, 135);
}
.summary-table {
  .el-table__header-wrapper,
  .el-table__body-wrapper {
    display: none;
  }
}
</style>
