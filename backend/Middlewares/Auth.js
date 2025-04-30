import jwt from 'jsonwebtoken';

const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // Attach decoded user data for later use

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default AuthMiddleware;
