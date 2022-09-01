const mongoose =require("mongoose");

const featureList =new mongoose.Schema({
	category :    {
		 			type:String,
		 			required :true,
		 	   },
	featurename:{
		 			type:String,
		 			required :true
		 	   }
})

// Collectiion creation
const Features = new mongoose.model("feature",featureList);

module.exports = Features;