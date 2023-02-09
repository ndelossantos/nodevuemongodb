<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button class="btn btn-primary" @click="logOut()" type="button">Logout</button>
        </div>
        <h5 class="card-title">Book List</h5>
        <br>
        <div class="row">
          <!-- <div class="text-right">
            <button class="btn btn-primary" @click="testBtn();">Create</button>&nbsp;
          </div> -->
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Description</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ld, i) in loadData" :key="i">
                <th scope="row">{{i+1}}</th>
                <!-- <td><img :src="ld._id" /></td> -->
                <td>{{ ld.title }}</td>
                <td>{{ ld.author }}</td>
                <td>{{ ld.desc }}</td>
                <td> 
                  <!-- <router-link class="btn btn-warning" :to="{ name: 'UpdateView', params: { propid: ld._id } }">
                    Edit
                  </router-link> -->
                  &nbsp;
                  <button @click="editData(ld._id);" class="btn btn-primary">Edit</button>&nbsp;
                  <button @click="deleteData(ld._id);" class="btn btn-danger">Delete</button>
                </td>
              </tr>
          
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br>
    <br>
    <br>
    <CreateView />

    <UpdateView v-if="showUpdate" :propUpdate="updateData"  />
    
  </div>


  
</template>

<script>
import CreateView from '../views/CreateView.vue'
import UpdateView from '../views/UpdateView.vue'
import {api}  from "@/api/api";
// import axios from 'axios'

export default {
 
  name: 'HomeView',
  props: {
    msg: String,
  },
  components:{
    CreateView,
    UpdateView
  },
  data(){
    return{
      loadData: [],
      updateData: [],
      showUpdate: false
    }
  },
  
  methods: {

    editData(id) {
      console.log(id)
      // this.$router.push({name: 'UpdateView', params: { id: id }})
      this.$router.push('/updateview?edit_id='+id)
      // this.showUpdate = true
    },

    logOut(){
      localStorage.clear()
      this.$router.push('/')
    },

    deleteData(delete_id){
      
      // let self = this
      if(confirm("Confirm delete?")){
        let url = 'bookstwo/delete';

        try{
          api(url, {delete_id}, 'post').then(function(res) {
              console.log(res) 
              this.handleStsResponse(res.data.sts, res.data.accessToken);
          })
          location.reload()

        }catch(err){
          console.log(err)
        }
      }

    },

    loadBooks(){
      let self = this

      api('bookstwo', {}, 'get').then(function(res) {
        console.log('acctoken: '+res.data.accessToken)
        
        self.handleStsResponse(res.data.sts, res.data.accessToken);
        self.loadData = res.data.datus
        
      })
 
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
    this.loadBooks();
    // console.log('this is mounted')
  }
  
}

</script>
