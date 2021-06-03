var express = require('express');
var db=require('./models/db')
var model=require('./models/models')
var app = express();
const router=require('./Routes/router')
const authrout=require('./Routes/authroutes')
const rateLimit=require('express-rate-limit')
const limit = rateLimit({
    max: 10,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: 'Too many requests' // message to send

});

app.use(limit)
app.set('port', (process.env.PORT || 3001));
app.use(express.json({
    //extended: false,
    limit: '2kb' 
})) //parse incoming request body in JSON format.

const config = require('config');
const dbConfig = config.get('Customer.dbConfig');
console.log(dbConfig.dbName)
app.get('/',(req,res)=>{
    res.status(200).json({
        status: "success",
        message: "Hello from the express server"
    });
})

app.use(authrout)
app.use(router)

// Listen on assigned port
app.listen(app.get('port'), function () {
    console.log('listening on port ' + app.get('port'));
});