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
    // Set cookie secure flag only in production (requires HTTPS). Keep SameSite=None for cross-site.
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 10 * 24 * 60 * 60 * 1000
    });

    // Return token in response as a fallback for clients/browsers that block cookies.
    return res.json({
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
      token,
      message: "User registered successfully"
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
      // Set cookie secure flag only in production (requires HTTPS). Keep SameSite=None for cross-site.
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        path: '/',
        maxAge: 10 * 24 * 60 * 60 * 1000
      });

      // Return token in response body as a fallback for clients that cannot accept cookies.
      return res.json({
        user: {
          email: user.email,
          name: user.name,
          _id: user._id
        },
        token,
        message: "User login successfully"
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

// Return currently authenticated user info
const Me = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ user });
  } catch (error) {
    console.error('Me error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export {Register,Login , Logout , AllUser, Me};