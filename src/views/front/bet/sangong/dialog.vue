<template>
   <!-- 点收码 -->
    <el-dialog class="dialogBox" :title="title" :visible.sync="isOpen" width="1400px" :before-close="handleClose" append-to-body v-if="isOpen" :close-on-click-modal="false"> 
      
         <el-row :gutter="20">
           <el-col :span="6" :xs="12">
             <el-table v-loading="loading" stripe class="bbetbox"  height="auto" :data="Listdata"  border show-summary :sum-text="$t('bet.xiaoji')" :summary-method="getSummaries">
                 <el-table-column :label="$t('bet.face')+'$'" align="center" key="val" prop="val"  />
                <el-table-column :label="$t('bet.vol')" align="center" key="num" prop="num" >
                    <template slot-scope="scope">
                        <el-input ref="input" id="input" @keyup.enter.native="handelTab(scope.row.id,$event)" v-model.number="scope.row.num" placeholder="" @input="handleSelectionChange" oninput="value=value.replace(/[^\d]/g,'')" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('bet.heji')" align="center"   prop="total">
                   <template slot-scope="scope">
                     <span v-if="scope.row.val==$t('bet.cash')">{{scope.row.num || 0}}</span>
                       <span v-else>{{(scope.row.num||0)*(scope.row.value>5000?scope.row.value/10000:scope.row.value)}}{{scope.row.value>5000?$t('bet.wan'):''}}</span>
                    </template>
                </el-table-column>

              </el-table>
           </el-col>
           <el-col :span="6" :xs="12">
              <el-form ref="form" class="gameDialog" :model="form" :rules="rules" label-width="0px">
                  <div class="list">
                    <div>{{$t('bet.type')}}</div>
                    <div>{{$t('bet.account')}}</div>
                    <div>{{$t('bet.status')}}</div>
                  </div>
                  <div class="list">
                    <div>${{$t('bet.chipIncrease')}}</div>
                    <div>
                      <el-input v-model.number="form.chipAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>${{$t('bet.chipReduce')}}</div>
                    <div>
                      <el-input v-model.number="form.chipSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>${{$t('bet.cashIncrease')}}</div>
                    <div>
                      <el-input v-model.number="form.cashAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>${{$t('bet.cashReduce')}}</div>
                    <div>
                      <el-input v-model.number="form.cashSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                  <div class="list">
                    <div>${{$t('bet.chipgap')}}</div>
                    <div>
                     {{form.chipGap ==0?'0':(form.chipGap||'-') }}
                    </div>
                    <div>
                       <span v-if="!form.chipGap">{{form.chipGap==0?$t('bet.correct'):'-'}}</span>
                       <span v-else style="color:red">{{$t('bet.incorrect')}}</span>
                    </div>
                  </div>
                  <div class="list">
                    <div>${{$t('bet.cashGap')}}</div>
                    <div>
                       {{form.cashGap ==0?'0':(form.cashGap || '-')}}
                    </div>
                    <div>
                        <span v-if="!form.cashGap">{{form.cashGap==0?$t('bet.correct'):'-'}}</span>
                       <span v-else style="color:red">{{$t('bet.incorrect')}}</span>
                       </div>
                  </div>
                  <div class="list">
                    <div>${{$t('bet.totGap')}}</div>
                    <div>
                      {{form.totalGap==0?'0':(form.totalGap||'-')}}
                    </div>
                     <div>
                       <span v-if="!form.totalGap">{{form.totalGap==0?$t('bet.correct'):'-'}}</span>
                       <span v-else style="color:red">{{$t('bet.incorrect')}}</span>
                     </div>
                  </div>
                  <!-- <div class="list">
                    <div>${{$t('bet.insChip')}}</div>
                    <div>
                      <el-input v-model.number="form.insurance" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>${{$t('bet.insChipAdd')}}</div>
                    <div>
                      <el-input v-model.number="form.insuranceAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>${{$t('bet.insChipSub')}}</div>
                    <div>
                      <el-input v-model.number="form.insuranceSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>${{$t('bet.insGap')}}</div>
                    <div>
                      {{form.insuranceGap==0?'0':(form.insuranceGap||'-')}}
                    </div>
                     <div>
                       <span v-if="!form.insuranceGap">{{form.insuranceGap==0?$t('bet.correct'):'-'}}</span>
                       <span v-else style="color:red">{{$t('bet.incorrect')}}</span>
                       </div>
                  </div> -->
                  <div class="list" v-if="title==$t('bet.getCode')">
                    <div>${{$t('bet.chipGet')}}</div>
                    <div>
                      {{form.chipReceipt==0?'0':(form.chipReceipt||'-') }}
                    </div>
                     <div>-</div>
                  </div>
                  <div class="list"  v-if="title==$t('bet.getCode')">
                    <div>${{$t('bet.cashGet')}}</div>
                    <div>
                      {{form.cashReceipt==0?'0':(form.cashReceipt||'-') }}
                    </div>
                     <div>-</div>
                  </div>
              </el-form>
           </el-col>
           <el-col :span="6" :xs="12">
             <el-table v-loading="loading" stripe class="bbetbox"  height="auto" :data="Listdata1"  border show-summary :sum-text="$t('bet.xiaoji')" :summary-method="getSummaries1">
                 <el-table-column :label="$t('bet.face')+'฿'" align="center" key="val" prop="val"  />
                <el-table-column :label="$t('bet.vol')" align="center" key="num" prop="num" >
                      <template slot-scope="scope">
                         <el-input ref="input" id="input1" @keyup.enter.native="handelTab1(scope.row.id,$event)" v-model.number="scope.row.num" placeholder=""  @input="handleSelectionChange" oninput="value=value.replace(/[^\d]/g,'')" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('bet.heji')" align="center"   prop="total">
                   <template slot-scope="scope">
                     <span v-if="scope.row.val==$t('bet.cash')">{{scope.row.num || 0}}</span>
                       <span v-else>{{(scope.row.num||0)*(scope.row.value>5000?scope.row.value/10000:scope.row.value)}}{{scope.row.value>5000?$t('bet.wan'):''}}</span>
                    </template>
                </el-table-column>

              </el-table>
           </el-col>
           <el-col :span="6" :xs="12">
              <el-form ref="form" class="gameDialog" :model="form" :rules="rules" label-width="0px">
                  <div class="list">
                    <div>{{$t('bet.type')}}</div>
                    <div>{{$t('bet.account')}}</div>
                    <div>{{$t('bet.status')}}</div>
                  </div>
                  <div class="list">
                    <div>฿{{$t('bet.chipIncrease')}}</div>
                    <div>
                      <el-input v-model.number="form.chipAddTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿{{$t('bet.chipReduce')}}</div>
                    <div>
                      <el-input v-model.number="form.chipSubTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿{{$t('bet.cashIncrease')}}</div>
                    <div>
                      <el-input v-model.number="form.cashAddTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿{{$t('bet.cashReduce')}}</div>
                    <div>
                      <el-input v-model.number="form.cashSubTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                  <div class="list">
                    <div>฿{{$t('bet.chipgap')}}</div>
                    <div>
                     {{form.chipGapTh ==0?'0':(form.chipGapTh||'-') }}
                    </div>
                    <div>
                       <span v-if="!form.chipGapTh">{{form.chipGapTh==0?$t('bet.correct'):'-'}}</span>
                       <span v-else style="color:red">{{$t('bet.incorrect')}}</span>
                    </div>
                  </div>
                  <div class="list">
                    <div>฿{{$t('bet.cashGap')}}</div>
                    <div>
                       {{form.cashGapTh ==0?'0':(form.cashGapTh||'-') }}
                    </div>
                    <div>
                        <span v-if="!form.cashGapTh">{{form.cashGapTh==0?$t('bet.correct'):'-'}}</span>
                       <span v-else style="color:red">{{$t('bet.incorrect')}}</span>
                       </div>
                  </div>
                  <div class="list">
                    <div>฿{{$t('bet.totGap')}}</div>
                    <div>
                       {{form.totalGapTh ==0?'0':(form.totalGapTh||'-') }}
                    </div>
                     <div>
                       <span v-if="!form.totalGapTh">{{form.totalGapTh==0?$t('bet.correct'):'-'}}</span>
                       <span v-else style="color:red">{{$t('bet.incorrect')}}</span>
                     </div>
                  </div>
                  <!-- <div class="list">
                    <div>฿{{$t('bet.insChip')}}</div>
                    <div>
                      <el-input v-model.number="form.insuranceTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿{{$t('bet.insChipAdd')}}</div>
                    <div>
                      <el-input v-model.number="form.insuranceAddTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿{{$t('bet.insChipSub')}}</div>
                    <div>
                      <el-input v-model.number="form.insuranceSubTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿{{$t('bet.insGap')}}</div>
                    <div>
                      {{form.insuranceGapTh ==0?'0':(form.insuranceGapTh||'-') }}
                    </div>
                     <div>
                      <span v-if="!form.insuranceGapTh">{{form.insuranceGapTh==0?$t('bet.correct'):'-'}}</span>
                       <span v-else style="color:red">{{$t('bet.incorrect')}}</span>
                       </div>
                  </div> -->
                  <div class="list" v-if="title==$t('bet.getCode')">
                    <div>฿{{$t('bet.chipGet')}}</div>
                    <div>
                      {{form.chipReceiptTh==0?'0':(form.chipReceiptTh||'-') }}
                    </div>
                     <div>-</div>
                  </div>
                  <div class="list"  v-if="title==$t('bet.getCode')">
                    <div>฿{{$t('bet.cashGet')}}</div>
                    <div>
                      {{form.cashReceiptTh==0?'0':(form.cashReceiptTh||'-') }}
                    </div>
                     <div>-</div>
                  </div>
              </el-form>
           </el-col>
           <el-col :span="24" :xs="24">
             <div class="remark">
                <span>{{$t('bet.remark')}}</span>
               <el-input
                  type="text"
                  :placeholder="$t('Please-enter-content')"
                  v-model="form.remark">
                </el-input>
             </div>


           </el-col>
        </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{$t('bet.conChange')}}</el-button>
        <el-button @click="count">{{$t('bet.calculateGap')}}</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { sangongReckon,sangongEdit} from "@/api/bet/sangong";

export default {
  name: "Dialog",
  props:['title','open'],
  data() {
    return {
      form: {},
      isOpen:this.open,
      rules:{},
      loading:false,
      aTotal:'',
      cash:'',
      chip:'',
      aTotalTh:'',
      cashTh:'',
      chipTh:'',
      Listdata:[
        {id:1,value:1000000,val:100+this.$t('bet.wan'),num:'',total:''},
        {id:2,value:500000,val:50+this.$t('bet.wan'),num:'',total:''},
        {id:3,value:50000,val:5+this.$t('bet.wan'),num:'',total:''},
        {id:4,value:10000,val:1+this.$t('bet.wan'),num:'',total:''},
        {id:5,value:5000,val:'5000',num:'',total:''},
        {id:6,value:1000,val:'1000',num:'',total:''},
        {id:7,value:500,val:'500',num:'',total:''},
        {id:8,value:100,val:'100',num:'',total:''},
        {id:9,value:50,val:'50',num:'',total:''},
        {id:10,value:10,val:'10',num:'',total:''},
        {id:11,value:5,val:'5',num:'',total:''},
        {id:12,value:1,val:'1',num:'',total:''},
        {id:13,value:1,val:this.$t('bet.cash'),num:'',total:''},
        ],
      Listdata1:[
         {id:1,value:1000000,val:100+this.$t('bet.wan'),num:'',total:''},
        {id:2,value:500000,val:50+this.$t('bet.wan'),num:'',total:''},
        {id:3,value:50000,val:5+this.$t('bet.wan'),num:'',total:''},
        {id:4,value:10000,val:1+this.$t('bet.wan'),num:'',total:''},
        {id:5,value:5000,val:'5000',num:'',total:''},
        {id:6,value:1000,val:'1000',num:'',total:''},
        {id:7,value:500,val:'500',num:'',total:''},
        {id:8,value:100,val:'100',num:'',total:''},
        {id:9,value:50,val:'50',num:'',total:''},
        {id:10,value:10,val:'10',num:'',total:''},
        {id:11,value:5,val:'5',num:'',total:''},
        {id:12,value:1,val:'1',num:'',total:''},
        {id:13,value:1,val:this.$t('bet.cash'),num:'',total:''},
      ] 
    };
  },
  created() {
    console.log(this.isOpen)
  },
  watch: {
      open (val) {
        this.isOpen = val
      }
    },
  methods: {
    handelTab(i) {
      let inputs = document.querySelectorAll('#input')
      for (let j = 0; j < inputs.length; j++) {
          if(i<(inputs.length)){ 
                    inputs[i].focus();
                }else if(i==(inputs.length)){ 
                    inputs[0].focus();break;                 
                }
      }
    },
    handelTab1(i) {
      let inputs = document.querySelectorAll('#input1')
      for (let j = 0; j < inputs.length; j++) {
          if(i<(inputs.length)){ 
                    inputs[i].focus();
                }else if(i==(inputs.length)){ 
                    inputs[0].focus();break;                 
                }
      }
    },
    reset(){
       this.Listdata=[
        {id:1,value:1000000,val:100+this.$t('bet.wan'),num:'',total:''},
        {id:2,value:500000,val:50+this.$t('bet.wan'),num:'',total:''},
        {id:3,value:50000,val:5+this.$t('bet.wan'),num:'',total:''},
        {id:4,value:10000,val:1+this.$t('bet.wan'),num:'',total:''},
        {id:5,value:5000,val:'5000',num:'',total:''},
        {id:6,value:1000,val:'1000',num:'',total:''},
        {id:7,value:500,val:'500',num:'',total:''},
        {id:8,value:100,val:'100',num:'',total:''},
        {id:9,value:50,val:'50',num:'',total:''},
        {id:10,value:10,val:'10',num:'',total:''},
        {id:11,value:5,val:'5',num:'',total:''},
        {id:12,value:1,val:'1',num:'',total:''},
        {id:13,value:1,val:this.$t('bet.cash'),num:'',total:''},
        ],
      this.Listdata1=[
         {id:1,value:1000000,val:100+this.$t('bet.wan'),num:'',total:''},
        {id:2,value:500000,val:50+this.$t('bet.wan'),num:'',total:''},
        {id:3,value:50000,val:5+this.$t('bet.wan'),num:'',total:''},
        {id:4,value:10000,val:1+this.$t('bet.wan'),num:'',total:''},
        {id:5,value:5000,val:'5000',num:'',total:''},
        {id:6,value:1000,val:'1000',num:'',total:''},
        {id:7,value:500,val:'500',num:'',total:''},
        {id:8,value:100,val:'100',num:'',total:''},
        {id:9,value:50,val:'50',num:'',total:''},
        {id:10,value:10,val:'10',num:'',total:''},
        {id:11,value:5,val:'5',num:'',total:''},
        {id:12,value:1,val:'1',num:'',total:''},
        {id:13,value:1,val:this.$t('bet.cash'),num:'',total:''},
      ] ,
        this.form ={
          chip:'',
          cash:'',
          chipAdd:'',
          chipSub:'',
          cashAdd:'',
          cashSub:'',
          insurance:'',
          insuranceAdd:'',
          insuranceSub:'',
          chipTh:'',
          cashTh:'',
          chipAddTh:'',
          chipSubTh:'',
          cashAddTh:'',
          cashSubTh:'',
          insuranceTh:'',
          insuranceAddTh:'',
          insuranceSubTh:'',
          type:'',
          remark:'',
           aTotal:'',
          aTotalTh:''
        }
         this.resetForm("form");
    },
     /** 提交按钮 */
    submitForm: function() {
      this.$confirm(this.$t('bet.ismodiffy'), this.$t('bet.tips'), {
        confirmButtonText: this.$t('bet.sure'),
        cancelButtonText: this.$t('bet.cancel'),
        type: 'warning',
         customClass:'dialog_tips'
      }).then(() => {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.title == this.$t('bet.getCode')) {
              this.form['type']=1
              sangongEdit(this.form).then(response => {
                this.$modal.msgSuccess(this.$t('bet.sucGet'));
                this.isOpen= !this.isOpen
                this.$emit('getOpen',this.isOpen)
                this.reset()
              });
            } else {
              this.form['type']=0
              sangongEdit(this.form).then(response => {
                this.$modal.msgSuccess(this.$t('bet.sucPoint'));
                this.isOpen= !this.isOpen
                this.$emit('getOpen',this.isOpen)
                this.reset()
              });
            }
          }
        });
      })
    },
      // 取消按钮
    handleClose() {
      this.reset();
      this.isOpen= !this.isOpen
      this.$emit('getOpen',this.isOpen)
      
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t('bet.heji');
          return;
        }
          if (index === 2) {
          sums[index] = this.aTotal;
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
          sums[index] = this.$t('bet.heji');
          return;
        }
          if (index === 2) {
          sums[index] = this.aTotalTh;
          return;
        }
      });
      return sums;
    },
        // 多选框选中数据
    handleSelectionChange(selection) {
      const newData = this.Listdata
      this.cash =newData[12].num||0
      this.chip =(newData[0].num||0)*newData[0].value +(newData[1].num||0)*newData[1].value+(newData[2].num||0)*newData[2].value+(newData[3].num||0)*newData[3].value+(newData[4].num||0)*newData[4].value+(newData[5].num||0)*newData[5].value+(newData[6].num||0)*newData[6].value+(newData[7].num||0)*newData[7].value+(newData[8].num||0)*newData[8].value+(newData[9].num||0)*newData[9].value+(newData[10].num||0)*newData[10].value+(newData[11].num||0)*newData[11].value
      this.aTotal = this.cash +this.chip
      const newData1 = this.Listdata1
      this.cashTh =newData1[12].num||0
      this.chipTh =(newData1[0].num||0)*newData1[0].value +(newData1[1].num||0)*newData1[1].value+(newData1[2].num||0)*newData1[2].value+(newData1[3].num||0)*newData1[3].value+(newData1[4].num||0)*newData1[4].value+(newData1[5].num||0)*newData1[5].value+(newData1[6].num||0)*newData1[6].value+(newData1[7].num||0)*newData1[7].value+(newData1[8].num||0)*newData1[8].value+(newData1[9].num||0)*newData1[9].value+(newData1[10].num||0)*newData1[10].value+(newData1[11].num||0)*newData1[11].value
      this.aTotalTh = this.cashTh +this.chipTh
      this.form['cash']=this.cash
      this.form['chip']=this.chip
      this.form['cashTh']=this.cashTh
      this.form['chipTh']=this.chipTh
      this.form['info']=JSON.stringify(this.Listdata)
      this.form['infoTh']=JSON.stringify(this.Listdata1)
    },
    count(){
      console.log(this.form)
     
          if (this.title == this.$t('bet.getCode')) {
            this.form['type']=1
            console.log(typeof(this.form.type))
            sangongReckon(this.form).then(res => {
              this.$modal.msgSuccess(this.$t('bet.sucGetCount'));
              let arr =res.data
              this.form['cashGap']=arr.cashGap
              this.form['chipGap']=arr.chipGap
              this.form['insuranceGap']=arr.insuranceGap
               this.form['cashReceipt']=arr.cashReceipt
              this.form['chipReceipt']=arr.chipReceipt
               this.form['cashGapTh']=arr.cashGapTh
              this.form['chipGapTh']=arr.chipGapTh
              this.form['insuranceGapTh']=arr.insuranceGapTh
               this.form['cashReceiptTh']=arr.cashReceiptTh
              this.form['chipReceiptTh']=arr.chipReceiptTh
                 this.form['totalGap']=arr.totalGap
              this.form['totalGapTh']=arr.totalGapTh
              this.$forceUpdate()
            });
          } else {
            this.form['type']=0
            sangongReckon(this.form).then(res => {
              this.$modal.msgSuccess(this.$t('bet.sucPointCount'));
               let arr =res.data
              this.form['cashGap']=arr.cashGap
              this.form['chipGap']=arr.chipGap
              this.form['insuranceGap']=arr.insuranceGap
              this.form['cashGapTh']=arr.cashGapTh
              this.form['chipGapTh']=arr.chipGapTh
              this.form['insuranceGapTh']=arr.insuranceGapTh
                 this.form['totalGap']=arr.totalGap
              this.form['totalGapTh']=arr.totalGapTh
              this.$forceUpdate()             
            });
          }
     
    },
  },
};
</script>

<style lang="scss">
.dialogBox{


    .gameDialog{
       .el-input__inner{
          line-height: 25px;
          height: 25px;
          border: 0;
          text-align: center;
          background: none;
        }
    border-bottom:1px solid #DCDFE6 ;
        border-right: 1px solid #DCDFE6 ;
    .list{
      display: flex;
      justify-content: center;
      align-items: center;
      &>div{
        flex-basis: 1/3*100%;
        border-top:1px solid #DCDFE6 ;
        border-left: 1px solid #DCDFE6 ;
        height: 45px;
        line-height: 45px;
        padding: 0 10px;
        text-align: center;

      }
    }
  }
    .bbetbox{
    .el-input__inner{
          line-height: 25px;
          height: 25px;
          border: 0;
          text-align: center;
          background: none;
        }
   
    .el-table__body-wrapper{
      tbody{
        tr{
          td{
            padding: 4px 0;
          }
        }
      }
    }
  }
  .remark{
    display: flex;
    align-items: center;
    margin: 15px 0;
    span{
      flex-basis: 150px;
    }
  }
  .dialog-footer{
    display: flex;
    justify-content: center;
    .el-button{
      margin: 0 50px;
    }
  }
   .el-dialog__body{
      padding: 10px 20px;
    }
}

</style>