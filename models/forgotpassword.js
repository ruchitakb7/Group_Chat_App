const Sequelize= require('sequelize')
const sequelize= require('../util/database');


const Request = sequelize.define('forgotpassword',{
    id:{
        type:Sequelize.UUID,
        allowNull: false,
        primaryKey:true
    },
    isActive:
    {
        type:Sequelize.BOOLEAN,
        allowNull:false  
    }
})

module.exports= Request