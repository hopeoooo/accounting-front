<template>
  <div class="app-container member-management">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="100px"
        >
          <el-form-item label="" prop="gameName">
            <el-select
              v-model="queryParams.type"
              placeholder=""
              style="width: 130px"
            >
              <el-option :label="$t('Card-search')" value="card"></el-option>
              <el-option :label="$t('Name-search')" value="name"></el-option>
              <el-option :label="$t('Phone-search')" value="phone"></el-option>
            </el-select>
            <el-input
              v-model="queryParams.value"
              placeholder=""
              clearable
              style="width: 240px"
            />
            <el-checkbox
              v-model="queryParams.isChild"
              style="margin-left:20px;"
              :disabled="!queryParams.value"
              >{{ $t("Include-sub-cards") }}</el-checkbox
            >
          </el-form-item>

          <el-form-item :label="$t('card-status')" prop="status">
            <el-select v-model="queryParams.status" :placeholder="$t('All')">
              <el-option :label="$t('All')" :value="null"></el-option>
              <el-option :label="$t('Normal')" :value="0"></el-option>
              <el-option :label="$t('Deactivated')" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('Acc-Op-Tm')">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              :start-placeholder="$t('start-time')"
              :end-placeholder="$t('end-time')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >{{ $t("Enq") }}</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
              $t("Rst")
            }}</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >{{$t('Add-New')}}</el-button
            >
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >{{$t('Del')}}</el-button
            >
          </el-col> -->
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
          :empty-text="$t('no-data')"
        >
          <!-- <el-table-column
            fixed
            type="selection"
            key="id"
            prop="id"
            width="50"
            align="center"
          /> -->
          <el-table-column
            :label="$t('Card-number')"
            align="center"
            key="card"
            prop="card"

          />
          <el-table-column
            :label="$t('Name')"
            align="center"
            key="name"
            prop="name"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            :label="$t('phone-number')"
            align="center"
            key="phone"
            prop="phone"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.phone">{{ scope.row.phone }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('Staus')" align="center" key="status">
            <template slot-scope="scope">
              <!-- <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch> -->
              <span v-if="scope.row.status == 0">{{ $t("Normal") }}</span>
              <span v-else style="color:red">{{ $t("Deactivated") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Card-Type')"
            align="center"
            key="cardType"
            prop="cardType"
             width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.cardType == 0 ? $t("master-card") : $t("child-card")}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Int-card')"
            align="center"
            key="isAdmin"
            prop="isAdmin"
             width="150px"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.isAdmin == 0 ? $t("No") : $t("Yes") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Gender')"
            align="center"
            key="sex"
            prop="sex"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.sex == 0 ? $t('male') : $t('female') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Acc-holder')"
            align="center"
            key="createBy"
            prop="createBy"
            width="120"
          />
          <el-table-column
            :label="$t('Dt-op-acc')"
            align="center"
            prop="createTime"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('Remarks')"
            align="center"
            key="remark"
            prop="remark"
            width="220px"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.remark">{{ scope.row.remark }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>

          <el-table-column
            fixed="right"
            :label="$t('Opr')"
            align="center"
            width="260"
            style="text-align:left;"
            class-name="operation-column small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleMore(scope.row.id)"
                >{{ $t("More-information") }}</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >{{ $t("Modifications") }}</el-button
              >
              <el-button
                v-if="scope.row.cardType == 0"
                size="mini"
                type="text"
                icon="el-icon-circle-plus-outline"
                @click="handleAddChild(scope.row.card)"
                >{{ $t("Add-new-subcard") }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <div class="count-item-box" v-if="userList && userList.length > 0">
          <span class="count-item"
            >{{ $t("main-number") }}:{{ count.parentCount }}</span
          ><span class="count-item"
            >{{ $t("sub-number") }}:{{ count.childCount }}</span
          ><span class="count-item"
            >${{ $t("Deposit") }}:{{ count.depositCount }}</span
          ><span class="count-item"
            >฿{{ $t("Deposit") }}:{{ count.depositCountTh }}</span
          ><span class="count-item"
            >${{ $t("Rep-C-Fee") }}:{{ count.repairCount }}</span
          ><span class="count-item"
            >฿{{ $t("Rep-C-Fee") }}:{{ count.repairCountTh }}</span
          >
        </div>

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
      width="800px"
      @close="onDialogClose"
      append-to-body
      :close-on-click-modal="false"
      ref="dialogForm"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        v-if="open"
      >
        <el-row :gutter="0" v-if="isMain == false">
          <el-col :span="12">
            <el-form-item :label="$t('Card-number')" prop="card">
              <el-input
                v-model="form.card"
                :placeholder="$t('enter-card-number')"
                :disabled="openType == 'edit'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Name')" prop="name">
              <el-input v-model="form.name"  :placeholder="$t('enter-name')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" v-if="isMain">
          <el-col :span="12">
            <el-form-item :label="$t('main-card')" prop="parentCard">
              <el-input
                v-model="form.parentCard"
                :disabled="true"
                :placeholder="$t('enter-card-number')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Name')" prop="name">
              <el-input v-model="form.name"  :placeholder="$t('enter-name')" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0" v-if="isMain">
          <el-col :span="12">
            <el-form-item :label="$t('sub-card')" prop="card">
              <el-input
                v-model="form.card"
                :placeholder="$t('enter-card-number')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('Gender')" prop="sex">
              <el-select v-model="form.sex" placeholder="">
                <el-option :label="$t('male')" :value="0"></el-option>
                <el-option :label="$t('female')" :value="1"></el-option>
                <!-- <el-option label="未知" :value="2"></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Phone-number')" prop="phone">
              <el-input
                v-model="form.phone"
                :placeholder="$t('enter-phone-number')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('Password')" prop="password" v-if="isshow">
              <el-input
                v-model="form.password"
                :placeholder="openType == 'edit' ? '******' : $t('enter-pwd')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('Confirm-Password')"
              prop="rawPassword"
              v-if="isshow"
            >
              <el-input
                v-model="form.rawPassword"
                :placeholder="openType == 'edit' ? '******' : $t('confirm-pwd')"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('Deposit')" prop="deposit">
              <el-input
                v-model="form.deposit"
                 :placeholder="$t('enter-deposit')"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Rep-C-Fee')" prop="repair">
              <el-input
                v-model="form.repair"
                 :placeholder="$t('enter-fee')"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('Shr')" prop="shareRatio">
              <el-input
                style="width:180px"
                v-model="form.shareRatio"
                 :placeholder="$t('enter-shr')"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('rebate-Percentage')" prop="rebateRatio">
              <el-input
                style="width:180px"
                v-model="form.rebateRatio"
                 :placeholder="$t('enter-rebate')"
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item
              :label="$t('Baccarat-Rolling-Ratio-S-Chip')"
              prop="baccaratRollingRatioChip"
              label-width="250px"
            >
              <el-input
                style="width:60px"
                v-model="form.baccaratRollingRatioChip"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('Baccarat-Rolling-Ratio-S-Cash')"
              prop="baccaratRollingRatioCash"
              label-width="250px"
            >
              <el-input
                style="width:60px"
                v-model="form.baccaratRollingRatioCash"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item
              :label="$t('Baccarat-rolling-percentage-B-chip')"
              prop="baccaratRollingRatioChipTh"
              label-width="250px"
            >
              <el-input
                style="width:60px"
                v-model="form.baccaratRollingRatioChipTh"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('Baccarat-Rolling-Ratio-B-cash')"
              prop="baccaratRollingRatioCashTh"
              label-width="250px"
            >
              <el-input
                style="width:60px"
                v-model="form.baccaratRollingRatioCashTh"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item
              :label="$t('DT-Rolling-Ratio-S-Chip')"
              prop="dragonTigerRatioChip"
              label-width="220px"
            >
              <el-input
                style="width:60px"
                v-model="form.dragonTigerRatioChip"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('DT-Rolling-Ratio-S-Cash')"
              prop="dragonTigerRatioCash"
              label-width="220px"
            >
              <el-input
                style="width:60px"
                v-model="form.dragonTigerRatioCash"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item
              :label="$t('DT-Rolling-Ratio-B-chip')"
              prop="dragonTigerRatioChipTh"
              label-width="220px"
            >
              <el-input
                style="width:60px"
                v-model="form.dragonTigerRatioChipTh"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('DT-Rollingh-Ratio-B-cash')"
              prop="dragonTigerRatioCashTh"
              label-width="220px"
            >
              <el-input
                style="width:60px"
                v-model="form.dragonTigerRatioCashTh"
                placeholder=""
                oninput="if(isNaN(value)) { value = null } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+3)}"
              />%
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('is-cash-out')" prop="isCash">
              <el-select
                v-model="form.isCash"
                placeholder=""
                style="width:100px"
              >
                <el-option :label="$t('No')" :value="0"></el-option>
                <el-option :label="$t('Yes')" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('is-settle')"
              prop="isSettlement"
              label-width="110px"
            >
              <el-select
                v-model="form.isSettlement"
                placeholder=""
                style="width:100px"
              >
                <el-option :label="$t('No')" :value="0"></el-option>
                <el-option :label="$t('Yes')" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('is-remit')" prop="isOut">
              <el-select
                v-model="form.isOut"
                placeholder=""
                style="width:100px"
              >
                <el-option :label="$t('No')" :value="0"></el-option>
                <el-option :label="$t('Yes')" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('Whether-have-commission')"
              prop="isPump"
              label-width="150px"
            >
              <el-select
                v-model="form.isPump"
                placeholder=""
                style="width:100px"
              >
                <el-option :label="$t('No')" :value="0"></el-option>
                <el-option :label="$t('Yes')" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <el-form-item :label="$t('Staus')" prop="status">
              <el-select
                v-model="form.status"
                placeholder=""
                style="width:100px"
              >
                <el-option :label="$t('Normal')" :value="0"></el-option>
                <el-option :label="$t('Deactivated')" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('Int-card')"
              prop="isAdmin"
              label-width="150px"
            >
              <el-select
                v-model="form.isAdmin"
                placeholder=""
                style="width:100px"
              >
                <el-option :label="$t('No')" :value="0"></el-option>
                <el-option :label="$t('Yes')" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item :label="$t('Remarks')" prop="remark">
              <el-input
                type="textarea"
                :rows="7"
                :placeholder="$t('Please-enter-content')"
                v-model="form.remark"
                maxlength="100"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" @click="submitForm">{{ $t("OK") }}</el-button>
        <el-button @click="resetAddForm">{{ $t("Rst") }}</el-button>
      </div>
    </el-dialog>

    <!-- 用户详情 -->
    <el-dialog
      :title="$t('More-information')"
      :visible.sync="detailOpen"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="detailBox">
        <div class="list">
          <span>${{ $t("Deposit") }}</span
          ><span>{{ memlist.deposit ? memlist.deposit : "0" }}</span>
        </div>
        <div class="list">
          <span>฿{{ $t("Deposit") }}</span
          ><span>{{ memlist.depositTh ? memlist.depositTh : "0" }}</span>
        </div>
        <div class="list">
          <span>${{ $t("Rep-C-Fee") }}</span
          ><span>{{ memlist.repair ? memlist.repair : "0" }}</span>
        </div>
        <div class="list">
          <span>฿{{ $t("Rep-C-Fee") }}</span
          ><span>{{ memlist.repairTh ? memlist.repairTh : "0" }}</span>
        </div>
        <div class="list">
          <span>{{ $t("Shr") }}</span
          ><span>{{ memlist.shareRatio ? memlist.shareRatio : "0" }}%</span>
        </div>
        <div class="list">
          <span>{{ $t("rebate-Percentage") }}</span
          ><span>{{ memlist.rebateRatio ? memlist.rebateRatio : "0" }}%</span>
        </div>
        <div class="list">
          <span>{{ $t("Baccarat-Rolling-Ratio-S-Chip") }}</span
          ><span
            >{{
              memlist.baccaratRollingRatioChip
                ? memlist.baccaratRollingRatioChip
                : "0"
            }}%</span
          >
        </div>
        <div class="list">
          <span>{{ $t("Baccarat-rolling-percentage-B-chip") }}）</span
          ><span
            >{{
              memlist.baccaratRollingRatioChipTh
                ? memlist.baccaratRollingRatioChipTh
                : "0"
            }}%</span
          >
        </div>
        <div class="list">
          <span>{{ $t("Baccarat-Rolling-Ratio-S-Cash") }}）</span
          ><span
            >{{
              memlist.baccaratRollingRatioCash
                ? memlist.baccaratRollingRatioCash
                : "0"
            }}%</span
          >
        </div>
        <div class="list">
          <span>{{ $t("Baccarat-Rolling-Ratio-B-cash") }}</span
          ><span
            >{{
              memlist.baccaratRollingRatioCashTh
                ? memlist.baccaratRollingRatioCashTh
                : "0"
            }}%</span
          >
        </div>
        <div class="list">
          <span>{{ $t("DT-Rolling-Ratio-S-Chip") }}</span
          ><span
            >{{
              memlist.dragonTigerRatioChip ? memlist.dragonTigerRatioChip : "0"
            }}%</span
          >
        </div>
        <div class="list">
          <span>{{ $t("DT-Rolling-Ratio-B-chip") }}</span
          ><span
            >{{
              memlist.dragonTigerRatioChipTh
                ? memlist.dragonTigerRatioChipTh
                : "0"
            }}%</span
          >
        </div>
        <div class="list">
          <span>{{ $t("DT-Rolling-Ratio-S-Cash") }}</span
          ><span
            >{{
              memlist.dragonTigerRatioCash ? memlist.dragonTigerRatioCash : "0"
            }}%</span
          >
        </div>
        <div class="list">
          <span>{{ $t("DT-Rollingh-Ratio-B-cash") }}</span
          ><span
            >{{
              memlist.dragonTigerRatioCashTh
                ? memlist.dragonTigerRatioCashTh
                : "0"
            }}%</span
          >
        </div>
        <div class="list">
          <span>{{ $t("Whether-have-commission") }}</span
          ><span>{{
            memlist.isPump != null
              ? memlist.isPump == 0
                ? $t("No")
                : $t("Yes")
              : "-"
          }}</span>
        </div>
        <div class="list">
          <span>{{ $t("is-cash-out") }}</span
          ><span>{{
            memlist.isCash != null
              ? memlist.isCash == 0
                ? $t("No")
                : $t("Yes")
              : "-"
          }}</span>
        </div>
        <div class="list">
          <span>{{ $t("is-settle") }}</span
          ><span>{{
            memlist.isSettlement != null
              ? memlist.isSettlement == 0
                ? $t("No")
                : $t("Yes")
              : "-"
          }}</span>
        </div>
        <div class="list">
          <span>{{ $t("is-remit") }}</span
          ><span>{{
            memlist.isOut != null
              ? memlist.isOut == 0
                ? $t("No")
                : $t("Yes")
              : "-"
          }}</span>
        </div>
        <!-- <div class="list"><span>是否走账</span><span>{{memlist.isBill?(memlist.isBill==0?this.$t("No"):"是"):'-'}}</span></div> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMambers,
  listMambersInfo,
  addMambers,
  updateMambers,
  delMambers,
  changeUserStatus
} from "@/api/account/member";
import { listOdds } from "@/api/sys/odds";
import { getToken } from "@/utils/auth";

export default {
  name: "Member",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.form.password !== value) {
        callback(new Error(this.$t("Password-entered-twice-does-not-match")));
      } else {
        callback();
      }
    };
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
      userList: null,
      //会员详情
      memlist: {},
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      detailOpen: false,
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
      // 初始化的表单参数，用于重置时还原
      initForm: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        type: "card",
        value: "",
        isChild: "",
        status: ""
      },

      isshow: true,
      oddsList: [],
      count: {
        childCount: 0,
        depositCount: 0,
        depositCountTh: 0,
        parentCount: 0,
        repairCount: 0,
        repairCountTh: 0
      },
      openType: "" //add 新增卡号;addChild 新增子卡;edit 卡号修改
    };
  },
  computed: {
    rules() {
      return {
        card: [
          {
            required: true,
            message: this.$t("Card-No-cannot-be-empty"),
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: this.$t("user-name-cannot-be-empty"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: this.openType == "edit" ? false : true,
            message: this.$t("New-password-cannot-be-empty"),
            trigger: "blur"
          }
        ],
        rawPassword: [
          {
            required: this.openType == "edit" ? false : true,
            message: this.$t("Confirm-password-cannot-be-empty"),
            trigger: "blur"
          },
          { validator: this.equalToPassword, trigger: "blur" }
        ],
        deposit: [
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: this.$t("Please-enter-a-No-greater-than-0")
          }
        ],
        repair: [
          {
            pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
            message: this.$t("Please-enter-a-No-greater-than-0")
          }
        ],
        shareRatio: [
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        rebateRatio: [
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        baccaratRollingRatioChip: [
          {
            required: true,
            message: this.$t("Baccarat-Rolling-Ratio-S-chip-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        baccaratRollingRatioCash: [
          {
            required: true,
            message: this.$t("Baccarat-Rolling-Ratio-S-cash-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        dragonTigerRatioChip: [
          {
            required: true,
            message: this.$t("DT-Rolling-Ratio-S-chip-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        dragonTigerRatioCash: [
          {
            required: true,
            message: this.$t("DT-Rolling-Ratio-S-cash-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        baccaratRollingRatioChipTh: [
          {
            required: true,
            message: this.$t("Baccarat-Rolling-Ratio-B-chip-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        baccaratRollingRatioCashTh: [
          {
            required: true,
            message: this.$t("Baccarat-Rolling-Ratio-B-cash-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        dragonTigerRatioChipTh: [
          {
            required: true,
            message: this.$t("DT-Rolling-Ratio-B-chip-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ],
        dragonTigerRatioCashTh: [
          {
            required: true,
            message: this.$t("DT-Rolling-Ratio-B-cash-cannot-be-empty"),
            trigger: "blur"
          },
          {
            validator: this.perValidator,
            message: this.$t("Only-0-100-can-be-entered"),
            trigger: "blur"
          }
        ]
      };
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getOddsList();
  },
  methods: {
    equalToPassword(rule, value, callback) {
      if (this.form.password !== value) {
        callback(new Error(this.$t("Password-entered-twice-does-not-match")));
      } else {
        callback();
      }
    },
    perValidator(rule, value, callback) {
      // 百分比校验
      // 只能输入0-100
      if (value > 100 || value < 0) {
        callback(new Error(this.$t("Only-0-100-can-be-entered")));
      } else {
        callback();
      }
    },
    /** 查询用户列表 */
    getList() {
      console.log(this.queryParams);
      let type = this.queryParams.type;
      let value = this.queryParams.value;
      let createTime = "";
      let endTime = "";
      if (this.dateRange) {
        createTime = this.addDateRange(this.dateRange)[0];
        endTime = this.addDateRange(this.dateRange)[1];
      }

      let params = {
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize
      };
      if (value) {
        params[type] = value;
      } else {
        params = params;
      }
      params["isChild"] = this.queryParams.isChild == false ? 0 : 1;
      params["status"] = this.queryParams.status;
      params["beginTime"] = createTime;
      params["endTime"] = endTime;
      console.log(params);
      // this.loading = true;
      listMambers(params).then(response => {
        this.userList = response.list.rows;
        this.total = response.list.total;
        this.count = response.count ? response.count : this.count;
        this.loading = false;
      });
    },

    //查询会员详情
    getMemberInfo(id) {
      listMambersInfo({ id: id }).then(response => {
        this.memlist = response.data;
        // 将用户更多信息加进form里
        this.form = { ...this.form, ...response.data };
        // initForm用于重置时还原
        this.initForm = { ...this.form, ...response.data };
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    // 弹窗里的重置按钮
    resetAddForm() {
      // this.open = false;
      if (this.openType == "edit") {
        this.form = Object.assign({}, this.initForm);
        this.$refs.dialogForm.$forceUpdate();
      }
      if (this.openType == "add") {
        this.reset();
        this.addOdds();
      }
      if (this.openType == "addChild") {
        this.reset();
        this.addOdds();
      }
    },
    // 弹窗关闭时
    onDialogClose() {
      this.openType = "";
    },
    // 表单重置
    reset() {
      const newForm = {
        card: this.openType == "edit" ? this.form.card : "",
        name: "",
        sex: 0,
        phone: "",
        password: "",
        rawPassword: "",
        deposit: "",
        repair: "",
        shareRatio: "",
        rebateRatio: "",
        baccaratRollingRatioChip: "",
        baccaratRollingRatioCash: "",
        dragonTigerRatioChip: "",
        dragonTigerRatioCash: "",
        baccaratRollingRatioChipTh: "",
        baccaratRollingRatioCashTh: "",
        dragonTigerRatioChipTh: "",
        dragonTigerRatioCashTh: "",
        isCash: 1,
        isSettlement: 1,
        isOut: 1,
        isPump: 1,
        status: 0, //0 正常 1停用
        cardType: 0,
        // isBill:'',
        isAdmin: 0,
        remark: ""
      };
      // 将form部分重置为newForm
      this.form = { ...this.form, ...newForm };
      // if (this.openType != "edit") {
      //   // 不是修改卡号时，点击重置按钮需要清除卡号
      //   this.form.card = "";
      // }

      // this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.value = "";
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.openType = "add";
      this.isshow = true;
      this.isMain = false;
      this.title = this.$t("New-card-no");
      this.reset();
      this.addOdds();
      // 移除表单校验结果
      this.$refs.form && this.$refs.form.clearValidate();
    },
    /** 新增子卡按钮操作 */
    handleAddChild(parentCard) {
      this.open = true;
      this.openType = "addChild";
      this.isMain = true;
      this.isshow = true;
      this.title = this.$t("Add-new-sub");

      this.reset();
      // 将用户更多信息加进form里
      this.form["parentCard"] = parentCard;
      this.addOdds();
      // 移除表单校验结果
      this.$refs.form && this.$refs.form.clearValidate();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true;
      this.openType = "edit";
      this.isMain = false;
      this.isshow = true;
      this.title = this.$t("Card-Amendment");

      this.reset();
      this.form = Object.assign({}, row);
      // 将用户更多信息加进form里
      this.getMemberInfo(row.id);
      // 移除表单校验结果
      this.$refs.form && this.$refs.form.clearValidate();
    },
    // 更多信息
    handleMore(id) {
      this.loading = true;
      listMambersInfo({ id: id }).then(response => {
        this.memlist = response.data;
        this.loading = false;
        this.detailOpen = true;
      });
    },

    /** 提交按钮 */
    submitForm: function() {
      console.log(this.title);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.openType == "edit") {
            // 修改卡号
            updateMambers(this.form).then(response => {
              this.$modal.msgSuccess(this.$t("Change-successful"));
              this.open = false;
              this.getList();
            });
          } else if (this.openType == "addChild") {
            // 新增子卡卡号
            this.form["cardType"] = 1;
            addMambers(this.form).then(response => {
              this.$modal.msgSuccess(this.$t("Adding-card-number-successful"));
              this.open = false;
              this.getList();
            });
          } else {
            // 新增卡号
            addMambers(this.form).then(response => {
              this.$modal.msgSuccess(this.$t("Add-success"));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      console.log(userIds.toString());
      this.$modal
        .confirm(this.$t("Confirm-deletion-of-the-card-number"))
        .then(function() {
          return delMambers({ ids: userIds.toString() });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(this.$t("Deletion-successful"));
        })
        .catch(() => {});
    },
    getOddsList() {
      listOdds().then(response => {
        this.oddsList = response.data;
        // this.form.baccaratRollingRatioChip =
        //   response.data.baccaratRollingRatioChip;
        // this.form.baccaratRollingRatioCash =
        //   response.data.baccaratRollingRatioCash;
        // this.form.dragonTigerRatioChip = response.data.dragonTigerRatioChip;
        // this.form.dragonTigerRatioCash = response.data.dragonTigerRatioCash;
        // this.form.baccaratRollingRatioChipTh =
        //   response.data.baccaratRollingRatioChipTh;
        // this.form.baccaratRollingRatioCashTh =
        //   response.data.baccaratRollingRatioCashTh;
        // this.form.dragonTigerRatioChipTh = response.data.dragonTigerRatioChipTh;
        // this.form.dragonTigerRatioCashTh = response.data.dragonTigerRatioCashTh;
      });
    },
    addOdds() {
      if (this.oddsList) {
        this.form.baccaratRollingRatioChip = this.oddsList.baccaratRollingRatioChip;
        this.form.baccaratRollingRatioCash = this.oddsList.baccaratRollingRatioCash;
        this.form.dragonTigerRatioChip = this.oddsList.dragonTigerRatioChip;
        this.form.dragonTigerRatioCash = this.oddsList.dragonTigerRatioCash;
        this.form.baccaratRollingRatioChipTh = this.oddsList.baccaratRollingRatioChipTh;
        this.form.baccaratRollingRatioCashTh = this.oddsList.baccaratRollingRatioCashTh;
        this.form.dragonTigerRatioChipTh = this.oddsList.dragonTigerRatioChipTh;
        this.form.dragonTigerRatioCashTh = this.oddsList.dragonTigerRatioCashTh;
        // initForm用于重置时还原
        this.initForm = Object.assign({}, this.form);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
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
.member-management {
  .count-item-box {
    padding-left: 100px;
    margin-top: 20px;
    color: #606266;

    .count-item {
      display: inline-block;
      width: 150px;
    }
  }

  .operation-column {
    .cell {
      text-align: left;
    }
  }
}
</style>
