<template>
  <div class="app-container game_nn">
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
              <el-input  style="width:180px" v-model="dealer" placeholder=""  /> 
              <el-button style="width:100px" class="loginout" type="success" plain @click="subDealer">{{$t('Confirm')}}</el-button>
            </div>
          </el-card>
      </el-col>
       <!--桌台信息-->
      <el-col :span="16" :xs="24">
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
             </ul>
              <ul>
              <li>฿{{$t('bet.chip')}}:{{tableInfo.chipTh || 0}}</li>
              <li>฿{{$t('bet.cash')}}:{{tableInfo.cashTh || 0}}</li>
             </ul>
          </el-card>
         
      </el-col>
     
       <!--操作-->
      <el-col :span="8" :xs="24">
          <el-card class="box-card-box-list" style="text-align:center">
            <el-row :gutter="0" style="width:100%">
               <el-col :span="24" :xs="24">
                  <div class="f2">
                     <span>${{$t('bet.chip')}}:{{nnSum.sumChip || 0}}</span>
                    <span>${{$t('bet.cash')}}:{{nnSum.sumCash || 0}}</span>
                     <span>฿{{$t('bet.chip')}}:{{nnSum.sumChipTh || 0}}</span>
                    <span>฿{{$t('bet.cash')}}:{{nnSum.sumCashTh || 0}}</span>
                  </div>
               </el-col>
         
               <el-col :span="24" :xs="24" class="control">  
                  <el-button type="primary" @click="startBet">{{$t('bet.open')}}</el-button>
                  <el-button type="primary" @click="updataBet" :disabled="iskaipai">{{$t('bet.input')}}</el-button>
                  <el-button type="warning" @click="ponintCode">{{$t('bet.ponintCode')}}</el-button>
                  <el-button type="danger" @click="getCode">{{$t('bet.getCode')}}</el-button>
               </el-col>
            </el-row>
          </el-card>
       </el-col>
    </el-row>


  

     <el-table v-loading="loading" stripe class="betBox" height="600px" style="font-size: 20px;" :data="nnList"  border :row-class-name="status_change"   @selection-change="handleSelectionChange" >
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
                  <el-input @input='DataChange' v-model="scope.row.card" placeholder="" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('Loss')" align="center" key="lose" prop="lose"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' :disabled="scope.row.win?scope.row.win !='':false" v-model.number="scope.row.lose" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('Win')" align="center" key="win" prop="win"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' :disabled="scope.row.lose?scope.row.lose !='':false" v-model.number="scope.row.win" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
          <el-table-column :label="$t('bet.payOut')" align="center"   prop="payout" />
             
         
        </el-table>

    <!-- 添加或修改用户配置对话框 -->
    <Dialog :title='title' :open='open' @getOpen='openData' />
     <!-- 下注记录 -->
    <BetRecord :record='record' @getRecord='recordData'/>

   
  </div>
</template>

<script>
import {getDealerCheckUserName} from "@/api/account/dealer"
import { niuniuInput,niuniuNext,niuniuOpen,niuniuInfo,niuniuSave} from "@/api/bet/niuniu";
import { mapState, mapMutations } from "vuex";
import Dialog from "./dialog.vue"
import BetRecord from "./dialogBet.vue"
export default {
  name: "Niuniu",
  data() {

    return {
      isSend:false,
      // 遮罩层
      loading: false,
      isVisibles:true,
      dealer:'',
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
          sumChip:'',
          sumCash:'',
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
    this.getStatus()
  },
  computed:{
    userName(){
      return this.$store.state.user.name
    },
     ...mapState("game", [ "nnList",'nnSum']),
  },
  methods: {
    ...mapMutations('game',["setNnList","setNnSum"]),
    screencast(){
      this.isSend = !this.isSend
      this. getSend()
      localStorage.setItem('NnType',this.isSend)
    },
  
     subDealer(){
      getDealerCheckUserName({'userName':this.dealer}).then(res =>{
        if(res.code && res.code == 200){
          this.$modal.msgSuccess(this.$t('bet.suc'));
          localStorage.setItem('NnDealer',this.dealer)
        }else{
          this.$modal.msgError(this.$t('bet.los'));
           this.dealer =''
           localStorage.setItem('NnDealer','')
        }
      })
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
        niuniuNext().then(res => {
          // this.loading = false;
           this.getTableInfo()
            this.getResult()
        })
      })
    },
    openData(data){
      this.open = data
      // if(this.title=='点码')
      this.getTableInfo()
    },
     recordData(data){
      this.record = data
    },
    //桌台信息
    getTableInfo(){
       niuniuInfo().then(res => {
          this.tableInfo = res.data;
          // this.loading = false;
        },
        this.setNnList(this.betList),
        this.setNnSum(this.sumdata),
      );
    },
   //获取本地存储
    getStatus(){
        if(localStorage.getItem("NnType") != null){
          if(localStorage.getItem('NnType')=="true"){
            this.isSend =true
          }else{
            this.isSend =false
          }
        }
         if(localStorage.getItem("NnList") != null){
           this.setNnList(JSON.parse(localStorage.getItem('NnList')))
        }
           if(localStorage.getItem("NnDealer") != null){
         this.dealer = localStorage.getItem('NnDealer')
        }
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
      if(row.row.lose|| row.row.win ){
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
        niuniuSave({'json':this.nnList}).then(res => {
          // this.loading = false;
        })
      }else{
         let arr2 = Array(30).fill().map((e,i)=>Object({id:i+1,type:0}))
         niuniuSave({'json':arr2}).then(res => {
          // this.loading = false;
        })
      }
    },
    DataChange(){
      this. getSend()
    },
    //开牌
    startBet(){

      let param ={}
      // let str =''
      // str= this.radio1.toString()
      // param['gameResult']=str
      let arr=[]
      let arr1=[]
      this.betList = this.nnList
      arr = this.betList.map(o=>{
            return {
              "type":o.type,
              "card":o.card,
              "输":o.lose,
              "赢":o.win,
            }
      })
      // this.betList = this.nnList
      let isDialog = false
      this.betList.forEach(e=>{
        if(e.lose|| e.win){
          
          if(!e.type && e.type!=0 && !isDialog){
            
             isDialog =true
             this.$modal.msgError(this.$t('bet.isChoose'));
          };
          if(!e.card && !isDialog){
            isDialog =true
            this.$modal.msgError(this.$t('bet.ishas'));
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
      const  newData = this.sumArr(arr1)
      const arrCash =arr1.filter(e =>e.type==0)
      const newCash =this.sumArr(arrCash)
      const arrChip =arr1.filter(e =>e.type==1)
      const newChip =this.sumArr(arrChip)
      const arrCashTh =arr1.filter(e =>e.type==2)
      const newCashTh =this.sumArr(arrCashTh)
      const arrChipTh =arr1.filter(e =>e.type==3)
      const newChipTh =this.sumArr(arrChipTh)

      this.sumdata.sumChip = newChip['输']+newChip['赢']
      this.sumdata.sumCash = newCash['输']+newCash['赢']
      this.sumdata.sumChipTh = newChipTh['输']+newChipTh['赢']
      this.sumdata.sumCashTh = newCashTh['输']+newCashTh['赢']
     this.setNnSum(this.sumdata)
      niuniuOpen({'json':param}).then(res => {
          this.subData= res.data
          let arr2 = Array(30).fill().map((e,i)=>Object({id:i+1,type:0}))
          
            this.subData.bet.forEach((e,i)=>{
            arr2[i]={...arr2[i],...this.betList[i],...e}
             
          })
          this.betList = arr2
          this.setNnList(arr2)
          this. getSend()
          this.iskaipai = false
          // this.loading = false;
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
        niuniuInput({'json':this.subData,'dealer':this.dealer}).then(res=>{
          // this.loading = false;
          // this.betList = Array(30).fill().map((e,i)=>Object({id:i+1,type:0})),
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
          localStorage.setItem('NnList',JSON.stringify(this.betList))
          this.setNnList(this.betList)
          this.setNnSum(this.sumdata)
          let that=this
          setTimeout(function(){  
            that.getTableInfo() 
            // that.getResult()
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
        }, {'输': 0, '赢': 0})
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
.game_nn{
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
      .f2{
      display: flex;
      justify-content: space-around;
      width: 100%;
      span{
        line-height: 50px;
        font-size: 18px;
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
          // &:nth-child(5){
          //   background: green;
          //   color: #fff;
          // }
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
.app_zh .game_nn .table-info-bj-red1 td:nth-child(2){
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
.app_en .game_nn .table-info-bj-red1 td:nth-child(2){
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
        min-width: 80px;
        height: 40px;
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