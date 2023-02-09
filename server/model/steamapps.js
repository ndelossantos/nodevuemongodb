const mongoose = require('mongoose')

const steamappSchema = new mongoose.Schema({
    appId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    released: {
        type: String,
        required: true
    },
    reviewSummary: {
        type: String,
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
module.exports = mongoose.model('Steamapp', steamappSchema)