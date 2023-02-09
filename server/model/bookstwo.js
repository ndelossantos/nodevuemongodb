const mongoose = require('mongoose')

const booksTwoSchema = new mongoose.Schema({
    // _id: {
    //     type: String,
    //     required: true
    // },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
    
}) 

// 1st param: Name of model in the database
// 2nd param: coressponds to model schema
// export: interact directly to db using this schema
module.exports = mongoose.model('Booktwo', booksTwoSchema)