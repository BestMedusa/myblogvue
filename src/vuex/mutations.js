//更改用户状态信息
export const userStatus=(state,user)=>{
  if (user && user != '游客'){
    state.currentUser = user
    state.isLogin = true
    state.token = '123'
    localStorage.setItem("token","token")
  }else if(user==null){
    //退出的时候清空sessionStorage里的东西
    sessionStorage.setItem('userName',null);
    //  sessionStorage.setItem('userToke','');
    state.currentUser = null;
    state.isLogin = false;
    state.token = ''
    localStorage.removeItem("token")
  }
}
