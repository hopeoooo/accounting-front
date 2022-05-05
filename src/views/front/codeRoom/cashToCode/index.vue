<template>
  <div class="app-container">
    <el-row :gutter="20">
      
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="fromSearch" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
           <el-form-item label="会员卡号" prop="card" >
            <el-input
              v-model="fromSearch.card"
              placeholder=""
              clearable
               style="width: 240px;margin-right:20px"
            />
           <el-checkbox v-model="fromSearch.isAdmin" >过滤内部卡号</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <!-- <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handlePrint"
            >打印</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-c-scale-to-original"
              size="mini"
              
              @click="handleDetail"
            >明细</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
         
        </el-row>

        <el-table v-loading="loading" :data="userList" show-summary sum-text="小计" :summary-method="getSummaries1"  @selection-change="handleSelectionChange">
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column label="会员卡号" align="center" key="card" prop="card" />
          <el-table-column label="姓名" align="center" key="userName" prop="userName"  />
           <el-table-column label="筹码余额" align="center" sortable key="chipAmount" prop="chipAmount" />
          <el-table-column label="是否可换现" align="center" key="isCash" prop="isCash" >
            <template slot-scope="scope">
              <span >{{scope.row.isCash==0?'否':'是'}}</span>
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
                @click="handleSign(scope.row.card)"
              
              >买码</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row.card)"
              
              >换现</el-button>
                <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row.card)"
              
              >明细</el-button>
           
            </template>
          </el-table-column>
        </el-table>
        <el-table v-loading="loading" :data="userList" show-summary sum-text="合计" class="table2" :summary-method="getSummaries"  @selection-change="handleSelectionChange">
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
         <el-table-column label="会员卡号" align="center" key="card" prop="card" />
          <el-table-column label="姓名" align="center" key="userName" prop="userName"  />
          <el-table-column label="筹码余额" align="center" sortable key="chipAmount" prop="chipAmount" />
          <el-table-column label="是否可换现" align="center" key="isCash" prop="isCash" >
            <template slot-scope="scope">
              <span >{{scope.row.isCash==0?'否':'是'}}</span>
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
                @click="handleSign(scope.row.card)"
              
              >买码</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row.card)"
              
              >换现</el-button>
               <el-button
                size="mini"
                type="text"
                icon="el-icon-document-remove"
                @click="handleBack(scope.row.card)"
              
              >明细</el-button>
          
           
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
       <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="卡号" prop="card">
              <el-input v-model="form.card" placeholder="" :disabled="true"/>
            </el-form-item>
          <el-form-item label="买入筹码金额" prop="chipAmount"  v-if="!isMain">
              <el-input v-model="form.chipAmount" placeholder="" />
            </el-form-item>   
           
           <el-form-item label="换现金额" prop="chipAmount"  v-if="isMain">
              <el-input v-model="form.chipAmount" placeholder="" />
            </el-form-item>   
          

           <el-form-item label="备注" prop="remark">
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
import { listCashChip,listCashChipTotal,addBuyCode,addCashExchange} from "@/api/coderoom/cashToCode";

export default {
  name: "CashToCode",
  data() {
  
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
      userList: [],
      userData: [],
      userTotal:'',
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
        pageSize: 10,
      },
       fromSearch:{
        card:'',
        isAdmin:false,
      },
      // 表单校验
      rules: {
         chipAmount: [
          {
            required: true,
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: "请输入大于0的数字",
            trigger: "blur"
          }
         ]
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
      let params = Object.assign({}, this.fromSearch,this.queryParams);
      params['isAdmin']=this.fromSearch.isAdmin ==false?0:1
      this.loading = true;
      listCashChip(params).then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
       listCashChipTotal(params).then(response => {
          this.userTotal = response.data;
         
          this.loading = false;
        }
      );
      this.$delete(params,'pageNum')
      this.$delete(params,'pageSize')
       listCashChip(params).then(response => {
          this.userData = response.rows;
          console.log(this.userData)
        }
      );
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    //合计规则
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (index === 2) {
            sums[index] = this.userTotal.chipAmount;
            return;
          }
        
        });
         return sums;
      },
     getSummaries1(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '小计';
            return;
          }
           if (index === 1) {
            sums[index] = '';
            return;
          }
           if (index === 3) {
            sums[index] = '';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                const pel = prev + curr // 主要代码
                return pel
                
              } else {
                // return prev;
                  const pel = prev // 主要代码
                return pel
              }
            }, 0);
            sums[index] += '';
          } else {
            // sums[index] = 'N/A';
          }
        });
         return sums;
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
        userName:'',
        chipAmount:'',
        isCash:'',
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
   
    /** 存码 */
    handleSign(row) {
      this.reset();
      // this.form = Object.assign({},row)
      this.form['card']=row
       this.open = true;
       this.isMain =false
      this.title = "买码";
    },
   
    /** 取码 */
    handleBack(row) {
      this.reset();
      // this.form = Object.assign({},row)
      this.form['card']=row
      this.open = true;
      this.isMain =true
      this.title = "换现";
    },
        /** 导出按钮操作 */
    handleExport() {
       // 表头对应关系
        require.ensure([], () => {
          const { export_json_to_excel  } = require('@/excel/Export2Excel');
          const tHeader = ['会员卡号', '姓名', '筹码余额','是否可换现','备注'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['card', 'userName', 'chipAmount','isCash','remark'];
          // 上面的index、nickName、name是tableData里对象的属性
          const list = this.userData;  //把data里的tableData存到list
          const data = this.formatJson(filterVal,list);
          export_json_to_excel (tHeader, data, '买码换现列表');
        })
    },
     // 该方法负责将数组转化成二维数组
   formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 打印
    handlePrint(){},
    // 明细
    handleDetail(){},
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.title)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == "换现") {
            addCashExchange(this.form).then(response => {
              this.$modal.msgSuccess("换现成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form['cardType']=1
            addBuyCode(this.form).then(response => {
              this.$modal.msgSuccess("买码成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
   
  }
};
</script>
<style lang="scss" >
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
.el-table.table2 {
  .el-table__header-wrapper,.el-table__body-wrapper{display: none;}
}
</style>