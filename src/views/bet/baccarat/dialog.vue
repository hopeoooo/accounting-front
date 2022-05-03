<template>
   <!-- 点收码 -->
    <el-dialog :title="title" :visible.sync="isOpen" width="600px" append-to-body>
      
        <el-row>
           <el-col :span="12" :xs="24">
             <el-table v-loading="loading" class="bbetbox"  height="" :data="Listdata"  border  >          
                 <el-table-column label="面值" align="center" key="val" prop="val"  />
                <el-table-column label="数量" align="center" key="num" prop="num" >
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.num" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </template>
                </el-table-column>
                <el-table-column label="合计" align="center"   prop="total">
                   <template slot-scope="scope">
                       <span>{{(scope.row.num||0)*scope.row.value}}</span>
                    </template>
                </el-table-column>
              
              </el-table>
           </el-col>
           <el-col :span="12" :xs="24">
              <el-form ref="form" :model="form" :rules="rules" label-width="0px">
                  <div class="list">
                    <div>类型</div>
                    <div>金额</div>
                    <div>状态</div>
                  </div>
                  <div class="list">
                    <div>筹码增</div>
                    <div> 
                      <el-input v-model.number="form.chipAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>筹码减</div>
                    <div> 
                      <el-input v-model.number="form.chipSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>现金增</div>
                    <div> 
                      <el-input v-model.number="form.cashAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>现金减</div>
                    <div> 
                      <el-input v-model.number="form.cashSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                  <div class="list">
                    <div>筹码差距</div>
                    <div> 
                     {{1}}
                    </div>
                    <div>{{'正确'}}</div>
                  </div>
                  <div class="list">
                    <div>现金差距</div>
                    <div> 
                      
                    </div>
                    <div>{{'正确'}}</div>
                  </div>
                  <div class="list">
                    <div>总差距</div>
                    <div> 
                      {{1}}
                    </div>
                     <div>{{'正确'}}</div>
                  </div>
                  <div class="list">
                    <div>保险筹码</div>
                    <div> 
                      <el-input v-model.number="form.insurance" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>保险筹码增</div>
                    <div> 
                      <el-input v-model.number="form.insuranceAdd" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>保险筹码减</div>
                    <div> 
                      <el-input v-model.number="form.insuranceSub" placeholder="" oninput="value=value.replace(/[^\d]/g,'')" />
                    </div>
                    <div>-</div>
                  </div>
                   <div class="list">
                    <div>保险筹码差距</div>
                    <div> 
                      {{1}}
                    </div>
                     <div>{{'正确'}}</div>
                  </div>
                  <div class="list">
                    <div>筹码收码</div>
                    <div> 
                      {{1}}
                    </div>
                     <div>-</div>
                  </div>
                  <div class="list">
                    <div>现金收码</div>
                    <div> 
                      {{1}}
                    </div>
                     <div>-</div>
                  </div>
              </el-form>  
           </el-col>
           
        </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { getAuthRole, updateAuthRole } from "@/api/system/user";

export default {
  name: "Dialog",
  props:['title','open'],
  data() {
    return {
      form: {},
      isOpen:this.open,
      rules:{},
      loading:false,
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
    reset(){},
     /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.title == "收码") {
            addReturnOrder(this.form).then(response => {
              this.$modal.msgSuccess("收码成功");
              this.isOpen= !this.isOpen
              this.$emit('getOpen',this.isOpen)
            });
          } else {
            addSigned(this.form).then(response => {
              this.$modal.msgSuccess("点码成功");
               this.isOpen= !this.isOpen
              this.$emit('getOpen',this.isOpen)
            });
          }
        }
      });
    },
      // 取消按钮
    cancel() {
      this.isOpen= !this.isOpen
      this.$emit('getOpen',this.isOpen)
      this.reset();
    },
  },
};
</script>