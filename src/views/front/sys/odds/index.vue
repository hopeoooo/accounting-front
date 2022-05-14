<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="form" :model="oddsList" :rules="rules" label-width="80px">
      <div class="title">赔率设置</div>
      <el-row :gutter="20">
        <el-col :span="12" :xs="24">
          <div class="odds-container">
            <div style="height:60px;">
              <span>百家乐</span>
            </div>
            <div class="gamebox">
              <div class="list">
                <el-form-item label="庄赢抽水" prop="baccaratPump">
                  <el-input
                    v-model="oddsList.baccaratPump"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />%
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="庄赢:  1赔" prop="baccaratBankerWin">
                  <el-input
                    v-model="oddsList.baccaratBankerWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="闲赢:  1赔" prop="baccaratPlayerWin">
                  <el-input
                    v-model="oddsList.baccaratPlayerWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="和赢:  1赔" prop="baccaratTieWin">
                  <el-input
                    v-model="oddsList.baccaratTieWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="庄对:  1赔" prop="baccaratBankerPair">
                  <el-input
                    v-model="oddsList.baccaratBankerPair"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="闲对:  1赔" prop="baccaratPlayerPair">
                  <el-input
                    v-model="oddsList.baccaratPlayerPair"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="大:  1赔" prop="baccaratLarge">
                  <el-input
                    v-model="oddsList.baccaratLarge"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="小:  1赔" prop="baccaratSmall">
                  <el-input
                    v-model="oddsList.baccaratSmall"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" :xs="24">
          <div class="odds-container">
            <div style="height:60px;">
              <span>龙虎</span>
            </div>
            <div class="gamebox">
              <div class="list">
                <el-form-item label="龙赢:  1赔" prop="dragonWin">
                  <el-input
                    v-model="oddsList.dragonWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="虎赢:  1赔" prop="tigerWin">
                  <el-input
                    v-model="oddsList.tigerWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item label="和赢:  1赔" prop="tieWin">
                  <el-input
                    v-model="oddsList.tieWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="title">洗码比例</div>
      <el-row :gutter="20">
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
              label="百家乐洗码比例（$筹码）"
              prop="baccaratRollingRatioChip"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.baccaratRollingRatioChip"
                style="witdh:200px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
                <template slot="suffix">
                  <span style="color:#000">
                    %
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
              label="百家乐洗码比例（$现金）"
              prop="baccaratRollingRatioCash"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.baccaratRollingRatioCash"
                style="witdh:200px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
                <template slot="suffix">
                  <span style="color:#000">
                    %
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
              label="龙虎洗码比例（$筹码）"
              prop="dragonTigerRatioChip"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.dragonTigerRatioChip"
                style="witdh:200px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
                <template slot="suffix">
                  <span style="color:#000">
                    %
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
              label="龙虎洗码比例（$现金）"
              prop="dragonTigerRatioCash"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.dragonTigerRatioCash"
                style="witdh:200px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
                <template slot="suffix">
                  <span style="color:#000">
                    %
                  </span>
                </template></el-input
              >
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
              label="百家乐洗码比例（฿筹码）"
              prop="baccaratRollingRatioChipTh"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.baccaratRollingRatioChipTh"
                style="witdh:200px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
                <template slot="suffix">
                  <span style="color:#000">
                    %
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
              label="百家乐洗码比例（฿现金）"
              prop="baccaratRollingRatioCashTh"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.baccaratRollingRatioCashTh"
                style="witdh:200px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
                <template slot="suffix">
                  <span style="color:#000">
                    %
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
              label="龙虎洗码比例（฿筹码）"
              prop="dragonTigerRatioChipTh"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.dragonTigerRatioChipTh"
                style="witdh:200px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
                <template slot="suffix">
                  <span style="color:#000">
                    %
                  </span>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
              label="龙虎洗码比例（฿现金）"
              prop="dragonTigerRatioCashTh"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.dragonTigerRatioCashTh"
                style="witdh:200px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
                <template slot="suffix">
                  <span style="color:#000">
                    %
                  </span>
                </template></el-input
              >
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="title">其它配置</div>
      <el-row :gutter="20">
        <el-col :span="6" :xs="12">
          <el-checkbox v-model="checked" @change="onCheckChange1"
            >洗码佣金取整</el-checkbox
          >
        </el-col>
        <el-col :span="6" :xs="12">
          <el-checkbox v-model="checked1" @change="onCheckChange2"
            >庄赢抽水取整</el-checkbox
          >
        </el-col>
      </el-row>
    </el-form>

    <div class="commitOdds" @click="submit" v-prclick>保存设置</div>
  </div>
</template>

<script>
import { listOdds, UpOdds } from "@/api/sys/odds";

export default {
  name: "Odds",
  data() {
    return {
      loading: false,
      checked: false,
      checked1: false,
      oddsList: {
        baccaratPump: "",
        baccaratBankerWin: "",
        baccaratPlayerWin: "",
        baccaratTieWin: "",
        baccaratBankerPair: "",
        baccaratPlayerPair: "",
        baccaratLarge: "",
        baccaratSmall: "",
        dragonWin: "",
        tigerWin: "",
        tieWin: "",
        baccaratRollingRatioChip: "",
        baccaratRollingRatioCash: "",
        dragonTigerRatioChip: "",
        dragonTigerRatioCash: "",
        baccaratRollingRatioChipTh: "",
        baccaratRollingRatioCashTh: "",
        dragonTigerRatioChipTh: "",
        dragonTigerRatioCashTh: "",
        rollingCommissionRounding: 0,
        bankerWinPumpRounding: 0
      },
      // 表单校验
      rules: {
        baccaratPump: [
          {
            required: true,
            message: "庄赢抽水比例不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100"
          }
          // {
          //   pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          //   message: "请输入大于0的数字"
          // }
        ],
        baccaratBankerWin: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
          // {
          //   pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          //   message: "请输入大于0的数字"
          // }
        ],
        baccaratPlayerWin: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
          // {
          //   pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          //   message: "请输入大于0的数字"
          // }
        ],
        baccaratTieWin: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
          // {
          //   pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
          //   message: "请输入大于0的数字"
          // }
        ],
        baccaratBankerPair: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        baccaratPlayerPair: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        baccaratLarge: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        baccaratSmall: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        dragonWin: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        tigerWin: [
          {
            required: true,
            message: "百家乐洗码比例（筹码）不能为空",
            trigger: "blur"
          }
        ],
        tieWin: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        baccaratRollingRatioChip: [
          {
            required: true,
            message: "百家乐洗码比例（$筹码）不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100",
            trigger: "blur"
          }
        ],
        baccaratRollingRatioCash: [
          {
            required: true,
            message: "百家乐洗码比例（$现金）不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100",
            trigger: "blur"
          }
        ],
        dragonTigerRatioChip: [
          {
            required: true,
            message: "龙虎洗码比例（$筹码）不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100",
            trigger: "blur"
          }
        ],
        dragonTigerRatioCash: [
          {
            required: true,
            message: "龙虎洗码比例（$现金）不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100",
            trigger: "blur"
          }
        ],
        baccaratRollingRatioChipTh: [
          {
            required: true,
            message: "百家乐洗码比例（฿筹码）不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100",
            trigger: "blur"
          }
        ],
        baccaratRollingRatioCashTh: [
          {
            required: true,
            message: "百家乐洗码比例（฿现金）不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100",
            trigger: "blur"
          }
        ],
        dragonTigerRatioChipTh: [
          {
            required: true,
            message: "龙虎洗码比例（฿筹码）不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100",
            trigger: "blur"
          }
        ],
        dragonTigerRatioCashTh: [
          {
            required: true,
            message: "龙虎洗码比例（฿现金）不能为空",
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: "只能输入0-100",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    perValidator(rule, value, callback) {
      // 百分比校验
      // 只能输入0-100
      if (value > 100 || value < 0) {
        callback(new Error("只能输入0-100"));
      } else {
        callback();
      }
    },
    numberValitor(rule, value, callback) {
      // 大于0的数字数字校验
      // 请输入大于0的数字
      if (value < 0) {
        callback(new Error("请输入大于0的数字"));
      } else {
        callback();
      }
    },
    onInputChange(value) {
      if (isNaN(value)) {
        value = null;
      }
      if (value.indexOf(".") > 0) {
        value = value.slice(0, value.indexOf(".") + 3);
      }
      return value;
    },
    /** 查询赔率设置列表 */
    getList() {
      this.loading = true;
      listOdds()
        .then(response => {
          this.oddsList = response.data;
          if (this.oddsList.rollingCommissionRounding == 0) {
            this.checked = false;
          } else {
            this.checked = true;
          }
          if (this.oddsList.bankerWinPumpRounding == 0) {
            this.checked1 = false;
          } else {
            this.checked1 = true;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },

    /** 修改按钮操作 */
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true;
          // 转成数字类型
          this.oddsList.baccaratPump = parseInt(this.oddsList.baccaratPump);
          this.oddsList.baccaratRollingRatioChip = parseInt(
            this.oddsList.baccaratRollingRatioChip
          );
          this.oddsList.baccaratRollingRatioCash = parseInt(
            this.oddsList.baccaratRollingRatioCash
          );
          this.oddsList.dragonTigerRatioChip = parseInt(
            this.oddsList.dragonTigerRatioChip
          );
          this.oddsList.dragonTigerRatioCash = parseInt(
            this.oddsList.dragonTigerRatioCash
          );
          UpOdds(this.oddsList)
            .then(response => {
              this.$modal.msgSuccess("保存成功");
              this.loading = false;
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    },
    onCheckChange1(newValue) {
      if (newValue == false) {
        this.oddsList.rollingCommissionRounding = 0;
      } else {
        this.oddsList.rollingCommissionRounding = 1;
      }
    },
    onCheckChange2(newValue) {
      if (newValue == false) {
        this.oddsList.bankerWinPumpRounding = 0;
      } else {
        this.oddsList.bankerWinPumpRounding = 1;
      }
    }
  }
};
</script>
<style lang="scss">
.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 80px;
}
.odds-container {
  border: 1px solid #bcbcbc;
  padding: 20px;
  .gamebox {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    height: 250px;
    .list {
      // flex-basis: 13%;
      height: 60px;
      span {
        display: inline-block;
        // width: 70px;
      }
      // &:nth-child(7) {
      //   margin-top: 50px;
      // }
    }
  }
}

.el-checkbox .el-checkbox__label {
  font-size: 16px !important;
}
.commitOdds {
  border-radius: 4px;
  background: #1890ff;
  padding: 5px 20px;
  width: 150px;
  text-align: center;
  color: #fff;
  margin-top: 80px;
  cursor: pointer;
  transform: 0.6s;
  &:hover {
    background: #bcbcbc;
    color: #000;
  }
}
</style>
