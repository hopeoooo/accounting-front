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
          >{{ $t("Add-New") }}</el-button
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
      <el-table-column :label="$t('T-No')" prop="tableId" :width="currentLanguage == 'zh' ? '' : '120px'" />
      <el-table-column :label="$t('Game-type')" prop="gameId"  :width="currentLanguage == 'zh' ? '' : '120px'">
        <template slot-scope="scope">
          <span>{{ getGameName(scope.row.gameId) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="'$' + $t('Chip-Point-Base')"
        prop="chipPointBase"
        :width="currentLanguage == 'zh' ? '150px' : '150px'"
      />
      <el-table-column
        :label="'$' + $t('Cash-Point-Base')"
        prop="cashPointBase"
        :width="currentLanguage == 'zh' ? '150px' : '150px'"
      />
      <el-table-column
        :label="'$' + $t('Insurance-Chip-Point-Base')"
        prop="insurancePointBase"
        :width="currentLanguage == 'zh' ? '150px' : '220px'"
      />
      <el-table-column
        :label="'฿' + $t('Chip-Point-Base')"
        prop="chipPointBaseTh"
        :width="currentLanguage == 'zh' ? '150px' : '150px'"
      />
      <el-table-column
        :label="'฿' + $t('Cash-Point-Base')"
        prop="cashPointBaseTh"
        :width="currentLanguage == 'zh' ? '150px' : '150px'"
      />
      <el-table-column
        :label="'฿' + $t('Insurance-Chip-Point-Base')"
        prop="insurancePointBaseTh"
        :width="currentLanguage == 'zh' ? '150px' : '220px'"
      />
      <el-table-column label="IP" prop="ip" width="150px" />

      <el-table-column
        :label="$t('Create-Time')"
        align="center"
        prop="createTime"
        width="180px"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('Opr')"
        align="center"
        class-name="small-padding fixed-width"
        width="150px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >{{ $t("Edit") }}</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >{{ $t("Del") }}</el-button
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
      v-if="open"
      :width="currentLanguage == 'zh' ? '500px' : '650px'"
      @close="onDialogClose"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="currentLanguage == 'zh' ? '150px' : '220px'"
      >
        <el-form-item :label="$t('T-No')" prop="tableId">
          <el-input
            v-model.number="form.tableId"
            :placeholder="$t('Please-enter-a-T-No')"
          />
        </el-form-item>

        <el-form-item :label="$t('Game-type')" prop="gameId">
          <el-select
            v-model="form.gameId"
            :placeholder="$t('select-a-game-type')"
            @change="onGameChange"
          >
            <el-option :label="$t('Baccarat')" :value="1"></el-option>
            <el-option :label="$t('DT')" :value="2"></el-option>
            <el-option :label="$t('Niu-Niu')" :value="3"></el-option>
            <el-option :label="$t('San-Gong')" :value="4"></el-option>
            <el-option :label="$t('Tui-Tong-Zi')" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input
            v-model="form.ip"
            :placeholder="$t('Please-enter') + '...'"
          ></el-input>
        </el-form-item>
        <el-form-item :label="'$' + $t('Chip-Point-Base')" prop="chipPointBase">
          <el-input
            v-model="form.chipPointBase"
            :placeholder="$t('Please-enter') + '...'"
             oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          ></el-input>
        </el-form-item>
        <el-form-item :label="'$' + $t('Cash-Point-Base')" prop="cashPointBase">
          <el-input
            v-model="form.cashPointBase"
            :placeholder="$t('Please-enter') + '...'"
             oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="'฿' + $t('Chip-Point-Base')"
          prop="chipPointBaseTh"
        >
          <el-input
            v-model="form.chipPointBaseTh"
            :placeholder="$t('Please-enter') + '...'"
             oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="'฿' + $t('Cash-Point-Base')"
          prop="cashPointBaseTh"
        >
          <el-input
            v-model="form.cashPointBaseTh"
            :placeholder="$t('Please-enter') + '...'"
             oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="'$' + $t('Insurance-Chip-Point-Base')"
          prop="insurancePointBase"
        >
          <el-input
            v-model="form.insurancePointBase"
            :placeholder="$t('Please-enter') + '...'"
             oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            :disabled="form.gameId != 1"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="'฿' + $t('Insurance-Chip-Point-Base')"
          prop="insurancePointBaseTh"
        >
          <el-input
            v-model="form.insurancePointBaseTh"
            :placeholder="$t('Please-enter') + '...'"
             oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            :disabled="form.gameId != 1"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="submitForm">{{ $t("OK") }}</el-button>
        <el-button @click="cancel">{{ $t("Cancel") }}</el-button>
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
import { mapState, mapMutations } from "vuex";
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
      }
    };
  },
  computed: {
    ...mapState("app", ["currentLanguage"]),
    // 游戏类型列表
    Gameoptions() {
      return [
        {
          value: "",
          label: this.$t("All")
          // label: "全部"
        },
        {
          value: 1,
          label: this.$t("Baccarat")
          // label: "百家乐"
        },
        {
          value: 2,
          label: this.$t("DT")
          // label: "龙虎"
        },
        {
          value: 3,
          label: this.$t("Niu-Niu")
          // label: "牛牛"
        },
        {
          value: 4,
          label: this.$t("San-Gong")
          // label: "三公"
        },
        {
          value: 5,
          label: this.$t("Tui-Tong-Zi")
          // label: "推筒子"
        }
      ];
    },
    rules() {
      return {
        tableId: [
          {
            required: true,
            message: this.$t("T-NO.cannot-be-empty"),
            trigger: "blur"
          },
          {
            type: "number",
            message: this.$t("Please-enter-a-number"),
            trigger: "blur"
          },
          {
            validator: this.numberValitor,
            trigger: "blur"
          }
        ],
        gameId: [
          {
            required: true,
            message: this.$t("Please-select-a-game-type"),
            trigger: "change"
          }
        ],
        ip: [
          {
            required: true,
            message: this.$t("Please-enter-the-correct-IP-address"),
            // validator: validateIP,
            trigger: "blur"
          }
        ],
        chipPointBase: [
          {
            required: true,
            message: this.$t("Dollar-Chip-Point-Base-cannot-be-empty"),
            trigger: "blur"
          },
          // { type: "number", message: this.$t("Please-enter-a-number"), trigger: "blur" },
          {
            validator: this.numberValitor,
            message: this.$t("Please-enter-a-No-greater-than-0"),
            trigger: "blur"
          }
        ],
        cashPointBase: [
          {
            required: true,
            message: this.$t("USD-Cash-Point-Base-cannot-be-empty"),
            trigger: "blur"
          },
          // { type: "number", message: this.$t("Please-enter-a-number"), trigger: "blur" },
          {
            validator: this.numberValitor,
            message: this.$t("Please-enter-a-No-greater-than-0"),
            trigger: "blur"
          }
        ],
        insurancePointBase: [
          {
            required: this.form.gameId == 1 ? true : false,
            message: this.$t("USD-insurance-chip-point-base-cannot-be-empty"),
            trigger: "blur"
          },

          {
            validator: this.numberValitor,
            message: this.$t("Please-enter-a-No-greater-than-0")
          }
        ],
        chipPointBaseTh: [
          {
            required: true,
            message: this.$t("Thai-baht-chip-point-base-cannot-be-empty"),
            trigger: "blur"
          },
          // { type: "number", message: this.$t("Please-enter-a-number"), trigger: "blur" },
          {
            validator: this.numberValitor,
            message: this.$t("Please-enter-a-No-greater-than-0"),
            trigger: "blur"
          }
        ],
        cashPointBaseTh: [
          {
            required: true,
            message: this.$t("Thai-Baht-Cash-Point-Base-cannot-be-empty"),
            trigger: "blur"
          },
          // { type: "number", message: this.$t("Please-enter-a-number"), trigger: "blur" },
          {
            validator: this.numberValitor,
            message: this.$t("Please-enter-a-No-greater-than-0"),
            trigger: "blur"
          }
        ],
        insurancePointBaseTh: [
          {
            required: this.form.gameId == 1 ? true : false,
            message: this.$t("Baht-insurance-chip-point-base-cannot-be-empty"),
            trigger: "blur"
          },
          // { type: "number", message: this.$t("Please-enter-a-number"), trigger: "blur" },
          {
            validator: this.numberValitor,
            message: this.$t("Please-enter-a-No-greater-than-0")
          }
        ]
      };
    }
  },
  created() {
    this.getList();
  },
  methods: {
    numberValitor(rule, value, callback) {
      if (this.form.gameId != 1) {
        // 非百家乐的情况下不对保险系数进行校验
        if (
          rule.field == "insurancePointBase" ||
          rule.field == "insurancePointBaseTh"
        ) {
          callback();
        }
      }

      // 大于0的数字数字校验
      // 请输入大于0的数字
      if (isNaN(value)) {
        callback(new Error(this.$t("Please-enter-a-number")));
      }
      if (value < 0) {
        callback(new Error(this.$t("Please-enter-a-No-greater-than-0")));
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
      this.$refs.form && this.$refs.form.resetFields();
      this.$refs.form && this.$refs.form.clearValidate();
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
        insurancePointBase: "",
        chipPointBaseTh: "",
        cashPointBaseTh: "",
        insurancePointBaseTh: ""
      };
      this.resetForm("form");
      this.$refs.form && this.$refs.form.resetFields();
      this.$refs.form && this.$refs.form.clearValidate();
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
      this.title = this.$t("Add-a-new-table");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      this.form = Object.assign({}, row);
      this.open = true;
      this.openType = "edit";
      this.title = this.$t("Add-a-new-table");
      this.$refs.form && this.$refs.form.resetFields();
      this.$refs.form && this.$refs.form.clearValidate();
    },
    // 弹窗关闭时
    onDialogClose() {
      this.openType = "";
      this.$refs.form && this.$refs.form.resetFields();
    },

    onGameChange(gameId) {
      console.log(gameId);
      const game = this.Gameoptions.filter(item => item.value == gameId)[0];
      this.form.gameName = game.label;
      if (gameId == 1) {
        this.form.insurancePointBase = "";
        this.form.insurancePointBaseTh = "";
      } else {
        this.form.insurancePointBase = 0;
        this.form.insurancePointBaseTh = 0;
      }
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

    /** 提交按钮 */
    submitForm: function() {
      // if (this.form.gameName == "百家乐") {
      //   this.form.gameId = 1;
      // } else if (this.form.gameName == "龙虎") {
      //   this.form.gameId = 2;
      // } else if (this.form.gameName == "牛牛") {
      //   this.form.gameId = 3;
      // } else if (this.form.gameName == "三公") {
      //   this.form.gameId = 4;
      // } else if (this.form.gameName == "推筒子") {
      //   this.form.gameId = 5;
      // }
      console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.openType == "add") {
            addUpTable(this.form).then(response => {
              this.$modal.msgSuccess(this.$t("Add-success"));
              this.open = false;
              this.getList();
            });
          } else {
            addUpTable(this.form).then(response => {
              this.$modal.msgSuccess(this.$t("Edit-successful"));
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
        .confirm(this.$t("Confirm-deletion-of-the-table"))
        .then(function() {
          return delTable(id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("Deletion-successful"));
        })
        .catch(() => {});
    },
    //总计规则
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t("Tot");
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
