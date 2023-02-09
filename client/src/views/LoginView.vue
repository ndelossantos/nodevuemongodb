<template>
  <div class="container">
      
      <div class="card">
        <div class="card-body">
            <h5 class="card-title">Login</h5>
            <br>
            <div class="row">
                <div class="col-md-5">
                <div :style="[displayAlert ? '' : 'display:none']" class="alert alert-danger" role="alert">
                    {{ responsemsg }}
                </div>


                <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">Username</label>
                    <input type="text" v-model="username" class="form-control" id="exampleFormControlInput1">
                </div>
                <div class="mb-3">
                    <label for="exampleFormControlInput1" class="form-label">Password</label>
                    <input type="password" v-model="password" class="form-control" id="exampleFormControlInput1">
                </div>
                <br>
                <br>
                <div class="d-grid gap-2 d-md-block">
                    <button @click="login()" class="btn btn-primary">Login</button>
                </div>
                </div>
                
            </div>
        </div>
      </div>
  </div>
   
</template>

<script>

import {post}  from "@/api/httppost";

export default {
 
  name: 'LoginView',
  props: {
    msg: String
  },
  data(){
    return{
        username: '',
        password: '',
        responsemsg: '',
        displayAlert: false,
        responseAlert: 'alert alert-success',
        
    }
  },
  methods: {
    testBtn() {
      console.log('test btn clicked!')
    },

    login(){
        let self = this
        let loginData = {
            username: this.username,
            password: this.password,
        }
        post('users/login', loginData).then(function(response) {
            console.log(response);
            
            if(response.data.sts == 'FAILED') {
                self.responsemsg = 'Invalid Login'
                self.displayAlert = true
                console.log('Invalid Login or Token expired')
                // self.$router.push('/')
            }else{
                console.log('token: '+response.data.accessToken)
                // this.responsemsg = 'Success'
                localStorage.setItem('access', response.data.accessToken);
                self.$router.push('/home')
            }
        });
    },

  },
  mounted(){

      localStorage.clear()
    
    // this.mountedFunction();
    // console.log('this is mounted')
  }
}
</script>
