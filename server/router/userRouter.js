const router=require('express').Router();
const {register,emailVerify,login}=require('../controllers/userController');
router.post('/register',register);
router.post('/emailVerify',emailVerify);

router.post('/login',login);
module.exports=router;