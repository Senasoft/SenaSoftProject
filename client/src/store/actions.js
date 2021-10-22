import * as api from "../api"

import router from "@/router"

export default {
  
  async login({commit}, user){
    try {
      commit('setLoading',true)
      const login = await api.Login(user)
      localStorage.setItem('token', login.token)
      localStorage.setItem('userLogin', JSON.stringify(login.usuario))
      commit('setToken', login.token)
      commit('setUserLogin', login.usuario)
      commit('setLoading', false)  
      router.push('/')
    } catch (error) {
      commit('setError', error)
    }
  },

  async uploadPhoto({commit}, photos){
    try {
      commit('setLoading', true)
      const response = await api.UploadPhoto(photos)
      commit('setCheckout', response)
      commit('setLoading', false) 
    } catch (error) {
      commit('setError', error)
    }
  },

  logout({commit}) {
    localStorage.removeItem('token')
    commit('setToken', null)
    localStorage.removeItem('userLogin')
    commit('setUserLogin', null)
    router.push('/login')
  },

  getDataLocalStorage({commit}) {
    const token = localStorage.getItem('token')
    if(token) {
      commit('setToken', token)
    }
    const userLogin = JSON.parse(localStorage.getItem('userLogin'))
    if(userLogin) {
      commit('setUserLogin', userLogin)
    }
  }

}