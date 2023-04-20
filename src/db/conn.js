const mongoose =require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/featuredb",
	{
		useNewUrlParser : true,
		useUnifiedTopology:true
	})
.then(()=>{console.log("Connection Succesfull...!");})
.catch((e)=> {console.log("Not connected with db");})