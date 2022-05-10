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
              <li>台号：{{tableInfo.tableId || 0}}</li>
              <li>靴号：{{tableInfo.bootNum || 0}}</li>
              <li>局号：{{tableInfo.gameNum || 0}}</li>
             </ul>
             <ul>
              <li>$累计：{{tableInfo.total || 0}}</li>
              <li>$筹码：{{tableInfo.chip || 0}}</li>
              <li>$现金：{{tableInfo.cash || 0}}</li>
             </ul>
              <ul>
              <li>฿累计：{{tableInfo.totalTh || 0}}</li>
              <li>฿筹码：{{tableInfo.chipTh || 0}}</li>
              <li>฿现金：{{tableInfo.cashTh || 0}}</li>
             </ul>
          </el-card>
          <el-card class="box-card-box" style="text-align:center">
             <ul>
              <li>$龙：{{lhSum.sumL || 0}}</li>
              <li>$虎：{{lhSum.sumHu || 0}}</li>
              <li>$和：{{lhSum.sumH || 0}}</li>
             </ul> 
             <ul>
              <li>฿龙：{{lhSum.sumLTh || 0}}</li>
              <li>฿虎：{{lhSum.sumHuTh || 0}}</li>
              <li>฿和：{{lhSum.sumHTh || 0}}</li>
             </ul> 
          </el-card>
      </el-col>
       <!--按钮-->
      <el-col :span="4" :xs="24">
          <el-card class="box-card-box" style="text-align:center">
              <el-button type="primary" plain @click="screencast">{{isSend?'已投屏':'未投屏'}}</el-button>
              <!-- <el-button type="primary" plain @click="roadChange">路珠修改</el-button> -->
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
                  <el-tooltip class="item list_p" v-for="(c,key) in e" :key="key" 
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
                    <span>$筹码:{{lhSum.sumChip || 0}}</span>
                    <span>$现金:{{lhSum.sumCash || 0}}</span>
                     <span>฿筹码:{{lhSum.sumChipTh || 0}}</span>
                    <span>฿现金:{{lhSum.sumCashTh || 0}}</span>
                  </div>
               </el-col>
              <el-col :span="10" :xs="24">
                  <el-radio-group v-model="radio1" class="checked">
                      <el-radio-button label="龙" class="red">龙</el-radio-button>
                      <el-radio-button label="虎" class="blue">虎</el-radio-button>
                      <el-radio-button label="和" class="green">和</el-radio-button>
                    </el-radio-group>

               </el-col>
               <el-col :span="10" :xs="24" class="control">  
                  <el-button type="primary" @click="startBet">开牌</el-button>
                  <el-button type="primary" @click="updataBet" :disabled="iskaipai">录入</el-button>
                  <el-button type="primary" @click="ponintCode">点码</el-button>
                  <el-button type="primary" @click="getCode">收码</el-button>
               </el-col>
            </el-row>
          </el-card>
       </el-col>
    </el-row>

    <!-- 路单结果修改 -->
    <el-dialog title="路单修改" :visible.sync="openLUdan" width="600px" class="ludanBox_dialog" append-to-body>
       <el-form ref="form" :model="formLudan" :rules="rulesLudan" label-width="0">
          <el-form-item label="" prop="">
             <div class="head" style="display:flex;width:100%;justify-content: space-around;">
               <div>台号：{{formLudan.tableId}}</div>
               <div>靴号：{{formLudan.bootNum}}</div>
               <div>局号：{{formLudan.gameNum}}</div> 
             </div>
          </el-form-item>
          <el-form-item label="" prop="">
              <el-radio-group v-model="formLudan.radio1" >
                  <el-radio-button label="龙" class="red">龙</el-radio-button>
                  <el-radio-button label="虎" class="blue">虎</el-radio-button>
                  <el-radio-button label="和" class="green">和</el-radio-button>
              </el-radio-group>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLudan">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

     <el-table v-loading="loading" class="betBox" height="500px" :data="lhList"  border :row-class-name="status_change"   @selection-change="handleSelectionChange" >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column label="选择币种" align="center" fixed key="type" prop="type" width="320px">
               <template slot-scope="scope">
                  <el-radio-group @change='DataChange' v-model.number="scope.row.type">
                    <el-radio :label="0">$筹码</el-radio>
                    <el-radio :label="1">$现金</el-radio>
                    <el-radio :label="2">฿筹码</el-radio>
                    <el-radio :label="3">฿现金</el-radio>
              </el-radio-group>
              </template>
          </el-table-column>
          <el-table-column label="卡号" align="center" key="card" prop="card"  width="200px">
               <template slot-scope="scope">
                  <el-input @change='DataChange' v-model.number="scope.row.card" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="龙" align="center" key="card1" prop="card1"  >
               <template slot-scope="scope">
                  <el-input @change='DataChange' v-model.number="scope.row.card1" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="虎" align="center" key="card2" prop="card2"  >
               <template slot-scope="scope">
                  <el-input @change='DataChange' v-model.number="scope.row.card2" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column label="和" align="center" key="card3" prop="card3"  >
               <template slot-scope="scope">
                  <el-input @change='DataChange' v-model.number="scope.row.card3" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
          
          <el-table-column label="现有筹码" align="center" key="chip" prop="chip"  fixed="right" />
          <el-table-column label="赔码数" align="center"   prop="payout"  fixed="right"/>
             
         
        </el-table>

    <!-- 添加或修改用户配置对话框 -->
    <Dialog :title='title' :open='open' @getOpen='openData'/>
    

   
  </div>
</template>

<script>
import { dragantigerInfo,dragantigerList,dragantigerOpen,dragantigerUpdate,dragantigerInput,dragantigerSave} from "@/api/bet/draganTiger";
import { mapState, mapMutations } from "vuex";
import Dialog from "./dialog.vue"
export default {
  name: "DraganTiger",
  data() {

    return {
      isSend:false,
      // 遮罩层
      loading: true,
      isVisibles:false,
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
        {id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},
        {id:11},{id:12},{id:13},{id:14},{id:15},{id:16},{id:17},{id:18},{id:19},{id:20},
        {id:21},{id:22},{id:23},{id:24},{id:25},{id:26},{id:27},{id:28},{id:29},{id:30},
      ],
      subData:[],
      rulesLudan:{},
      radio1:'',
   
      // userName:'',
      tableInfo:'', //桌台信息
      iskaipai:true,
      result:'',//赛果
      //庄闲和筹码现金合计
      sumdata:{
         sumL:'',
          sumHu:'',
          sumH:'',
     
          sumChip:'',
          sumCash:'',
          sumLTh:'',
          sumHuTh:'',
          sumHTh:'',
     
          sumChipTh:'',
          sumCashTh:'',
      }
     
    };
  },
  components:{Dialog},
  watch: {
    // 根据名称筛选部门树

  },

  created() {
    this.getszdata();
    this.getTableInfo()
    this.getResult()
  },
  computed:{
    userName(){
      return this.$store.state.user.name
    },
     ...mapState("game", [ "lhList",'lhSum']),
  },
  methods: {
    ...mapMutations('game',["setLhList","setLhSum"]),
    screencast(){
      this.isSend = !this.isSend
      this. getSend()
    },
  
    roadChange(){},
    betRecord(){},
    openData(data){
      this.open = data
       if(this.title=='点码')
      this.getTableInfo()
      this.getResult()
    },
    //桌台信息
    getTableInfo(){
       dragantigerInfo().then(res => {
          this.tableInfo = res.data;
          this.loading = false;
        },
        this.setLhList(this.betList),
        this.setLhSum(this.sumdata),
      );
    },
    //赛果列表
    getResult(){
       dragantigerList().then(res => {
          this.result = this.spArr(res.data,6);
          this.loading = false;
        }
      );
    },
    //处理路单class
    getclass(c){
      if(c.indexOf('龙')!=-1){
        return 'type1'
      }else if(c.indexOf('虎')!=-1){
        return 'type2'
      }else if(c.indexOf('和')!=-1){
        return 'type3'
      }
    },
    // 退出登录
    async logout() {
      this.$confirm('确定切换账号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('usre/LogOut').then(() => {
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
    status_change: function (row) {  
      if(row.row.card1|| row.row.card2 || row.row.card3|| row.row.card4 || row.row.card5|| row.row.card6|| row.row.card7 || row.row.card8|| row.row.card9){
          if (!row.row.type && row.row.type !=0) {
            return 'table-info-lh-red'
          }
          if (!row.row.card) {
            return 'table-info-lh-red1'
          }
        }
    },
    getSend(){
      if(this.isSend == true){
        dragantigerSave({'json':this.betList}).then(res => {
          this.loading = false;
        })
      }else{
         let arr2 = Array(30).fill().map((e,i)=>Object({id:i+1}))
         dragantigerSave({'json':arr2}).then(res => {
          this.loading = false;
        })
      }
    },
    DataChange(){
      this. getSend()
    },
    //开牌
    startBet(){
      console.log(this.iskaipai)
      if(this.radio1 ==''){
        this.$modal.msgError("请选择开奖结果");
        return
      }
      
      let param ={}
      let str =''
      str= this.radio1.toString()
      param['gameResult']=str
      let arr=[]
      let arr1=[]

      arr = this.betList.map(o=>{
            return {
              "type":o.type,
              "card":o.card,
              "龙":o.card1,
              "虎":o.card2,
              "和":o.card3,
            }
      })
      
      let isDialog = false
      this.betList.forEach(e=>{
        if(e.card1|| e.card2 || e.card3){
          
          if(!e.type && e.type!=0 && !isDialog){
            
             isDialog =true
             this.$modal.msgError("请检查币种是否漏勾选");
          };
          if(!e.card && !isDialog){
            isDialog =true
            this.$modal.msgError("请检查考号是否漏填");
          }
        }
      })
      //  console.log(this.betList,2)
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
     
     
      
      const arrChip =arr1.filter(e =>e.type==0)
      const newChip =this.sumArr(arrChip)
      const arrCash =arr1.filter(e =>e.type==1)
      const newCash =this.sumArr(arrCash)
      const arrChipTh =arr1.filter(e =>e.type==2)
      const newChipTh =this.sumArr(arrChipTh)
      const arrCashTh =arr1.filter(e =>e.type==3)
      const newCashTh =this.sumArr(arrCashTh)

       let  arrMJ = arrCash.concat(arrChip)
      let  arrTh = arrCashTh.concat(arrChipTh)
      const  newDataMj = this.sumArr(arrMJ)
      this.sumdata.sumL = newDataMj['龙']
      this.sumdata.sumHu = newDataMj['虎']
      this.sumdata.sumH = newDataMj['和']
      const  newDataTh = this.sumArr(arrTh)
      this.sumdata.sumLTh = newDataTh['龙']
      this.sumdata.sumHuTh = newDataTh['虎']
      this.sumdata.sumHTh = newDataTh['和']

      this.sumdata.sumChip = newChip['龙']+newChip['虎']+newChip['和']
      this.sumdata.sumCash = newCash['龙']+newCash['虎']+newCash['和']
      this.sumdata.sumChipTh = newChipTh['龙']+newChipTh['虎']+newChipTh['和']
      this.sumdata.sumCashTh = newCashTh['龙']+newCashTh['虎']+newCashTh['和']
     this.setLhSum(this.sumdata)
      dragantigerOpen({'json':param}).then(res => {
          this.subData= res.data
           this.betList.forEach(e=>{
            Object.keys(e).forEach(i=>{
              if(this.isEmpty(e[i])) {
                  delete e[i];

                }
            })
            return e
          })
          let arr2 = Array(30).fill().map((e,i)=>Object({id:i+1}))
          
            this.subData.bet.forEach((e,i)=>{
            arr2[i]={...e,...arr2[i],...this.betList[i]}
             
          })
          this.betList = arr2
          this.setLhList(arr2)
          this. getSend()
          this.iskaipai = false
          this.loading = false;
        })
    },
    //录入
    updataBet(){
        dragantigerInput({'json':this.subData}).then(res=>{
          this.loading = false;
          this.betList = Array(30).fill().map((e,i)=>Object({id:i+1}))
          this.radio1 =''
          this.sumdata={
            sumL:'',
            sumHu:'',
            sumH:'',
            sumChip:'',
            sumCash:'',
          }
          this.setLhList(this.betList)
          this.setLhSum(this.sumdata)
          let that=this
          setTimeout(function(){  
            that.getTableInfo() 
            that.getResult()
          },1000)
          this. getSend()  
          this.iskaipai = true
        }) 
        
    },
    //数组对象求和
    sumArr(arr){
      if(arr){
        return  arr.reduce((p,c) => {
          Object.keys(p).forEach(k=>p[k]+=c[k]?c[k]:0)

          return p
        }, {'龙': 0, '虎': 0, '和':0})
      }
      
    },
    //判断空对象
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

    /** 点码 */
    ponintCode() {
      console.log(1)
       this.open = true;
      this.title = "点码";
    },

    /** 收码 */
    getCode() {
      this.open = true;
      this.title = "收码";
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
      console.log(c)
      this.reset();
      this.openLUdan =true
      this.formLudan.id = c.id
      this.formLudan.bootNum = c.bootNum
      this.formLudan.gameNum = c.gameNum
      this.formLudan.tableId = c.tableId

      this.formLudan.radio1 = c.gameResult
      
      
    },
      submitLudan(){
      let str =''
      str= this.formLudan.radio1.toString()
      
      let param ={}
      param['id']= this.formLudan.id
      param['gameResult'] = str
      dragantigerUpdate(param).then(res=>{
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
      margin: 0;
     text-align: left;
      li{
        list-style: none;
        display: inline-block;
        min-width: 60px;
        margin: 0 10px;
        line-height: 39px;
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
              background: url("../../../../assets/images/ludan/l.webp") center no-repeat;
              background-size: 100%;
            }
            .type2{
              background: url("../../../../assets/images/ludan/hu.webp") center no-repeat;
              background-size: 100%;
            }
            .type3{
              background: url("../../../../assets/images/ludan/h.webp") center no-repeat;
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
          justify-content:  flex-start;
        }
      }
    }
    .f1{
      display: flex;
      text-align: left;
      flex-wrap: wrap;
      span{
        flex-basis: 50%;
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
           opacity: .6;
        }
      }
      .blue{
        // background: blue;
        .el-checkbox-button__inner,.el-radio-button__inner{
           background: blue;
           opacity: .6;
        }
      }
      .green{
        // background: green;
        .el-checkbox-button__inner,.el-radio-button__inner{
           background: green;
           opacity: .6;
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
  .el-table__row .el-table__cell .cell .el-radio-group .el-radio{margin-right: 10px;}
  .el-input--medium .el-input__inner{
    line-height: 25px;
    height: 25px;
  }
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
.table-info-lh-red td:nth-child(1){
  position: relative;
  &::after{
    content: '请选择币种';
     position: absolute;
    bottom: -5px;
    left: 10px;
    color: red;
    font-size: 12px;
    z-index: 1;
  }
}
.table-info-lh-red1 td:nth-child(2){
  position: relative;
  &::after{
    content: '请填写卡号';
    position: absolute;
    bottom: -5px;
    left: 10px;
    color: red;
    font-size: 12px;
    z-index: 1;
  }
}
.table-info-red td,.table-info-red1 td{
  // background: rgb(199, 135, 135);
}
.ludanBox_dialog{
    .el-form-item{
      .el-radio-group,.el-checkbox-group{
        display:  flex;
        justify-content: center;
        width: 100%;
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
           opacity: .6;
        }
      }
      .blue{
        // background: blue;
        .el-checkbox-button__inner,.el-radio-button__inner{
           background: blue;
           opacity: .6;
        }
      }
      .green{
        // background: green;
        .el-checkbox-button__inner,.el-radio-button__inner{
           background: green;
           opacity: .6;
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
</style>
