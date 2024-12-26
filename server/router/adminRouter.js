const router=require('express').Router();
const {adminRequestApproval,adminRequestDenial,getAllAdminRequest,adminRequestCreate,adminRequestStatus}=require('../controllers/adminController');
router.post('/adminRequestApproval',adminRequestApproval);
router.post('/adminRequestDenial',adminRequestDenial);
router.get('/getAllAdminRequest',getAllAdminRequest);
router.post('/adminRequestCreate',adminRequestCreate);
router.get('/adminRequestStatus',adminRequestStatus);
module.exports=router;