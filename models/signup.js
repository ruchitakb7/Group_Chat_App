const Sequelize = require('sequelize');

const sequelize=require('../util/database');

const Signup = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        uniqueKey:true
    },
    phoneno: {
        type: Sequelize.INTEGER,
        allowNull:false,
        uniqueKey:true
      },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports=Signup