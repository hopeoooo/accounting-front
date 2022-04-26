<template>
  <div class="app-container">
    <el-row :gutter="20">
      
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
           <el-form-item label="会员卡号" prop="card" >
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 240px"
            />
           <el-checkbox v-model="queryParams.isAdmin">过滤内部卡号</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >打印</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >明细</el-button>
          </el-col>
         
        </el-row>

        <el-table v-loading="loading" :data="userList"  @selection-change="handleSelectionChange">
          <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" />
          <el-table-column label="会员卡号" align="center" key="card" prop="card" />
          <el-table-column label="姓名" align="center" key="userName" prop="userName"  />
          <el-table-column label="是否可汇出" align="center" key="isAdmin" prop="isAdmin"  >
             <template slot-scope="scope">
               <span >{{scope.row.isAdmin==0?'否':'是'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" key="remark" prop="remark" />      
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
                @click="handleMore(scope.row.id)"
              
              >签单</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleMore(scope.row.id)"
              
              >签单</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleUpdate(scope.row)"
              
              >还单</el-button>
          
           
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
       <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="卡号" prop="card">
              <el-input v-model="form.card" placeholder="" />
            </el-form-item>
          <el-form-item label="买入筹码金额" prop="signedAmount">
              <el-input v-model="form.signedAmount" placeholder="" />
            </el-form-item>  
           <el-form-item label="换现金额" prop="signedAmount">
              <el-input v-model="form.signedAmount" placeholder="" />
          </el-form-item>  

            <el-form-item label="备注" prop="remark">
               <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="form.remark">
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
import { listSign,listSignTotal,addSigned,addReturnOrder} from "@/api/coderoom/sign";



export default {
  name: "Transfer",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.form.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // 添加卡号
      isMain:false,
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
      userList: null,
      //会员详情
      memlist:{
       
      },
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      detailOpen:false,
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
        pageSize: 30,
        card:'',
        isAdmin:false,
      },
      
      // 表单校验
      rules: {
        card: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        name: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
       password: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        rawPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
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
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
  
  },
  methods: {
    /** 查询用户列表 */
    getList() {

      let params = {pageNum:1,pageSize:30}
  
      params['isChild']=this.queryParams.isAdmin ==false?0:1
      params['card']=this.queryParams.card
      this.loading = true;
      listSign(params).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },

  
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        card: '',
        name:'',
        sex:0,
        phone:'',
        password:'',
        rawPassword:'',
        deposit:'',
        repair:'',
        shareRatio:'',
        rebateRatio:'',
        baccaratRollingRatioChip:'',
        baccaratRollingRatioCash:'',
        dragonTigerRatioChip:'',
        dragonTigerRatioCash:'',
        isCash:1,
        isSettlement:1,
        isOut:1,
        isPump:1,
        status:1,
        cardType:0,
        // isBill:'',
        remark:''

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
   
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
       this.open = true;
       this.isMain =false
      this.title = "新增卡号";
    },
   
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.form = Object.assign({},row)
      this.open = true;
      this.title = "卡号修改";
    },
    // 更多信息
   handleMore(id){
     this.loading = true;
     
      listMambersInfo({"id":id}).then(response => {
          this.memlist = response.data;
          this.loading = false;
          this.detailOpen =true
        }
      );
   },
 
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.title)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == "卡号修改") {
            updateMambers(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else if (this.title == "新增子卡卡号") {
            this.form['cardType']=1
            addMambers(this.form).then(response => {
              this.$modal.msgSuccess("新增子卡卡号成功");
              this.open = false;
              this.getList();
            });
          }else{
            addMambers(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      console.log(userIds.toString())
      this.$modal.confirm('是否确认删除该卡号').then(function() {
        return delMambers({'ids':userIds.toString()});
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
   
  }
};
</script>
<style lang="scss" scoped>
.detailBox{
  border: 1px solid #bcbcbc;
  .list{
    border-bottom: 1px solid #bcbcbc;
    span{
      display: inline-block;
      text-align: center;
      width: 49%;
      &:nth-child(1){
        border-right: 1px solid #bcbcbc;
        width: 50%;
      }
    }
  }
}
</style>