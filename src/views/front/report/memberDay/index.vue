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
                    <el-form-item label="会员卡号" prop="userName">
                        <el-input
                            v-model="queryParams.card"
                            placeholder=""
                            clearable
                            style="width: 240px; margin-right: 20px"
                        />
                    </el-form-item>
                    <el-form-item label="统计时间">
                        <el-date-picker
                            v-model="queryParams.dateRange"
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
                        <el-button
                            icon="el-icon-refresh"
                            size="mini"
                            @click="resetQuery"
                            >重置</el-button
                        >
                    </el-form-item>
                </el-form>

                <el-table
                    v-loading="loading"
                    :data="userList"
                    show-summary
                    sum-text="总计"
                    :summary-method="getSummaries"
                >
                    <el-table-column
                        label="会员卡号"
                        align="center"
                        key="card"
                        prop="card"
                    />
                    <el-table-column label="姓名" align="center" key="name">
                        <template slot-scope="scope">
                            <span>{{ scope.row.name || "--" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="日期" align="center" key="date">
                        <template slot-scope="scope">
                            <span>{{ scope.row.date || "--" }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="$输赢" align="center" key="winLose">
                        <template slot-scope="scope">
                            <span>{{ scope.row.winLose || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="$卡号累计输赢"
                        align="center"
                        key="sumWinLose"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.sumWinLose || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="$洗码量" align="center" key="water">
                        <template slot-scope="scope">
                            <span>{{ scope.row.water || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="$卡号洗码量累计"
                        align="center"
                        key="sumWater"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.sumWater || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="฿输赢"
                        align="center"
                        key="chipWinLoseTh"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.chipWinLoseTh || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="฿卡号累计输赢"
                        align="center"
                        key="winLoseTh"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.winLoseTh || 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="฿洗码量"
                        align="center"
                        key="waterTh"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.waterTh || 0 }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="฿卡号洗码量累计"
                        align="center"
                        key="sumWaterTh"
                    >
                        <template slot-scope="scope">
                            <span>{{ scope.row.sumWaterTh || 0 }}</span>
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
import { listReport, totalReport } from "@/api/report/report";
export default {
    // 客户日报表
    name: "MemberDay",
    data() {
        return {
            //总计
            userTotal: {},
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
                label: "label",
            },
            queryParams: {
                card: "",
                isAdmin: 0,
                cardType: 0,
                dateRange: [],
            },
        };
    },

    created() {
        // this.getList();
    },

    methods: {
        /**
         * @description: 报表底部总计
         * @param {*} param
         * @return {*}
         */
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = "总计";
                    return;
                }
                if (index === 3) {
                    sums[index] = this.userTotal.winLose || 0;
                    return;
                }
                if (index === 4) {
                    sums[index] = this.userTotal.sumWinLose || 0;
                    return;
                }
                if (index === 5) {
                    sums[index] = this.userTotal.water || 0;
                    return;
                }
                if (index === 6) {
                    sums[index] = this.userTotal.sumWater || 0;
                    return;
                }
                if (index === 7) {
                    sums[index] = this.userTotal.winLoseTh || 0;
                    return;
                }
                if (index === 8) {
                    sums[index] = this.userTotal.sumWinLoseTh || 0;
                    return;
                }
                if (index === 9) {
                    sums[index] = this.userTotal.waterTh || 0;
                    return;
                }
                if (index === 10) {
                    sums[index] = this.userTotal.sumWaterTh || 0;
                    return;
                }
            });
            return sums;
        },
        /**
         * @description: 报表数据
         * @param {*}
         * @return {*}
         */
        getList() {
            let params = {
                card: this.queryParams.card,
                startTime:
                    this.queryParams.dateRange.length > 0
                        ? this.queryParams.dateRange[0]
                        : "",
                endTime:
                    this.queryParams.dateRange.length > 0
                        ? this.queryParams.dateRange[1]
                        : "",
                pageNum: this.queryParams.pageNum,
                pageSize: this.queryParams.pageSize,
            };

            this.loading = true;
            /**
             * @description: 列表
             * @param {*}
             * @return {*}
             */
            listReport(params).then((response) => {
                this.userList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
            /**
             * @description: 总计
             * @param {*}
             * @return {*}
             */
            totalReport(params).then((response) => {
                this.userTotal = response.data;
                this.loading = false;
            });
            this.$delete(params, "pageNum");
            this.$delete(params, "pageSize");
        },

        /**
         * @description: 重置表单
         * @param {*}
         * @return {*}
         */
        reset() {
            this.form = {
                card: "",
                userName: "",
                signedAmount: "",
                remark: "",
            };
            this.resetForm("form");
        },

        /**
         * @description: 查询按钮
         * @param {*}
         * @return {*}
         */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },

        /**
         * @description: 重置按钮
         * @param {*}
         * @return {*}
         */
        resetQuery() {
            this.queryParams = {
                card: "",
                pageNum: 1,
                dateRange: [],
                pageSize: this.queryParams.pageSize,
            };
            this.resetForm("queryForm");
            this.handleQuery();
        },
    },
};
</script>
<style lang="scss">
</style>
