<template>
  <el-form-item :label="label" class="TiemBox">
    <el-date-picker
      :type="alltime ? 'datetimerange' : 'daterange'"
      :format="alltime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
      :editable="false"
      v-model="GetDateTime"
      style="margin-right: 10px"
      value-format="yyyy-MM-dd HH:mm:ss"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      :default-time="['00:00:00', '23:59:59']"
      :clearable="false"
      @change="setTimedata"
      :picker-options="pickerOptions"
      clearable
    ></el-date-picker>
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
</template>

<script>
import moment from "moment";
export default {
  name: "Tabletime",
  data() {
    return {
      GetDateTime: [],
      Datatype:
        this.query.startDate &&
        this.query.endDate &&
        this.query.startDate != "" &&
        this.query.endDate != ""
          ? 0
          : 999,
      TimeList: [
        {
          name: "今日",
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
          name: "昨日",
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
        },
        {
          name: "本周",
          val: [
            moment()
              .week(moment().week())
              .startOf("week")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment()
              .week(moment().week())
              .endOf("week")
              .format("YYYY-MM-DD HH:mm:ss")
          ]
        },
        {
          name: "上周",
          val: [
            moment()
              .week(moment().week() - 1)
              .startOf("week")
              .add(1, "days")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment()
              .week(moment().week() - 1)
              .endOf("week")
              .add(1, "days")
              .format("YYYY-MM-DD HH:mm:ss")
          ]
        },
        {
          name: "本月",
          val: [
            moment()
              .month(moment().month())
              .startOf("month")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment()
              .month(moment().month())
              .endOf("month")
              .format("YYYY-MM-DD HH:mm:ss")
          ]
        },
        {
          name: "上月",
          val: [
            moment()
              .month(moment().month() - 1)
              .startOf("month")
              .format("YYYY-MM-DD HH:mm:ss"),
            moment()
              .month(moment().month() - 1)
              .endOf("month")
              .format("YYYY-MM-DD HH:mm:ss")
          ]
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() >
            new Date(
              new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            )
          );
        }
      }
    };
  },
  props: {
    query: {
      type: Object,
      default: {}
    },
    label: {
      type: String,
      default: ""
    },
    alltime: {
      type: Boolean,
      default: false
    },
    quickbtn: {
      type: Boolean,
      default: true
    },
    fetchData: {
      type: Function,
      default: () => () => {}
    }
  },
  created() {
    this.GetDateTime = [
      this.query.startDate ? this.query.startDate : "",
      this.query.endDate ? this.query.endDate : ""
    ];
  },
  methods: {
    /**
     * @description: 设置时间
     * @return *
     */
    setTimedata(Date) {
      if (Date) {
        this.query.startDate = Date[0];
        this.query.endDate = Date[1];
         this.Datatype = null;
        for (let index = 0; index < this.TimeList.length; index++) {
          const element = this.TimeList[index];
          if (Date[0] == element.val[0] && Date[1] == element.val[1]) {
            this.Datatype = index;
            break;
          }else{

          }
        }

      } else {
        this.query.startDate = "";
        this.query.endDate = "";
        this.Datatype = null;
      }
    },
    /**
     * @description: 阶段日期
     * @param {time} 天数
     * @return *
     */
    TimeCheck(index, time) {
      this.Datatype = index;
      this.$set(this.query, "startDate", time[0]);
      this.$set(this.query, "endDate", time[1]);
      this.GetDateTime = [time[0], time[1]];
    }
  }
};
</script>
