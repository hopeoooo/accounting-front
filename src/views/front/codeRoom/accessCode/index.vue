<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="fromSearch"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="会员卡号" prop="card">
            <el-input
              v-model="fromSearch.card"
              placeholder=""
              clearable
              style="width: 240px;margin-right:20px"
            />
            <el-checkbox v-model="fromSearch.isAdmin">过滤内部卡号</el-checkbox>
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
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          :row-class-name="status_change"
          show-summary
          sum-text="小计"
          :summary-method="getSummaries1"
        >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
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
            prop="userName"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            prop="status"
            width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">正常</span>
              <span v-else style="color:red">停用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="$已存筹码余额"
            align="center"
            sortable
            key="chipBalance"
            prop="chipBalance"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.chipBalance | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="$已存现金余额"
            align="center"
            sortable
            key="cashBalance"
            prop="cashBalance"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cashBalance | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="฿已存筹码余额"
            align="center"
            sortable
            key="chipBalanceTh"
            prop="chipBalanceTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.chipBalanceTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="฿已存现金余额"
            align="center"
            sortable
            key="cashBalanceTh"
            prop="cashBalanceTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cashBalanceTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            label="总余额"
            align="center"
            sortable
            key="totalBalance"
            prop="totalBalance"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.totalBalance | MoneyFormat }}</span>
            </template>
          </el-table-column> -->

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
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleSign(scope.row)"
                >存码</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row)"
                >取码</el-button
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
          sum-text="总计"
          class="table2"
          :summary-method="getSummaries"
        >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
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
            prop="userName"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            prop="status"
            width="80"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">正常</span>
              <span v-else style="color:red">停用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="$已存筹码余额"
            align="center"
            sortable
            key="chipBalance"
            prop="chipBalance"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.chipBalance | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="$已存现金余额"
            align="center"
            sortable
            key="cashBalance"
            prop="cashBalance"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cashBalance | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="฿已存筹码余额"
            align="center"
            sortable
            key="chipBalanceTh"
            prop="chipBalanceTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.chipBalanceTh | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="฿已存现金余额"
            align="center"
            sortable
            key="cashBalanceTh"
            prop="cashBalanceTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cashBalanceTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column
            label="总余额"
            align="center"
            sortable
            key="totalBalance"
            prop="totalBalance"
          /> -->

          <el-table-column
            label="备注"
            align="center"
            key="remark"
            prop="remark"
            width="150"
          />
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleSign(scope.row)"
                >存码</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row)"
                >取码</el-button
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
      width="800px"
      v-if="open"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :show-message="false"
        label-width="100px"
        class="access-code-form"
      >
        <el-form-item label="卡号" prop="card">
          <el-input v-model="form.card" placeholder="" :disabled="true" />
        </el-form-item>

        <!-- 存码 开始-->
        <div v-if="openType == 'deposit'">
          <el-form-item
            label="$存储筹码"
            prop="chipAmount"
            v-if="openType == 'deposit'"
          >
            <el-input
              v-model="form.chipAmount"
              placeholder=""
              class="access-input"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
          <el-form-item
            label="$存储现金"
            prop="cashAmount"
            v-if="openType == 'deposit'"
          >
            <el-input
              v-model="form.cashAmount"
              placeholder=""
              class="access-input"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
          <el-form-item
            label="฿存储筹码"
            prop="chipAmountTh"
            v-if="openType == 'deposit'"
          >
            <el-input
              v-model="form.chipAmountTh"
              placeholder=""
              class="access-input"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
          <el-form-item
            label="฿存储现金"
            prop="cashAmountTh"
            v-if="openType == 'deposit'"
          >
            <el-input
              v-model="form.cashAmountTh"
              placeholder=""
              class="access-input"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
        </div>

        <!-- 存码 结束-->

        <!-- 取码 开始-->
        <div style="border:'1px solid #000'" v-if="openType == 'withdraw'">
          <div style="display:flex">
            <el-form-item label="$现有筹码" prop="chipBalance">
              <el-input
                v-model="form.chipBalance"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="$现有现金" prop="cashBalance">
              <el-input
                v-model="form.cashBalance"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </div>

          <el-form-item label="$取出筹码" prop="chipAmount">
            <el-input
              v-model="form.chipAmount"
              placeholder=""
              class="access-input"
              :disabled="form.chipBalance == 0"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
          <el-form-item label="$取出现金" prop="cashAmount">
            <el-input
              v-model="form.cashAmount"
              placeholder=""
              class="access-input"
              :disabled="form.cashBalance == 0"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
        </div>

        <div style="border:'1px solid #000'" v-if="openType == 'withdraw'">
          <div style="display:flex">
            <el-form-item label="฿现有筹码" prop="chipBalanceTh">
              <el-input
                v-model="form.chipBalanceTh"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
            <el-form-item label="฿现有现金" prop="cashBalanceTh">
              <el-input
                v-model="form.cashBalanceTh"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </div>

          <el-form-item
            label="฿取出筹码"
            prop="chipAmountTh"
            :show-message="false"
          >
            <el-input
              v-model="form.chipAmountTh"
              placeholder=""
              class="access-input"
              :disabled="form.chipBalanceTh == 0"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
          <el-form-item label="฿取出现金" prop="cashAmountTh">
            <el-input
              v-model="form.cashAmountTh"
              placeholder=""
              class="access-input"
              :disabled="form.cashBalanceTh == 0"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
        </div>

        <!-- 取码结束 -->

        <el-form-item label="操作备注" prop="remark">
          <el-input
            type="textarea"
            :rows="7"
            placeholder="请输入内容"
            v-model="form.remark"
            maxlength="100"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button
          type="primary"
          @click="submitForm"
          :disabled="
          openType=='withdraw' &&
            form.chipBalance == 0 &&
              form.cashBalanceTh == 0 &&
              form.chipBalanceTh == 0 &&
              form.cashBalanceTh == 0
          "
          >确认</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAccessCode,
  listAccessCodeTotal,
  saveCode,
  updateCodeFetching
} from "@/api/coderoom/accessCode";
import { MoneyFormat } from "@/filter";

const fieldMap = {
  chipAmount: "chipBalance",
  cashAmount: "cashBalance",
  chipAmountTh: "chipBalanceTh",
  cashAmountTh: "cashBalanceTh"
};
export default {
  // 存取码管理
  name: "AccessCode",
  data() {
    //  const lessOne = (rule, value, callback) => {
    //   if (value == '') {
    //     callback(new Error("请输入额度"));
    //   } else {
    //     callback();
    //   }
    // };
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
      // 弹窗类型:deposit 存码; withdraw 取码
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
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30
      },
      fromSearch: {
        card: "",
        isAdmin: false
      },

      // 表单校验
      rules: {
        chipAmount: [
          {
            validator: this.amountValidator,
            trigger: "blur"
          }
        ],
        cashAmount: [
          {
            validator: this.amountValidator,
            trigger: "blur"
          }
        ],
        chipAmountTh: [
          {
            validator: this.amountValidator,
            trigger: "blur"
          }
        ],
        cashAmountTh: [
          {
            validator: this.amountValidator,
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
  },
  created() {
    this.getList();
  },
  methods: {
    // chipAmountValidator(rule, value, callback) {
    //   // 筹码金额校验
    //   if (this.openType == "deposit") {
    //     // 存码的校验规则
    //     if (
    //       !this.form.chipAmount &&
    //       !this.form.cashAmount &&
    //       !this.form.chipAmountTh &&
    //       !this.form.cashAmountTh
    //     ) {
    //       callback(new Error("请输入至少一个存码金额"));
    //     } else if (this.form.chipAmount && this.form.chipAmount <= 0) {
    //       callback(new Error("请输入大于0的数字"));
    //     } else {
    //       // 当筹码金额通过校验时，如果现金金额通过校验，则移除现金的校验结果果
    //       if (
    //         !this.form.cashAmount ||
    //         (this.form.cashAmount && this.form.cashAmount > 0)
    //       ) {
    //         this.$refs["form"].clearValidate("cashAmount");
    //       }
    //       callback();
    //     }
    //   } else {
    //     // 取码的校验规则
    //     if (
    //       !this.form.chipAmount &&
    //       !this.form.cashAmount &&
    //       !this.form.chipAmountTh &&
    //       !this.form.cashAmountTh
    //     ) {
    //       callback(new Error("请输入至少一个取码金额"));
    //     } else if (this.form.chipAmount && this.form.chipAmount <= 0) {
    //       callback(new Error("请输入大于0的数字"));
    //     } else if (
    //       this.form.chipAmount &&
    //       this.form.chipAmount > this.form.chipBalance
    //     ) {
    //       // 取出的筹码/现金必须小于等于现有筹码/现金，否则提示“余额不足“
    //       callback(new Error("余额不足"));
    //     } else if (this.form.chipAmount && this.form.chipBalance == 0) {
    //       // 现有筹码为0，对应的取出金额输入任何金额，提示“余额不足’
    //       callback(new Error("余额不足"));
    //     } else {
    //       // 当筹码金额通过校验时，如果现金金额通过校验，则移除该输入项的校验结果
    //       if (
    //         !this.form.cashAmount ||
    //         (this.form.cashAmount &&
    //           this.form.cashBalance > 0 &&
    //           this.form.cashAmount > 0 &&
    //           this.form.cashAmount <= this.cashBalance)
    //       ) {
    //         this.$refs["form"].clearValidate("cashAmount");
    //       }

    //       callback();
    //     }
    //   }
    // },
    // cashAmountValidator(rule, value, callback) {
    //   // 现金金额校验
    //   if (this.openType == "deposit") {
    //     // 存码的校验规则
    //     if (!this.form.chipAmount && !this.form.cashAmount) {
    //       callback(new Error("请输入至少一个存码金额"));
    //     } else if (this.form.cashAmount && this.form.cashAmount <= 0) {
    //       callback(new Error("请输入大于0的数字"));
    //     } else {
    //       // 当现金金额通过校验时，如果筹码金金额为空或者筹码金额不为空但是大于0，则移除筹码金额的校验结果
    //       if (
    //         !this.form.chipAmount ||
    //         (this.form.chipAmount && this.form.chipAmount > 0)
    //       ) {
    //         this.$refs["form"].clearValidate("chipAmount");
    //       }

    //       callback();
    //     }
    //   } else {
    //     // 取码的校验规则
    //     if (!this.form.chipAmount && !this.form.cashAmount) {
    //       callback(new Error("请输入至少一个取码金额"));
    //     } else if (this.form.cashAmount && this.form.cashAmount <= 0) {
    //       callback(new Error("请输入大于0的数字"));
    //     } else if (
    //       this.form.cashAmount &&
    //       this.form.cashAmount > this.form.cashBalance
    //     ) {
    //       callback(new Error("余额不足"));
    //     } else if (this.form.cashAmount && this.form.cashBalance == 0) {
    //       // 现有现金为0，对应的取出金额输入任何金额，提示“余额不足’
    //       callback(new Error("余额不足"));
    //     } else {
    //       // 如果现金金额符合校验,同时移除筹码金额的校验结果
    //       console.log("如果现金金额符合校验,同时移除筹码金额的校验结果");

    //       if (
    //         !this.form.chipAmount ||
    //         (this.form.chipAmount &&
    //           this.form.chipBalance > 0 &&
    //           this.form.chipAmount > 0 &&
    //           this.form.chipAmount <= this.chipBalance)
    //       ) {
    //         this.$refs["form"].clearValidate("chipAmount");
    //       }
    //       // else {
    //       //   console.log("再对筹码校验");
    //       //   this.$refs["form"].validate("chipAmount");
    //       // }

    //       callback();
    //     }
    //   }
    // },
    // 通用的金额校验
    amountValidator(rule, value, callback) {
      // console.log(rule,value);
      if (this.openType == "deposit") {
        // 存码的校验规则
        if (
          !this.form.chipAmount &&
          !this.form.cashAmount &&
          !this.form.chipAmountTh &&
          !this.form.cashAmountTh
        ) {
          callback(new Error("请输入至少一个存码金额"));
        } else if (value && value <= 0) {
          callback(new Error("请输入大于0的数字"));
        } else {
          callback();
        }
      } else {
        // 取码的校验规则

        // chipAmount->chipBalance
        const balanceField = fieldMap[rule.field];
        if (
          !this.form.chipAmount &&
          !this.form.cashAmount &&
          !this.form.chipAmountTh &&
          !this.form.cashAmountTh
        ) {
          callback(new Error("请输入至少一个取码金额"));
        } else if (value && value <= 0) {
          callback(new Error("请输入大于0的数字"));
        } else if (value && value > this.form[balanceField]) {
          // 取出的筹码/现金必须小于等于现有筹码/现金，否则提示“余额不足“
          callback(new Error("余额不足"));
        } else if (value && this.form[balanceField] == 0) {
          // 现有筹码为0，对应的取出金额输入任何金额，提示“余额不足’
          callback(new Error("余额不足"));
        } else {
          callback();
        }
      }
    },
    /** 查询用户列表 */
    getList() {
      let params = Object.assign({}, this.fromSearch, this.queryParams);
      params["isAdmin"] = this.fromSearch.isAdmin == false ? 0 : 1;
      this.loading = true;
      listAccessCode(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listAccessCodeTotal(params).then(response => {
        this.userTotal = response.data;

        this.loading = false;
      });
      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
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
          return;
        }
        if (index === 1 || index === 2 || index === 7) {
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
          sums[index] = Number(sums[index]).toFixed(2);
          if (index == 3 || index == 4 || index == 5 || index == 6) {
            // 金额需要保留两位小数点
            sums[index] = MoneyFormat(sums[index]);
          }
        } else {
          // sums[index] = 'N/A';
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
          return;
        }
        if (index === 3) {
          sums[index] = MoneyFormat(this.userTotal.chipBalance);
          return;
        }
        if (index === 4) {
          sums[index] = MoneyFormat(this.userTotal.cashBalance);
          return;
        }
        if (index === 5) {
          sums[index] = MoneyFormat(this.userTotal.chipBalanceTh);
          return;
        }
        if (index === 6) {
          sums[index] = MoneyFormat(this.userTotal.cashBalanceTh);
          return;
        }
        // if (index === 5) {
        //   sums[index] = MoneyFormat(this.userTotal.totalBalance);
        //   return;
        // }
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
        userName: "",
        chipAmount: "",
        cashAmount: "",
        chipAmountTh: "",
        cashAmountTh: "",
        totalBalance: "",
        remark: ""
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 存码 */
    handleSign(row) {
      this.reset();
      // this.form = Object.assign({}, row);
      this.form["card"] = row.card;
      this.form["remark"] = "";
      this.open = true;
      this.openType = "deposit";
      this.title = "存码";
    },

    /** 取码 */
    handleBack(row) {
      this.reset();
      // this.form = Object.assign({}, row);
      this.form = { ...this.form, ...row };
      // this.form["card"] = row.card;
      this.form["remark"] = "";
      this.open = true;
      this.openType = "withdraw";
      this.title = "取码";
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
          "$已存筹码余额",
          "$已存现金余额",
          "฿已存筹码余额",
          "฿已存现金余额",
          "备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "userName",
          "status",
          "chipBalance",
          "cashBalance",
          "chipBalanceTh",
          "cashBalanceTh",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `存取码管理列表-${time_str}`);
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j == "status") {
            return v["status"] == 0 ? "正常" : "停用";
          } else {
            return v[j];
          }
        })
      );
    },

    // 明细
    handleDetail(card) {
      this.$router.push({ name: "DepositInfo" ,query:{card:card}});
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.openType == "withdraw") {
        if (this.form.status == 1) {
          // 取码时 如果卡号停用，则提示“该卡号已停用”
          this.$modal.msgError("该卡号已停用");
          return;
        }
      }

      this.$refs["form"].validate((valid, res) => {
        if (valid) {
          this.form["chipAmount"] = Number(this.form["chipAmount"]);
          this.form["chipAmountTh"] = Number(this.form["chipAmountTh"]);
          this.form["cashAmount"] = Number(this.form["cashAmount"]);
          this.form["cashAmountTh"] = Number(this.form["cashAmountTh"]);

          if (this.openType == "withdraw") {
            updateCodeFetching(this.form)
              .then(response => {
                this.$modal.msgSuccess("取码成功");

                this.open = false;
                this.getList();
              })
              .catch(err => {
                this.$modal.msgError("取码失败");
              });
          } else {
            // this.form["cardType"] = 1;
            saveCode(this.form)
              .then(response => {
                this.$modal.msgSuccess("存码成功");
                this.open = false;
                this.getList();
              })
              .catch(err => {
                this.$modal.msgError("存码失败");
              });
          }
        } else {
          //提示校验错误
          this.$modal.msgError(Object.values(res)[0][0].message);
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

.access-code-form {
  .el-form-item.is-error .access-input .el-input__inner {
    border-color: #dcdfe6 !important;
  }
}
</style>
