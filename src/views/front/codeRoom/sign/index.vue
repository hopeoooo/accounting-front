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
            label="现有签单额"
            align="center"
            sortable
            key="signedAmount"
            prop="signedAmount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.signedAmount | MoneyFormat }}</span>
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
            width="260"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope" v-if="scope.row.userId !== 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleSign(scope.row)"
                >签单</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row)"
                >还单</el-button
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
        <el-table
          v-loading="loading"
          :data="userList"
          show-summary
          sum-text="合计"
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
            label="现有签单额"
            align="center"
            sortable
            key="signedAmount"
            prop="signedAmount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.signedAmount | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="备注"
            align="center"
            key="remark"
            prop="remark"
            width="150"
            :show-overflow-tooltip="true"
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
                @click="handleSign(scope.row)"
                >签单</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row)"
                >还单</el-button
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
      width="600px"
      append-to-body
      v-if="open"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="卡号" prop="card">
          <el-input v-model="form.card" placeholder="" :disabled="true" />
        </el-form-item>
        <el-form-item
          label="现有签单金额"
          prop="signedAmount"
          v-if="openType == 'back'"
        >
          <el-input
            v-model="form.signedAmount"
            placeholder=""
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="签单金额" prop="amount" v-if="openType == 'sign'">
          <el-input v-model="form.amount" placeholder="" />
        </el-form-item>
        <el-form-item label="还单金额" prop="amount" v-if="openType == 'back'">
          <el-input v-model="form.amount" placeholder="" />
        </el-form-item>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
import { MoneyFormat } from "@/filter";
export default {
  name: "Sign",
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
      userData: [],
      userTotal: "",
      //会员详情
      memlist: {},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 弹窗类型:sign 签单; back 还单
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
      fromSearch: {
        card: "",
        isAdmin: false
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30
      },

      // 表单校验
      rules: {
        amount: [
          {
            required: true,
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入大于0的数字",
            trigger: "blur"
          }
        ]
        // phonenumber: [
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur"
        //   }
        // ]
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
    /** 查询用户列表 */
    getList() {
      let params = Object.assign({}, this.fromSearch, this.queryParams);
      params["isAdmin"] = this.fromSearch.isAdmin == false ? 0 : 1;
      this.loading = true;
      listSign(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listSignTotal(params).then(response => {
        this.userTotal = response.data.signed_amount;

        this.loading = false;
      });
      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
      listSign(params).then(response => {
        this.userData = response.rows;
        console.log(this.userData);
      });
    },

    // status_change: function (row) {
    //         if (row.row.signedAmount > 0) {
    //           return 'table-info-red'
    //         }
    // },
    //合计规则
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 3) {
          sums[index] = MoneyFormat(this.userTotal);
          return;
        }
      });
      return sums;
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
        if (index === 1 || index === 2 || index === 4) {
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
          if (index == 3) {
            // 金额需要保留两位小数点
            sums[index] = MoneyFormat(sums[index]);
          }
        } else {
          // sums[index] = 'N/A';
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
        remark: "",
        amount: ""
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
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 签单 */
    handleSign(row) {
      this.reset();
      const { card } = row;
      this.form = { ...this.form, ...{ card } };
      this.open = true;
      this.openType = "sign";
      this.title = "签单";
    },

    /** 还单 */
    handleBack(row) {
      // this.reset();
      const { card, signedAmount } = row;
      this.form = { ...this.form, ...{ card, signedAmount } };
      this.open = true;
      this.openType = "back";
      this.title = "还单";
    },
    // 明细
    handleDetail() {
      //TODO: 前往明细表
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
          "现有签单金额",
          "操作备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "userName",
          "status",
          "signedAmount",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `签单列表-${time_str}`);
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
    // 打印
    handlePrint() {},
    // 明细
    handleDetail() {},
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
.table-info-red td {
  // background: rgb(199, 135, 135);
}
</style>
