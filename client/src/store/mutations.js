export default {
  setToken(state, payload) {
    state.token = payload
  },
  setUserLogin(state, payload) {
    state.userLogin = payload
  },
  setLoading(state, payload) {
    state.loading = payload
    state.error = null
  },
  setCheckout(state, payload) {
    state.checkout = payload
  },
  setError(state, payload) {
    state.loading = false
    state.error = payload
  }
}