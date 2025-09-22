//jwt authentification middleware
import jwt from "jsonwebtoken";

const authenticate = async(req,res,next) => {

  const {token}= req.cookies;
  if(!token){
    throw new Error("User not Authenticated",{cause:401})
  }

  const payload= jwt.verify(token,process.env.JWT_SECRET);

  req.userId= payload.id;
  next();
}

export default authenticate;
