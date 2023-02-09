const mongoose = require('mongoose')

const booksSchema = new mongoose.Schema({
    usid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
    
}) 

// 1st param: Name of model in the database
// 2nd param: coressponds to model schema
// export: interact directly to db using this schema
module.exports = mongoose.model('Book', booksSchema)