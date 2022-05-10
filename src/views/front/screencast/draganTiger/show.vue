<template>
  <div class="app-container">
      <div><h1>龙虎</h1>
       <span>桌台编号</span>
       <el-select v-model="tableId" @change="valChange(tableId)" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.tableId"
          :label="item.tableId"
          :value="item.tableId">
        </el-option>
      </el-select>
       </div>

     <el-table v-loading="loading" class="betBox" height="800px" :data="betList"  border >
          <!-- <el-table-column fixed type="selection" key="id" prop="id" width="50" align="center" /> -->
          <el-table-column label="选择币种" align="center" fixed key="type" prop="type" width="155px">
              <template slot-scope="scope">
                <span v-if="scope.row.type==0">$现金</span>
                <span v-else-if="scope.row.type==1">$筹码</span>
                <span v-else-if="scope.row.type==2">฿现金</span>
                <span v-else-if="scope.row.type==3">฿筹码</span>
                <span v-else>-</span>
                <!-- {{scope.row.type==0?'现金':(scope.row.type==1?'筹码':'-')}} -->
              </template>
          </el-table-column>
          <el-table-column label="卡号" align="center" key="card" prop="card"  width="200px"></el-table-column>
           <el-table-column label="龙" align="center" key="card1" prop="card1"  ></el-table-column>
           <el-table-column label="虎" align="center" key="card2" prop="card2"  ></el-table-column>
           <el-table-column label="和" align="center" key="card3" prop="card3"  ></el-table-column>
           
          <el-table-column label="现有筹码" align="center" key="chip" prop="chip"  fixed="right" />
          <el-table-column label="赔码数" align="center"   prop="payout"  fixed="right"/>
             
         
        </el-table>
  </div>
</template>

<script>
import { baccaratGet} from "@/api/bet/baccarat";
import {listTable} from "@/api/sys/table";
export default {
  name: "ShowLh",
  data() {

    return {
      // 遮罩层
      loading: true,
      isVisibles:false,
      options:'',
      timer:'',
      tableId:'',
      // 选中数组
      queryParams: {
        gameId:2,
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
	}, 3000);
  },
  destroyed(){
    clearInterval(this.timer)
  },
  methods: {
    // 轮循


    valChange(id){
      this.getTableInfo(id)
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listTable(this.queryParams).then(response => {
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
  .el-card__body{
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
        min-width: 60px;
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
    .f1{
      display: flex;
      flex-direction: column;
      text-align: left;
      span{
        line-height: 50px;
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
  .el-input--medium .el-input__inner{
    line-height: 25px;
    height: 25px;
  }
  .el-table__header-wrapper{
    thead{
      th{
        &:nth-child(3), &:nth-child(6), &:nth-child(8), &:nth-child(10){
          background: red;
          color: #fff;
        }
        &:nth-child(4), &:nth-child(7), &:nth-child(9), &:nth-child(11){
          background: blue;
          color: #fff;
        }
        &:nth-child(5){
          background: green;
          color: #fff;
        }
      }
    }
  }
}
.table-info-red td:nth-child(1){
  position: relative;
  &::after{
    content: '请选择币种';
     position: absolute;
    bottom: -5px;
    left: 10px;
    color: red;
    font-size: 12px;
    z-index: 1;
  }
}
.table-info-red1 td:nth-child(2){
  position: relative;
  &::after{
    content: '请填写卡号';
    position: absolute;
    bottom: -5px;
    left: 10px;
    color: red;
    font-size: 12px;
    z-index: 1;
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
</style>
