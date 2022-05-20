<template>
  <div class="app-container push_show">
      <div>
       <span>桌台编号</span>
       <el-select v-model="tableId" @change="valChange(tableId)"  style="width:100px" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.tableId"
          :label="item.tableId"
          :value="item.tableId">
        </el-option>
      </el-select>
      <el-button class="loginout" type="primary" plain @click="screencast">全屏</el-button>
       </div>

     <el-table v-loading="loading" class="betBox" height="920px" :data="betList"  border >
          <el-table-column label="选择币种" align="center"  key="type" prop="type" width="155px">
              <template slot-scope="scope">
                <span style="font-size: 20px;" v-if="scope.row.type==1">$现金</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==0">$筹码</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==3">฿现金</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==2">฿筹码</span>
                <span style="font-size: 20px;" v-else>-</span>
              </template>
          </el-table-column>
          <el-table-column label="卡号" align="center" key="card" prop="card"  width="200px"></el-table-column>
          <el-table-column label="输" align="center" key="lose" prop="lose"  ></el-table-column>
          <el-table-column label="赢" align="center" key="win" prop="win"  ></el-table-column>
          <el-table-column label="赔码数" align="center"   prop="payout" />   
      </el-table>
        <!-- 全屏 -->
    <el-dialog title="" :visible.sync="openLUdan" width="100%" top="0" class="quanping_dialog" append-to-body :close-on-click-modal="false">
         <div>
       <span>桌台编号</span>
       <el-select v-model="tableId" @change="valChange(tableId)"  style="width:100px" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.tableId"
          :label="item.tableId"
          :value="item.tableId">
        </el-option>
      </el-select>
      
       </div>

     <el-table v-loading="loading" class="betBox" height="920px" :data="betList"  border >
          <el-table-column label="选择币种" align="center"  key="type" prop="type" width="155px">
              <template slot-scope="scope">
                <span style="font-size: 20px;" v-if="scope.row.type==1">$现金</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==0">$筹码</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==3">฿现金</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==2">฿筹码</span>
                <span style="font-size: 20px;" v-else>-</span>
              </template>
          </el-table-column>
          <el-table-column label="卡号" align="center" key="card" prop="card"  width="200px"></el-table-column>
          <el-table-column label="输" align="center" key="lose" prop="lose"  ></el-table-column>
          <el-table-column label="赢" align="center" key="win" prop="win"  ></el-table-column>
          <el-table-column label="赔码数" align="center"   prop="payout" />   
      </el-table>
    </el-dialog>  
  </div>
</template>

<script>
import { pusherGet} from "@/api/bet/pusher";
import {tableIdComboBoxInfo} from "@/api/sys/table";
export default {
  name: "Screencastpusher",
  data() {

    return {
      // 遮罩层
      loading: true,
      isVisibles:false,
       openLUdan:false,
      options:'',
      timer:'',
      tableId:'',
      // 选中数组
      queryParams: {
        gameId:5,
        pageNum: 1,
        pageSize: 10000
      },
  

      betList:[
        {id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7},{id:8},{id:9},{id:10},
        {id:11},{id:12},{id:13},{id:14},{id:15},{id:16},{id:17},{id:18},{id:19},{id:20},
        {id:21},{id:22},{id:23},{id:24},{id:25},{id:26},{id:27},{id:28},{id:29},{id:30},
      ],
   
      // userName:'',
      tableInfo:'', //桌台信息
      iskaipai:true,
    
   
     
    };
  },
  components:{},
  watch: {
    // 根据名称筛选部门树

  },

  created() {
    this. getList()
    this.getTableInfo()
  },
  computed:{
    userName(){
      return this.$store.state.user.name
    },
   
  },
   mounted(){
	// 轮循
	this.timer = window.setInterval(() => {
		setTimeout(() => {
		   	this.getTableInfo(this.tableId) //调用接口的方法
		  	
		 }, 1)
	}, 1000);
  },
  destroyed(){
    clearInterval(this.timer)
  },
  methods: {
     screencast(){
      this.openLUdan=true
    },
    // 轮循
    valChange(id){
      this.getTableInfo(id)
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      tableIdComboBoxInfo(this.queryParams).then(response => {
        this.options = response.rows;
        this.loading = false;
      });
    },
    //桌台信息
    getTableInfo(id){
       pusherGet({'tableId':id}).then(res => {
         if(res.data.json)
          this.betList = res.data.json;
          this.loading = false;
        }
      );
    },



  }

  

};
</script>
<style lang="scss" >
.push_show{
    .detailBox{
      border: 1px solid #bcbcbc;
      .list{
        border-bottom: 1px solid #bcbcbc;
        span{
          display: inline-block;
          text-align: center;
          width: 49%;
          &:nth-child(1){
            border-right: 1px solid #bcbcbc;
            width: 50%;
          }
        }
      }
    }
    .el-table.table2 {
      .el-table__header-wrapper,.el-table__body-wrapper{display: none;}
    }
    .box-card-box{
      margin-bottom: 15px;
      font-size: 18px;  .el-card__body{
        display: flex;
        flex-direction: column;
        button{
          width: 80%;
          height: 80px;
          margin: 10px auto;
        }
        .loginout{
          height: 60px;
        }
        ul{
          padding: 0;
        text-align: left;
          li{
            list-style: none;
            display: inline-block;
            min-width: 100px;
            margin: 0 10px;
            line-height: 45px;
          }
        }
      }
      .ludanbox{
        position: relative;
          .ludanbg{
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #919191;
            font-size: 0;
            box-sizing: border-box;
            position: relative;
            .list{
              flex-basis: 1/12*100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-right: #919191 1px solid;
              font-size: 0;
              box-sizing: border-box;
              &:last-child{
                border: 0;
                // border-left: #919191 1px solid;
              }
              .list_p{
                flex-basis: 1/6*100%;
                width: 100%;
                height: 0;
                padding-bottom: 100%;
                box-sizing: border-box;
                border-bottom: #919191 1px solid;
                &:last-child{
                  border: 0;
                  // border-top: #919191 1px solid;
                }
                position: relative;
                i{
                position: absolute;
                font-size: 16px;
                color: #919191;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-style: normal;
                }
              }
            }
          }
        
      }
      

    }
    .box-card-box-list{
      .el-card__body{
        display: flex;
        justify-content: space-around;
        align-items: center;
        .el-row{
          .el-col{
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap:wrap;
            &.control {
              justify-content:  flex-start;
            }
          }
        }
    
        .btn{
          padding: 10px 30px;
          background: #919191;
          border-radius: 6px;
          color: #fff;
          cursor: pointer;
        }

        .checked{
          display: flex;
          .el-checkbox-button__inner,.el-radio-button__inner{
            min-width: 80px;
            height: 40px;
            line-height: 40px;
            background: #919191;
            border-radius: 6px;
            color: #fff;
            margin: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .red{
            .el-checkbox-button__inner,.el-radio-button__inner{
              background: red;
              opacity: .6;
            }
          }
          .blue{
            // background: blue;
            .el-checkbox-button__inner,.el-radio-button__inner{
              background: blue;
              opacity: .6;
            }
          }
          .green{
            // background: green;
            .el-checkbox-button__inner,.el-radio-button__inner{
              background: green;
              opacity: .6;
            }
          }
          .is-active,.is-checked{
            .el-checkbox-button__inner,.el-radio-button__inner{
              opacity: 1;
              font-size: 20px;
              border: 0;
              font-weight: bold;
            }
          }
        }
      }

    }
    .betBox {
      font-size: 25px;
      font-weight:bold ;
     
      .el-input--medium .el-input__inner{
        line-height: 35px;
        height: 35px;
      }
      .el-table__header-wrapper th,  .el-table__fixed-header-wrapper th{
          font-size: 22px;
      }
      .el-table__header-wrapper{
      
        thead{
          th{
          
            &:nth-child(3){
              background: red;
              color: #fff;
            }
            &:nth-child(4){
              background: blue;
              color: #fff;
            }
           
          }
        }
      }
    }

    .table-info-red td,.table-info-red1 td{
      // background: rgb(199, 135, 135);
    }
    .ludanBox_dialog{
        .el-form-item{
          .el-radio-group,.el-checkbox-group{
            display:  flex;
            justify-content: center;
            width: 100%;
            .el-checkbox-button__inner,.el-radio-button__inner{
            min-width: 80px;
            height: 40px;
            line-height: 40px;
            background: #919191;
            border-radius: 6px;
            color: #fff;
            margin: 0 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .red{
            .el-checkbox-button__inner,.el-radio-button__inner{
              background: red;
              opacity: .6;
            }
          }
          .blue{
            // background: blue;
            .el-checkbox-button__inner,.el-radio-button__inner{
              background: blue;
              opacity: .6;
            }
          }
          .green{
            // background: green;
            .el-checkbox-button__inner,.el-radio-button__inner{
              background: green;
              opacity: .6;
            }
          }
          .is-active,.is-checked{
            .el-checkbox-button__inner,.el-radio-button__inner{
              opacity: 1;
              font-size: 20px;
              border: 0;
              font-weight: bold;
            }
          }
          }
        }
      }
 
}  
 .quanping_dialog{
    .el-dialog{
      margin-top: 0 !important;
      .el-dialog__body{
        padding-top: 0;
      }
      .el-dialog__header{
        padding: 0;
        .el-dialog__headerbtn{
          top: 10px;
        }
        }
    }
      .betBox {
        font-size: 25px;
        font-weight:bold ;
       
      .el-input--medium .el-input__inner{
        line-height: 35px;
        height: 35px;
      }
      .el-table__header-wrapper th,  .el-table__fixed-header-wrapper th{
          font-size: 22px;
      }
      .el-table__header-wrapper{
      
        thead{
          th{
          
            &:nth-child(3){
              background: red;
              color: #fff;
            }
            &:nth-child(4){
              background: blue;
              color: #fff;
            }
           
          }
        }
      }
    }
  }
</style>