
/**
 * 注单管理相关的状态
 */
 const getDefaultState = () => {
  return {
    baccaratList:[], //百家乐表格数据
    baccaratSum:{},//百家乐计算数据
  };
};

const state = getDefaultState();

const mutations = {
  setBaccaratList: (state, data) => {
      state.baccaratList = data;
  },
  setBaccaratSum: (state, data) => {
    state.baccaratSum = data;
  },
  
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
