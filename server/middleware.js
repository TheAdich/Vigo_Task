const jwt = require('jsonwebtoken');
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization; // Extract token from `Bearer <token>`

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
        where:{
            id:decoded.id
        }
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; 
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;