<template>
  <div class="app-container game_lh">
    <el-row :gutter="20">

      <!--切换账号-->
      <el-col :span="24" :xs="24">
          <el-card class="box-card-box1" style="text-align:center">
            <div class="h1">{{$t('bet.user')}}</div>
            <div >{{userName}}</div>
            <el-button class="loginout" type="info" @click.native="logout">{{$t('bet.changeAccount')}}</el-button>
            <el-button class="loginout" type="primary" plain @click="screencast">{{isSend?$t('bet.onScreen'):$t('bet.noScreen')}}</el-button>
            <el-button class="loginout" type="danger" plain @click="betRecord">{{$t('bet.betRecord')}}</el-button>
            <el-button class="loginout" type="success" plain @click="nextGame">{{$t('bet.next')}}</el-button>
            <div style="display:flex;    justify-content: center;align-items: center;margin-left: 50px;">
              <span >{{$t('bet.dealer')}}</span> 
              <el-input  style="width:180px" v-model="dealer" :disabled="isSure" placeholder=""  /> 
              <el-button v-if="!isSure" style="width:100px" class="loginout" type="success" plain @click="subDealer">{{$t('Confirm')}}</el-button>
              <el-button v-else style="width:100px" class="loginout" type="success" plain @click="subDealer1">{{$t('Confirm')}}11</el-button>
            </div>
          </el-card>
      </el-col>
       <!--桌台信息-->
      <el-col :span="12" :xs="24">
           <el-card class="box-card-box" style="text-align:center">
              <ul>
              <li>{{$t('bet.taiHao')}}：{{tableInfo.tableId || 0}}</li>
              <li>{{$t('bet.xueHao')}}：{{tableInfo.bootNum || 0}}</li>
              <li>{{$t('bet.juHao')}}：{{tableInfo.gameNum || 0}}</li>
                <li style="color: blueviolet;">${{$t('bet.leiji')}}：{{tableInfo.total || 0}}</li>
              <li style="color: red;">฿{{$t('bet.leiji')}}：{{tableInfo.totalTh || 0}}</li>
             </ul>
             <ul>
             
              <li>${{$t('bet.chip')}}:{{tableInfo.chip || 0}}</li>
              <li>${{$t('bet.cash')}}:{{tableInfo.cash || 0}}</li>
            
              <li>฿{{$t('bet.chip')}}:{{tableInfo.chipTh || 0}}</li>
              <li>฿{{$t('bet.cash')}}:{{tableInfo.cashTh || 0}}</li>
             </ul>
          </el-card>
          <el-card class="box-card-box" style="text-align:center">
             <ul>
              <li>${{$t('D')}}：{{lhSum.sumL || 0}}</li>
              <li>${{$t('TYG')}}：{{lhSum.sumHu || 0}}</li>
              <li>${{$t('bet.h')}}:{{lhSum.sumH || 0}}</li>
             </ul> 
             <ul>
              <li>฿{{$t('D')}}：{{lhSum.sumLTh || 0}}</li>
              <li>฿{{$t('TYG')}}：{{lhSum.sumHuTh || 0}}</li>
              <li>฿{{$t('bet.h')}}:{{lhSum.sumHTh || 0}}</li>
             </ul> 
          </el-card>
      </el-col>
       <!--按钮-->
      <!-- <el-col :span="4" :xs="24">
          <el-card class="box-card-box" style="text-align:center">
              <el-button type="primary" plain @click="screencast">{{isSend?$t('bet.onScreen'):$t('bet.noScreen')}}</el-button>
          </el-card>
      </el-col> -->
       <!--路单展示-->
      <el-col :span="12" :xs="24">
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
                    effect="light" :content="$t('bet.juHao')+c.gameNum" placement="top">
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
               <el-col :span="5" :xs="12">
                  <div class="f1">
                    <span>${{$t('bet.chip')}}:{{lhSum.sumChip || 0}}</span>
                    <span>${{$t('bet.cash')}}:{{lhSum.sumCash || 0}}</span>
                     <span>฿{{$t('bet.chip')}}:{{lhSum.sumChipTh || 0}}</span>
                    <span>฿{{$t('bet.cash')}}:{{lhSum.sumCashTh || 0}}</span>
                  </div>
               </el-col>
              <el-col :span="9" :xs="24" class="choose">
                  <el-radio-group v-model="radio1" class="checked">
                      <el-radio-button label="龙" class="red">{{$t('D')}}</el-radio-button>
                      <el-radio-button label="虎" class="blue">{{$t('TYG')}}</el-radio-button>
                      <el-radio-button label="和" class="green">{{$t('bet.h')}}</el-radio-button>
                    </el-radio-group>

               </el-col>
               <el-col :span="10" :xs="24" class="control">  
                  <el-button type="primary" @click="startBet">{{$t('bet.open')}}</el-button>
                  <el-button type="primary" @click="updataBet" :disabled="iskaipai">{{$t('bet.input')}}</el-button>
                  <el-button type="warning" @click="ponintCode">{{$t('bet.ponintCode')}}</el-button>
                  <el-button type="danger" @click="getCode">{{$t('bet.getCode')}}</el-button>
               </el-col>
            </el-row>
          </el-card>
       </el-col>
    </el-row>

    <!-- 路单结果修改 -->
    <el-dialog :title="$t('bet.ludan')" :visible.sync="openLUdan" width="600px" class="ludanBox_dialog" append-to-body>
       <el-form ref="form" :model="formLudan" :rules="rulesLudan" label-width="0">
          <el-form-item label="" prop="">
             <div class="head" style="display:flex;width:100%;justify-content: space-around;">
               <div>{{$t('bet.taiHao')}}：{{formLudan.tableId}}</div>
               <div>{{$t('bet.xueHao')}}：{{formLudan.bootNum}}</div>
               <div>{{$t('bet.juHao')}}：{{formLudan.gameNum}}</div> 
             </div>
          </el-form-item>
          <el-form-item label="" prop="">
              <el-radio-group v-model="formLudan.radio1" >
                  <el-radio-button label="龙" class="red">{{$t('D')}}</el-radio-button>
                  <el-radio-button label="虎" class="blue">{{$t('TYG')}}</el-radio-button>
                  <el-radio-button label="和" class="green">{{$t('bet.h')}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLudan">{{$t('bet.sure')}}</el-button>
        <el-button @click="cancel">{{$t('bet.cancel')}}</el-button>
      </div>
    </el-dialog>

     <el-table v-loading="" stripe class="betBox" height="500px" style="font-size: 20px;" :data="lhList"  border :row-class-name="status_change"   @selection-change="handleSelectionChange" >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column :label="$t('bet.chooseStyle')" align="center"  key="type" prop="type" width="360px">
               <template slot-scope="scope">
                  <el-radio-group @change='DataChange' v-model.number="scope.row.type">
                    <el-radio :label="0">${{$t('bet.chip')}}</el-radio>
                    <el-radio :label="1">${{$t('bet.cash')}}</el-radio>
                    <el-radio :label="2">฿{{$t('bet.chip')}}</el-radio>
                    <el-radio :label="3">฿{{$t('bet.cash')}}</el-radio>
              </el-radio-group>
              </template>
          </el-table-column>
          <el-table-column :label="$t('Card-number')" align="center" key="card" prop="card"  width="200px">
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model="scope.row.card" placeholder=""  />
              </template>
          </el-table-column>
           <el-table-column :label="$t('D')" align="center" key="card1" prop="card1"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card1" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('TYG')" align="center" key="card2" prop="card2"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card2" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.h')" align="center" key="card3" prop="card3"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card3" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
          <el-table-column :label="$t('bet.payOut')" align="center"   prop="payout" />
             
         
        </el-table>

    <!-- 添加或修改用户配置对话框 -->
    <Dialog :title='title' :open='open' @getOpen='openData'/>
    <BetRecord :record='record' @getRecord='recordData'/>

   
  </div>
</template>

<script>
import {getDealerCheckUserName} from "@/api/account/dealer"
import { dragantigerInfo,dragontigerNext,dragantigerList,dragantigerOpen,dragantigerUpdate,dragantigerInput,dragantigerSave} from "@/api/bet/draganTiger";
import { mapState, mapMutations } from "vuex";
import Dialog from "./dialog.vue"
import BetRecord from "./dialogBet.vue"
export default {
  name: "DraganTiger",
  data() {

    return {
      isSend:false,
      // 遮罩层
      loading: true,
      isSure:false,
      dealer:'',
      isVisibles:false,
      record:false,
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
      betList:Array(30).fill().map((e,i)=>Object({id:i+1,type:0})),
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
  components:{Dialog,BetRecord},
  watch: {
    // 根据名称筛选部门树

  },

  created() {
    this.getszdata();
    this.getTableInfo()
    this.getResult()
    this.getStatus()
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
      localStorage.setItem('LhType',this.isSend)
    },
    subDealer(){
      getDealerCheckUserName({'userName':this.dealer}).then(res =>{
        
        if(res.code && res.code == 200){
          this.isSure = true
          localStorage.setItem('LhDealer',this.dealer)
          localStorage.setItem('LhDealerType',this.isSure)
        }else{
           this.dealer =''
           localStorage.setItem('LhDealer','')
        }
      }).catch(error => {
           this.dealer =''
           localStorage.setItem('LhDealer','')
          
        })
    },
    subDealer1(){
      this.isSure = false
      localStorage.setItem('LhDealerType',this.isSure)
    },
    roadChange(){},
    betRecord(){
      this.record = true
    },
    nextGame(){
      this.$confirm(this.$t('bet.sureNext'), this.$t('bet.tips'), {
        confirmButtonText: this.$t('bet.sure'),
        cancelButtonText: this.$t('bet.cancel'),
        type: 'warning',
         customClass:'dialog_tips'
      }).then(() => {
        dragontigerNext().then(res => {
          this.loading = false;
           this.getTableInfo()
            this.getResult()
        })
      })
    },
    //获取本地存储
    getStatus(){
        if(localStorage.getItem("LhType") != null){
          if(localStorage.getItem('LhType')=="true"){
            this.isSend =true
          }else{
            this.isSend =false
          }
        }
         if(localStorage.getItem("LhList") != null){
           this.setLhList(JSON.parse(localStorage.getItem('LhList')))
        }
         if(localStorage.getItem("LhDealer") != null){
         this.dealer = localStorage.getItem('LhDealer')
        }
        if(localStorage.getItem("LhDealerType") != null){
         if(localStorage.getItem('LhDealerType')=="true"){
            this.isSure =true
          }else{
            this.isSure =false
          }
        }
    },
    openData(data){
      this.open = data
      //  if(this.title=='点码')
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
     recordData(data){
      this.record = data
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
      this.$confirm(this.$t('bet.getCode'), this.$t('bet.tips'), {
        confirmButtonText: this.$t('bet.sure'),
        cancelButtonText: this.$t('bet.cancel'),
        type: 'warning',
        customClass:'dialog_tips'
      }).then(() => {
        this.$store.dispatch('user/LogOut').then(() => {
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
        dragantigerSave({'json':this.lhList}).then(res => {
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
        this.$modal.msgError(this.$t('bet.chooseResult'));
        return
      }
      
      let param ={}
      let str =''
      str= this.radio1.toString()
      param['gameResult']=str
   
      let arr=[]
      let arr1=[]
        this.betList = this.lhList
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
             this.$modal.msgError(this.$t('bet.isChoose'));
             return
          };
          if(!e.card && !isDialog){
            isDialog =true
            this.$modal.msgError(this.$t('bet.ishas'));
            return
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
          let arr2 = Array(30).fill().map((e,i)=>Object({id:i+1,type:0}))
            this.subData.bet.forEach((e,i)=>{
            arr2[i]={...arr2[i],...this.betList[i],...e}
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
       this.$confirm(this.$t('bet.sureAdd'), this.$t('bet.tips'), {
        confirmButtonText: this.$t('bet.sure'),
        cancelButtonText: this.$t('bet.cancel'),
        type: 'warning',
        customClass:'dialog_tips'
      }).then(() => {
        dragantigerInput({'json':this.subData,'dealer':this.dealer}).then(res=>{
          this.loading = false;
          // this.betList = Array(30).fill().map((e,i)=>Object({id:i+1}))
          this.betList = this.betList.map(o=>{
                return {
                  "type":o.type,
                  "card":o.card,
                  "id":o.id,
                }
          })
          this.radio1 =''
          this.sumdata={
            sumL:'',
            sumHu:'',
            sumH:'',
            sumChip:'',
            sumCash:'',
          }
          localStorage.setItem('LhList',JSON.stringify(this.betList))
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
      }).catch(() => {});    
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
            sums[index] = this.$t('bet.heji');
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
            sums[index] = this.$t('bet.xiaoji');
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
      this.title = this.$t('bet.ponintCode');
    },

    /** 收码 */
    getCode() {
      this.open = true;
      this.title = this.$t('bet.getCode');
    },


  
    //获取数组
    getszdata(){
      this.szdata =[...Array(121).keys()]
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
         this.$modal.msgSuccess(this.$t('bet.tips1'));
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
.game_lh{
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
    font-size: 18px;  .el-card__body{
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
      .h1{
        font-size: 24px;
        line-height: 40px;
      }
      ul{
        padding: 0;
        margin: 0;
      text-align: left;
        li{
          list-style: none;
          display: inline-block;
          min-width:100px;
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
          border-right: 0;
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
              // border: 0;
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
            flex-basis: 1/20*100%;
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
                background: url("../../../../assets/images/ludan/l.svg") center no-repeat;
                background-size: 100%;
              }
              .type2{
                background: url("../../../../assets/images/ludan/hu.svg") center no-repeat;
                background-size: 100%;
              }
              .type3{
                background: url("../../../../assets/images/ludan/h.svg") center no-repeat;
                background-size: 100%;
              }
            
            }
          }
        }
    }
    

  }
  .box-card-box1{
  margin-bottom: 10px;
  font-size: 18px;  
  .el-card__body{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 10px 20px;
    .h1{
      font-size: 22px;
      line-height: 40px;
      margin-right: 20px;
    }
    button{
      width: 150px;
      height: 60px;
      margin-left: 30px;
    }
    .loginout{
      height: 40px;
    }
    ul{
      padding: 0;
      margin: 0;
     text-align: left;
     border-top:1px solid #cbcbcb ;
     &:nth-child(1){
       border: 0;
     }
      li{
        list-style: none;
        display: inline-block;
        min-width:100px;
        margin: 0 8px;
        line-height: 32px;
        font-size: 18px;
        // font-weight: bold;
      }
    }
  }
}
  .box-card-box-list{
    .el-card__body{
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 5px 20px;
      .el-row{
        .el-col{
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap:wrap;
          &.control {
            justify-content:  space-around;
            button{
              padding: 0;
                flex-basis: 20%;
                height: 60px;
                line-height: 60px;
                font-size: 20px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
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
          font-size: 18px
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
        width: 100%;
        display: flex;
        justify-content: space-around;
        flex-basis: 9/10*100%;
        .el-radio-button{
            flex-basis: 25%;
          }
        .el-checkbox-button__inner,.el-radio-button__inner{
            height: 60px;
          line-height: 60px;
          font-size: 20px;
          border-radius: 6px;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .red{
          .el-checkbox-button__inner,.el-radio-button__inner{
            background: red;
            opacity: .6;
          }
           &.is-active,&.is-checked{
            .el-checkbox-button__inner,.el-radio-button__inner{
              border: 4px solid blue;
            }
         }
        }
        .blue{
          // background: blue;
          .el-checkbox-button__inner,.el-radio-button__inner{
            background: blue;
            opacity: .6;
          }
           &.is-active,&.is-checked{
            .el-checkbox-button__inner,.el-radio-button__inner{
              border: 4px solid red;
            }
          }
        }
        .green{
          // background: green;
          .el-checkbox-button__inner,.el-radio-button__inner{
            background: green;
            opacity: .6;
          }
           &.is-active,&.is-checked{
            .el-checkbox-button__inner,.el-radio-button__inner{
              border: 4px solid rgb(255, 0, 225);
            }
         }
        }
        .is-active,.is-checked{
          .el-checkbox-button__inner,.el-radio-button__inner{
            opacity: 1;
            font-size: 24px;
            border: 0;
            font-weight: bold;
            color: #fff;
          }
        }
      }
    }

  }
  .betBox {
    .el-table__row .el-table__cell .cell .el-radio-group .el-radio{
      margin-right: 10px;
      .el-radio__label{
        font-size: 18px;
      }
    }
        .el-table__header-wrapper th,  .el-table__fixed-header-wrapper th{
        font-size: 22px;
    }
    .el-input--medium .el-input__inner{
      line-height: 25px;
      height: 25px;
      border: 0;
      text-align: center;
      background: none;
    }
    .el-input--medium{
      font-size: 20px;
      font-weight: bold;
      .el-input__inner{
        padding: 0;
      }
    }
    .el-table__header-wrapper{
      thead{
        th{
          &:nth-child(3){
            background: red;
            color: #fff;
          }
          &:nth-child(4){
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
      width: 100%;
      text-align: center;
      left: 0px;
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
      width: 100%;
      text-align: center;
      left: 0px;
      color: red;
      font-size: 12px;
      z-index: 1;
    }
  }
  .table-info-red td,.table-info-red1 td{
    // background: rgb(199, 135, 135);
  }
}
.app_zh .game_lh .box-card-box .ludanbox .ludan .list2 .list_p {
  .type1{
                background: url("../../../../assets/images/ludan/l.svg") center no-repeat;
                background-size: 100%;
              }
              .type2{
                background: url("../../../../assets/images/ludan/hu.svg") center no-repeat;
                background-size: 100%;
              }
              .type3{
                background: url("../../../../assets/images/ludan/h.svg") center no-repeat;
                background-size: 100%;
              }
}
.app_en .game_lh .box-card-box .ludanbox .ludan .list2 .list_p {
  .type1{
                background: url("../../../../assets/images/ludan/l_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type2{
                background: url("../../../../assets/images/ludan/hu_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type3{
                background: url("../../../../assets/images/ludan/h_en.svg") center no-repeat;
                background-size: 100%;
              }
}
.app_zh .game_lh .table-info-bj-red1 td:nth-child(2){
  position: relative;
  &::after{
    content: '请填写卡号';
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: -5px;
    left: 0px;
    color: red;
    font-size: 12px;
    z-index: 1;
  }
}
.app_en .game_lh .table-info-bj-red1 td:nth-child(2){
  position: relative;
  &::after{
    content: 'Enter card number';
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: -5px;
    left: 0px;
    color: red;
    font-size: 12px;
    z-index: 1;
  }
}
.ludanBox_dialog{
    .el-form-item{
      .el-radio-group,.el-checkbox-group{
        display:  flex;
        justify-content: center;
        width: 100%;
        .el-checkbox-button__inner,.el-radio-button__inner{
        min-width: 100px;
        height: 50px;
        line-height: 40px;
        background: #919191;
        border-radius: 6px;
        color: #999;
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
           font-size: 22px;
           border: 0;
           font-weight: bold;
           color: #fff;
        }
      }
      }
    }
}
.dialog_tips{
  .el-message-box__content{
      font-size: 24px;
  }
  .el-message-box__btns{
    button{
      font-size: 20px;
      padding: 15px 25px;
    }
  }
}  
.el-message-box__btns{
  button{
    font-size: 20px;
    padding: 15px 25px;
  }
}
</style>
