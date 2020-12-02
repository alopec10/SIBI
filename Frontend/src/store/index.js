import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logged: false,
    emailUsuario: "",
    IP: "http://localhost:3000",
    ok: false,
    idUser: null,
    nombre: "",
  },
  plugins: [createPersistedState()],
  mutations: {
    logearse(state) {
      state.logged = true;
    },
    deslogearse(state) {
      state.logged = false;
      state.emailUsuario = "";
      state.ok = false;
      state.nombre = "";
      state.idUser = null;
    },
    setEmail(state, msg) {
      state.emailUsuario = msg;
    },
    setIdUser(state, msg) {
      state.idUser = msg;
    },
    setOk(state) {
      state.ok = true;
    },
    setNombre(state, nombre) {
      state.nombre = nombre;
    },
  },
  actions: {},
  modules: {},
});
