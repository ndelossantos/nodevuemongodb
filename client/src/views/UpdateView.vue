<template>
  <div class="container">
      <div class="card">
        <div class="card-body">
            <h5 class="card-title">Update Book</h5>
            <div :style="[displayAlert ? '' : 'display:none']" :class="[alertType == 'success' ? 'alert alert-success' : 'alert alert-danger']" role="alert">
                {{ responsemsg }}
            </div>
            <!-- {{ propData.author }} -->
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
            <button @click="update()" class="btn btn-primary">Submit</button>
            &nbsp;&nbsp;
            <button @click="backHome()" class="btn btn-primary">Back</button>
        </div>
      </div>
  </div>
  
</template>

<script>
import {api}  from "@/api/api";


export default {
 
  name: 'UpdateView',
  props: {
    msg: String,
    // propUpdate: Object
  },
  data(){
    return{
        author: '',
        title: '',
        description: '',
        loadData: [],
        edit_id: this.$route.query.edit_id,
        displayAlert: false,
        alertType: '',
        responsemsg: ''
    }
  },
  
  methods: {

    displayUpdate(){
        console.log('edit_id: '+this.edit_id)
        let self = this
        let url = 'bookstwo/'+this.edit_id;

        api(url, {}, 'get').then(function(res) {
            console.log(res)  
            self.author = res.data.datus.author,
            self.title = res.data.datus.title,
            self.description = res.data.datus.desc

            self.handleStsResponse(res.data.sts, res.data.accessToken);

        })
    },

    update(){
        let self = this

        let updateData = {
            'id':      this.edit_id,
            'author':   this.author,
            'title':    this.title,
            'desc':     this.description
        }

        try{
            api('bookstwo/update', updateData, 'post').then(function(res) {
                console.log(res)

                self.handleStsResponse(res.data.sts, res.data.accessToken);
            })
            this.displayAlert = true
            this.alertType = 'success'
            this.responsemsg = 'Updated Successfully. Redirecting home...'

            setTimeout(() => self.$router.push('/home'), 2500);
            

        }catch(err){
            this.displayAlert = true
            this.alertType = 'false'
            this.responsemsg = err.msg ? err.msg : 'Something went wrong. Please try again.'
            console.log(err)
        }
        
    },

    backHome(){
        this.$router.push('/home')
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
      this.displayUpdate();
    //   console.log()
    // console.log(propUpdate.author)
    // this.mountedFunction();
    // console.log('this is mounted')
  }
  
}

</script>
