const mongoose =require("mongoose");

const infoSchema =new mongoose.Schema({
	counter:Number
})

// Collectiion creation
const Info = new mongoose.model("infos",infoSchema);

module.exports = Info;