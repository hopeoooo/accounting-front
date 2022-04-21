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
          v-hasPermi="['sys:table:add']"
        >新增</el-button>
      </el-col>
  
    </el-row>

    <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="桌台编号" prop="gameId" width="120" />
      <el-table-column label="游戏类型" prop="gameName" :show-overflow-tooltip="true"  />
      <el-table-column label="筹码点码基数" prop="chipPointBase" :show-overflow-tooltip="true"  />
      <el-table-column label="现金点码基数" prop="cashPointBase" />
      <el-table-column label="保险筹码点码基数" prop="insurancePointBase" />
     
      <el-table-column label="创建时间" align="center" prop="createTime" width="150px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sys:table:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sys:table:remove']"
          >删除</el-button>
         
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item label="桌台编号" prop="gameId">
          <el-input v-model="form.gameId" placeholder="请输入桌台编号" />
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
        <el-form-item label="筹码点码基数" prop="chipPointBase">
          <el-input v-model="form.chipPointBase"  placeholder="请输入..."></el-input>
        </el-form-item>
         <el-form-item label="现金点码基数" prop="cashPointBase">
          <el-input v-model="form.cashPointBase"  placeholder="请输入..."></el-input>
        </el-form-item>
         <el-form-item label="保险筹码点码基数" prop="insurancePointBase">
          <el-input v-model="form.insurancePointBase"  placeholder="请输入..."></el-input>
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
import { listTable,addUpTable,delTable } from "@/api/sys/table";

export default {
  name: "Table",
  data() {
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
    
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        gameId: [
          { required: true, message: "桌台编号不能为空", trigger: "blur" }
        ],
        gameName: [
          { required: true, message: "权限字符不能为空", trigger: "change" }
        ],
        chipPointBase: [
          { required: true, message: "筹码点码基数不能为空", trigger: "blur" }
        ],
         cashPointBase: [
          { required: true, message: "现金点码基数不能为空", trigger: "blur" }
        ],
         insurancePointBase: [
          { required: true, message: "保险筹码点码基数不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listTable().then(response => {
          this.tableList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
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
        gameId: '',
        gameName:'',
        chipPointBase:'',
        cashPointBase:'',
        insurancePointBase:''
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
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
   
   
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增桌台";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      addUpTable(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            let checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
                this.$nextTick(()=>{
                    this.$refs.menu.setChecked(v, true ,false);
                })
            })
          });
        });
        this.title = "编辑桌台";
      });
    },
   

    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //     if (this.form.gameId != undefined) {
      //       this.form.menuIds = this.getMenuAllCheckedKeys();
      //       addUpTable(this.form).then(response => {
      //         this.$modal.msgSuccess("修改成功");
      //         this.open = false;
      //         this.getList();
      //       });
      //     } else {
      //       this.form.gameId = this.getMenuAllCheckedKeys();
      //       addUpTable(this.form).then(response => {
      //         this.$modal.msgSuccess("新增成功");
      //         this.open = false;
      //         this.getList();
      //       });
      //     }
      //   }
      // });
    },
   
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$modal.confirm('是否确认删除该桌台？').then(function() {
        return delTable(roleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
 
  }
};
</script>