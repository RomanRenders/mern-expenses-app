const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')          

const protect = asyncHandler(async (req, res, next) => {        // a single func to verify the user's token
  let token   

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {   
    try {
      token = req.headers.authorization.split(' ')[1]  

      // verify token 
      const decoded = jwt.verify(token, process.env.JWT_SECRET)   

      req.user = await User.findById(decoded.id).select('-password')    
      // WE FIND THE USER HERE, SO WE DON'T HAVE TO DO THE SAME THING IN OUR CONTROLLER FUNCS.
    
      next() 
    } catch (error) {
      console.log(error)
      res.status(401)     
      throw new Error('Not authorized....idiot')
    }
  }   

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')   
  }
})

module.exports = { protect }
// EVERYTHING GOOD HERE.
