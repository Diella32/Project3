import { createStore } from "vuex";
// import Utils from "./config/utils";
import Utils from "../config/utils";

// "./config/utils";
// C:\xampp\htdocs\s.engrIV\Project3-Frontend\src\config\utils.js
// Vue.use(Vuex);

const user = Utils.getStore("user");

const store = createStore({
  state: {
    loginUser: user,
  },
  mutations: {
    setLoginUser(state, user) {
      state.loginUser = user;
      Utils.setStore("user", user);
    },
  },
  actions: {},
  getters: {
    getLoginUserInfo(state) {
      return state.loginUser;
    },
  },
});

export default store;
