const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env


const auth = (req, res, next) => {
  // grab the token
  const { token } = req.cookies
  
  // if no token, stop proceeding
  if(!token) {
    res.status(403).send(`User not logged in!!`)
  }

  try {

    // decode token get user id
    const decode = jwt.verify(token, JWT_SECRET)
    console.log(decode);
    req.user  = decode

  } catch (error) {
    console.log(error);
    res.status(401).send(`Invalid Token`)
  }

  return next()
}


module.exports = auth
