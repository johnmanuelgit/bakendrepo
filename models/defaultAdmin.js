const mongoose = require('mongoose')

const defaultadmin= new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    role:String,
})
module.exports = mongoose.model('defaultadmin',defaultadmin)