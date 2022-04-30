<template>
  <div class="app-container" v-loading="loading">
    <div class="title">赔率设置</div>
    <el-row :gutter="20">
      <el-col :span="12" :xs="24">
      
        <div class="gamebox">
            <div class="list">
            <span>百家乐</span>
           </div>
          <div class="list">
            <span>庄赢抽水</span>
              <el-input
                v-model="oddsList.baccaratPump"
                style="width: 80px"
                oninput="value=value.replace(/[^\d]/g,'')"
              />%
            </div>
          <div class="list">
            <span>庄赢</span>1赔 
            <el-input
                v-model="oddsList.baccaratBankerWin"
                style="width: 80px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
          <div class="list">
            <span>闲赢</span>1赔 
            <el-input
                v-model="oddsList.baccaratPlayerWin"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
          <div class="list">
            <span>和赢</span>1赔
            <el-input
                v-model="oddsList.baccaratTieWin"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
          <div class="list">
            <span>庄对</span>1赔
            <el-input
                v-model="oddsList.baccaratBankerPair"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
          <div class="list">
            <span>闲对</span>1赔
            <el-input
                v-model="oddsList.baccaratPlayerPair"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
          <div class="list">
            <span>大</span>1赔
            <el-input
                v-model="oddsList.baccaratLarge"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
          <div class="list">
            <span>小</span>1赔
            <el-input
                v-model="oddsList.baccaratSmall"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
        </div>
      </el-col>
      <el-col :span="12" :xs="24">
        <div class="gamebox">
          <div class="list">
            <span>龙虎</span>
          </div>
          <div class="list">
            <span>龙赢</span>1赔 
            <el-input
                v-model="oddsList.dragonWin"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
          <div class="list">
            <span>虎赢</span>1赔
            <el-input
                v-model="oddsList.tigerWin"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
          <div class="list">
            <span>和赢</span>1赔
            <el-input
                v-model="oddsList.tieWin"
                style="width: 80px"
                 oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="title">洗码比例</div>
    <el-row :gutter="20">
      <el-col :span="6" :xs="12">
         <div class="listb">
            <span>百家乐洗码比例（筹码）</span>
              <el-input
                v-model="oddsList.baccaratRollingRatioChip"
                style="width: 80px"
                oninput="value=value.replace(/[^\d]/g,'')"
              />%
            </div>
      </el-col>
      <el-col :span="6" :xs="12">
         <div class="listb">
            <span>百家乐洗码比例（现金）</span>
              <el-input
                v-model="oddsList.baccaratRollingRatioCash"
                style="width: 80px"
                oninput="value=value.replace(/[^\d]/g,'')"
              />%
            </div>
      </el-col>
      <el-col :span="6" :xs="12">
        <div class="listb">
            <span>龙虎洗码比例（筹码）</span>
              <el-input
                v-model="oddsList.dragonTigerRatioChip"
                style="width: 80px"
                oninput="value=value.replace(/[^\d]/g,'')"
              />%
            </div>
      </el-col>
      <el-col :span="6" :xs="12">
           <div class="listb">
            <span>龙虎洗码比例（现金）</span>
              <el-input
                v-model="oddsList.dragonTigerRatioCash"
                style="width: 80px"
                oninput="value=value.replace(/[^\d]/g,'')"
              />%
            </div>
      </el-col>
    </el-row>
     <div class="title">其它配置</div>
    <el-row :gutter="20">
      <el-col :span="6" :xs="12">
        <el-checkbox v-model="checked">洗码佣金取整</el-checkbox>
      </el-col>
      <el-col :span="6" :xs="12">
        <el-checkbox v-model="checked1">庄赢抽水取整</el-checkbox>
      </el-col>
    </el-row>
    <div class="commitOdds" @click="submit">保存设置</div>
  </div>
</template>

<script>
import { listOdds, UpOdds } from "@/api/sys/odds";


export default {
  name: "odds",
  data() {
    return {
      loading:false,
      checked:false,
      checked1:false,
      oddsList:{
        baccaratPump:'',
        baccaratBankerWin:'',
        baccaratPlayerWin:'',
        baccaratTieWin:'',
        baccaratBankerPair:'',
        baccaratPlayerPair:'',
        baccaratLarge:'',
        baccaratSmall:'',
        dragonWin:'',
        tigerWin:'',
        tieWin:'',
        baccaratRollingRatioChip:'',
        baccaratRollingRatioCash:'',
        dragonTigerRatioChip:'',
        dragonTigerRatioCash:'',
        rollingCommissionRounding:'',
        bankerWinPumpRounding:'',
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
      listOdds().then(response => {
          this.oddsList = response.data;
         if( this.oddsList.rollingCommissionRounding==0){
           this.checked =false
         }else{
           this.checked =true
         }
         if( this.oddsList.bankerWinPumpRounding==0){
           this.checked1 =false
         }else{
           this.checked1 =true
         }
          this.loading = false;
        }
      );
    },
    
    /** 修改按钮操作 */
    submit() {
      this.loading = true;
      if(this.checked==false){
       this.oddsList.rollingCommissionRounding=0
      }else{
        this.oddsList.rollingCommissionRounding=1
      }
      if(this.checked1==false){
       this.oddsList.bankerWinPumpRounding=0
      }else{
        this.oddsList.bankerWinPumpRounding=1
      }
      UpOdds(this.oddsList).then(response => {
        this.$modal.msgSuccess("保存成功");
        this.loading = false;
      }).catch(() => {});;
    },
   
  }
};
</script>
<style lang="scss" >
.title{
  font-size: 18px;
  font-weight: 500;
  line-height: 80px;
}
.gamebox{
  border: 1px solid #bcbcbc;
  padding: 20px;
  display: flex;
   flex-wrap: wrap;
  flex-direction: column;
  height: 350px;
  .list{
    // flex-basis: 13%;
    height: 50px;
    span{
      display: inline-block;
      // width: 70px;
    }
    &:nth-child(7){
      margin-top: 50px;
    }
  }
}

 .el-checkbox .el-checkbox__label{
    font-size: 16px !important;
  }
.commitOdds{
  border-radius: 4px;
  background: #1890ff;
  padding: 5px 20px;
  width: 150px;
  text-align: center;
  color: #fff;
  margin-top: 80px;
  cursor: pointer;
  transform: .6s;
  &:hover{
    background: #bcbcbc;
    color: #000;
  }
}
</style>