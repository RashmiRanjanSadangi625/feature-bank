const mongoose =require("mongoose");

mongoose.connect("mongodb://localhost:27017/featuredb",
	{
		useNewUrlParser : true,
		useUnifiedTopology:true
	})
.then(()=>{console.log("Connection Succesfull...!");})
.catch((e)=> {console.log("Not connected with db");})

