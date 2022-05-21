/*
 * @Author:
 * @Date: 2022-04-30 10:22:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-05-21 16:42:57
 * @Description: file content
 */
import Cookies from "js-cookie";

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true,
    withoutAnimation: false,
    hide: false
  },
  device: "desktop",
  size: Cookies.get("size") || "medium",
  currentLanguage:localStorage.getItem("USER_LANG") ||  "en" //当前语言
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    if (state.sidebar.hide) {
      return false;
    }
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_SIZE: (state, size) => {
    state.size = size;
    Cookies.set("size", size);
  },
  SET_SIDEBAR_HIDE: (state, status) => {
    state.sidebar.hide = status;
  },
  /** 设置语言 */
  SET_LANGUAGE: (state, language) => {
    state.currentLanguage = language;
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  setSize({ commit }, size) {
    commit("SET_SIZE", size);
  },
  toggleSideBarHide({ commit }, status) {
    commit("SET_SIDEBAR_HIDE", status);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
