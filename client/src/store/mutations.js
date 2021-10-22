export default {
  setToken(state, payload) {
    state.token = payload
    state.loading = false
  },
  setUserLogin(state, payload) {
    state.userLogin = payload
    state.loading = false
  },
  setLoading(state, payload) {
    state.loading = payload
    state.error = null
  },
  setError(state, payload) {
    state.loading = false
    state.error = payload
  }
}