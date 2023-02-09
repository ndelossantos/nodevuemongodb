const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    
}) 

// 1st param: Name of model in the database
// 2nd param: coressponds to model schema
// export: interact directly to db using this schema
module.exports = mongoose.model('User', usersSchema)