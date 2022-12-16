
export default {
  namespaced: true, // 为每个模块添加一个前缀名，保证模块命明不冲突 
  state: {
    userInfo: {
      nickName: '',
      avatar: ""
    }
  },
  mutations: {
    updateUserInfo(state,userInfo){
      state.userInfo=userInfo
      console.log(state.userInfo,'-------------state.userInfo')
    }
  },
  actions: {
  },
}