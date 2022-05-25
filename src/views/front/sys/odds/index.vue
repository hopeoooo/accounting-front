<template>
  <div class="app-container" v-loading="loading">
    <el-form ref="form" :model="oddsList" :rules="rules" label-width="80px">
      <div class="title">{{$t('Odds-Settings')}}</div>
      <el-row :gutter="20">
        <el-col :span="16" :xs="24">
          <div class="odds-container">
            <div style="height:60px;">
              <span>{{$t('Baccarat')}}</span>
            </div>
            <div class="gamebox">
              <div class="list">
                <el-form-item :label="$t('B-Win-comm')" prop="baccaratPump">
                  <el-input
                    v-model="oddsList.baccaratPump"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />%
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item  :label="$t('B-Win')+': '+ $t('1x')" prop="baccaratBankerWin">
                  <el-input
                    v-model="oddsList.baccaratBankerWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item :label="$t('P-wins')+': '+ $t('1x')" prop="baccaratPlayerWin">
                  <el-input
                    v-model="oddsList.baccaratPlayerWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item :label="$t('T-Win')+': '+ $t('1x')" prop="baccaratTieWin">
                  <el-input
                    v-model="oddsList.baccaratTieWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item :label="$t('B-P')+': '+ $t('1x')" prop="baccaratBankerPair">
                  <el-input
                    v-model="oddsList.baccaratBankerPair"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item :label="$t('P-P')+': '+ $t('1x')"  prop="baccaratPlayerPair">
                  <el-input
                    v-model="oddsList.baccaratPlayerPair"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item  :label="$t('BIG')+': '+ $t('1x')"  prop="baccaratLarge">
                  <el-input
                    v-model="oddsList.baccaratLarge"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item  :label="$t('S')+': '+ $t('1x')"  prop="baccaratSmall">
                  <el-input
                    v-model="oddsList.baccaratSmall"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item
                 :label="$t('Lucky-2-cards')+': '+ $t('1x')"

                  prop="baccaratTwo"
                  label-width="150px"
                >
                  <el-input
                    v-model="oddsList.baccaratTwo"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item
                 :label="$t('Lucky-3-cards')+': '+ $t('1x')"

                  prop="baccaratThere"
                  label-width="150px"
                >
                  <el-input
                    v-model="oddsList.baccaratThere"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" :xs="24">
          <div class="odds-container">
            <div style="height:60px;">
              <span>{{$t('DT')}}</span>
            </div>
            <div class="gamebox">
              <div class="list">
                <el-form-item  :label="$t('D-wins')+': '+ $t('1x')"  prop="dragonWin">
                  <el-input
                    v-model="oddsList.dragonWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item  :label="$t('Tiger-wins')+': '+ $t('1x')" prop="tigerWin">
                  <el-input
                    v-model="oddsList.tigerWin"
                    style="width: 80px"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="list">
                <el-form-item :label="$t('T-Win')+': '+ $t('1x')"   prop="tieWin">
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
      <div class="title">{{$t('Rolling-ratio')}}</div>
      <el-row :gutter="20">
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
               :label="$t('Baccarat-Rolling-Ratio-S-Chip')"
              prop="baccaratRollingRatioChip"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.baccaratRollingRatioChip"
                style="witdh:100px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
              </el-input>
            </el-form-item>
            <span class="percentage-label">%</span>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
               :label="$t('Baccarat-Rolling-Ratio-S-Cash')"
              prop="baccaratRollingRatioCash"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.baccaratRollingRatioCash"
                style="witdh:100px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
              </el-input>
            </el-form-item>
            <span class="percentage-label">%</span>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
               :label="$t('DT-Rolling-Ratio-S-Chip')"
              prop="dragonTigerRatioChip"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.dragonTigerRatioChip"
                style="witdh:100px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
            <span class="percentage-label">%</span>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
               :label="$t('DT-Rolling-Ratio-S-Cash')"
              prop="dragonTigerRatioCash"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.dragonTigerRatioCash"
                style="witdh:100px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
              </el-input>
            </el-form-item>
            <span class="percentage-label">%</span>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
               :label="$t('Baccarat-rolling-percentage-B-chip')"
              prop="baccaratRollingRatioChipTh"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.baccaratRollingRatioChipTh"
                style="witdh:100px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
              </el-input>
            </el-form-item>
            <span class="percentage-label">%</span>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
               :label="$t('Baccarat-Rolling-Ratio-B-cash')"
              prop="baccaratRollingRatioCashTh"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.baccaratRollingRatioCashTh"
                style="witdh:100px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
              </el-input>
            </el-form-item>
            <span class="percentage-label">%</span>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
               :label="$t('DT-Rolling-Ratio-B-chip')"
              prop="dragonTigerRatioChipTh"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.dragonTigerRatioChipTh"
                style="witdh:100px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
              </el-input>
            </el-form-item>
            <span class="percentage-label">%</span>
          </div>
        </el-col>
        <el-col :span="6" :xs="12">
          <div class="listb">
            <el-form-item
               :label="$t('DT-Rollingh-Ratio-B-cash')"
              prop="dragonTigerRatioCashTh"
              label-width="200px"
            >
              <el-input
                v-model="oddsList.dragonTigerRatioCashTh"
                style="witdh:100px"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              >
              </el-input>
            </el-form-item>
            <span class="percentage-label">%</span>
          </div>
        </el-col>
      </el-row>
      <div class="title">{{$t('Other-Conf')}}</div>
      <el-row :gutter="20">
        <el-col :span="6" :xs="12">
          <el-checkbox v-model="checked" @change="onCheckChange1"
            >{{$t('Rolling-Commission-rounding')}}</el-checkbox
          >
        </el-col>
        <el-col :span="6" :xs="12">
          <el-checkbox v-model="checked1" @change="onCheckChange2"
            >{{$t('B-win-comm-rounding')}}</el-checkbox
          >
        </el-col>
      </el-row>
    </el-form>

    <div class="commitOdds" @click="submit" v-prclick>{{$t('Save-Settings')}}</div>
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

    };
  },
  computed: {
    rules(){
      return {
        baccaratPump: [
          {
            required: true,
            message: this.$t('B-comm-p-cannot-be-empty'),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered")
          }

        ],
        baccaratBankerWin: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }

        ],
        baccaratPlayerWin: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }

        ],
        baccaratTieWin: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
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
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        baccaratPlayerPair: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        baccaratLarge: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        baccaratSmall: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        baccaratTwo: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        baccaratThere: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        dragonWin: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        tigerWin: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        tieWin: [
          {
            required: true,
            message: this.$t("Cannot-be-empty"),
            trigger: "blur"
          }
        ],
        baccaratRollingRatioChip: [
          {
            required: true,
            message:  this.$t("Baccarat-Rolling-Ratio-S-chip-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        baccaratRollingRatioCash: [
          {
            required: true,
            message:  this.$t("Baccarat-Rolling-Ratio-S-cash-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        dragonTigerRatioChip: [
          {
            required: true,
            message:  this.$t("DT-Rolling-Ratio-S-chip-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        dragonTigerRatioCash: [
          {
            required: true,
            message:  this.$t("DT-Rolling-Ratio-S-cash-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        baccaratRollingRatioChipTh: [
          {
            required: true,
            message:  this.$t("Baccarat-Rolling-Ratio-B-chip-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        baccaratRollingRatioCashTh: [
          {
            required: true,
            message:  this.$t("Baccarat-Rolling-Ratio-B-cash-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        dragonTigerRatioChipTh: [
          {
            required: true,
            message:  this.$t("DT-Rolling-Ratio-B-chip-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        dragonTigerRatioCashTh: [
          {
            required: true,
            message:  this.$t("DT-Rolling-Ratio-B-cash-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message:  this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ]
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    perValidator(rule, value, callback) {
      // 百分比校验
      // 只能输入0-100
      if (value > 100 || value < 0) {
        callback(new Error( this.$t("Only-0-100-can-be-entered")));
      } else {
        callback();
      }
    },
    numberValitor(rule, value, callback) {
      // 大于0的数字数字校验
      // 请输入大于0的数字
      if (value < 0) {
        callback(new Error(this.$t("Please-enter-a-No-greater-than-0")));
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
              this.$modal.msgSuccess(this.$t("Save-successful"));
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
.listb {
  display: flex;
  margin-bottom: 25px;
  .percentage-label {
    display: inline-block;
    height: 36px;
    line-height: 36px;
  }
}
</style>
