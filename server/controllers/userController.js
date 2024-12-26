const { PrismaClient } = require('@prisma/client');
const { dmmfToRuntimeDataModel } = require('@prisma/client/runtime/library');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();


const register = async (req, res) => {
    const { email, password, referedCode } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        // check if referedCode exists
        if (referedCode) {
            const referredCodeExsistsUser = await prisma.user.findFirst({
                where: {
                    referalCode: referedCode
                }
            });
            if (referredCodeExsistsUser) {
                const ifUserExists = await prisma.user.findUnique({
                    where:{
                        email:email
                    }
                })
                if (ifUserExists) {
                    return res.status(409).json({ message: 'User already exists' });
                }
                const user = await prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        referalCode: uuidv4(),
                        referedCode
                    }
                })

                const createdUser=await prisma.user.findUnique({
                    where:{
                        id:user.id
                    },
                    select:{
                        email:true,
                        referalCode:true,
                        referedCode:true,
                        isAdmin:true,
                        id:true,
                        isVerified:true,
                        points:true,
                    }
                })

                const referall = await prisma.referal.create({
                    data: {
                        refereeId: user.id,
                        referrerId: referredCodeExsistsUser.id
                    },
                })
                const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1d'});

                console.log(user, referall,token);
                return res.status(201).json({ message: 'User registered successfully',token:token,user:createdUser });
            }
            else {
                return res.status(404).json({ message: 'Referal code does not exist' });
            }
        }
        else {
            const ifUserExists = await prisma.user.findUnique({
                where:{
                    email:email
                }
            })
            if (ifUserExists) {
                return res.status(409).json({ message: 'User already exists' });
            }
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    referalCode: uuidv4()
                }
            })

            const createdUser=await prisma.user.findUnique({
                where:{
                    id:user.id
                },
                select:{
                    email:true,
                    referalCode:true,
                    referedCode:true,
                    isAdmin:true,
                    id:true,
                    isVerified:true,
                    points:true
                }
            })


            const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1d'});
            console.log(user,token);
            return res.status(201).json({ message: 'User registered successfully',token:token,user:createdUser });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });

    }
}

const emailVerify=async(req,res)=>{

    const {email}=req.body;
    try{
        const user=await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(user.isVerified){
            return res.status(400).json({message:'Email already verified'})
        }
        
        if(user.referedCode !==null){
            const referal=await prisma.referal.findFirst({
                where:{
                    refereeId:user.id
                }
            })

            const referrer=await prisma.user.findFirst({
                where:{
                    id:referal.referrerId
                }
            })

            await prisma.user.update({
                where:{
                    id:referrer.id
                },
                data:{
                    points:{increment:5}
                }
            })

            await prisma.referal.update({
                where:{
                    id:referal.id
                },
                data:{
                    status:'completed'
                }
            })
            await prisma.user.update({
                where:{
                    id:user.id
                },
                data:{
                    isVerified:true
                }
            })
            return res.status(200).json({message:'Email verified successfully'})
        }
        else{
            return res.status(404).json({message:'No referal code found'})
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Verification failed"});
    }
}

const login = async (req, res) => {
    try{
        const {email,password}=req.body;
        const user=await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:'Invalid credentials'});
        }
        const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'1d'});
        const createdUser=await prisma.user.findUnique({
            where:{
                id:user.id
            },
            select:{
                email:true,
                referalCode:true,
                referedCode:true,
                isAdmin:true,
                id:true,
                isVerified:true,
                points:true,
            }
        })
        return res.status(200).json({token:token,user:createdUser});

        
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal server error'});
    }
}

module.exports = { register,emailVerify,login };