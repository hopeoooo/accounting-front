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
          label-width="120px"
        >
          <el-form-item :label="$t('Staff-Work-Number')" prop="userName"  label-width="180px">
            <el-input
              v-model="queryParams.userName"
              placeholder=""
              clearable
              style="width: 240px; margin-right: 20px"
            />
          </el-form-item>
          <el-form-item  :label="$t('Statistical-time')" >
            <el-date-picker
              v-model="queryParams.dateRange"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              :start-placeholder="$t('start-time')"
              :end-placeholder="$t('end-time')"
              clearable
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >{{$t("Enq")}}</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >{{$t("Rst")}}</el-button
            >
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="userList" :empty-text="$t('no-data')">
          <el-table-column :label="$t('Sort-by')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Job-Number')"
            align="center"
            key="userName"
            prop="userName"
          />
          <el-table-column
             :label="$t('Name')"
            align="center"
            key="nickName"
            prop="nickName"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('Number-of-entries')" align="center" key="input">
            <template slot-scope="scope">
              <span>{{ scope.row.input || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('Number-of-errors')"  align="center" key="waterAmount">
            <template slot-scope="scope">
              <span>{{ scope.row.error || 0 }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('Error-rate')" align="center" key="errorRate">
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
          this.queryParams.dateRange && this.queryParams.dateRange.length > 0
            ? this.queryParams.dateRange[0]
            : "",
        endTime:
          this.queryParams.dateRange &&this.queryParams.dateRange.length > 0
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
