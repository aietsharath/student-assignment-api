const mongoose = require('mongoose');

const Schemas={
 userAssignment :new mongoose.Schema({
    studentUSN:String,
    content:String,
    topicTitle:String
}),
}

module.exports=Schemas;