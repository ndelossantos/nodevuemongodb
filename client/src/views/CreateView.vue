<template>
  <div class="container">
      <div class="card">
        <div class="card-body">
            <h5 class="card-title">Create Book</h5>
            <br>
            <div class="mb-3">
                <label class="form-label">Author</label>
                <input type="text" v-model="author" class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" v-model="title" class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="description" rows="2"></textarea>
            </div>
            <button @click="create()" class="btn btn-primary">Submit</button>
        </div>
      </div>
  </div>
  

  
</template>

<script>
import {api}  from "@/api/api";

export default {
 
  name: 'CreateUpdate',
  props: {
    msg: String,
    propUpdate: Object
  },
  data(){
    return{
        author: '',
        title: '',
        description: '',
        loadData: [],
    }
  },
  
  methods: {

    create(){

        let self = this

        let createData = {
            author: this.author,
            title: this.title,
            description: this.description,
        }
        // console.log(createData)
        try{
            api('bookstwo/create', createData, 'post').then(function(res) {
                console.log(res);
                self.handleStsResponse(res.data.sts, res.data.accessToken);
            }); 

            location.reload()

        }catch(error){
            console.log(error.msg)
        }
        
    },

    handleStsResponse(sts, token){
      console.log(sts+' / '+token)
      // redirect, newtoken, valid
        if(sts === 'redirect') {
              localStorage.clear()
              this.$router.push('/')
        }else{
          
          if(sts === 'newtoken'){
            localStorage.setItem('access', token);
          }
        }
    }
   
  },
  mounted(){
    
  }
  
}

</script>
