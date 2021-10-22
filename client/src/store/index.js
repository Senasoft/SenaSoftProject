import { createStore } from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

export default createStore({
  state: {
    token: null,
    error: null,
    users: [],
    userLogin: null,
    loading: false,
    histories: [],
    checkout: null
  },
  mutations,
  actions,
  getters
})
