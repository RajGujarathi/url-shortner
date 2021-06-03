const {Router, request}=require('express')
const router=Router()

const auth=require('../controler/AuthController')
const check=require('../middlewear/authmiddle')

router.post('/auth/Signup',auth.register)
router.post('/auth/login',auth.login_post)
//router.post('/auth',check.checkUser)

module.exports=router;