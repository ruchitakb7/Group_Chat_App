const Sequelize = require('sequelize');
const dotenv= require('dotenv')
dotenv.config()


const pass=process.env.dbpassword;
const dbname= process.env.dbname;
const dbusername= process.env.dbusername

 const sequelize = new Sequelize(dbname, dbusername, pass, {
    host:process.env.dblocalhost,
    dialect: "mysql",
     logging: false
}); 

module.exports=sequelize
