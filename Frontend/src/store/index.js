import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logged: false,
    emailUsuario: '',
    IP: 'http://localhost:3000',
    ok: false,
    nombre: ''
  },
  plugins: [createPersistedState()],
  mutations: {
    logearse(state){
      state.logged = true
    },
    deslogearse(state){
      state.logged = false
      state.emailUsuario = ''
      state.ok = false
      state.nombre = ''
    },
    setEmail(state, msg){
      state.emailUsuario = msg
    },
    setOk(state){
      state.ok=true
    },
    setNombre(state, nombre){
      state.nombre = nombre
    }
  },
  actions: {
  },
  modules: {
  }
})
