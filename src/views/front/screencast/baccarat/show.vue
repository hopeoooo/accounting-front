<template>
  <div class="app-container bjl_show">
      <div class="table_box_box">
       <span>{{$t('T-No')}}</span>   
       <el-select v-model="tableId" @change="valChange(tableId)" style="width:150px"  :placeholder="$t('bet.choose')">
          <el-option
            v-for="item in options"
            :key="item.tableId"
            :label="item.tableId"
            :value="item.tableId">
          </el-option>
        </el-select>
        <el-button class="loginout" type="primary" plain @click="screencast">{{$t('bet.fullScreen')}}</el-button>
      </div>

     <el-table v-loading="loading" class="betBox" stripe="" height="920px" :data="betList"  border >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column :label="$t('bet.chooseStyle')" align="center" key="type" prop="type" width="120px" class="name">
             <template slot-scope="scope" >
                <span style="font-size: 20px;" v-if="scope.row.type==1">${{$t('bet.cash')}}</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==0">${{$t('bet.chip')}}</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==3">฿{{$t('bet.cash')}}</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==2">฿{{$t('bet.chip')}}</span>
                <span style="font-size: 20px;" v-else>-</span>
                <!-- {{scope.row.type==0?'{{$t('bet.cash')}}':(scope.row.type==1?'{{$t('bet.chip')}}':'-')}} -->
              </template>
          </el-table-column>
          <el-table-column :label="$t('Card-number')" align="center" key="card" prop="card"  width="185px"></el-table-column>
           <el-table-column :label="$t('bet.z')" align="center" key="card1" prop="card1"  ></el-table-column>
           <el-table-column :label="$t('bet.x')" align="center" key="card2" prop="card2"  ></el-table-column>
           <el-table-column :label="$t('bet.h')" align="center" key="card3" prop="card3"  ></el-table-column>
           <el-table-column :label="$t('bet.zd')" align="center" key="card4" prop="card4"  ></el-table-column>
           <el-table-column :label="$t('bet.xd')" align="center" key="card5" prop="card5"  ></el-table-column>
           <el-table-column :label="$t('bet.zIns')" align="center" key="card6" prop="card6"  ></el-table-column>
           <el-table-column :label="$t('bet.xIns')" align="center" key="card7" prop="card7"  ></el-table-column>
           <el-table-column :label="$t('bet.tIns')" align="center" key="card10" prop="card10"  ></el-table-column>
           <el-table-column :label="$t('bet.big')" align="center" key="card8" prop="card8"  ></el-table-column>
          <el-table-column :label="$t('bet.small')" align="center" key="card9" prop="card9"  ></el-table-column>
          <el-table-column :label="$t('bet.lucky')" align="center" key="card11" prop="card11"  ></el-table-column>
          <el-table-column :label="$t('bet.payOut')" align="center"   prop="payout"  />
             
         
     </el-table>

      <!-- {{$t('bet.fullScreen')}} -->
    <el-dialog title="" :visible.sync="openLUdan" width="100%" top="0" class="quanping_dialog" append-to-body :close-on-click-modal="false">
          <div class="table_box_box">
       <span>{{$t('T-No')}}</span>   
       <el-select v-model="tableId" @change="valChange(tableId)" style="width:100px"  :placeholder="$t('bet.choose')">
          <el-option
            v-for="item in options"
            :key="item.tableId"
            :label="item.tableId"
            :value="item.tableId">
          </el-option>
        </el-select>
      </div>

     <el-table v-loading="loading" class="betBox" stripe="" height="93.6vh" :data="betList"  border >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column :label="$t('bet.chooseStyle')" align="center" key="type" prop="type" width="155px" >
             <template slot-scope="scope" style="font-size: 20px;">
                <span style="font-size: 20px;" v-if="scope.row.type==1">${{$t('bet.cash')}}</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==0">${{$t('bet.chip')}}</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==3">฿{{$t('bet.cash')}}</span>
                <span style="font-size: 20px;" v-else-if="scope.row.type==2">฿{{$t('bet.chip')}}</span>
                <span style="font-size: 20px;" v-else>-</span>
              </template>
          </el-table-column>
          <el-table-column :label="$t('Card-number')" align="center" key="card" prop="card"  width="200px"></el-table-column>
           <el-table-column :label="$t('bet.z')" align="center" key="card1" prop="card1"  ></el-table-column>
           <el-table-column :label="$t('bet.x')" align="center" key="card2" prop="card2"  ></el-table-column>
           <el-table-column :label="$t('bet.h')" align="center" key="card3" prop="card3"  ></el-table-column>
           <el-table-column :label="$t('bet.zd')" align="center" key="card4" prop="card4"  ></el-table-column>
           <el-table-column :label="$t('bet.xd')" align="center" key="card5" prop="card5"  ></el-table-column>
           <el-table-column :label="$t('bet.zIns')" align="center" key="card6" prop="card6"  ></el-table-column>
           <el-table-column :label="$t('bet.xIns')" align="center" key="card7" prop="card7"  ></el-table-column>
           <el-table-column :label="$t('bet.tIns')" align="center" key="card10" prop="card10"  ></el-table-column>
           <el-table-column :label="$t('bet.big')" align="center" key="card8" prop="card8"  ></el-table-column>
          <el-table-column :label="$t('bet.small')" align="center" key="card9" prop="card9"  ></el-table-column>
          <el-table-column :label="$t('bet.lucky')" align="center" key="card11" prop="card11"  ></el-table-column>
          <el-table-column :label="$t('bet.payOut')" align="center"   prop="payout"  />
             
         
          </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { baccaratGet} from "@/api/bet/baccarat";
import {tableIdComboBoxInfo} from "@/api/sys/table";
export default {
  name: "Screencastbaccarat",
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
        gameId:1,
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
       baccaratGet({'tableId':id}).then(res => {
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
.bjl_show{


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
          
            &:nth-child(3), &:nth-child(6), &:nth-child(8), &:nth-child(11){
              background: red;
              color: #fff;
            }
            &:nth-child(4), &:nth-child(7), &:nth-child(9),&:nth-child(12){
              background: blue;
              color: #fff;
            }
            &:nth-child(5), &:nth-child(10){
              background: green;
              color: #fff;
            }
            &:nth-child(13){
              background:#ffc833;
              color: #fff;}
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
          
            &:nth-child(3), &:nth-child(6), &:nth-child(8), &:nth-child(11){
              background: red;
              color: #fff;
            }
            &:nth-child(4), &:nth-child(7), &:nth-child(9),&:nth-child(12){
              background: blue;
              color: #fff;
            }
            &:nth-child(5), &:nth-child(10){
              background: green;
              color: #fff;
            }
            &:nth-child(13){
            background:#ffc833;
            color: #fff;}
          }
        }
      }
    }
  }
</style>
