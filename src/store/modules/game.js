
/**
 * 注单管理相关的状态
 */
 const getDefaultState = () => {
  return {
    baccaratList:[], //百家乐表格数据
    baccaratSum:{},//百家乐计算数据
    lhList:[], //龙虎表格数据
    lhSum:{},//龙虎计算数据
    sgList:[], //三公表格数据
    sgSum:{},//三公计算数据
    nnList:[], //牛牛表格数据
    nnSum:{},//牛牛计算数据
    ttzList:[], //推筒子表格数据
    ttzSum:{},//推筒子计算数据
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
  setLhList: (state, data) => {
    state.lhList = data;
  },
  setLhSum: (state, data) => {
    state.lhSum = data;
  },
  setSgList: (state, data) => {
    state.sgList = data;
  },
  setSgSum: (state, data) => {
    state.sgSum = data;
  },
  setNnList: (state, data) => {
    state.nnList = data;
  },
  setNnSum: (state, data) => {
    state.nnSum = data;
  },
  setTtzList: (state, data) => {
    state.ttzList = data;
  },
  setTtzSum: (state, data) => {
    state.ttzSum = data;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
