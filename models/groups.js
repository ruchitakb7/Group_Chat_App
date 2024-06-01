const Sequelize = require('sequelize');

const sequelize=require('../util/database');

const Group = sequelize.define('group',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    grpname:{
        type:Sequelize.STRING,
        allowNull:false
    },
    createdby:{
        type:Sequelize.INTEGER,
        allowNull:false
    }

})

module.exports=Group