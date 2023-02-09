import request from '@/utils/request'

//Login
export function post(url, datus) {

  let data = {}
  
    if(data === 'users/login'){
        data = { 'username': datus.username, 'password': datus.password }  
    }else{
        data = datus
    }
 
  return request({ url: process.env.VUE_APP_API_URL + url, method: 'post', data: data})
} 

 