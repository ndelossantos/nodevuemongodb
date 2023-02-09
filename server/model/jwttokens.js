const mongoose = require('mongoose')

const authTokensSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    refresh: {
        type: String,
        required: true
    }
    
}) 

// 1st param: Name of model in the database
// 2nd param: coressponds to model schema
// export: interact directly to db using this schema
module.exports = mongoose.model('Jwttoken', authTokensSchema)