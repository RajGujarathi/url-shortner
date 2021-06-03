const {Router, request}=require('express')
const router=Router()
const controler=require('../controler/controler')
 router.post('/encode',controler.encode)
 router.get('/:shortner', controler.shortner )
 
 module.exports=router;