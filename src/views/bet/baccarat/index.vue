<template>
  <div class="app-container">
    <el-row :gutter="20">
      
      <!--切换账号-->
      <el-col :span="4" :xs="24">
          <el-card class="box-card-box" style="text-align:center">
            <h1>当前操作员</h1>
            <div >{{userName}}</div>
            <el-button class="loginout" type="info" @click.native="logout">切换账号</el-button>
          </el-card>
      </el-col>
       <!--桌台信息-->
      <el-col :span="6" :xs="24">
           <el-card class="box-card-box" style="text-align:center">
             <ul>
              <li>台号：{{tableInfo.tableId}}</li>
              <li>靴号：{{tableInfo.bootNum}}</li>
              <li>局号：{{tableInfo.gameNum}}</li>
              <li>累计：{{tableInfo.total}}</li>
              <li>筹码：{{tableInfo.chip}}</li>
              <li>现金：{{tableInfo.cash}}</li>
             </ul>
          </el-card>
          <el-card class="box-card-box" style="text-align:center">
             <ul>
              <li>庄：{{sumZ}}</li>
              <li>庄对：{{sumZd}}</li>
              <li>庄保险：{{sumZbx}}</li>
              <li>和：{{sumH}}</li>
              <li>闲：{{sumX}}</li>
              <li>闲对：{{sumXd}}</li>
              <li>闲保险：{{sumXbx}}</li>
             </ul>
          </el-card>
      </el-col>
       <!--按钮-->
      <el-col :span="4" :xs="24">
          <el-card class="box-card-box" style="text-align:center">
              <el-button type="primary" plain @click="screencast">未投屏</el-button>
              <el-button type="primary" plain @click="roadChange">路珠修改</el-button>
              <el-button type="primary" plain @click="betRecord">下注记录</el-button>
          </el-card>
      </el-col>
       <!--路单展示-->
      <el-col :span="10" :xs="24">
          <el-card class="box-card-box" style="text-align:center">
            <div class="ludanbox">
              <div class="ludanbg">
                <div v-for="(e,key) in szdata" class="list" :key="key">
                  <div class="list_p" :title="c" v-for="(c,key) in e" :key="key">
                    <i>{{c}}</i>
                  </div>
                </div>
              </div>
              <div class="ludan">
                <div v-for="(e,key) in result" class="list2" :key="key">
                  <!-- <div class="list_p" :title="c" v-for="(c,key) in e" :key="key" @click="changeChip(c)">
                    <i>{{c}}</i>
                  </div> -->
                  <el-tooltip class="item list_p" v-for="c in e" :key="c.gameNum" 
                    effect="light" :content="'局号'+c.gameNum" placement="top">
                    <el-button @click="changeChip(c)"><i :class="getclass(c.gameResult)"></i></el-button>
                  </el-tooltip>
                </div>
              </div>
            </div>
           
          </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
       <el-col :span="24" :xs="24">
          <el-card class="box-card-box-list" style="text-align:center">
            <el-row :gutter="0" style="width:100%">
               <el-col :span="4" :xs="12">
                  <div class="f1">
                    <span>筹码:{{sumChip}}</span>
                    <span>现金:{{sumCash}}</span>
                  </div>
               </el-col>
              <el-col :span="14" :xs="24">
                  <el-radio-group v-model="radio1" class="checked">
                      <el-radio-button :label="4" class="red">庄</el-radio-button>
                      <el-radio-button :label="1" class="blue">闲</el-radio-button>
                      <el-radio-button :label="7" class="green">和</el-radio-button>
                    </el-radio-group>
              
                  <el-checkbox-group v-model="checkboxGroup1" class="checked">
                    <el-checkbox-button v-for="e in reData" :label="e.id" :class="e.color" :key="e.id">{{e.name}}</el-checkbox-button>
                  </el-checkbox-group>
              
                  <el-radio-group v-model="radio2" class="checked">
                    <el-radio-button :label="9" class="red">大</el-radio-button>
                    <el-radio-button :label="6" class="blue">小</el-radio-button>
                  </el-radio-group>
               </el-col>
               <el-col :span="6" :xs="12" class="control">  
                  <el-button type="primary" @click="startBet">开牌</el-button>
                  <el-button type="primary" @click="startBet">录入</el-button>
                  <el-button type="primary" @click="startBet">点码</el-button>
                  <el-button type="primary" @click="startBet">收码</el-button>
               </el-col>
            </el-row>
          </el-card>
       </el-col>
    </el-row>
  
    <!-- 路单结果修改 -->
    <el-dialog title="路单修改" :visible.sync="openLUdan" width="600px" append-to-body>
       <el-form ref="form" :model="formLudan" :rules="rulesLudan" label-width="0">
          <el-form-item label="" prop="">
              <el-radio-group v-model="formLudan.radio1">
                <el-radio-button :label="4">庄</el-radio-button>
                <el-radio-button :label="1">闲</el-radio-button>
                <el-radio-button :label="7">和</el-radio-button>
              </el-radio-group>
            </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="formLudan.checkboxGroup1" class="checked">
              <el-checkbox-button v-for="e in reData" :label="e.id" :class="e.color" :key="e.id">{{e.name}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>  
          <el-form-item label="" prop=""  >
              <el-radio-group v-model="formLudan.radio2">
                <el-radio-button :label="9">大</el-radio-button>
                <el-radio-button :label="6">小</el-radio-button>
              </el-radio-group>
          </el-form-item>   
          
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLudan">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

     <el-table v-loading="loading" class="betBox" :data="betList" stripe border show-summary sum-text="合计"  @selection-change="handleSelectionChange" >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column label="选择币种" align="center" fixed key="type" prop="type" width="180px">
               <template slot-scope="scope">
                  <el-radio-group v-model="scope.row.type">
                <el-radio :label="0">现金</el-radio>
                <el-radio :label="1">筹码</el-radio>
              </el-radio-group>
              </template>
          </el-table-column>
          <el-table-column label="卡号" align="center" key="card" prop="card"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="庄" align="center" key="card1" prop="card1"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card1" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="闲" align="center" key="card2" prop="card2"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card2" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="和" align="center" key="card3" prop="card3"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card3" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="庄对" align="center" key="card4" prop="card4"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card4" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="闲对" align="center" key="card5" prop="card5"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card5" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="庄保险" align="center" key="card6" prop="card6"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card6" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="闲保险" align="center" key="card7" prop="card7"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card7" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="大" align="center" key="card8" prop="card8"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card8" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
            <el-table-column label="小" align="center" key="card9" prop="card9"  >
               <template slot-scope="scope">
                  <el-input v-model="scope.row.card9" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
          <el-table-column label="现有筹码" align="center" key="card10" prop="card10"  fixed="right" />
          <el-table-column label="赔码数" align="center"   prop="signedAmount"  fixed="right"/>
             
         
        </el-table>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
       <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="卡号" prop="card">
              <el-input v-model="form.card" placeholder="" :disabled="true"/>
            </el-form-item>
          <el-form-item label="现有签单金额" prop="signedAmount" v-if="isMain">
              <el-input v-model="form.signedAmount" placeholder="" :disabled="true" />
            </el-form-item>  
          <el-form-item label="签单金额" prop="amount"  v-if="!isMain">
              <el-input v-model="form.amount" placeholder="" />
            </el-form-item>   
           <el-form-item label="还单金额" prop="amount"  v-if="isMain">
              <el-input v-model="form.amount" placeholder="" />
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
import { baccaratInfo,baccaratList,baccaratOpen,baccaratUpdate,baccaratInput,baccaratReckon,baccaratEdit} from "@/api/bet/baccarat";

export default {
  name: "Baccarat",
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
      szdata:[],
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      openLUdan:false,
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
      formLudan:{
        id:'',
        radio1:'',
        checkboxGroup1:[],
        radio2:'',
      },
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
      basedata:{

      },
      betList:[
        {id:1},
        {id:2},
        {id:3},
        {id:4},
        {id:5},
        {id:6},
        {id:7},
        {id:8},
        {id:9},
        {id:10},
      ],
      // 表单校验
      rules: {
        
        // phonenumber: [
        //   {
        //     pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        //     message: "请输入正确的手机号码",
        //     trigger: "blur"
        //   }
        // ]
      },
      rulesLudan:{},
      checkboxGroup1:[],
      radio1:'',
      radio2:'',
      reData:[
        // {id:1,name:'庄',color:'red'},
        // {id:2,name:'闲',color:'blue'},
        // {id:3,name:'和',color:'green'},
        {id:8,name:'庄对',color:'red'},
        {id:5,name:'闲对',color:'blue'},
        // {id:6,name:'大',color:'red'},
        // {id:7,name:'小',color:'blue'},
      ],
      // userName:'',
      tableInfo:'', //桌台信息
      result:'',//赛果
      //庄闲和筹码现金合计
      sumZ:'',
      sumX:'',
      sumH:'',
      sumZd:'',
      sumXd:'',
      sumZbx:'',
      sumXbx:'',
      sumD:'',
      sumX:'',
      sumChip:'',
      sumCash:'',
    };
  },
  watch: {
    // 根据名称筛选部门树
  
  },

  created() {
    this. getszdata();
    // this.getUsername();
    this. getTableInfo()
    this.getResult()
  },
  computed:{
    userName(){
      return this.$store.state.user.name
    },
    // betList(){
    //   console.log(this.betList)
    // }
  },
  methods: {
    screencast(){},
    roadChange(){},
    betRecord(){},
    //桌台信息
    getTableInfo(){
       baccaratInfo().then(res => {
          this.tableInfo = res.data;
          this.loading = false;
        }
      );
    },
    //赛果列表
    getResult(){
       baccaratList().then(res => {
          this.result = this.spArr(res.data,6);
          this.loading = false;
        }
      );
    },
    //处理路单class
    getclass(c){
      console.log(c.indexOf('1'))
      if(c.indexOf('1')!=-1 && c.indexOf('5')==-1 && c.indexOf('8')==-1  ){
        return 'type1'
      }else if(c.indexOf('1')!=-1 && c.indexOf('5')!=-1 && c.indexOf('8')==-1  ){
        return 'type2'
      }else if(c.indexOf('1')!=-1 && c.indexOf('5')==-1 && c.indexOf('8')!=-1  ){
        return 'type3'
      }else if(c.indexOf('1')!=-1 && c.indexOf('5')!=-1 && c.indexOf('8')!=-1  ){
        return 'type4'
      }else if(c.indexOf('4')!=-1 && c.indexOf('5')==-1 && c.indexOf('8')==-1  ){
        return 'type5'
      }else if(c.indexOf('4')!=-1 && c.indexOf('5')!=-1 && c.indexOf('8')==-1  ){
        return 'type6'
      }else if(c.indexOf('4')!=-1 && c.indexOf('5')==-1 && c.indexOf('8')!=-1  ){
        return 'type7'
      }else if(c.indexOf('4')!=-1 && c.indexOf('5')!=-1 && c.indexOf('8')!=-1  ){
        return 'type8'
      }else if(c.indexOf('7')!=-1 ){
        return 'type9'
      }

    },
    // 退出登录
    async logout() {
      this.$confirm('确定切换账号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => {});
    },
 
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
      
    },
    //开牌
    startBet(){
      if(this.radio1 ==''){
        this.$modal.msgError("请选择开奖结果");
        return
      }
      let param ={}
      let str =''
      str= this.radio1.toString()+this.checkboxGroup1.join('')+this.radio2.toString()
      param['gameResult']=str
      let arr=[]
      let arr1=[]
      arr = this.betList.map(o=>{
            return {
              "type":o.type,
              // "id":o.id,
              "4":o.card1,
              "1":o.card2,
              "7":o.card3,
              "8":o.card4,
              "5":o.card5,
              "3":o.card6,
              "0":o.card7,
              "9":o.card8,
              "6":o.card9,
            }
      })
      arr.forEach(e=>{
        Object.keys(e).forEach(i=>{
          if(this.isEmpty(e[i])) {
              delete e[i];
              
            }
        })
        return e
      })
      arr1 = arr.filter(v => Object.keys(v).length!==0)
      param['bet']= arr1
      console.log(param,arr,arr1)
    },

    isEmpty(obj) {
      if (typeof obj === 'undefined' || obj === null || obj === '') {
        return true;
      } else {
        return false;
      }
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
           if (index === 6) {
            sums[index] = this.userTotal.betMoney;
            return;
          }
           if (index === 8) {
            sums[index] = this.userTotal.winLose;
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
           if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5 || index == 7) {
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
      this.openLUdan =false
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        card: '',
        userName:'',
        signedAmount:'',
        remark:''

      };
      this.formLudan={
        id:'',
        radio1:'',
        checkboxGroup1:[],
        radio2:'',
      },
      this.resetForm("form");
      this.resetForm("formLudan");
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
   
    /** 签单 */
    handleSign(row) {
      this.reset();
      this.form = Object.assign({},row)
       this.open = true;
       this.isMain =false
      this.title = "签单";
    },
   
    /** 还单 */
    handleBack(row) {
      this.reset();
      this.form = Object.assign({},row)
      this.open = true;
      this.isMain =true
      this.title = "还单";
    },

  
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.title)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == "还单") {
            addReturnOrder(this.form).then(response => {
              this.$modal.msgSuccess("还单编辑成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form['cardType']=1
            addSigned(this.form).then(response => {
              this.$modal.msgSuccess("签单编辑成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    //获取数组
    getszdata(){
      this.szdata =[...Array(73).keys()]
      this.szdata.shift()
      this.szdata = this.spArr(this.szdata,6)
    },
   //数组切割
    spArr(arr, num) { //arr是你要分割的数组，num是以几个为一组
      let newArr = [] //首先创建一个新的空数组。用来存放分割好的数组
      for (let i = 0; i < arr.length;) { //注意：这里与for循环不太一样的是，没有i++
        newArr.push(arr.slice(i, i += num));
      }
      return newArr
    },
    //
    changeChip(c){
      this.reset();
      this.openLUdan =true
      this.formLudan.id = c.id
      let v = c.gameResult
      let arr =v.split('')
      arr.forEach(e=>{
        if(e==1){
          this.formLudan.radio1 = 1
        }else if(e==4){
         this.formLudan.radio1 = 4
        }else if(e==7){
         this.formLudan.radio1 = 7
        }else if(e==5){
         this.formLudan.checkboxGroup1.push(5)
        }else if(e==8){
          this.formLudan.checkboxGroup1.push(8)
        }else if(e==9){
         this.formLudan.radio2 = 9
        }else if(e==6){
          this.formLudan.radio2 = 6
        }
      })
      console.log(c,this.formLudan)
    },
      submitLudan(){
      console.log(this.formLudan)
      let str =''
      str= this.formLudan.radio1.toString()+this.formLudan.checkboxGroup1.join('')+this.formLudan.radio2.toString()
      console.log(str)
      let param ={}
      param['id']= this.formLudan.id
      param['gameResult'] = str
      baccaratUpdate(param).then(res=>{
         this.$modal.msgSuccess("路单图修改成功");
          this.openLUdan = false;
          const that =this
          setTimeout(function () {
            that.getResult();
          },1000)
         
      })
    },
    // getUsername(){
    //   let obj = {}
    //   let obj1 ={}
    //   obj = JSON.parse(sessionStorage.getItem("sessionObj"))
    //   obj1 = JSON.parse(obj.data)
    //   this.userName =obj1.username
    // }
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
.box-card-box{
  margin-bottom: 15px;
  .el-card__body{
    display: flex;
    flex-direction: column;
    button{
      width: 80%;
      height: 80px;
      margin: 10px auto;
    }
    .loginout{
      height: 60px;
    }
    ul{
      padding: 0;
     text-align: left;
      li{
        list-style: none;
        display: inline-block;
        min-width: 60px;
        margin: 0 10px;
        line-height: 45px;
      }
    }
  }
  .ludanbox{
    position: relative;
      .ludanbg{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #919191;
        font-size: 0;
        box-sizing: border-box;
        position: relative;
        .list{
          flex-basis: 1/12*100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-right: #919191 1px solid;
          font-size: 0;
          box-sizing: border-box;
          &:last-child{
            border: 0;
            // border-left: #919191 1px solid;
          }
          .list_p{
            flex-basis: 1/6*100%;
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            box-sizing: border-box;
            border-bottom: #919191 1px solid;
            &:last-child{
              border: 0;
              // border-top: #919191 1px solid;
            }
            position: relative;
            i{
            position: absolute;
            font-size: 16px;
            color: #919191;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);   
            font-style: normal;
            }
          }
        }
      }
      .ludan{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
         display: flex;
        justify-content: flex-start;
        align-items: center;
         .list2{
          flex-basis: 1/12*100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          // justify-content: center;
          align-items: center;
          font-size: 0;
          box-sizing: border-box;
          .list_p{
            flex-basis: 1/6*100%;
            width: 100%;
            box-sizing: border-box;
            position: relative;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: none;
            i{
            position: absolute;
            width: 80%;
            height: 80%;
            font-size: 16px;
            color: #919191;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);   
            font-style: normal;
            }
            .type1{
              background: url("../../../assets/images/ludan/x1.webp") center no-repeat;
              background-size: 100%;
            }
            .type2{
              background: url("../../../assets/images/ludan/x2.webp") center no-repeat;
              background-size: 100%;
            }
            .type3{
              background: url("../../../assets/images/ludan/x3.webp") center no-repeat;
              background-size: 100%;
            }
            .type4{
              background: url("../../../assets/images/ludan/x4.webp") center no-repeat;
              background-size: 100%;
            }
            .type5{
              background: url("../../../assets/images/ludan/z1.webp") center no-repeat;
              background-size: 100%;
            }
            .type6{
              background: url("../../../assets/images/ludan/z2.webp") center no-repeat;
              background-size: 100%;
            }
            .type7{
              background: url("../../../assets/images/ludan/z3.webp") center no-repeat;
              background-size: 100%;
            }
            .type8{
              background: url("../../../assets/images/ludan/z4.webp") center no-repeat;
              background-size: 100%;
            }
            .type9{
              background: url("../../../assets/images/ludan/h.webp") center no-repeat;
              background-size: 100%;
            }
          }
         }
      }
  }


}
.box-card-box-list{
  .el-card__body{
    display: flex;
    justify-content: space-around;
    align-items: center;
    .el-row{
      .el-col{
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap:wrap;
        &.control {
          justify-content: center;
        }
      }
    }
    .f1{
      display: flex;
      flex-direction: column;
      text-align: left;
      span{
        line-height: 50px;
      }
    }
    .btn{
      padding: 10px 30px;
      background: #919191;
      border-radius: 6px;
      color: #fff;
      cursor: pointer;
    }
    
    .checked{
      display: flex;
      .el-checkbox-button__inner,.el-radio-button__inner{
        min-width: 80px;
        height: 40px;
        line-height: 40px;
        background: #919191;
        border-radius: 6px;
        color: #fff;
        margin: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .red{
        .el-checkbox-button__inner,.el-radio-button__inner{
           background: red;
           opacity: .7;
        }
      }
      .blue{
        // background: blue;
        .el-checkbox-button__inner,.el-radio-button__inner{
           background: blue;
           opacity: .7;
        }
      }
      .green{
        // background: green;
        .el-checkbox-button__inner,.el-radio-button__inner{
           background: green;
           opacity: .7;
        }
      }
      .is-active,.is-checked{
         .el-checkbox-button__inner,.el-radio-button__inner{
           opacity: 1;
           font-size: 20px;
           border: 0;
           font-weight: bold;
        }
      }
    }
  }
  
}
.betBox {
  .el-table__header-wrapper{
    thead{
      th{
        &:nth-child(3), &:nth-child(6), &:nth-child(8), &:nth-child(10){
          background: red;
          color: #fff;
        }
        &:nth-child(4), &:nth-child(7), &:nth-child(9), &:nth-child(11){
          background: blue;
          color: #fff;
        }
        &:nth-child(5){
          background: green;
          color: #fff;
        }
      }
    }
  }
}
</style>