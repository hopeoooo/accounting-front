<template>
  <div class="app-container game_bjl" oncontextmenu = "return false">
    <el-row :gutter="20">

      <!--切换账号-->
      <el-col :span="24" :xs="24">
          <el-card class="box-card-box1" style="text-align:center">
            <div class="h1">{{$t('bet.user')}}</div>
            <div >{{userName}}</div>
            <el-button class="loginout" type="info" @click.native="logout">{{$t('bet.changeAccount')}}</el-button>
             <el-button class="loginout" type="primary" plain @click="screencast">{{isSend?$t('bet.onScreen'):$t('bet.noScreen')}}</el-button>
              <!-- <el-button type="primary" plain @click="roadChange">路珠修改</el-button> -->
              <el-button class="loginout" type="danger" plain @click="betRecord">{{$t('bet.betRecord')}}</el-button>
          </el-card>
      </el-col>
       <!--桌台信息-->
      <el-col :span="18" :xs="24">
           <el-card class="box-card-box" style="text-align:center">
            <ul style="background-color: #ececec;">
              <li>{{$t('bet.taiHao')}}：{{tableInfo.tableId || 0}}</li>
              <li>{{$t('bet.xueHao')}}：{{tableInfo.bootNum || 0}}</li>
              <li>{{$t('bet.juHao')}}：{{tableInfo.gameNum || 0}}</li>
              <li style="color: blueviolet;">${{$t('bet.leiji')}}：{{tableInfo.total || 0}}</li>
              <li style="color: red;">฿{{$t('bet.leiji')}}：{{tableInfo.totalTh || 0}}</li>

            </ul>
            <ul style="background-color: #ececec;">
            
              <li>${{$t('bet.chip')}}:{{tableInfo.chip || 0}}</li>
              <li>${{$t('bet.cash')}}:{{tableInfo.cash || 0}}</li>
               <li>${{$t('bet.ins')}}:{{tableInfo.totalInsurance || 0}}</li>
              <li>฿{{$t('bet.chip')}}:{{tableInfo.chipTh || 0}}</li>
              <li>฿{{$t('bet.cash')}}:{{tableInfo.cashTh || 0}}</li>
              <li>฿{{$t('bet.ins')}}:{{tableInfo.totalInsuranceTh || 0}}</li>
             
            </ul>
            <!-- <ul>
             
             
             </ul> -->
          <!-- </el-card>
          <el-card class="box-card-box" style="text-align:center"> -->
             <ul>
              <li>${{$t('bet.z')}}:{{baccaratSum.sumZ || 0}}</li>
              <li>${{$t('bet.zd')}}:{{baccaratSum.sumZd || 0}}</li>
              <li>${{$t('bet.h')}}:{{baccaratSum.sumH || 0}}</li>
              <li>${{$t('bet.x')}}:{{baccaratSum.sumX || 0}}</li>
              <li>${{$t('bet.xd')}}:{{baccaratSum.sumXd || 0}}</li>
              <li>${{$t('bet.big')}}:{{baccaratSum.sumBig || 0}}</li>
              <li>${{$t('bet.small')}}:{{baccaratSum.sumSmall || 0}}</li>
               <li>${{$t('bet.lucky')}}:{{baccaratSum.sumA || 0}}</li>
             </ul>
             <ul>
              <li>฿{{$t('bet.z')}}:{{baccaratSum.sumZTh || 0}}</li>
              <li>฿{{$t('bet.zd')}}:{{baccaratSum.sumZdTh || 0}}</li>
              <li>฿{{$t('bet.h')}}:{{baccaratSum.sumHTh || 0}}</li>
              <li>฿{{$t('bet.x')}}:{{baccaratSum.sumXTh || 0}}</li>
              <li>฿{{$t('bet.xd')}}:{{baccaratSum.sumXdTh || 0}}</li>
              <li>฿{{$t('bet.big')}}:{{baccaratSum.sumBigTh || 0}}</li>
              <li>฿{{$t('bet.small')}}:{{baccaratSum.sumSmallTh || 0}}</li>
              <li>฿{{$t('bet.lucky')}}:{{baccaratSum.sumATh || 0}}</li>
             </ul>
             <ul>
                <li>${{$t('bet.zIns')}}:{{baccaratSum.sumZbx || 0}}</li>
                <li>${{$t('bet.tIns')}}:{{baccaratSum.sumHbx || 0}}</li>
                <li>${{$t('bet.xIns')}}:{{baccaratSum.sumXbx || 0}}</li>
                <li>฿{{$t('bet.zIns')}}:{{baccaratSum.sumZbxTh || 0}}</li>
                <li>฿{{$t('bet.tIns')}}:{{baccaratSum.sumHbxTh || 0}}</li>
                <li>฿{{$t('bet.xIns')}}:{{baccaratSum.sumXbxTh || 0}}</li>
             </ul>
              <ul>
                <li>${{$t('bet.chip')}}:{{baccaratSum.sumChip || 0}}</li>
                <li>${{$t('bet.cash')}}:{{baccaratSum.sumCash || 0}}</li>
                  <li>฿{{$t('bet.chip')}}:{{baccaratSum.sumChipTh || 0}}</li>
                <li>฿{{$t('bet.cash')}}:{{baccaratSum.sumCashTh || 0}}</li>
              </ul>
          </el-card>
      </el-col>
     
       <!--路单展示-->
      <el-col :span="6" :xs="24">
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
               <!-- <el-col :span="4" :xs="12"> -->
                  <!-- <div class="f1">
                    <span>${{$t('bet.chip')}}:{{baccaratSum.sumChip || 0}}</span>
                    <span>${{$t('bet.cash')}}:{{baccaratSum.sumCash || 0}}</span>
                     <span>฿{{$t('bet.chip')}}:{{baccaratSum.sumChipTh || 0}}</span>
                    <span>฿{{$t('bet.cash')}}:{{baccaratSum.sumCashTh || 0}}</span>
                  </div> -->
               <!-- </el-col> -->
              <el-col :span="17" :xs="24" class="choose">
                  <el-radio-group v-model="radio1" class="checked checked1">
                      <el-radio-button :label="4" class="red">{{$t('bet.z')}}</el-radio-button>
                      <el-radio-button :label="1" class="blue">{{$t('bet.x')}}</el-radio-button>
                      <el-radio-button :label="7" class="green">{{$t('bet.h')}}</el-radio-button>
                    </el-radio-group>

                  <el-checkbox-group v-model="checkboxGroup1" class="checked checked2">
                    <el-checkbox-button v-for="(e,key) in reData" :label="e.id" :class="e.color" :key="key">{{e.name}}</el-checkbox-button>
                  </el-checkbox-group>
                  <el-checkbox-group v-model="checkboxGroup2" class="checked checked3" :max="1">
                    <el-checkbox-button v-for="(e,key) in reData1" :label="e.id" :class="e.color" :key="key">{{e.name}}</el-checkbox-button>
                  </el-checkbox-group>
                  <el-checkbox-group v-model="checkboxGroup3" class="checked checked4" :max="1">
                    <el-checkbox-button v-for="(e,key) in reData2" :label="e.id" :class="e.color" :key="key">{{e.name}}</el-checkbox-button>
                  </el-checkbox-group>
               </el-col>
               <el-col :span="7" :xs="24" class="control">  
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
                 <el-radio-button :label="4" class="red">{{$t('bet.z')}}</el-radio-button>
                  <el-radio-button :label="1" class="blue">{{$t('bet.x')}}</el-radio-button>
                  <el-radio-button :label="7" class="green">{{$t('bet.h')}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
          <el-form-item>
            <el-checkbox-group v-model="formLudan.checkboxGroup1" class="checked">
              <el-checkbox-button v-for="(e,key) in reData" :label="e.id" :class="e.color" :key="key">{{e.name}}</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="" prop=""  >
              <el-checkbox-group v-model="formLudan.checkboxGroup2" class="checked" :max="1">
                <el-checkbox-button v-for="(e,key) in reData1" :label="e.id" :class="e.color" :key="key">{{e.name}}</el-checkbox-button>
              </el-checkbox-group>
          </el-form-item>
           <el-form-item label="" prop=""  >
               <el-checkbox-group v-model="formLudan.checkboxGroup3" class="checked" :max="1">
                  <el-checkbox-button v-for="(e,key) in reData2" :label="e.id" :class="e.color" :key="key">{{e.name}}</el-checkbox-button>
                </el-checkbox-group>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLudan">{{$t('bet.sure')}}</el-button>
        <el-button @click="cancel">{{$t('bet.cancel')}}</el-button>
      </div>
    </el-dialog>

     <el-table v-loading="loading" class="betBox_bjl" height="650px" style="font-size: 20px;" stripe :data="baccaratList"  border :row-class-name="status_change"  @selection-change="handleSelectionChange" >
       <!-- <el-table v-loading="loading" class="betBox" height="500px" :data="baccaratList"  border :row-class-name="status_change" @current-change='DataChange'  @selection-change="handleSelectionChange" > -->
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column :label="$t('bet.chooseStyle')" align="center"  key="type" prop="type" width="360px">
               <template slot-scope="scope">
                  <el-radio-group  @change='DataChange' v-model.number="scope.row.type">
                   <el-radio :label="0">${{$t('bet.chip')}}</el-radio>
                    <el-radio :label="1">${{$t('bet.cash')}}</el-radio>
                    <el-radio :label="2">฿{{$t('bet.chip')}}</el-radio>
                    <el-radio :label="3">฿{{$t('bet.cash')}}</el-radio>
                  </el-radio-group>
              </template>
          </el-table-column>
          <el-table-column :label="$t('Card-number')" align="center" key="card" prop="card"  width="150px">
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model="scope.row.card" placeholder=""  />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.z')" align="center" key="card1" prop="card1"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card1" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.x')" align="center" key="card2" prop="card2"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card2" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.h')" align="center" key="card3" prop="card3"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card3" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.zd')" align="center" key="card4" prop="card4"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card4" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.xd')" align="center" key="card5" prop="card5"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card5" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.zIns')" align="center" key="card6" prop="card6"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card6" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.xIns')" align="center" key="card7" prop="card7"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card7" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
           <el-table-column :label="$t('bet.tIns')" align="center" key="card10" prop="card10"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card10" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
         
           <el-table-column :label="$t('bet.big')" align="center" key="card8" prop="card8"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card8" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
            <el-table-column :label="$t('bet.small')" align="center" key="card9" prop="card9"  >
               <template slot-scope="scope">
                  <el-input @input='DataChange' v-model.number="scope.row.card9" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
            <el-table-column :label="$t('bet.lucky')" align="center" width="110px" key="card11" prop="card11"  >
               <template slot-scope="scope">
                  <el-input @change='DataChange' v-model.number="scope.row.card11" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
              </template>
          </el-table-column>
          <!-- <el-table-column label="现有筹码" align="center" key="chip" prop="chip"  fixed="right" /> -->
          <el-table-column :label="$t('bet.payOut')" align="center" width="110px"   prop="payout" />
             
         
        </el-table>

    <!-- 添加或修改用户配置对话框 -->
    <Dialog :title='title' :open='open' @getOpen='openData' />
     <!-- 下注记录 -->
    <BetRecord :record='record' @getRecord='recordData'/>

   
  </div>
</template>

<script>
import { baccaratInfo,baccaratList,baccaratOpen,baccaratUpdate,baccaratInput,baccaratSave} from "@/api/bet/baccarat";
import { mapState, mapMutations } from "vuex";
import Dialog from "./dialog.vue"
import BetRecord from "./dialogBet.vue"

export default {
  name: "Baccarat",
  data() {

    return {
      isSend:false,
      // 遮罩层
      loading: true,
      isVisibles:false,
      record:false,
      // isRecord:false,
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
         checkboxGroup2:[],
         checkboxGroup3:[], 
        // radio2:'',
      },
  
      basedata:{

      },
      betList:Array(30).fill().map((e,i)=>Object({id:i+1,type:0})),
      subData:[],
      rulesLudan:{},
      checkboxGroup1:[],
        checkboxGroup2:[],
      checkboxGroup3:[],  
      radio1:'',
      // radio2:'',
      // reData:[
      //   {id:8,name:this.$t('bet.zd'),color:'red'},
      //   {id:5,name:this.$t('bet.xd'),color:'blue'},
      // ],
      //  reData1:[
      //   {id:9,name:this.$t('bet.big'),color:'red'},
      //   {id:6,name:this.$t('bet.small'),color:'blue'},
      // ],
      //  reData2:[
      //   {id:'a',name:this.$t('bet.two'),color:'red'},
      //   {id:'b',name:this.$t('bet.three'),color:'blue'},
      // ],
      // userName:'',
      tableInfo:'', //桌台信息
      iskaipai:true,
      result:'',//赛果
      //庄闲和筹码现金合计
      sumdata:{
          sumZ:'',
          sumX:'',
          sumH:'',
          sumZd:'',
          sumXd:'',
          sumZbx:'',
          sumXbx:'',
          sumHbx:'',
          sumBig:'',
          sumSmall:'',
          sumChip:'',
          sumCash:'',
          sumZTh:'',
          sumXTh:'',
          sumHTh:'',
          sumZdTh:'',
          sumXdTh:'',
          sumZbxTh:'',
          sumXbxTh:'',
          sumHbxTh:'',
          sumBigTh:'',
          sumSmallTh:'',
          sumATh:'',
          sumA:'',
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
   
       reData1(){
        return [
            {id:9,name:this.$t('bet.big'),color:'red'},
            {id:6,name:this.$t('bet.small'),color:'blue'},
          ]
      },
       reData2(){
        return [
            {id:'a',name:this.$t('bet.two'),color:'red'},
            {id:'b',name:this.$t('bet.three'),color:'blue'},
          ]
       },
      reData(){
        return [
        {id:8,name:this.$t('bet.zd'),color:'red'},
        {id:5,name:this.$t('bet.xd'),color:'blue'},
        ]
      },
    userName(){
      return this.$store.state.user.name
    },
     ...mapState("game", [ "baccaratList",'baccaratSum']), 
  },
  methods: {
    ...mapMutations('game',["setBaccaratList","setBaccaratSum"]),
    screencast(){
      this.isSend = !this.isSend
      this. getSend()
      localStorage.setItem('BjType',this.isSend)
    },
  
    roadChange(){},
    betRecord(){
      this.record = true
    },
    
    



    openData(data){
      this.open = data
        // if(this.title=='点码')
      this.getTableInfo()
      this.getResult()
    },
    recordData(data){
      this.record = data
    },
    //桌台信息
    getTableInfo(){
       baccaratInfo().then(res => {
          this.tableInfo = res.data;
          this.loading = false;
        },
        this.setBaccaratList(this.betList),
        this.setBaccaratSum(this.sumdata),
      );
     
    },
    //获取本地存储
    getStatus(){
        if(localStorage.getItem("BjType") != null){
          if(localStorage.getItem('BjType')=="true"){
            this.isSend =true
          }else{
            this.isSend =false
          }
        }
         if(localStorage.getItem("BjList") != null){
           this.setBaccaratList(JSON.parse(localStorage.getItem('BjList')))
        }
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
      if(row.row.card1|| row.row.card2 || row.row.card3|| row.row.card4 || row.row.card5|| row.row.card6|| row.row.card7 || row.row.card8|| row.row.card9|| row.row.card10|| row.row.card11){
          if (!row.row.type && row.row.type !=0) {
            return 'table-info-bj-red'
          }
          if (!row.row.card) {
            return 'table-info-bj-red1'
          }
        }
    },
    getSend(){
      if(this.isSend == true){
        baccaratSave({'json':this.baccaratList}).then(res => {
          this.loading = false;
        })
      }else{
         let arr2 = Array(30).fill().map((e,i)=>Object({id:i+1,type:0}))
         baccaratSave({'json':arr2}).then(res => {
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
      str= this.radio1.toString()+this.checkboxGroup1.join('')+this.checkboxGroup2.join('')+this.checkboxGroup3.join('')
      //  str= this.radio1.toString()+this.checkboxGroup1.join('')+this.radio2.toString()
      param['gameResult']=str
      let arr=[]
      let arr1=[]
      this.betList = this.baccaratList
      arr = this.betList.map(o=>{
            return {
              "type":o.type,
              "card":o.card,
              "4":o.card1,
              "1":o.card2,
              "7":o.card3,
              "8":o.card4,
              "5":o.card5,
              "3":o.card6,
              "0":o.card7,
              "9":o.card8,
              "6":o.card9,
              "2":o.card10,
              "a":o.card11,
              "b":o.card12,
            }
      })
      
      let isDialog = false
      this.betList.forEach(e=>{
        if(e.card1|| e.card2 || e.card3|| e.card4 || e.card5|| e.card6|| e.card7 || e.card8|| e.card9){
          
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
     
      const arrCash =arr1.filter(e =>e.type==1)
      const newCash =this.sumArr(arrCash)
      const arrChip =arr1.filter(e =>e.type==0)
      const newChip =this.sumArr(arrChip)
      const arrCashTh =arr1.filter(e =>e.type==3)
      const newCashTh =this.sumArr(arrCashTh)
      const arrChipTh =arr1.filter(e =>e.type==2)
      const newChipTh =this.sumArr(arrChipTh)
      let  arrMJ = arrCash.concat(arrChip)
      let  arrTh = arrCashTh.concat(arrChipTh)
       const  newData = this.sumArr(arrMJ)     
      this.sumdata.sumZ = newData['4']
      this.sumdata.sumX = newData['1']
      this.sumdata.sumH = newData['7']
      this.sumdata.sumZd = newData['8']
      this.sumdata.sumXd = newData['5']
   
      this.sumdata.sumBig = newData['9']
      this.sumdata.sumSmall = newData['6']
      this.sumdata.sumA = newData['a']     

        const  newDataTh = this.sumArr(arrTh)     
      this.sumdata.sumZTh = newDataTh['4']
      this.sumdata.sumXTh = newDataTh['1']
      this.sumdata.sumHTh = newDataTh['7']
      this.sumdata.sumZdTh = newDataTh['8']
      this.sumdata.sumXdTh = newDataTh['5']
     
      this.sumdata.sumBigTh = newDataTh['9']
      this.sumdata.sumSmallTh = newDataTh['6']
      this.sumdata.sumATh = newDataTh['a']
      if(this.radio1 =='4'){
        this.sumdata.sumZbx = -newData['3']
        this.sumdata.sumXbx = newData['0']
        this.sumdata.sumHbx = newData['2']
        this.sumdata.sumZbxTh = -newDataTh['3']
        this.sumdata.sumXbxTh = newDataTh['0']
        this.sumdata.sumHbxTh = newDataTh['2']
      }else if(this.radio1 =='1'){
        this.sumdata.sumZbx = newData['3']
        this.sumdata.sumXbx = -newData['0']
        this.sumdata.sumHbx = newData['2']
        this.sumdata.sumZbxTh = newDataTh['3']
        this.sumdata.sumXbxTh = -newDataTh['0']
        this.sumdata.sumHbxTh = newDataTh['2']
      }else if(this.radio1 =='7'){
        this.sumdata.sumZbx = 0
        this.sumdata.sumXbx = 0
        this.sumdata.sumHbx = -newData['2']
        this.sumdata.sumZbxTh = 0
        this.sumdata.sumXbxTh = 0
        this.sumdata.sumHbxTh = -newDataTh['2']
      }
      this.sumdata.sumChip = newChip['4']+newChip['1']+newChip['7']+newChip['8']+newChip['5']+newChip['9']+newChip['6']+newChip['a']
      this.sumdata.sumCash = newCash['4']+newCash['1']+newCash['7']+newCash['8']+newCash['5']+newCash['9']+newCash['6']+newCash['a']
       this.sumdata.sumChipTh = newChipTh['4']+newChipTh['1']+newChipTh['7']+newChipTh['8']+newChipTh['5']+newChipTh['9']+newChipTh['6']+newChipTh['a']
      this.sumdata.sumCashTh = newCashTh['4']+newCashTh['1']+newCashTh['7']+newCashTh['8']+newCashTh['5']+newCashTh['9']+newCashTh['6']+newCashTh['a']
  
    this.setBaccaratSum(this.sumdata)

      baccaratOpen({'json':param}).then(res => {
          this.subData= res.data
          let arr2 = Array(30).fill().map((e,i)=>Object({id:i+1,type:0}))
            this.subData.bet.forEach((e,i)=>{
            arr2[i]={...arr2[i],...this.betList[i],...e}
          })
          this.betList = arr2
          this.setBaccaratList(this.betList)
          
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
        baccaratInput({'json':this.subData}).then(res=>{
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
          this.checkboxGroup1 =[]
          this.checkboxGroup2 =[]
          this.checkboxGroup3 =[]
          this.sumdata={ }
          console.log(this.betList)
          localStorage.setItem('BjList',JSON.stringify(this.betList))
          this.setBaccaratList(this.betList)
          this.setBaccaratSum(this.sumdata)
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
        }, {'1': 0,'2': 0, '4': 0, '7':0,'8':0,'5':0,'9':0,'6':0,'3':0,'0':0,'a':0})
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
        checkboxGroup1:[],
        checkboxGroup2:[],
        checkboxGroup3:[],
        // radio2:'',
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
        this.formLudan.checkboxGroup2.push(9)
        }else if(e==6){
          this.formLudan.checkboxGroup2.push(6)
        }else if(e=='a'){
        this.formLudan.checkboxGroup3.push('a')
        }else if(e=='b'){
          this.formLudan.checkboxGroup3.push('b')
        }
      })
      
    },
      submitLudan(){
      let str =''
      str= this.formLudan.radio1.toString()+this.formLudan.checkboxGroup1.join('')+this.formLudan.checkboxGroup2.join('')+this.formLudan.checkboxGroup3.join('')
      
      let param ={}
      param['id']= this.formLudan.id
      param['gameResult'] = str
      baccaratUpdate(param).then(res=>{
         this.$modal.msgSuccess(this.$t('bet.tips1'));
          this.openLUdan = false;
          const that =this
          setTimeout(function () {
            that.getResult();
            that.getTableInfo()
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
.game_bjl{
  padding: 5px 20px 20px;
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
    margin-bottom: 10px;
    font-size: 18px;  
    .el-card__body{
      display: flex;
      flex-direction: column;
      padding: 10px;
      .h1{
        font-size: 24px;
        line-height: 40px;
      }
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
              .type1{
                background: url("../../../../assets/images/ludan/x1.svg") center no-repeat;
                background-size: 100%;
              }
              .type2{
                background: url("../../../../assets/images/ludan/x2.svg") center no-repeat;
                background-size: 100%;
              }
              .type3{
                background: url("../../../../assets/images/ludan/x3.svg") center no-repeat;
                background-size: 100%;
              }
              .type4{
                background: url("../../../../assets/images/ludan/x4.svg") center no-repeat;
                background-size: 100%;
              }
              .type5{
                background: url("../../../../assets/images/ludan/z1.svg") center no-repeat;
                background-size: 100%;
              }
              .type6{
                background: url("../../../../assets/images/ludan/z2.svg") center no-repeat;
                background-size: 100%;
              }
              .type7{
                background: url("../../../../assets/images/ludan/z3.svg") center no-repeat;
                background-size: 100%;
              }
              .type8{
                background: url("../../../../assets/images/ludan/z4.svg") center no-repeat;
                background-size: 100%;
              }
              .type9{
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
    margin-bottom: 10px;
    .el-card__body{
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 20px;
      .el-row{
        .el-col{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap:wrap;
          &.choose{
            padding-right: 50px;
          }
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
        font-size: 18px;
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
        justify-content: space-around;
        &.checked1{
          flex-basis: 3/10*100%;
          .el-radio-button{
            flex-basis: 30%;
          }
        }
        &.checked2,&.checked3,&.checked4{
          flex-basis: 2/10*100%;
          .el-checkbox-button{
            flex-basis: 45%;
          }
        }
        &.checked4{
          flex-basis: 3/10*100%;
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
            font-weight: bold;
            color: #fff;
          }
        }
      }
    }

  }
  .betBox_bjl {
    
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
          &:nth-child(3), &:nth-child(6), &:nth-child(8), &:nth-child(11){
            background: red;
            color: #fff;
          }
          &:nth-child(4), &:nth-child(7), &:nth-child(9), &:nth-child(12){
            background: blue;
            color: #fff;
          }
          &:nth-child(5),&:nth-child(10){
            background: green;
            color: #fff;
          }
          &:nth-child(13){
          background:#ffc833;
          color: #fff;}
        }
      }
    }
  }
  .table-info-bj-red td:nth-child(1){
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
  .table-info-bj-red1 td:nth-child(2){
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
  .table-info-red td,.table-info-red1 td{
    // background: rgb(199, 135, 135);
  }

}

.app_zh .game_bjl .box-card-box .ludanbox .ludan .list2 .list_p {
  .type1{
                background: url("../../../../assets/images/ludan/x1.svg") center no-repeat;
                background-size: 100%;
              }
              .type2{
                background: url("../../../../assets/images/ludan/x2.svg") center no-repeat;
                background-size: 100%;
              }
              .type3{
                background: url("../../../../assets/images/ludan/x3.svg") center no-repeat;
                background-size: 100%;
              }
              .type4{
                background: url("../../../../assets/images/ludan/x4.svg") center no-repeat;
                background-size: 100%;
              }
              .type5{
                background: url("../../../../assets/images/ludan/z1.svg") center no-repeat;
                background-size: 100%;
              }
              .type6{
                background: url("../../../../assets/images/ludan/z2.svg") center no-repeat;
                background-size: 100%;
              }
              .type7{
                background: url("../../../../assets/images/ludan/z3.svg") center no-repeat;
                background-size: 100%;
              }
              .type8{
                background: url("../../../../assets/images/ludan/z4.svg") center no-repeat;
                background-size: 100%;
              }
              .type9{
                background: url("../../../../assets/images/ludan/h.svg") center no-repeat;
                background-size: 100%;
              }
}
.app_en .game_bjl .box-card-box .ludanbox .ludan .list2 .list_p {
  .type1{
                background: url("../../../../assets/images/ludan/x1_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type2{
                background: url("../../../../assets/images/ludan/x2_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type3{
                background: url("../../../../assets/images/ludan/x3_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type4{
                background: url("../../../../assets/images/ludan/x4_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type5{
                background: url("../../../../assets/images/ludan/z1_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type6{
                background: url("../../../../assets/images/ludan/z2_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type7{
                background: url("../../../../assets/images/ludan/z3_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type8{
                background: url("../../../../assets/images/ludan/z4_en.svg") center no-repeat;
                background-size: 100%;
              }
              .type9{
                background: url("../../../../assets/images/ludan/h_en.svg") center no-repeat;
                background-size: 100%;
              }
}
.app_zh .game_bjl .table-info-bj-red1 td:nth-child(2){
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
.app_en .game_bjl .table-info-bj-red1 td:nth-child(2){
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
          line-height: 50px;
          background: #919191;
          border-radius: 6px;
          color: #999;
          margin: 0 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
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
           font-weight: bold;
           color: #fff;
           box-sizing: border-box;
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
  .result-long-banker {
  color: red;
}
.result-hu-player {
  color: blue;
}
.result-tie {
  color: green;
}

</style>
