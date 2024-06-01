const jwt = require('jsonwebtoken');
const User = require('../models/signup');

exports.authenticate = async (req, res,next) => {

    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secretkey');
        User.findByPk(user.id).then(user => {
          
            req.user = user; 
            next();
        })

      } catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
        
      }

}

