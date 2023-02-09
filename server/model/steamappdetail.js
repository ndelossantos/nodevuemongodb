const mongoose = require('mongoose')

const steamappdetailSchema = new mongoose.Schema({
    appId: {
        type: Number,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    developer: {
        type: Array,
        required: true
    },
    publisher: {
        type: Array,
        required: true
    },
    released: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    allReviews: {
        type: Array,
        required: true
    },
    price: {
        type: String,
        required: true
    }
    
    
}) 

// 1st param: Name of model in the database
// 2nd param: coressponds to model schema
// export: interact directly to db using this schema
module.exports = mongoose.model('Steamappdetail', steamappdetailSchema)