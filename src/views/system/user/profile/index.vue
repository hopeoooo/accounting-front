<!--
 * @Author:
 * @Date: 2022-05-11 17:03:06
 * @LastEditors:
 * @LastEditTime: 2022-05-21 16:51:37
 * @Description: file content
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24"></el-col>
      <el-col :span="12" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <!-- <span>个人信息</span> -->
            <span>{{$t("persino-info")}}</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />{{this.$t('User-name')}}
                <div class="pull-right">{{ user.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />{{this.$t('Mobile-P-No.')}}
                <div class="pull-right">{{ user.phonenumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="peoples" />{{this.$t('DOB')}}
                <div class="pull-right">{{ user.brithday }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />{{this.$t('Date-created')}}
                <div class="pull-right">{{ user.joinTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <!-- <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getUserProfile } from "@/api/system/user";
import { userinfo,avatar } from "@/api/account/user";

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      userinfo().then(response => {
        this.user = response.data;
        this.roleGroup = response.roleGroup;
        this.postGroup = response.postGroup;
      });
    }
  }
};
</script>
