import request from '@/utils/request'

export function api(url, datus, method) {

    return request({ url: process.env.VUE_APP_API_URL + url, method: method, data: datus})
  } 