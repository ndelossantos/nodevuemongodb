import axios from 'axios'

//Create Axios instance
const service = axios.create({
  baseURL:  process.env.VUE_APP_BASE_API, // base of API_ URL,
  Timeout: 5000, // request timeout
  
})

const getToken = () => localStorage.getItem('access'); 
  
//Request interceptor 
service.interceptors.request.use(
  config => {
    if (getToken() != null && getToken() !== '') {
      config.headers ['Authorization'] = 'Bearer ' +  getToken() 
    } 
    return config
  },
  error => {
    // Do something with request error
    console.log("No token?");
    console.log(error) // for debug
    // Promise.reject(error)
  }
)
 
 
 

export default service;