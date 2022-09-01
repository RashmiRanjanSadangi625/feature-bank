const mongoose =require("mongoose");

const usersSchema =new mongoose.Schema({

	username : { 
					type:String,
					required :true
			   },
	email :    {
		 			type:String,
		 			required :true,
		 			unique : true
		 	   },
	zip_code:Number,
	place : String,
	country : String,
	phoneno :  {
					type:Number,
					unique :true
			   },
	password : String,
	cpassword : String,
	date :    {
					type :Date,
					default : Date.now
			  }

})

// Collectiion creation
const Users = new mongoose.model("user",usersSchema);

module.exports = Users;