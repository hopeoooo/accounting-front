<template>
   <!-- 点收码 -->
    <el-dialog class="dialogBox" :title="title" :visible.sync="isOpen" width="1400px" :before-close="handleClose" append-to-body v-if="isOpen"> 
      
         <el-row :gutter="20">
           <el-col :span="6" :xs="12">
             <el-table v-loading="loading" class="bbetbox"  height="auto" :data="Listdata"  border show-summary sum-text="小计" :summary-method="getSummaries" @cell-mouse-leave="handleSelectionChange">
                 <el-table-column label="面值$" align="center" key="val" prop="val"  />
                <el-table-column label="数量" align="center" key="num" prop="num" >
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.num" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </template>
                </el-table-column>
                <el-table-column label="合计" align="center"   prop="total">
                   <template slot-scope="scope">
                     <span v-if="scope.row.val=='现金'">{{scope.row.num || 0}}</span>
                       <span v-else>{{(scope.row.num||0)*(scope.row.value>5000?scope.row.value/10000:scope.row.value)}}{{scope.row.value>5000?'万':''}}</span>
                    </template>
                </el-table-column>

              </el-table>
           </el-col>
           <el-col :span="6" :xs="12">
              <el-form ref="form" class="gameDialog" :model="form" :rules="rules" label-width="0px">
                  <div class="list">
                    <div>类型</div>
                    <div>金额</div>
                    <div>状态</div>
                  </div>
                  <div class="list">
                    <div>$筹码增</div>
                    <div>
                      <el-input v-model.number="form.chipAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>$筹码减</div>
                    <div>
                      <el-input v-model.number="form.chipSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>$现金增</div>
                    <div>
                      <el-input v-model.number="form.cashAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>$现金减</div>
                    <div>
                      <el-input v-model.number="form.cashSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                  <div class="list">
                    <div>$筹码差距</div>
                    <div>
                     {{form.chipGap || '-'}}
                    </div>
                    <div>
                       <span v-if="form.chipGap==0">正确</span>
                       <span v-else style="color:red">错误</span>
                    </div>
                  </div>
                  <div class="list">
                    <div>$现金差距</div>
                    <div>
                      {{form.cashGap || '-'}}
                    </div>
                    <div>
                        <span v-if="form.cashGap==0">正确</span>
                       <span v-else style="color:red">错误</span>
                       </div>
                  </div>
                  <div class="list">
                    <div>$总差距</div>
                    <div>
                      {{(form.chipGap||'-')+(form.cashGap||'')}}
                    </div>
                     <div>
                        <span v-if="form.cashGap==0 && form.cashGap==0">正确</span>
                       <span v-else style="color:red">错误</span>
                     </div>
                  </div>
                  <div class="list">
                    <div>$保险筹码</div>
                    <div>
                      <el-input v-model.number="form.insurance" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>$保险筹码增</div>
                    <div>
                      <el-input v-model.number="form.insuranceAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>$保险筹码减</div>
                    <div>
                      <el-input v-model.number="form.insuranceSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>$保险筹码差距</div>
                    <div>
                      {{form.insuranceGap||'-'}}
                    </div>
                     <div>
                       <span v-if="form.insuranceGap==0">正确</span>
                       <span v-else style="color:red">错误</span>
                       <!-- {{insuranceGap==0?'正确':'错误'}} -->
                       </div>
                  </div>
                  <div class="list" v-if="title=='收码'">
                    <div>$筹码收码</div>
                    <div>
                      {{form.chipReceipt||"-"}}
                    </div>
                     <div>-</div>
                  </div>
                  <div class="list"  v-if="title=='收码'">
                    <div>$现金收码</div>
                    <div>
                      {{form.cashReceipt||"-"}}
                    </div>
                     <div>-</div>
                  </div>
              </el-form>
           </el-col>
           <el-col :span="6" :xs="12">
             <el-table v-loading="loading" class="bbetbox"  height="auto" :data="Listdata1"  border show-summary sum-text="小计" :summary-method="getSummaries1" @cell-mouse-leave="handleSelectionChange">
                 <el-table-column label="面值฿" align="center" key="val" prop="val"  />
                <el-table-column label="数量" align="center" key="num" prop="num" >
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.num" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </template>
                </el-table-column>
                <el-table-column label="合计" align="center"   prop="total">
                   <template slot-scope="scope">
                     <span v-if="scope.row.val=='现金'">{{scope.row.num || 0}}</span>
                       <span v-else>{{(scope.row.num||0)*(scope.row.value>5000?scope.row.value/10000:scope.row.value)}}{{scope.row.value>5000?'万':''}}</span>
                    </template>
                </el-table-column>

              </el-table>
           </el-col>
           <el-col :span="6" :xs="12">
              <el-form ref="form" class="gameDialog" :model="form" :rules="rules" label-width="0px">
                  <div class="list">
                    <div>类型</div>
                    <div>金额</div>
                    <div>状态</div>
                  </div>
                  <div class="list">
                    <div>฿筹码增</div>
                    <div>
                      <el-input v-model.number="form.chipAddTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿筹码减</div>
                    <div>
                      <el-input v-model.number="form.chipSubTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿现金增</div>
                    <div>
                      <el-input v-model.number="form.cashAddTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿现金减</div>
                    <div>
                      <el-input v-model.number="form.cashSubTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                  <div class="list">
                    <div>฿筹码差距</div>
                    <div>
                     {{form.chipGapTh || '-'}}
                    </div>
                    <div>
                       <span v-if="form.chipGapTh==0">正确</span>
                       <span v-else style="color:red">错误</span>
                    </div>
                  </div>
                  <div class="list">
                    <div>฿现金差距</div>
                    <div>
                      {{form.cashGapTh || '-'}}
                    </div>
                    <div>
                        <span v-if="form.cashGapTh==0">正确</span>
                       <span v-else style="color:red">错误</span>
                       </div>
                  </div>
                  <div class="list">
                    <div>฿总差距</div>
                    <div>
                      {{(form.chipGapTh||'-')+(form.cashGapTh||'')}}
                    </div>
                     <div>
                        <span v-if="form.cashGapTh==0 && form.chipGapTh==0">正确</span>
                       <span v-else style="color:red">错误</span>
                     </div>
                  </div>
                  <div class="list">
                    <div>฿保险筹码</div>
                    <div>
                      <el-input v-model.number="form.insuranceTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿保险筹码增</div>
                    <div>
                      <el-input v-model.number="form.insuranceAddTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿保险筹码减</div>
                    <div>
                      <el-input v-model.number="form.insuranceSubTh" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>฿保险筹码差距</div>
                    <div>
                      {{form.insuranceGapTh||'-'}}
                    </div>
                     <div>
                       <span v-if="form.insuranceGapTh==0">正确</span>
                       <span v-else style="color:red">错误</span>
                       <!-- {{insuranceGap==0?'正确':'错误'}} -->
                       </div>
                  </div>
                  <div class="list" v-if="title=='收码'">
                    <div>฿筹码收码</div>
                    <div>
                      {{form.chipReceiptTh||"-"}}
                    </div>
                     <div>-</div>
                  </div>
                  <div class="list"  v-if="title=='收码'">
                    <div>฿现金收码</div>
                    <div>
                      {{form.cashReceiptTh||"-"}}
                    </div>
                     <div>-</div>
                  </div>
              </el-form>
           </el-col>
           <el-col :span="24" :xs="24">
             <div class="remark">
                <span>增减码修改备注：</span>
               <el-input
                  type="text"
                  placeholder="请输入内容"
                  v-model="form.remark">
                </el-input>
             </div>


           </el-col>
        </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确定修改</el-button>
        <el-button @click="count">计算差距</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { niuniuReckon,niuniuEdit} from "@/api/bet/niuniu";

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
        {value:1000000,val:'100万',num:'',total:''},
        {value:500000,val:'50万',num:'',total:''},
        {value:50000,val:'5万',num:'',total:''},
        {value:10000,val:'1万',num:'',total:''},
        {value:5000,val:'5000',num:'',total:''},
        {value:1000,val:'1000',num:'',total:''},
        {value:500,val:'500',num:'',total:''},
        {value:100,val:'100',num:'',total:''},
        {value:50,val:'50',num:'',total:''},
        {value:10,val:'10',num:'',total:''},
        {value:5,val:'5',num:'',total:''},
        {value:1,val:'1',num:'',total:''},
        {value:1,val:'现金',num:'',total:''},
        ],
      Listdata1:[
        {value:1000000,val:'100万',num:'',total:''},
        {value:500000,val:'50万',num:'',total:''},
        {value:50000,val:'5万',num:'',total:''},
        {value:10000,val:'1万',num:'',total:''},
        {value:5000,val:'5000',num:'',total:''},
        {value:1000,val:'1000',num:'',total:''},
        {value:500,val:'500',num:'',total:''},
        {value:100,val:'100',num:'',total:''},
        {value:50,val:'50',num:'',total:''},
        {value:10,val:'10',num:'',total:''},
        {value:5,val:'5',num:'',total:''},
        {value:1,val:'1',num:'',total:''},
        {value:1,val:'现金',num:'',total:''},
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
    reset(){
       this.Listdata=[
          {value:1000000,val:'100万',num:'',total:''},
          {value:500000,val:'50万',num:'',total:''},
          {value:50000,val:'5万',num:'',total:''},
          {value:10000,val:'1万',num:'',total:''},
          {value:5000,val:'5000',num:'',total:''},
          {value:1000,val:'1000',num:'',total:''},
          {value:500,val:'500',num:'',total:''},
          {value:100,val:'100',num:'',total:''},
          {value:50,val:'50',num:'',total:''},
          {value:10,val:'10',num:'',total:''},
          {value:5,val:'5',num:'',total:''},
          {value:1,val:'1',num:'',total:''},
          {value:1,val:'现金',num:'',total:''},
        ],
        this.Listdata1=[
          {value:1000000,val:'100万',num:'',total:''},
          {value:500000,val:'50万',num:'',total:''},
          {value:50000,val:'5万',num:'',total:''},
          {value:10000,val:'1万',num:'',total:''},
          {value:5000,val:'5000',num:'',total:''},
          {value:1000,val:'1000',num:'',total:''},
          {value:500,val:'500',num:'',total:''},
          {value:100,val:'100',num:'',total:''},
          {value:50,val:'50',num:'',total:''},
          {value:10,val:'10',num:'',total:''},
          {value:5,val:'5',num:'',total:''},
          {value:1,val:'1',num:'',total:''},
          {value:1,val:'现金',num:'',total:''},
        ],
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
          remark:''
        }
         this.resetForm("form");
    },
     /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == "收码") {
            niuniuEdit(this.form).then(response => {
              this.$modal.msgSuccess("收码修改成功");
              this.isOpen= !this.isOpen
              this.$emit('getOpen',this.isOpen)
              this.reset()
            });
          } else {
            niuniuEdit(this.form).then(response => {
              this.$modal.msgSuccess("点码修改成功");
               this.isOpen= !this.isOpen
              this.$emit('getOpen',this.isOpen)
              this.reset()
            });
          }
        }
      });
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
          sums[index] = '合计';
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
          sums[index] = '合计';
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

    },
    count(){
      console.log(this.form)
     
          if (this.title == "收码") {
            this.form['type']=1
            console.log(typeof(this.form.type))
            niuniuReckon(this.form).then(res => {
              this.$modal.msgSuccess("收码计算差距成功");
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
              this.$forceUpdate()
            });
          } else {
            this.form['type']=0
            niuniuReckon(this.form).then(res => {
              this.$modal.msgSuccess("点码计算差距成功");
               let arr =res.data
              this.form['cashGap']=arr.cashGap
              this.form['chipGap']=arr.chipGap
              this.form['insuranceGap']=arr.insuranceGap
              this.form['cashGapTh']=arr.cashGapTh
              this.form['chipGapTh']=arr.chipGapTh
              this.form['insuranceGapTh']=arr.insuranceGapTh
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