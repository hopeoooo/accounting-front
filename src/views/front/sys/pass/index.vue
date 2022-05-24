<!--
 * @Author:
 * @Date: 2022-05-02 22:14:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-12 17:30:57
 * @Description: file content
-->
<template>

  <el-form style="max-width: 500px;margin:20% auto" ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
       <el-input :type="flag == false ? 'password' : 'text'" v-model="user.oldPassword" placeholder="输入旧密码" autocomplete="off">
           <i slot="suffix" :class="flag == false ? 'el-input__icon icofont-eye-blocked icofont-2x' : 'el-input__icon icofont-eye icofont-2x '" @click="flag=!flag"></i>
       </el-input>

    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <!-- <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/> -->
       <el-input :type="flag1 == false ? 'password' : 'text'" v-model="user.newPassword" placeholder="输入新密码" autocomplete="off">
           <i slot="suffix" :class="flag1 == false ? 'el-input__icon icofont-eye-blocked icofont-2x' : 'el-input__icon icofont-eye icofont-2x '" @click="flag1=!flag1"></i>
       </el-input>
    </el-form-item>
    <el-form-item  :label="$t('Confirm-Password')"  prop="confirmPassword">
      <!-- <el-input v-model="user.confirmPassword" placeholder="请确认密码" type="password" show-password/> -->
       <el-input :type="flag2 == false ? 'password' : 'text'" v-model="user.confirmPassword" placeholder="再次输入新密码" autocomplete="off">
           <i slot="suffix" :class="flag2 == false ? 'el-input__icon icofont-eye-blocked icofont-2x' : 'el-input__icon icofont-eye icofont-2x '" @click="flag2=!flag2"></i>
       </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="mini" @click="submit">确定</el-button>
      <el-button type="danger" size="mini" @click="close">{{$t("Rst")}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";

export default {
  name:"Pass",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error( this.$t("Password-entered-twice-does-not-match")));
      } else {
        callback();
      }
    };
    return {
      flag:false,
      flag1:false,
      flag2:false,
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
       this.$refs["form"].resetFields();
    }
  }
};
</script>
