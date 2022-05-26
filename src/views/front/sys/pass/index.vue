<!--
 * @Author:
 * @Date: 2022-05-02 22:14:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-26 15:48:56
 * @Description: file content
-->
<template>
  <el-form
    style="max-width: 500px;margin:20% auto"
    ref="form"
    :model="user"
    :rules="rules"
    label-width="150px"
  >
    <el-form-item :label="$t('Old-password')" prop="oldPassword">
      <el-input
        :type="flag == false ? 'password' : 'text'"
        v-model="user.oldPassword"
        :placeholder="$t('Enter-old-password')"
        autocomplete="off"
      >
        <i
          slot="suffix"
          :class="
            flag == false
              ? 'el-input__icon icofont-eye-blocked icofont-2x'
              : 'el-input__icon icofont-eye icofont-2x '
          "
          @click="flag = !flag"
        ></i>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('New-password')" prop="newPassword">
      <!-- <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/> -->
      <el-input
        :type="flag1 == false ? 'password' : 'text'"
        v-model="user.newPassword"
        :placeholder="$t('Enter-new-password')"
        autocomplete="off"
      >
        <i
          slot="suffix"
          :class="
            flag1 == false
              ? 'el-input__icon icofont-eye-blocked icofont-2x'
              : 'el-input__icon icofont-eye icofont-2x '
          "
          @click="flag1 = !flag1"
        ></i>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('Confirm-Password')" prop="confirmPassword">
      <!-- <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" show-password/> -->
      <el-input
        :type="flag2 == false ? 'password' : 'text'"
        v-model="user.confirmPassword"
        :placeholder="$t('Re-enter-new-password')"
        autocomplete="off"
      >
        <i
          slot="suffix"
          :class="
            flag2 == false
              ? 'el-input__icon icofont-eye-blocked icofont-2x'
              : 'el-input__icon icofont-eye icofont-2x '
          "
          @click="flag2 = !flag2"
        ></i>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">{{
        $t("OK")
      }}</el-button>
      <el-button type="danger" size="mini" @click="close">{{
        $t("Rst")
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";

export default {
  name: "Pass",
  data() {
    return {
      flag: false,
      flag1: false,
      flag2: false,
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      }
    };
  },
  computed: {
    rules() {
      return {
        oldPassword: [
          {
            required: true,
            message: this.$t("Old-password-cannot-be-empty"),
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: this.$t("New-password-cannot-be-empty"),
            trigger: "blur"
          },
          {
            min: 6,
            max: 20,
            message: this.$t("6-to-20-characters-in-length"),
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            message: this.$t("Confirm-password-cannot-be-empty"),
            trigger: "blur"
          },
          { required: true, validator: this.equalToPassword, trigger: "blur" }
        ]
      };
    }
  },
  methods: {
    equalToPassword(rule, value, callback) {
      if (this.user.newPassword !== value) {
        callback(new Error(this.$t("Password-entered-twice-does-not-match")));
      } else {
        callback();
      }
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(
            response => {
              this.$modal.msgSuccess(this.$t("Change-successful"));
            }
          );
        }
      });
    },
    close() {
      this.$refs["form"].resetFields();
    }
  }
};
</script>
