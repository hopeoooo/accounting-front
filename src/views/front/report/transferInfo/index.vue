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
          <el-form-item label="会员卡号" prop="card">
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 240px;margin-right:20px"
            />

            <el-checkbox v-model="queryParams.isAdmin"
              >过滤内部卡号</el-checkbox
            >
          </el-form-item>
          <el-form-item label="操作类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="全部">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="汇入" :value="11"></el-option>
              <el-option label="汇出" :value="12"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货币类型" prop="type">
            <el-select v-model="queryParams.operationType" placeholder="全部">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="筹码" :value="0"></el-option>
              <el-option label="现金" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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

        <el-table v-loading="loading" :data="userList">
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
          <el-table-column label="类型" align="center" key="type" prop="type">
            <template slot-scope="scope">
              <span v-if="scope.row.type == '11'">汇入</span>
              <span v-if="scope.row.type == '12'">汇出</span>
            </template>
          </el-table-column>
          <el-table-column
            label="货币类型"
            align="center"
            key="operationType"
            prop="operationType"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.operationType == 0">筹码</span>
              <span v-if="scope.row.operationType == 1">现金</span>
            </template>
          </el-table-column>
          <el-table-column
            label="$金额"
            align="center"
            key="amount"
            prop="amount"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.amount | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="฿金额"
            align="center"
            key="amountTh"
            prop="amountTh"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.amountTh | MoneyFormat }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="操作时间"
            align="center"
            key="operationTime"
            prop="operationTime"
          />

          <el-table-column
            label="操作员"
            align="center"
            key="createBy"
            prop="createBy"
          />

          <el-table-column
            label="操作备注"
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
  listRemittanceDetailed,
  listRemittanceDetailedTotal
} from "@/api/report/report";
import { MoneyFormat } from "@/filter";
export default {
  // 汇款明细表
  name: "transferInfo",
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
      queryParams: {
        card: "",
        isAdmin: 0,
        type: null,
        operationType: null,
        dateRange: [],
        pageNum: 1,
        pageSize: 30
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
    /** 查询明细列表 */
    getList() {
      let params = {
        card: this.queryParams.card,
        type: this.queryParams.type,
        operationType: this.queryParams.operationType,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };

      params["isAdmin"] = this.queryParams.isAdmin == false ? 0 : 1;

      if (this.dateRange) {
        params["startTime"] = this.addDateRange(this.dateRange)[0];
        params["endTime"] = this.addDateRange(this.dateRange)[1];
      }
      this.loading = true;
      listRemittanceDetailed(params).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      listRemittanceDetailedTotal(params).then(response => {
        this.userTotal = response.data;
        this.loading = false;
      });

      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
    },

    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams = {
        card: "",
        isAdmin: 0,
        type: null,
        operationType: null,
        pageNum: 1,
        pageSize: this.queryParams.pageSize
      };
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
          "姓名",
          "类型",
          "货币类型",
          "$金额",
          "฿金额",
          "操作时间",
          "操作员",
          "操作备注"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "userName",
          "type",
          "operationType",
          "amount",
          "amountTh",
          "operationTime",
          "createBy",
          "remark"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        const time_str = this.$getCurrentTime();
        export_json_to_excel(tHeader, data, `汇款明细表-${time_str}`);
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j == "type") {
            let result = "";
            switch (v[j]) {
              case 11:
                result = "汇入";
                break;
              case 12:
                result = "汇出";
                break;
              default:
                break;
            }
            return result;
          }
                   if (j == "operationType") {
            let result = "";
            switch (v[j]) {
              case 0:
                result = "筹码";
                break;
              case 1:
                result = "现金";
                break;
              default:
                break;
            }
            return result;
          }

          return v[j];
        })
      );
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
