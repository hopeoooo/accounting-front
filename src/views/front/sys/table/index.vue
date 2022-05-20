<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tableList"
      show-summary
      sum-text="总计"
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="桌台编号" prop="tableId" width="120" />
      <el-table-column
        label="游戏类型"
        prop="gameName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="$筹码点码基数" prop="chipPointBase" />
      <el-table-column label="$现金点码基数" prop="cashPointBase" />
      <el-table-column label="$保险筹码点码基数" prop="insurancePointBase" />
      <el-table-column label="฿筹码点码基数" prop="chipPointBaseTh" />
      <el-table-column label="฿现金点码基数" prop="cashPointBaseTh" />
      <el-table-column label="฿保险筹码点码基数" prop="insurancePointBaseTh" />
      <el-table-column label="IP" prop="ip" />

      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="150px"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      @close="onDialogClose"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="桌台编号" prop="tableId">
          <el-input
            v-model.number="form.tableId"
            placeholder="请输入桌台编号"
          />
        </el-form-item>

        <el-form-item label="游戏类型" prop="gameName">
          <el-select v-model="form.gameName" placeholder="请选择游戏类型">
            <el-option label="百家乐" value="百家乐"></el-option>
            <el-option label="龙虎" value="龙虎"></el-option>
            <el-option label="牛牛" value="牛牛"></el-option>
            <el-option label="三公" value="三公"></el-option>
            <el-option label="推筒子" value="推筒子"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入..."></el-input>
        </el-form-item>
        <el-form-item label="$筹码点码基数" prop="chipPointBase">
          <el-input
            v-model="form.chipPointBase"
            placeholder="请输入..."
          ></el-input>
        </el-form-item>
        <el-form-item label="$现金点码基数" prop="cashPointBase">
          <el-input
            v-model="form.cashPointBase"
            placeholder="请输入..."
          ></el-input>
        </el-form-item>
        <el-form-item label="฿筹码点码基数" prop="chipPointBaseTh">
          <el-input
            v-model="form.chipPointBaseTh"
            placeholder="请输入..."
          ></el-input>
        </el-form-item>
        <el-form-item label="฿现金点码基数" prop="cashPointBaseTh">
          <el-input
            v-model="form.cashPointBaseTh"
            placeholder="请输入..."
          ></el-input>
        </el-form-item>
        <el-form-item label="$保险筹码点码基数" prop="insurancePointBase">
          <el-input
            v-model="form.insurancePointBase"
            placeholder="请输入..."
          ></el-input>
        </el-form-item>
        <el-form-item label="฿保险筹码点码基数" prop="insurancePointBaseTh">
          <el-input
            v-model="form.insurancePointBaseTh"
            placeholder="请输入..."
          ></el-input>
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
  listTable,
  listTableTotal,
  addUpTable,
  delTable
} from "@/api/sys/table";

export default {
  name: "Table",
  data() {
    const validateIP = (rule, value, callback) => {
      if (value === "" || typeof value === "undefined" || value == null) {
        callback(new Error("请输入正确的IP地址"));
      } else {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (!reg.test(value) && value !== "") {
          callback(new Error("请输入正确的IP地址"));
        } else {
          callback();
        }
      }
    };
    return {
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
      // 角色表格数据
      tableList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openType: "", //add 新增;  edit 编辑
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项

      // 菜单列表
      menuOptions: [],
      // 部门列表
      tableTotal: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        tableId: [
          { required: true, message: "桌台编号不能为空", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
          {
            validator: this.numberValitor,
            // message: "请输入大于0的数字",
            trigger: "blur"
          }
        ],
        gameName: [
          { required: true, message: "请选择游戏类型", trigger: "change" }
        ],
        ip: [
          {
            required: true,
            message: "请输入正确的IP地址",
            // validator: validateIP,
            trigger: "blur"
          }
        ],
        chipPointBase: [
          {
            required: true,
            message: "美元筹码点码基数不能为空",
            trigger: "blur"
          },
          // { type: "number", message: "请输入数字", trigger: "blur" },
          {
            validator: this.numberValitor,
            message: "请输入大于0的数字",
            trigger: "blur"
          }
        ],
        cashPointBase: [
          {
            required: true,
            message: "美元现金点码基数不能为空",
            trigger: "blur"
          },
          // { type: "number", message: "请输入数字", trigger: "blur" },
          {
            validator: this.numberValitor,
            message: "请输入大于0的数字",
            trigger: "blur"
          }
        ],
        insurancePointBase: [
          {
            required: true,
            message: "美元保险筹码点码基数不能为空",
            trigger: "blur"
          },
          // { type: "number", message: "请输入数字", trigger: "blur" },
          {
            validator: this.numberValitor,
            message: "请输入大于0的数字"
          }
        ],
        chipPointBaseTh: [
          {
            required: true,
            message: "泰铢筹码点码基数不能为空",
            trigger: "blur"
          },
          // { type: "number", message: "请输入数字", trigger: "blur" },
          {
            validator: this.numberValitor,
            message: "请输入大于0的数字",
            trigger: "blur"
          }
        ],
        cashPointBaseTh: [
          {
            required: true,
            message: "泰铢现金点码基数不能为空",
            trigger: "blur"
          },
          // { type: "number", message: "请输入数字", trigger: "blur" },
          {
            validator: this.numberValitor,
            message: "请输入大于0的数字",
            trigger: "blur"
          }
        ],
        insurancePointBaseTh: [
          {
            required: true,
            message: "泰铢保险筹码点码基数不能为空",
            trigger: "blur"
          },
          // { type: "number", message: "请输入数字", trigger: "blur" },
          {
            validator: this.numberValitor,
            message: "请输入大于0的数字"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    numberValitor(rule, value, callback) {
      // 大于0的数字数字校验
      // 请输入大于0的数字
      if (isNaN(value)) {
        callback(new Error("请输入数字"));
      }
      if (value < 0) {
        callback(new Error("请输入正确数字"));
      } else {
        callback();
      }
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listTable(this.queryParams)
        .then(response => {
          this.tableList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      listTableTotal(this.queryParams)
        .then(response => {
          this.tableTotal = response.data;

          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then(response => {
        this.tableOptions = response.depts;
        return response;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        tableId: "",
        id: "",
        gameId: "",
        gameName: "",
        ip: "",
        chipPointBase: "",
        cashPointBase: "",
        insurancePointBase: ""
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.openType = "add";
      this.title = "新增桌台";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      this.form = Object.assign({}, row);
      this.open = true;
      this.openType = "edit";
      this.title = "编辑桌台";
      // addUpTable({id:id}).then(response => {
      //   // this.form = response.data;

      // });
    },
    // 弹窗关闭时
    onDialogClose() {
      this.openType = "";
    },

    /** 提交按钮 */
    submitForm: function() {
      if (this.form.gameName == "百家乐") {
        this.form.gameId = 1;
      } else if (this.form.gameName == "龙虎") {
        this.form.gameId = 2;
      } else if (this.form.gameName == "牛牛") {
        this.form.gameId = 3;
      } else if (this.form.gameName == "三公") {
        this.form.gameId = 4;
      } else if (this.form.gameName == "推筒子") {
        this.form.gameId = 5;
      }
      console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.openType == "add") {
            addUpTable(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUpTable(this.form).then(response => {
              this.$modal.msgSuccess("编辑成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id || this.ids;
      this.$modal
        .confirm("是否确认删除该桌台？")
        .then(function() {
          return delTable(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
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
        if (index === 2) {
          sums[index] = this.tableTotal.chipPointBase;
          return;
        }
        if (index === 3) {
          sums[index] = this.tableTotal.cashPointBase;
          return;
        }
        if (index === 4) {
          sums[index] = this.tableTotal.insurancePointBase;
          return;
        }
        if (index === 5) {
          sums[index] = this.tableTotal.chipPointBaseTh;
          return;
        }
        if (index === 6) {
          sums[index] = this.tableTotal.cashPointBaseTh;
          return;
        }
        if (index === 7) {
          sums[index] = this.tableTotal.insurancePointBaseTh;
          return;
        }
      });
      return sums;
    }
  }
};
</script>
