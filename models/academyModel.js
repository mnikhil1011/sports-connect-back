const mongoose=require('mongoose')

const academySchema=new mongoose.Schema({
    name :{
      type: String,
      required: true
    },
    quantity :{
      type: Number,
      required: true
    },
    sport:{
      type:String,
      required: true
    },
    cID:{
      type:String,
      required:true
    }
})


module.exports =mongoose.model('academy',academySchema);

