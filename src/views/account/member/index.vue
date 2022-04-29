<template>
  <div class="app-container">
    <el-row :gutter="20">
      
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
           <el-form-item label="" prop="gameName" >
            <el-select v-model="queryParams.type" placeholder="" style="width: 100px">
              <el-option label="卡号查询" value="card"></el-option>
              <el-option label="姓名查询" value="name"></el-option>
              <el-option label="电话号码查询" value="phone"></el-option>
            
            </el-select>
            <el-input
              v-model="queryParams.value"
              placeholder=""
              clearable
              style="width: 240px"
            />
           <el-checkbox v-model="queryParams.isChild">包含子卡</el-checkbox>
          </el-form-item>
        
           <el-form-item label="卡号状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="全部">
                  <el-option label="正常" :value="0"></el-option>
                  <el-option label="停用" :value="1"></el-option>
                </el-select>
            </el-form-item>
          <el-form-item label="创建时间">
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
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
         
        </el-row>

        <el-table v-loading="loading" :data="userList"  @selection-change="handleSelectionChange">
          <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" />
          <el-table-column label="卡号" align="center" key="card" prop="card" />
          <el-table-column label="姓名" align="center" key="name" prop="name"  :show-overflow-tooltip="true" />
          <el-table-column label="电话号码" align="center" key="phone" prop="phone" :show-overflow-tooltip="true" />
           <el-table-column label="状态" align="center" key="status" >
            <template slot-scope="scope">
              
              <!-- <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch> -->
              <span v-if="scope.row.status==0">正常</span>
              <span v-else style="color:red">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="卡类型" align="center" key="cardType" prop="cardType"  >
             <template slot-scope="scope">
               <span >{{scope.row.cardType==0?'主卡':'子卡'}}</span>
            </template>
          </el-table-column>
           <el-table-column label="是否是内部卡号" align="center" key="isAdmin" prop="isAdmin"  >
             <template slot-scope="scope">
               <span >{{scope.row.isAdmin==0?'否':'是'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center" key="sex" prop="sex" >
             <template slot-scope="scope">
               <span >{{scope.row.sex==0?'男':'女'}}</span>
            </template>
          </el-table-column>
           <el-table-column label="开户人" align="center" key="createBy" prop="createBy" width="120" />
             <el-table-column label="开户时间" align="center" prop="createTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" key="remark" prop="remark" width="220" />      
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
                icon="el-icon-edit"
                @click="handleMore(scope.row.id)"
              
              >更多信息</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              
              >修改</el-button>
              <el-button
                v-if="scope.row.cardType==0"
                size="mini"
                type="text"
                icon="el-icon-circle-plus-outline"
                @click="handleAddChild(scope.row.card)"
              
              >新增子卡</el-button>
           
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
        <el-row :gutter="0" v-if="isMain ==false">
          <el-col :span="12">
            <el-form-item label="卡号" prop="card">
              <el-input v-model="form.card" placeholder="请输入卡号" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名" />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" v-if="isMain">
          <el-col :span="12">
            <el-form-item label="主卡号" prop="parentCard">
              <el-input v-model="form.parentCard" :disabled="true" placeholder="请输入卡号" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名" />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" v-if="isMain">
          <el-col :span="12">
            <el-form-item label="子卡号" prop="card">
              <el-input v-model="form.card" placeholder="请输入卡号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" placeholder="">
                  <el-option label="男" :value="0"></el-option>
                  <el-option label="女" :value="1"></el-option>
                  <el-option label="未知" :value="2"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入电话" />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="确认密码" prop="rawPassword">
                <el-input v-model="form.rawPassword" placeholder="请输入确认密码" />
              </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="押金" prop="deposit">
              <el-input v-model="form.deposit" placeholder="请输入押金" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="补卡费" prop="repair">
                <el-input v-model="form.repair" placeholder="请输入补卡费" />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="占股比例" prop="shareRatio">
              <el-input v-model="form.shareRatio" placeholder="请输入占股比例" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="返点比例" prop="rebateRatio">
                <el-input v-model="form.rebateRatio" placeholder="请输入返点比例" />
              </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="百家乐洗码比例（筹码）" prop="baccaratRollingRatioChip" label-width="170px">
              <el-input style="width:50px" v-model="form.baccaratRollingRatioChip" placeholder="" />%
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="百家乐洗码比例（现金）" prop="baccaratRollingRatioCash" label-width="170px">
                <el-input style="width:50px" v-model="form.baccaratRollingRatioCash" placeholder="" />%
              </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="龙虎洗码比例（筹码）" prop="dragonTigerRatioChip" label-width="160px">
              <el-input style="width:50px" v-model="form.dragonTigerRatioChip" placeholder="" />%
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="龙虎洗码比例（现金）" prop="dragonTigerRatioCash" label-width="160px">
                <el-input style="width:50px" v-model="form.dragonTigerRatioCash" placeholder="" />%
              </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="是否可换现" prop="isCash">
                <el-select v-model="form.isCash" placeholder="" style="width:100px" >
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="是否可结算洗码" prop="isSettlement" label-width="110px">
                <el-select v-model="form.isSettlement" placeholder="" style="width:100px">
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="是否可汇出" prop="isOut">
                <el-select v-model="form.isOut" placeholder="" style="width:100px">
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="12">
              <el-form-item label="是否抽水" prop="isPump" label-width="110px">
                <el-select v-model="form.isPump" placeholder="" style="width:100px">
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row :gutter="0" >
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="" style="width:100px">
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
          </el-col>
           <!-- <el-col :span="12">
              <el-form-item label="是否走账" prop="isBill" label-width="110px">
                <el-select v-model="form.isBill" placeholder="" style="width:100px">
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
         <el-row :gutter="0" >
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
               <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="form.remark">
                </el-input>
            </el-form-item>
          </el-col>
         
        </el-row>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户详情 -->
    <el-dialog title="更多信息" :visible.sync="detailOpen" width="400px" append-to-body>
      <div class="detailBox">
        <div class="list"><span>押金</span><span>{{memlist.deposit?memlist.deposit: "-"}}</span></div>
        <div class="list"><span>补卡费</span><span>{{memlist.repair?memlist.repair: "-"}}</span></div>
        <div class="list"><span>占股比例</span><span>{{memlist.shareRatio?memlist.shareRatio:"-"}}</span></div>
        <div class="list"><span>返点比例</span><span>{{memlist.rebateRatio?memlist.rebateRatio: "-"}}</span></div>
        <div class="list"><span>百家乐洗码比例（筹码）</span><span>{{memlist.baccaratRollingRatioChip?memlist.baccaratRollingRatioChip: "-"}}</span></div>
        <div class="list"><span>百家乐洗码比例（现金）</span><span>{{memlist.baccaratRollingRatioCash?memlist.baccaratRollingRatioCash:"-"}}</span></div>
        <div class="list"><span>龙虎洗码比例（筹码）</span><span>{{memlist.dragonTigerRatioChip?memlist.dragonTigerRatioChip:"-"}}</span></div>
        <div class="list"><span>龙虎洗码比例（现金）</span><span>{{memlist.dragonTigerRatioCash?memlist.dragonTigerRatioCash:"-"}}</span></div>
        <div class="list"><span>是否抽水</span><span>{{memlist.isPump?(memlist.isPump==0?"否":"是"):'-'}}</span></div>
        <div class="list"><span>是否可换现</span><span>{{memlist.isCash?(memlist.isCash==0?"否":"是"):'-'}}</span></div>
        <div class="list"><span>是否可结算洗码</span><span>{{memlist.isSettlement?(memlist.isSettlement==0?"否":"是"):'-'}}</span></div>
        <div class="list"><span>是否可汇出</span><span>{{memlist.isOut?(memlist.isOut==0?"否":"是"):'-'}}</span></div>
         <!-- <div class="list"><span>是否走账</span><span>{{memlist.isBill?(memlist.isBill==0?"否":"是"):'-'}}</span></div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMambers,listMambersInfo,addMambers,updateMambers,delMambers, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from "@/api/account/member";
import { getToken } from "@/utils/auth";


export default {
  name: "Member",
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
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        type: 'card',
        value: '',
        isChild:'',
        status:'',
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
      console.log(this.queryParams)
       let type =this.queryParams.type
      let value = this.queryParams.value
      let createTime =''
      let endTime=''
      if(this.dateRange){
        createTime =this.addDateRange(this.dateRange)[0]
        endTime=this.addDateRange(this.dateRange)[1]
      }
      
      let params = {pageNum:1,pageSize:30}
      if(value){
        params[type] = value
      }else{
        params =params
      }
      params['isChild']=this.queryParams.isChild ==false?0:1
      params['status']=this.queryParams.status
      params['beginTime'] = createTime
      params['endTime'] = endTime
      console.log(params)
      this.loading = true;
      listMambers(params).then(response => {
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
    /** 新增按钮操作 */
    handleAddChild(parentCard) {
      
      this.reset();
      this.form["parentCard"]=parentCard
       this.open = true;
       this.isMain =true
      this.title = "新增子卡卡号";
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