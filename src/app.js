const path = require("path");
const express =require("express");
const app = express();
const hbs =require("hbs");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const multer  = require("multer");

//File upload destination
const upload = multer({dest: "../images/uploads/"});

//Port
const port = process.env.PORT || 3000;

//Database connection
require("./db/conn");
//Importing Users Database schema and collection
const Users = require("./models/registers");
const { json } =require("express");

//Importing Info database schema and collection
// const Info = require("./models/info");

//Importing Feature List model
const Features = require("./models/featurelist");

//Importing File Upload model
const ImageUpload = require("./models/imagemodel");




//Path (used for static files)
const staticpath =path.join(__dirname,"../public");
//template path
const templatepath =path.join(__dirname,"../templates/views");
//Partials path
const partialspath =path.join(__dirname,"../templates/partials"); 

//To get data after register,instead of showing undefined
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//use static file
app.use(express.static(staticpath));

//set template engine
app.set("view engine","hbs");

//set Template Path
app.set("views",templatepath);

//register prtials
hbs.registerPartials(partialspath);



app.get("/",(req,res)=>
{
	res.render("index");
});
app.get("/index",async (req,res)=>
{
	res.render("index");
	// res.status(200).json({name : "rrs"});

});
app.get("/fetch",async (req,res)=>
{
	// res.send("Hello");
	
	// Get counter from database
	//-------------------------------------------
	const featuredb = await Features.find().sort({"category":1});
	const featureCounter = await Features.find().countDocuments();
	const getFeatures = featuredb[0].featurename;
	// console.log(featuredb);
	// Get the feature list
	//-------------------------------------------
	// const featurelist = await()
	//to use hbs engine hbs 
	res.json({
		counter : featureCounter,
		features : featuredb
	})
	// res.render("index");
	// res.status(200).json({name : "rrs"});

});




// --------------------------------------------REGISTARTION------------------------------------------
//-------------------------------------------


// /Creating data in database
app.post("/register",async(req,res)=>
{
	try
	{
		// console.log(req.body.uname);
		const psw = req.body.psw;
		const cpsw = req.body.cpsw;
		// password check
		if(psw === cpsw)
		{
			const usersData =new Users({
				username :req.body.uname,
				email :  req.body.email ,
				zip_code:req.body.zip,
				place : req.body.place,
				country : req.body.country,
				phoneno : req.body.phone ,
				password : psw,
				cpassword : cpsw,
			})

		const user = await usersData.save();
		res.status(201).render("register");
		}
		else
		{
			res.send("Password not matching");
		}
		// res.send(req.body.uname);
	}
	catch(err)
	{
		res.status(400).send(err);
	}

})
app.get("/register",(req,res)=>
{
	res.render("register");
})
// -----------------------------------------------LOGIN------------------------------------------------------------
//-----------------------------------------
app.get("/login",(req,res)=>
{
	res.render("login");
})

app.post("/login",async(req,res)=>
{
	try
	{
		const email = req.body.email;
		const password = req.body.psw;
		// console.log(`Email ${email} ,Passwprd is ${password}`);
		const useremail= await Users.findOne({email:email});
		const userPassword = useremail.password;
		if(password == userPassword)
		{
			res.send(useremail);
			console.log(useremail);
		}
		else
		{
			res.send("invalid credentials");
		}
	}
	catch(err)
	{
		res.status(400).send("Invalid Eamail");
	}

})
//--------------------------------------------------FILE UPLOAD----------------------------------------
app.get("/uploadPage",(req,res)=>
{
	res.render("upload");
})
//---------------------Multer Storage set up and file storing---------------
	
	
	const storage = multer.diskStorage({ destination: 'uploads',
  										 filename: function (req, file, cb) 
  										 {
  										 	const uniqueSuffix = cb(null, file.originalname + '-' +"001");
  										 }
                                      })

	const uploads = multer({ storage: storage }).single("images");

//Request to upload
	app.post("/upload",(req,res)=>
	{
		uploads(req,res,(err)=>{
			if (err) 
			{
				console.log(err);
			}
			else
			{
				const newImage = new ImageUpload({
					filename : req.file.filename,
					size:req.file.size,
					type :req.file.fieldname,
				})
				newImage.save().then(()=>res.render("index")).catch((err)=>res.send("try again !"));
				console.log("Succefully uploaded");
			}
		})
	})

//--------------------------------------------DYNAMIC DIV-----------------------------------------------------
//-------------------------------------------
app.get("/dynamicdiv",(req,res)=>
{
	res.render("dynamicdiv");
})
app.post("/dynamicdivs",(req,res)=>
{
	res.render("dynamicdiv",{
		"divs":req.body.divs
	});
})
//--------------------------------------------SENDING MAILS----------------------------------------------------
//-------------------------------------------
app.get("/sentEmail",(req,res)=>
{
	res.render("sentEmail");
})
const emailOpts = multer({ storage: storage }).single("files");
app.post("/sendEmail",(req,res)=>
//------Transported contains the authentictions------
{
	emailOpts(req,res,(err)=>{
			if (!err) 
			{
				const transporter = nodemailer.createTransport({
						service : "gmail",
						auth :
						{
							user : "sadangirashmiranjan@gmail.com",
							pass: "bznfufqmnflwnowx"
						}
					})
					const options = {
						from:"sadangirashmiranjan@gmail.com",
						to : req.body.to,
						cc:req.body.cc,
						bcc:req.body.bcc,
						subject :req.body.subject,
						text:req.body.message,
						attachments: [
						{filename:req.file.orginalname,path :req.file.path}]
					}

					transporter.sendMail(options , (err,info) =>
					{
						if (err) {res.send(err);console.log(err);}
						else{res.send("success");console.log(info);}	
					})
			}
			else
			{
					console.log(err);
			}
		})
})


//-------------------------------------------------
// Port
//---------------------------------------
app.listen(port,()=>{
	console.log(`Serving is running in ${port}`);
});