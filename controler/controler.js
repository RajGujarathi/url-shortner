const Url=require('../models/models')
var base62 = require("base62/lib/ascii");
const validUrl = require('valid-url')
const config = require('config');
const { base64encode, base64decode } = require('nodejs-base64');
const sha=require("crypto")
const { nanoid } = require('nanoid')
const baseurl = config.get('Customer.url');


module.exports.shortner=async(req,res)=>{
   try{
    const url=await Url.findOne({where:{shortId:base64decode(req.params.shortner)}}).catch((err)=>{res.status(400).json(err)})
    console.log(url.expiresIn===Date.now)
    if(url){
    await url.increment('clicks')
    res.redirect(url.longurl)
    }
else{
    return res.status(404).json('No url found')
}}
catch(err){
    console.error(err)
    res.status(500).json('Server Error')
}
}


module.exports.encode=async(req,res)=>{
    const longurl=req.body.longurl;
    
    if (!validUrl.isUri(baseurl)) {
        return res.status(401).json('Invalid base URL')
    }
    //let short=nanoid(6) 
    let hash=sha.createHash("sha256").update(longurl).digest("base64");
    //console.log(hash+'        '+'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
    //let urlId=await base64encode(short)
    if (validUrl.isUri(longurl)) {
        try {
            let url = await Url.findOne({where:{
                 longurl
            }
               
            }).catch((Err)=>{console.log(Err)})
            if (url) {
                res.json(url.Shorturl)
            } else {
                const Shorturl =baseurl+hash.substring(0,8)
                url=await Url.create({longurl:longurl,Shorturl:Shorturl}).catch((err)=>{res.status(400).json(err)})
                res.json(Shorturl)
            }
        }        catch (err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    } 
    else {
        res.status(401).json('Invalid longUrl')
    }
}

