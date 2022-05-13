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
          <el-form-item label="员工工号" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder=""
              clearable
              style="width: 240px; margin-right: 20px"
            />
          </el-form-item>
          <el-form-item label="统计时间">
            <el-date-picker
              v-model="queryParams.dateRange"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
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

        <el-table v-loading="loading" :data="userList">
          <el-table-column label="排序" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="工号"
            align="center"
            key="userName"
            prop="userName"
          />
          <el-table-column
            label="姓名"
            align="center"
            key="nickName"
            prop="nickName"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="录入次数" align="center" key="input">
            <template slot-scope="scope">
              <span>{{ scope.row.input || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="错误次数" align="center" key="waterAmount">
            <template slot-scope="scope">
              <span>{{ scope.row.error || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="错误率" align="center" key="errorRate">
            <template slot-scope="scope">
              <span>{{ scope.row.errorRate }}</span>
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
import { listInputError } from "@/api/report/report";
import moment from "moment"
export default {
  // 员工录入错账报表
  name: "Error",
  data() {
    return {
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
        userName: "",
        isAdmin: 0,
        cardType: 0,
        dateRange: [],
        pageNum:1,
        pageSize:30,
      }
    };
  },

  created() {
    this.getList();
  },

  methods: {
    /** 查询明细列表 */
    getList() {
      let params = {
        userName: this.queryParams.userName,
        startTime:
          this.queryParams.dateRange.length > 0
            ? this.queryParams.dateRange[0]
            : "",
        endTime:
          this.queryParams.dateRange.length > 0
            ? this.queryParams.dateRange[1]
            : "",
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };

      this.loading = true;
      listInputError(params)
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

    // 表单重置
    reset() {
      this.form = {
        card: "",
        userName: "",
        signedAmount: "",
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
      this.queryParams = {
        userName: "",
        pageNum: 1,
        dateRange: [],
        pageSize: this.queryParams.pageSize
      };
      this.resetForm("queryForm");
      this.handleQuery();
    }
  }
};
</script>
<style lang="scss"></style>
