import jwt from 'jsonwebtoken';

const AuthMiddleware = (req, res, next) => {
  try {
    // Prefer cookie token
    let token = req.cookies?.token;

    // Fallback to Authorization header: Bearer <token>
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // Attach decoded user data for later use

    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default AuthMiddleware;
