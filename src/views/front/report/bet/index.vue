<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          label-width="100px"
        >
          <el-form-item
            :label="$t('Membership-Card-Number')"
            prop="card"
            label-width="100"
          >
            <el-input
              v-model="queryParams.card"
              placeholder=""
              clearable
              style="width: 150px; "
            />
          </el-form-item>
          <el-form-item :label="$t('Station-number')" prop="tableId">
            <el-select
              v-model="queryParams.tableId"
              :placeholder="$t('Please-select')"
            >
              <el-option
                v-for="item in tableOptions"
                :key="item.tableId"
                :label="item.tableId ? item.tableId : $t('All')"
                :value="item.tableId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('Game-Type')"
            prop="gameId"
            label-width="100"
          >
            <el-select
              v-model="queryParams.gameId"
              :placeholder="$t('Please-select')"
            >
              <el-option
                v-for="item in Gameoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('Currency-Type')"
            prop="type"
            label-width="100"
          >
            <el-select
              v-model="queryParams.type"
              :placeholder="$t('Please-select')"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('Boot-number')" prop="bootNum">
            <el-input
              v-model="queryParams.bootNum"
              placeholder=""
              clearable
              style="width: 100px; "
            />
          </el-form-item>
          <el-form-item :label="$t('Game-number')" prop="gameNum">
            <el-input
              v-model="queryParams.gameNum"
              placeholder=""
              clearable
              style="width: 100px; "
            />
          </el-form-item>
          <el-form-item :label="$t('Operator')" prop="createBy">
            <el-input
              v-model="queryParams.createBy"
              placeholder=""
              clearable
              style="width: 100px; "
            />
          </el-form-item>
          <el-form-item :label="$t('Betting-Time')" label-width="100">
            <el-date-picker
              v-model="dateRange"
              style="width: 400px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
              :start-placeholder="$t('start-time')"
              :end-placeholder="$t('end-time')"
              :default-time="['00:00:00', '23:59:59']"
              @change="setTimedata"
              clearable
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              v-for="(item, index) in TimeList"
              :key="'Time' + index"
              style="margin-right: 10px"
              type="primary"
              :plain="Datatype == index ? false : true"
              size="mini"
              @click="TimeCheck(index, item.val)"
              >{{ item.name }}</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              v-prclick
              >{{ $t("Enq") }}</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetQuery"
              v-prclick
              >{{ $t("Rst") }}</el-button
            >

            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >{{ $t("Export") }}</el-button
            >
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          :data="userList"
          :empty-text="$t('no-data')"
        >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column
            :label="$t('Membership-Card-Number')"
            align="center"
            key="card"
            prop="card"
          />
          <el-table-column
            :label="$t('Station-number')"
            align="center"
            key="tableId"
            prop="tableId"
            width="100px"
          />
          <el-table-column
            :label="$t('Boot-number')"
            align="center"
            key="bootNum"
            prop="bootNum"
            width="100px"
          />
          <el-table-column
            :label="$t('Game-number')"
            align="center"
            key="gameNum"
            prop="gameNum"
            width="100px"
          />
          <el-table-column
            :label="$t('Game-Type')"
            align="center"
            key="gameId"
            prop="gameId"
            width="100px"
          >
            <template slot-scope="scope">
              <span>{{ getGameName(scope.row.gameId) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bets-to-play')"
            align="center"
            key="option"
            prop="option"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <!--百家乐、龙虎 -->
              <span v-if="scope.row.gameId == 1 || scope.row.gameId == 2">{{
                getPlayText(scope.row.option)
              }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('currency')"
            align="center"
            key="type"
            prop="type"
            width="100px"
          >
            <template slot-scope="scope" class="wanfabox">
              <!-- 币种(0美元筹码 1美元现金 2泰铢筹码 3泰铢现金) -->
              <!-- <span v-if="scope.row.type == 0">$筹码</span>
              <span v-if="scope.row.type == 1">$现金</span>
              <span v-if="scope.row.type == 2">฿筹码</span>
              <span v-if="scope.row.type == 3">฿现金</span> -->
              <span>{{ typeMap[scope.row.type] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('bet-money')"
            align="center"
            key="betMoney"
            prop="betMoney"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.betMoney | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Result')"
            align="center"
            key="gameResult"
            prop="gameResult"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <div>
                <span
                  v-for="(item, index) in scope.row.gameResult"
                  :key="index"
                  :class="getResultStyle(item)"
                >
                  {{ getGameResult2(item, index) }}
                </span>
              </div>
              <!-- <span>{{ getGameResult(scope.row.gameResult) }}</span> -->
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Win-Loss')"
            align="center"
            key="winLose"
            prop="winLose"
            width="120px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.winLose | MoneyFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Betting-Time')"
            align="center"
            key="createTime"
            prop="createTime"
            width="180px"
          />
          <el-table-column
            :label="$t('Operator')"
            align="center"
            key="createBy"
            prop="createBy"
          />

          <el-table-column
            fixed="right"
            :label="$t('Operation')"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleEdit(scope.row)"
                >{{ $t("Edit") }}</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-tickets"
                @click="handleRepair(scope.row)"
                >{{ $t("repair") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      v-if="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false"
      @close="onDialogClose"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="bet-form-box"
      >
        <div class="bet-form-row">
          <!-- 卡号、台号 -->
          <el-form-item
            :label="$t('card-number') + ':'"
            prop="card"
            class="bet-form-item"
            label-width="100px"
          >
            <el-input v-model="form.card" placeholder="" />
          </el-form-item>
          <el-form-item
            :label="$t('Station-number') + ':'"
            prop="tableId"
            class="bet-form-item"
            label-width="100px"
          >
            <el-input v-model="form.tableId" placeholder="" :disabled="true" />
          </el-form-item>
        </div>
        <!-- 靴号、局号 -->
        <div class="bet-form-row">
          <el-form-item
            :label="$t('Boot-number') + ':'"
            prop="bootNum"
            class="bet-form-item"
            label-width="100px"
          >
            <el-input v-model="form.bootNum" placeholder="" :disabled="true" />
          </el-form-item>
          <el-form-item
            :label="$t('Game-number') + ':'"
            prop="gameNum"
            class="bet-form-item"
            label-width="100px"
          >
            <el-input
              v-model="form.gameNum"
              placeholder=""
              :disabled="openType == 'edit'"
            />
          </el-form-item>
        </div>

        <!-- 输赢、币种 -->
        <div class="bet-form-row">
          <!-- <div class="bet-form-item" v-if="openType == 'edit'">
            <span class="winlose-label">{{ $t("Win-Loss") }}:</span>
            <span>{{ form.winLose }}</span>
          </div> -->
          <el-form-item
            :label="$t('Win-Loss') + ':'"
            prop="winLose"
            class="bet-form-item"
            label-width="100px"
            v-if="openType == 'edit'"
          >
            <el-input v-model="form.winLose" placeholder="" :disabled="true" />
          </el-form-item>
          <el-form-item
            :label="$t('currency') + ':'"
            prop="type"
            class="bet-form-item"
            label-width="100px"
          >
            <el-select v-model="form.type" :placeholder="$t('Please-select')">
              <el-option
                v-for="item in typeOptions2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="bet-time">
          {{ $t("Betting-Time") }}: {{ form.createTime }}
        </div>

        <!-- 龙虎 -->
        <div v-if="openGameId == 2" class="longhu-box">
          <!-- 下注金额 -->
          <div class="longhu-amount-box">
            <div class="box-label">
              <i class="start-symbol">*</i>{{ $t("bet-money") }}
            </div>
            <!-- <div> -->
            <el-form-item :label="$t('D') + ':'" label-width="50px">
              <el-input
                v-model="longhuFormOption.dragon"
                placeholder=""
                maxlength="11"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
            <el-form-item :label="currentLanguage == 'zh'? '虎:' : 'TYG:'" label-width="50px">
              <el-input
                v-model="longhuFormOption.tiger"
                placeholder=""
                maxlength="11"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
            <el-form-item :label="$t('T') + ':'" label-width="50px">
              <el-input
                v-model="longhuFormOption.tie"
                placeholder=""
                maxlength="11"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
            <!-- </div> -->
          </div>

          <!-- 开牌结果 -->
          <div class="longhu-result-box">
            <div class="box-label">{{ $t("Result") }}</div>
            <el-radio-group v-model="form.gameResult" class="result-list">
              <el-radio  label="龙">{{$t('D')}}</el-radio>
              <el-radio  label="虎">{{currentLanguage == 'zh'? '虎' : 'TYG'}}</el-radio>
              <el-radio  label="和">{{$t('T')}}</el-radio>
            </el-radio-group>
          </div>
        </div>

        <!-- 牛牛/三公/推筒子 -->
        <div
          class="niuniu-box"
          v-if="openGameId == 3 || openGameId == 4 || openGameId == 5"
        >
          <el-form-item :label="$t('bet-money') + ':'" label-width="80px">
            <el-input
              v-model="form.betMoney"
              @change="onBetMoneyChange"
              placeholder=""
              maxlength="11"
              style="width:150px"
              oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
            />
          </el-form-item>
          <el-form-item
            :label="$t('Result') + ':'"
            prop="gameResult"
            label-width="80px"
          >
            <el-radio-group
              v-model="form.gameResult"
              @change="onNiuGameResultChange"
            >
              <el-radio :label="$t('Win')">{{ $t("Win") }}</el-radio>
              <el-radio :label="$t('Loss')">{{ $t("Loss") }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <!-- 百家乐 -->
        <div v-if="openGameId == 1" class="bjl-box">
          <!-- 下注金额 -->
          <div class="bet-amount-box">
            <div class="box-label">{{ $t("bet-money") }}</div>
            <div class="bet-amount-container">
              <div class="amount-left-box">
                <el-form-item :label="$t('B') + ':'" label-width="80px">
                  <el-input
                    v-model="formOption.banker"
                    placeholder=""
                     maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('P') + ':'" label-width="80px">
                  <el-input
                    v-model="formOption.player"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('T') + ':'" label-width="80px">
                  <el-input
                    v-model="formOption.tie"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('B-P') + ':'" label-width="80px">
                  <el-input
                    v-model="formOption.bankerPair"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('P-P') + ':'" label-width="80px">
                  <el-input
                    v-model="formOption.playerPair"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('Lucky-6') + ':'" label-width="80px">
                  <el-input
                    v-model="formOption.two"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
              </div>
              <div class="amount-left-box">
                <el-form-item :label="$t('B-Ins') + ':'" label-width="60px">
                  <el-input
                    v-model="formOption.bankerIns"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('P-Ins') + ':'" label-width="60px">
                  <el-input
                    v-model="formOption.playerIns"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('T-Ins') + ':'" label-width="60px">
                  <el-input
                    v-model="formOption.tieIns"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('BIG') + ':'" label-width="60px">
                  <el-input
                    v-model="formOption.big"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>
                <el-form-item :label="$t('S') + ':'" label-width="60px">
                  <el-input
                    v-model="formOption.small"
                    placeholder=""
                    maxlength="11"
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item>

                <!-- <el-form-item label="三张牌:" label-width="60px">
                  <el-input
                    v-model="formOption.three"
                    placeholder=""
                    oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
                  />
                </el-form-item> -->
              </div>
            </div>
          </div>

          <!-- 开牌结果 -->
          <!-- <div class="game-result-box">
            <div class="box-label">开牌结果</div>
            <el-checkbox-group
              v-model="gameResultList"
              @change="onGameResultChange"
            >
              <el-checkbox label="4">庄</el-checkbox>
              <el-checkbox label="1">闲</el-checkbox>
              <el-checkbox label="7">和</el-checkbox>
              <el-checkbox label="8">庄对</el-checkbox>
              <el-checkbox label="5">闲对</el-checkbox>
              <el-checkbox label="9">大</el-checkbox>
              <el-checkbox label="6">小</el-checkbox>
              <el-checkbox label="a">幸运6(2张牌)</el-checkbox>
              <el-checkbox label="b">幸运6(3张牌)</el-checkbox>
            </el-checkbox-group>
          </div> -->
          <div class="game-result-box">
            <div class="box-label">{{ $t("Result") }}</div>
            <div class="result-box">
              <el-radio-group
                v-model="checkedFormResult1"
                class="result-item-box result1-box"
              >
                <el-radio :label="4">{{ $t("B") }}</el-radio>
                <el-radio :label="1">{{ $t("P") }}</el-radio>
                <el-radio :label="7">{{ $t("T") }}</el-radio>
              </el-radio-group>
              <el-checkbox-group
                v-model="checkedFormResult2"
                class="result-item-box"
              >
                <el-checkbox label="8">{{ $t("B-P") }}</el-checkbox>
                <el-checkbox label="5">{{ $t("P-P") }}</el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group
                v-model="checkedFormResult3"
                @change="onGameResultChange3"
                class="result-item-box"
              >
                <el-checkbox label="9">{{ $t("S") }}</el-checkbox>
                <el-checkbox label="6">{{ $t("BIG") }}</el-checkbox>
              </el-checkbox-group>

              <el-checkbox-group
                v-model="checkedFormResult4"
                @change="onGameResultChange4"
                class="result-item-box"
              >
                <el-checkbox label="a">{{ $t("Lucky-2-cards") }}</el-checkbox>
                <el-checkbox label="b">{{ $t("Lucky-3-cards") }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="submitForm">{{ $t("OK") }}</el-button>
        <el-button @click="cancel">{{ $t("Cancel") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listSign,
  listSignTotal,
  addSigned,
  addReturnOrder
} from "@/api/coderoom/sign";
import { listTable } from "@/api/sys/table";
import { MoneyFormat } from "@/filter";
import { mapGetters, mapState } from "vuex";
import {
  listBetRecord,
  listBetRecordTotal,
  editBetRecord,
  repairBetRecord
} from "@/api/report/report";
import moment from "moment";
const _ = require("lodash");
import i18n from "@/locales";
// 开牌结果映射
const betOptionList = {
  4: i18n.t("B"), //庄
  1: i18n.t("P"), //闲
  7: i18n.t("T"), //和
  8: i18n.t("B-P"), //庄对
  5: i18n.t("P-P"), //闲对
  3: i18n.t("B-Ins"), //庄保险
  0: i18n.t("P-Ins"), //闲保险
  2: i18n.t("T-Ins"), //和保险
  9: i18n.t("BIG"), //大
  6: i18n.t("S"), //小
  a: i18n.t("Lucky-2-cards"), //幸运6(2张牌)
  b: i18n.t("Lucky-3-cards"), //幸运6(3张牌)
  龙: i18n.t("D"), //
  虎: i18n.t("TYG"), //
  和: i18n.t("T"), //
  输: i18n.t("Loss"), //
  赢: i18n.t("Win"), //
  "-": "-" //
};

// 下注玩法映射
const playTextMap = {
  4: i18n.t("B"), //庄
  1: i18n.t("P"), //闲
  7: i18n.t("T"), //和
  8: i18n.t("B-P"), //庄对
  5: i18n.t("P-P"), //闲对
  3: i18n.t("B-Ins"), //庄保险
  0: i18n.t("P-Ins"), //闲保险
  2: i18n.t("T-Ins"), //和保险
  9: i18n.t("BIG"), //大
  6: i18n.t("S"), //小
  a: i18n.t("Lucky-6"), //幸运6
  龙: i18n.t("D"), //
  虎: i18n.t("TYG"), //
  和: i18n.t("T"), //
  输: i18n.t("Loss"), //
  赢: i18n.t("Win"), //
  "-": "-" //
};

// 百家乐
const optionMap = {
  banker: "4", //
  player: "1", //
  tie: "7", //
  bankerPair: "8", //
  playerPair: "5", //
  bankerIns: "3", //庄保险
  playerIns: "0", //闲保险
  tieIns: "2", //和保险
  big: "9", //
  small: "6", //
  two: "a", //幸运6(两张牌)
  three: "b", //幸运6(三张牌)
  4: "banker", //
  1: "player", //
  7: "tie", //
  8: "bankerPair", //
  5: "playerPair", //
  3: "bankerIns", //庄保险
  0: "playerIns", //闲保险
  2: "tieIns", //和保险
  9: "big", //
  6: "small", //
  a: "two", //
  b: "three" //
};
// 龙虎
const longhuOptionMap = {
  dragon: "龙", //龙
  tiger: "虎", //虎
  tie: "和", //和
  龙: "dragon", //龙
  虎: "tiger", //虎
  和: "tie" //和
};
const gameResult1 = ["4", "1", "7"]; //庄闲和
const gameResult2 = ["8", "5"]; //庄对、闲对
const gameResult3 = ["9", "6"]; //大小
const gameResult4 = ["a", "b"]; // 幸运6(2张牌)/幸运6(3张牌)

export default {
  // 注单记录
  name: "Bet",
  data() {
    return {
      // 添加卡号
      isMain: false,
      // 遮罩层
      loading: true,
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

      userTotal: {},
      //会员详情
      memlist: {},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 弹窗类型:edit 编辑；repair 补录
      openType: "",
      // 弹窗游戏
      openGame: "",
      openGameId: "",
      detailOpen: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围 默认今日
      dateRange: [
        moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss")
      ],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      //原始的表单数据，用于提交时对比
      initForm: {},
      // 原始的下注金额
      originalOption: {},
      // 原始的开牌结果(排序后)
      originalGameResult: "",
      // 开牌结果，用于表单
      gameResultList: [],
      // 百家可下注金额
      formOption: {
        banker: "",
        player: "",
        bankerIns: "", //庄保险
        playerIns: "", //闲保险
        tieIns: "", //和保险
        tie: "",
        playerPair: "",
        bankerPair: "",
        big: "",
        small: "",
        two: "" //幸运6
      },
      checkedFormResult1: "", //庄闲和 (单选)
      checkedFormResult2: [], //选中 庄对、闲对
      checkedFormResult3: [], //选中 大小
      checkedFormResult4: [], //选中 幸运6(2张牌)、幸运6(3张牌)

      // 龙虎下注金额
      longhuFormOption: {
        dragon: "",
        tiger: "",
        tie: ""
      },

      formBetMoney: null,

      defaultProps: {
        children: "children",
        label: "label"
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        card: "", //会员姓名
        tableId: null, //台号
        gameId: "", //游戏类型
        type: null, //	币种()
        bootNum: "", //靴号
        gameNum: "", //局号
        createBy: "", //操作员
        startTime: moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss")
      },

      // 台号列表
      tableOptions: [],

      Datatype: 0
    };
  },
  computed: {
     ...mapState("app", ["currentLanguage"]),
    // 游戏类型列表
    Gameoptions() {
      return [
        {
          value: "",
          label: this.$t("All")
          // label: "全部"
        },
        {
          value: 1,
          label: this.$t("Baccarat")
          // label: "百家乐"
        },
        {
          value: 2,
          label: this.$t("DT")
          // label: "龙虎"
        },
        {
          value: 3,
          label: this.$t("Niu-Niu")
          // label: "牛牛"
        },
        {
          value: 4,
          label: this.$t("San-Gong")
          // label: "三公"
        },
        {
          value: 5,
          label: this.$t("Tui-Tong-Zi")
          // label: "推筒子"
        }
      ];
    },
    // 币种类型列表
    typeOptions() {
      return [
        {
          value: null,
          label: this.$t("All")
          // label: "全部"
        },
        {
          value: 1,
          label: `$${this.$t("Chip")}`
          // label: "$筹码"
        },
        {
          value: 2,
          label: `$${this.$t("Cash")}`
          // label: "$现金"
        },
        {
          value: 3,
          label: `฿${this.$t("Chip")}`
          // label: "฿筹码"
        },
        {
          value: 4,
          label: `฿${this.$t("Cash")}`
          // label: "฿现金"
        },

        {
          value: 5,
          label: `$${this.$t("Chip")}+$${this.$t("Cash")}`
          // label: "$筹码+$现金"
        },
        {
          value: 6,
          label: `฿${this.$t("Chip")}+฿${this.$t("Cash")}`
          // label: "฿筹码+฿现金"
        }
      ];
    },
    typeOptions2() {
      return [
        {
          value: 0,
          label: `$${this.$t("Chip")}`
          // label: "$筹码"
        },
        {
          value: 1,
          label: `$${this.$t("Cash")}`
          // label: "$现金"
        },
        {
          value: 2,
          label: `฿${this.$t("Chip")}`
          // label: "฿筹码"
        },
        {
          value: 3,
          label: `฿${this.$t("Cash")}`
          // label: "฿现金"
        }
      ];
    },
    typeMap() {
      return {
        0: `$${this.$t("Chip")}`,
        1: `$${this.$t("Cash")}`,
        2: `฿${this.$t("Chip")}`,
        3: `฿${this.$t("Cash")}`
      };
    },
    TimeList() {
      return [
        {
          name: this.$t("Today"),
          val: [
            moment(new Date())
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment(new Date())
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss")
          ]
        },
        {
          name: this.$t("Yesterday"),
          val: [
            moment()
              .subtract(1, "days")
              .startOf("day")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment()
              .subtract(1, "days")
              .endOf("day")
              .format("YYYY-MM-DD HH:mm:ss")
          ]
        }
      ];
    },
    rules() {
      if (this.openType == "edit") {
        return {
          card: [{ required: true, message: "卡号不能为空" }],
          type: [{ required: true, message: "请选择币种" }]
        };
      } else {
        return {
          card: [{ required: true, message: "卡号不能为空" }],
          gameNum: [{ required: true, message: "局号不能为空" }],
          type: [{ required: true, message: "请选择币种" }]
        };
      }
    },
    //选中的开牌结果
    checkedFormResult() {
      const results = [
        this.checkedFormResult1,
        ...this.checkedFormResult2,
        ...this.checkedFormResult3,
        ...this.checkedFormResult4
      ];
      // 进行排序，以便与原始数据originalGameResult进行对比
      const newResults = _.sortBy(results);
      return newResults.join("");
    }
  },
  watch: {
    formOption: {
      handler(newVal, oldVal) {
        // 生成新的option,用于form提交
        console.log("生成新的百家乐option,用于form提交", newVal, oldVal);
        this.getNewOption(newVal);
      },
      deep: true,
      immediate: true
    },
    longhuFormOption: {
      handler(newVal, oldVal) {
        // 生成新的option,用于form提交
        console.log("生成新的龙虎option,用于form提交", newVal, oldVal);
        this.getNewLongHuOption(newVal);
      },
      deep: true,
      immediate: true
    },
    checkedFormResult(newVal, oldVal) {
      this.form.gameResult = newVal;
    }
  },
  created() {
    this.getList();
    this.getTableOptions();
  },

  methods: {
    /**
     * @description: 设置时间
     * @return *
     */
    setTimedata(Date) {
      if (Date) {
        this.Datatype = null;
        for (let index = 0; index < this.TimeList.length; index++) {
          const element = this.TimeList[index];
          if (Date[0] == element.val[0] && Date[1] == element.val[1]) {
            this.Datatype = index;
            break;
          }
        }
      } else {
        this.queryParams["startTime"] = "";
        this.queryParams["endTime"] = "";
        this.Datatype = null;
      }
    },
    TimeCheck(index, time) {
      this.Datatype = index;
      console.log(time);

      this.queryParams["startTime"] = time[0];
      this.queryParams["endTime"] = time[1];
      this.dateRange = [time[0], time[1]];
    },
    getTableOptions() {
      const params = {
        pageSize: 500,
        pageNum: 1
      };
      listTable(params).then(response => {
        this.tableOptions = response.rows;
        this.tableOptions.unshift({ tableId: null });
      });
    },
    /** 查询用户列表 */
    getList() {
      const { tableId, gameId, type, bootNum, gameNum } = this.queryParams;
      let params = {
        card: this.queryParams.card, //卡号
        tableId: tableId ? Number(tableId) : null, //台号
        gameId: gameId ? Number(gameId) : null, //游戏类型
        type: type != null ? Number(type) : null, //	币种(0 筹码 1现金)
        bootNum: bootNum ? Number(bootNum) : null, //靴号
        gameNum: gameNum ? Number(gameNum) : null, //局号
        createBy: this.queryParams.createBy, //操作员
        startTime: this.dateRange ? this.addDateRange(this.dateRange)[0] : null,
        endTime: this.dateRange ? this.addDateRange(this.dateRange)[1] : null,
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };
      this.loading = true;
      listBetRecord(params)
        .then(response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      listBetRecordTotal(params)
        .then(response => {
          this.userTotal = response.data;

          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
      this.$delete(params, "pageNum");
      this.$delete(params, "pageSize");
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    onDialogClose() {
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.initForm = {};
      this.originalOption = {};
      this.resetForm("form");
      this.openType = "";
      this.gameResultList = [];
      this.formBetMoney = null;
      this.resetOption();
      this.resetGameResult();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [
        moment(new Date())
          .startOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        moment(new Date())
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss")
      ];
      this.Datatype = 0;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getGameName(gameId) {
      if (gameId) {
        //通过gameId 得到游戏名称 gameName
        const game = this.Gameoptions.filter(item => item.value == gameId)[0];
        // console.log("通过gameId 得到游戏名称 gameName", game, gameId);

        return game.label;
      } else {
        return "百家乐";
      }
    },

    /** 编辑 */
    handleEdit(row) {
      // this.reset();
      this.form = Object.assign({}, row);
      // this.form.option = {};

      this.open = true;
      this.openType = "edit";
      const gameName = this.getGameName(row.gameId);
      this.openGame = gameName;
      this.openGameId = row.gameId;
      this.title = `${gameName}  ${this.$t("Bet-slip-amendment")}`;
      if (row.gameId == 1) {
        // 百家乐
        // 初始化下注金额和开牌结果
        this.initOption(row.option);
        this.getFormGameResult(row.gameResult);
      }
      if (row.gameId == 2) {
        // 龙虎
        this.initLongHuOption(row.option);
      }

      if (row.gameId != 1 || row.gameId != 2) {
        // 牛牛、三公、骰子
        this.form.betMoney = row.betMoney;
      }
      // 复制一份原始的form，用于提交时对比差异
      this.initForm = Object.assign({}, row);
    },

    /** 补录 */
    handleRepair(row) {
      this.reset();
      this.form = Object.assign({}, row);
      this.form.card = "";
      this.form.gameNum = "";
      this.form.type = null;
      this.form.option = {};
      this.form.gameResult = "";
      this.form.betMoney = null;
      this.form.optionTime = row.createTime;
      this.open = true;
      this.openType = "repair";
      const gameName = this.getGameName(row.gameId);
      this.openGame = gameName;
      this.openGameId = row.gameId;
      this.title = `${gameName} ${this.$t("Bet-slip-supplementary")}`;
    },
    /** 导出按钮操作 */
    handleExport() {
      // 表头对应关系
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/excel/Export2Excel");
        const tHeader = [
          "会员卡号",
          this.$t("Station-number"),
          this.$t("Boot-number"),
          "局号",
          "游戏类型",
          "下注玩法",
          "币种",
          "下注金额",
          "开牌结果",
          "输赢",
          "下注时间",
          "操作员"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "card",
          "tableId",
          "bootNum",
          "gameNum",
          "gameId",
          "option",
          "type",
          "betMoney",
          "gameResult",
          "winLose",
          "createTime",
          "createBy"
        ];
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.userList; //把data里的tableData存到list
        const time_str = this.$getCurrentTime();
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, `注单记录列表-${time_str}`);
      });
    },
    // 该方法负责将数组转化成二维数组
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j == "gameId") {
            // 游戏类型
            return this.getGameName(v[j]);
          }
          if (j == "option") {
            // 下注玩法
            const option = this.getPlayText(v[j]);
            return option;
          }
          if (j == "type") {
            // 币种
            return this.typeMap[v[j]];
          }
          if (j == "gameResult") {
            return this.getGameResult(v[j]);
          }
          return v[j];
        })
      );
    },

    // 生成下注玩法
    getPlayText(option = []) {
      if (!option || option.length == 0) {
        return "-";
      }
      let playText = "";
      let result = [];
      for (let index = 0; index < option.length; index++) {
        const element = option[index];
        const { betOption, betMoney } = element;
        const betName = playTextMap[betOption];
        if (betName) {
          const item = `${betName}:${betMoney}`;
          result.push(item);
        }
      }
      playText = result.join(" / ");
      return playText;
    },
    // 生成开牌结果(用于excel导出)
    getGameResult(c) {
      let arr1 = [];
      let arr = c.split("");

      arr.forEach(e => {
        arr1.push(betOptionList[e]);
      });
      return arr1.join(" / ");
    },
    // 生成开牌结果(用于表格渲染)
    getGameResult2(result, index) {
      if (index == 0) {
        return betOptionList[result];
      } else {
        return `/ ${betOptionList[result]}`;
      }
    },

    //开牌结果样式
    getResultStyle(option) {
      if (option == 4 || option == "龙") {
        // 龙/庄（红色）
        return "result-long-banker";
      }
      if (option == 1 || option == "虎") {
        // 虎/闲（蓝色）
        return "result-hu-player";
      }
      if (option == 7) {
        // 和（绿色）
        return "result-tie";
      }
      return "";
    },

    // 弹窗里的开牌结果
    getFormGameResult1(c) {
      let arr1 = [];
      let arr = c.split("");
      // 将排序后的开牌结果存起来。提交的时候对比差异
      const sortGameResult = _.sortBy(arr);
      this.originalGameResult = sortGameResult.join("");
      return arr;
    },
    getFormGameResult(val) {
      let arr = val.split("");
      // 将排序后的开牌结果存到originalGameResult。提交的时候对比差异
      const results = _.sortBy(arr);
      this.originalGameResult = results.join("");

      // 包含庄闲和的值
      const includeResult1 = _.filter(results, function(item) {
        return gameResult1.indexOf(item) > -1;
      });
      console.log("包含庄闲和的值", includeResult1);
      this.checkedFormResult1 = includeResult1[0]
        ? Number(includeResult1[0])
        : "";

      // 包含庄对/闲对的值
      const includeResult2 = _.filter(results, function(item) {
        return gameResult2.indexOf(item) > -1;
      });
      console.log("包含庄对/闲对的值", includeResult2);
      this.checkedFormResult2 = includeResult2;

      // 包含大/小的值
      const includeResult3 = _.filter(results, function(item) {
        return gameResult3.indexOf(item) > -1;
      });
      console.log("包含大/小的值", includeResult3);
      this.checkedFormResult3 = includeResult3;

      // 包含两张牌/三张牌的值
      const includeResult4 = _.filter(results, function(item) {
        return gameResult4.indexOf(item) > -1;
      });
      console.log("包含两张牌/三张牌的值", includeResult4);
      this.checkedFormResult4 = includeResult4;
    },

    onGameResultChange3(val) {
      console.log("大小选择变化", val);
      if (val.length == 2) {
        // 大小只能二选一. 选择后面选中的值
        this.checkedFormResult3 = [...val[1]];
      } else {
        this.checkedFormResult3 = val;
      }
    },
    onGameResultChange4(val) {
      console.log("幸运6选择变化", val);
      if (val.length == 2) {
        // 幸运6 两张牌/三张牌只能二选一. 选择后面选中的值
        this.checkedFormResult4 = [...val[1]];
      } else {
        this.checkedFormResult4 = val;
      }
    },

    initOption(options) {
      if (options) {
        // 百家乐：将下注金额带入表单，生成初始化的formOption，用于百家乐的表单里的下注金额数据绑定
        for (let index = 0; index < options.length; index++) {
          const element = options[index];
          // betOption数字4变成字母banker : 4->banker ,对应formOption里的banker
          const key = optionMap[element.betOption];
          // {banker:20}
          this.formOption[key] = element.betMoney;
        }

        // 复制一份下注金额.用于提交时对比差异
        this.originalOption = Object.assign({}, this.formOption);
      } else {
        this.resetOption();
      }
    },
    // 百家乐:生成新的百家乐的option,用于form提交
    getNewOption(formOption) {
      // 比如 formOption = {"banker":20}
      let newOption = {};
      let betAmount = 0;
      for (const key in formOption) {
        if (formOption.hasOwnProperty(key)) {
          //例如 value 是20
          const value = formOption[key] ? Number(formOption[key]) : null;
          if (value != null) {
            // 比如formOption的里key是banker,对应到optionMap里的值是4
            const optionKey = optionMap[key];
            // {4:20}
            newOption[optionKey] = value;
            betAmount += Number(value);
          }
        }
      }
      // 生成新的百家乐的option,用于form提交
      this.form.option = newOption;
      // 计算下注金额
      this.formBetMoney = betAmount;
      this.form.betMoney = betAmount;
    },

    initLongHuOption(options) {
      //龙虎：将下注金额带入表单，生成初始化的formOption，用于龙虎的表单里的下注金额数据绑定
      for (let index = 0; index < options.length; index++) {
        const element = options[index];
        // betOption中文 "龙"变成字母 "dragon" : "龙"->"dragon" ,对应longhuFormOption里的dragon
        const key = longhuOptionMap[element.betOption];
        // {dragon:20}
        this.longhuFormOption[key] = element.betMoney;
      }
      // 复制一份下注金额.用于提交时对比差异
      this.originalOption = Object.assign({}, this.longhuFormOption);
    },

    //龙虎: 生成新的龙虎的option,用于form提交
    getNewLongHuOption(formOption) {
      // 比如 formOption = {"dragon":20}
      let newOption = {};
      let betAmount = 0;
      for (const key in formOption) {
        if (formOption.hasOwnProperty(key)) {
          //例如 value 是20
          const value = formOption[key] ? Number(formOption[key]) :null;

          if (value !=null) {
            // 比如formOption的里key是dragon,对应到longhuOptionMap里的值是"龙"
            const optionKey = longhuOptionMap[key];
            // {"龙":20}
            newOption[optionKey] = value;
            betAmount += Number(value);
          }
        }
      }
      // 生成新的option,用于form提交
      this.form.option = newOption;
      // 计算下注金额
      this.formBetMoney = betAmount;
    },

    // 牛牛/三公/推筒子:当betMoney变化时生成option
    onBetMoneyChange(val) {
      if (this.form.gameResult) {
        this.form.option = {
          [this.form.gameResult]: Number(val)
        };
      }
    },
    // 牛牛/三公/推筒子:当gameResulty变化时生成option
    onNiuGameResultChange(val) {
      if (this.form.betMoney) {
        this.form.option = {
          [val]: Number(this.form.betMoney)
        };
      }
    },

    /**重置下注金额option */
    resetOption() {
      //  重置百家乐option
      this.formOption = {
        banker: "",
        player: "",
        bankerIns: "", //庄保险
        playerIns: "", //闲保险
        tieIns: "", //和保险
        tie: "",
        playerPair: "",
        bankerPair: "",
        big: "",
        small: "",
        two: "",
        three: ""
      };
      // 重置龙虎option
      this.longhuFormOption = {
        dragon: "",
        tiger: "",
        tie: ""
      };
    },

    // 对比下注金额的数据是否与原始数据相等
    equalOption(originalOption, formOption) {
      // 因为formOption的值类型是string,originalOption值类型是Number
      if (originalOption == Number(formOption)) {
        return true;
      }
    },

    /**重置百家乐开牌结果 */
    resetGameResult() {
      this.checkedFormResult1 = "";
      this.checkedFormResult2 = [];
      this.checkedFormResult3 = [];
      this.checkedFormResult4 = [];
    },

    /** 提交按钮 */
    submitForm: function() {
      if (this.openType == "edit") {
        /** 1.对比是否有修改 */
        // 百家乐
        if (this.openGameId == 1) {
          if (
            this.form.card == this.initForm.card &&
            this.form.type == this.initForm.type &&
            this.form.gameResult == this.originalGameResult &&
            _.isEqualWith(
              this.originalOption,
              this.formOption,
              this.equalOption
            )
          ) {
            // 没有修改东西,不调接口
            this.$modal.msgError(
              this.$t("No-changes-have-been-made-this-time")
            );
            return;
          }
        }
        // 龙虎
        if (this.openGameId == 2) {
          if (
            this.form.card == this.initForm.card &&
            this.form.type == this.initForm.type &&
            this.form.gameResult == this.initForm.gameResult &&
            _.isEqualWith(
              this.originalOption,
              this.longhuFormOption,
              this.equalOption
            )
          ) {
            // 没有修改东西,不调接口
            this.$modal.msgError(
              this.$t("No-changes-have-been-made-this-time")
            );
            return;
          }
        }
        if (
          this.openGameId == 3 ||
          this.openGameId == 4 ||
          this.openGameId == 5
        ) {
          if (
            this.form.card == this.initForm.card &&
            this.form.type == this.initForm.type &&
            this.form.gameResult == this.initForm.gameResult &&
            this.form.betMoney == this.initForm.betMoney
          ) {
            // 没有修改东西,不调接口
            this.$modal.msgError(
              this.$t("No-changes-have-been-made-this-time")
            );
            return;
          }
        }
        /** 2. 是否有录入完整注单数据 */
        if (
          (this.openGameId == 1 || this.openGameId == 2) &&
          (!this.form.card || _.size(this.form.option) == 0 || this.form.gameResult == "")
        ) {
          // 百家乐 、龙虎
          this.$modal.msgError(this.$t("Please-enter-the-complete-order-data"));
          return;
        }

        if (
          (this.openGameId == 3 ||
            this.openGameId == 4 ||
            this.openGameId == 5) &&
          (!this.form.card || _.size(this.form.option) == 0 || this.form.gameResult == "")
        ) {
          // 、牛牛、三公、推筒子
          this.$modal.msgError(this.$t("Please-enter-the-complete-order-data"));
          return;
        }

        /** 3.百家乐 庄闲和必选一*/
        if (this.openGameId == 1 && !this.checkedFormResult1) {
          this.$modal.msgError(this.$t("select-b-p-t"));
          return;
        }
        // 注单修改
        editBetRecord(this.form).then(response => {
          this.$modal.msgSuccess(this.$t("Order-amended-successfully"));
          this.open = false;
          this.reset();
          setTimeout(() => {
            this.getList();
          }, 500);
        });
      } else {
        // 补录

        /**1.百家乐 龙虎  是否录入完整注单数据*/
        if (
          (this.openGameId == 1 || this.openGameId == 2) &&
          (!this.form.card ||
            !this.form.gameNum ||
            !this.formBetMoney ||
            this.form.type == null ||
            !this.form.gameResult)
        ) {
          this.$modal.msgError(this.$t("Please-enter-the-complete-order-data"));
          return;
        }
        /** 2.百家乐 庄闲和必选一*/
        if (this.openGameId == 1 && !this.checkedFormResult1) {
          this.$modal.msgError(this.$t("select-b-p-t"));
          return;
        }

        /**3.牛牛 三公 推筒子 是否录入完整注单数据*/
        if (
          (this.openGameId == 3 ||
            this.openGameId == 4 ||
            this.openGameId == 5) &&
          (!this.form.card ||
            !this.form.gameNum ||
            !this.form.betMoney ||
            this.form.type == null ||
            !this.form.gameResult)
        ) {
          this.$modal.msgError(this.$t("Please-enter-the-complete-order-data"));
          return;
        }
        // 注单补录
        repairBetRecord(this.form).then(response => {
          this.$modal.msgSuccess(this.$t("Order-supplemented-successfully"));
          this.open = false;
          this.reset();
          this.getList();
        });
      }
    }
  }
};
</script>
<style lang="scss">
.detailBox {
  border: 1px solid #bcbcbc;
  .list {
    border-bottom: 1px solid #bcbcbc;
    span {
      display: inline-block;
      text-align: center;
      width: 49%;
      &:nth-child(1) {
        border-right: 1px solid #bcbcbc;
        width: 50%;
      }
    }
  }
}
.el-table.table2 {
  .el-table__header-wrapper,
  .el-table__body-wrapper {
    display: none;
  }
}
.wanfa {
  display: inline-block;
  width: 50%;
}

.bet-form-box {
  width: 90%;
  margin: 0 auto;

  .start-symbol {
    color: red;
  }
  .bet-form-row {
    display: flex;
    justify-content: space-between;
    .bet-form-item {
      width: 50%;
      height: 35px;
      line-height: 35px;
      margin-bottom: 30px;
      .winlose-label {
        display: inline-block;
        width: 85px;
        font-size: 14px;
        color: #606266;
        font-weight: 500;
        text-align: right;
        padding-right: 12px;
        margin-right: 15px;
      }
      .el-form-item__label {
        // text-align: left;
      }
    }
  }
  .niuniu-box {
    .el-form-item__label {
      text-align: left;
    }
  }
  // 百家乐
  .bjl-box {
    .bet-amount-box {
      text-align: center;
      border: 1px solid rgb(172, 166, 166);
      margin: 10px auto;
      padding-top: 22px;

      .el-form-item__label {
        text-align: right;
      }
      .bet-amount-container {
        display: flex;
      }
      .amount-left-box {
        width: 50%;
        .el-form-item__label {
          // text-align: left;
        }
      }
    }
    .game-result-box {
      text-align: left;
      border: 1px solid rgb(172, 166, 166);
      margin: 10px auto;
      padding: 10px;
    }
    .box-label {
      margin-bottom: 10px;
      text-align: center;
      &::before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
      }
    }
    .result-box {
      display: flex;
      flex-wrap: wrap;
      .result-item-box {
        display: flex;
        height: 20px;
        margin-right: 20px;
        .el-radio {
          height: 20px;
          top: 4px;
        }
      }
      .result1-box {
        .el-radio__inner {
          border-radius: 2px;
        }

        .el-radio__input.is-checked .el-radio__inner::after {
          box-sizing: content-box;
          content: "";
          border: 1px solid #ffffff;
          border-left: 0;
          border-top: 0;
          height: 7px;
          left: 4px;
          position: absolute;
          top: 1px;
          width: 3px;
          transition: transform 0.15s ease-in 0.05s,
            -webkit-transform 0.15s ease-in 0.05s;

          transform-origin: center;
          transform: rotate(45deg) scaleY(1);
          border-radius: 0;
          background-color: transparent;
        }
      }
    }
  }

  .bet-time {
    margin: 10px 0;
  }
  // 龙虎
  .longhu-box {
    display: flex;
    justify-content: space-between;
    .longhu-amount-box {
      width: 40%;
      text-align: center;
      border: 1px solid rgb(172, 166, 166);
      // margin: 10px auto;
      padding: 10px;
    }
    .longhu-result-box {
      width: 40%;
      text-align: center;
      border: 1px solid rgb(172, 166, 166);
      // margin: 10px auto;
      padding: 10px;
      .result-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .el-radio {
          margin: 18px auto;
        }
      }
    }
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
// .el-form-item__label{
//   font-size: 16px;
// }
// .el-table .cell{
//   font-size: 16px;
// }
// .el-table__cell {
//   .el-button{
//     font-size: 16px;
//   }
// }
</style>
