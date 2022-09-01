const mongoose =require("mongoose");

const imageModelSchema =new mongoose.Schema({

	filename : { 
					type:String,
					required :true
			   },
	size:Number,
	type : String,
	date :    {
					type :Date,
					default : Date.now
			  }

})

// Collectiion creation
const Files = new mongoose.model("files",imageModelSchema);

module.exports = Files;