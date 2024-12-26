const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const userRouter=require('./router/userRouter');
const referalRouter=require('./router/referalRouter');
const adminRouter=require('./router/adminRouter');
const authMiddleware=require('./middleware');
const app=express();
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST','DELETE','PUT'],
}))
dotenv.config();
app.use(express.json());
app.use('/api/auth',userRouter);
app.use('/api/referal',authMiddleware,referalRouter);
app.use('/api/admin',authMiddleware,adminRouter);
app.listen(5000,()=>{
    console.log(`Server is running on port 5000`);
})