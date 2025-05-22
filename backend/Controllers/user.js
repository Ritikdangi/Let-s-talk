import User from '../Models/User.js'
import jwt from 'jsonwebtoken'
const Register = async(req,res) => {
      const {name,email,password} = req.body;
      // console.log("Trying to register:", name, email);

      let user = await User.findOne({email});
      if(user){
        return res.json({message:"User already exists"})
      }
      try{
       user = await User.create({ name,email,password});
       const userId = user._id;
    const token = jwt.sign({userId}, process.env.JWT_KEY);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // false for HTTP in development
      sameSite: 'lax',
      domain: 'localhost', // Explicit domain
      path: '/',
      maxAge: 10 * 24 * 60 * 60 * 1000
    });
     return  res.json({
      user : {
        email : user.email,
        name: user.name,
        _id : user._id,
      },       
        message : "User registered successfully "
        });
       }
      
      catch(e){
       return res.json({message:"Something went wrong",
            error : e.message
        });
      }
}

const Login = async(req,res)=>{
    const {email,password} = req.body;
    // console.log("trying to loggin for",email,password);
    const user = await User.findOne({email});
    if(!user){
        return res.json({
            message: "User does not exist"
        });
    }
    try{ 
       if(password!=user.password) {
         return res.json({
          message: "Wrong password is entered"
         });
       }
      const userId = user._id;
      const token =  jwt.sign({userId}, process.env.JWT_KEY);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // false for HTTP in development
        sameSite: 'lax',
        domain: 'localhost', // Explicit domain
        path: '/',
        maxAge: 10 * 24 * 60 * 60 * 1000
      });
      return res.json({
          user : {
            email : user.email,
            name : user.name,
            _id : user._id
          },
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

const AllUser = async(req, res )=>{
          try{
              //  console.log(req.user.userId);
          const FilteredUsers = await User.find({ _id: { $ne: req.user.userId } }).select('-password' );
              res.json(FilteredUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ message: 'Server error' })
        }
         
}
export {Register,Login , Logout , AllUser};