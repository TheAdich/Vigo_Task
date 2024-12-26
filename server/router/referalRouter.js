const router=require('express').Router();
const {getAllReferals,getAllUsers}=require('../controllers/referallController');
router.get('/getAllReferals',getAllReferals);
router.get('/getAllUsers',getAllUsers);
module.exports=router;