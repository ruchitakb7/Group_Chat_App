const Sequelize = require('sequelize');

const sequelize=require('../util/database');

const Message = sequelize.define('message',{
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
    type:
    {
        type:Sequelize.STRING,
        allowNull:false,
    },
    msg:{
        type:Sequelize.STRING,
        allowNull:false,
        uniqueKey:true
    }
})

module.exports=Message