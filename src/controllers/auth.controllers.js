const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const tokenBlacklistModel =require("../models/blacklist.model")

const registeredUserController = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Provide username ,email and password",
    });
  }
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "Account already exists with this email addresss or username",
    });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = Jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.cookie("token", token);
  res.status(201).json({
    message: "User registered Successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const loginUserController = async (req, res) => {
   const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }
  const token = Jwt.sign(
    { id:user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);
  res.status(200).json({
    message: "User logged successfully.",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

const logoutUserController =async (req,res)=>{
const token =req.cookies.token;
if(token){
await tokenBlacklistModel.create({token});
}

res.clearCookie("token");
res.status(200).json({
    message:"User logged out successfully"
})
}


const getMeController =async (req,res)=>{
    const user =await userModel.findById(req.user.id);
    
    res.status(200).json({
        messsage:"User detail fetched succesfully",
        user:{
            id:user._id,
            email:user.email,
            username:user.username
        }
    })
}

module.exports = { registeredUserController ,loginUserController,logoutUserController,getMeController};
