import User from '../Models/User.js'
import jwt from 'jsonwebtoken'
const Register = async(req,res) => {
      const { name,email,password} = req.body;
      console.log("Trying to register:", name, email);

      let user = await User.findOne({email});
      if(user){
        return res.json({message:"User already exists"})
      }
      try{
       user = await User.create({ name,email,password});
       const userId = user._id;
    const token = jwt.sign({userId}, process.env.JWT_KEY);
         res.cookie("token", token , {httpOnly: true,maxAge: 10 * 24 * 60 * 60 * 1000 }); 
    return  res.json({token: token,
                   user : user,
            message : "User registered successfully "
        });
       }
      
      catch(e){
       return res.json({message:"Something went wrong",
            error : e.message
        });
      }
}

const Login = async (req,res)=>{
    const { email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.json({
            message: " User does not exist"
        });
    }
    try{
      const userId = user._id;
      const token = jwt.sign({userId}, process.env.JWT_KEY);
      res.cookie("token", token , {httpOnly: true,maxAge: 10 * 24 * 60 * 60 * 1000 }); 
      return res.json({
          token : token,
          user : user,
          message: " User login successfully"
          });
    }
    catch(e){
      res.json({
        error : e.message,
        message : "Something went wrong"
      })
    }
   
}

const Logout = async (req,res)=>{
        // const token = req.cookie("token");
       res.clearCookie("token");
       res.json({ message: "Token cookie removed!" });
}

export {Register,Login ,Logout};