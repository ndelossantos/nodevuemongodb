<template>
  <div class="container">
    <div class="row">
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <br />
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>
    </div>
  </div>
   
</template>

<script>

import axios from 'axios'

export default {
 
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return{
      nikko: 'hello hooy!'
    }
  },
  methods: {
    testBtn() {
      console.log('test btn clicked!')
    },

    mountedFunction(){

      axios.get('http://localhost:4000/books').then((resp) => {
        console.log(resp)
      })

    }
  },
  mounted(){
    
    this.mountedFunction();
    // console.log('this is mounted')
  }
}
</script>
