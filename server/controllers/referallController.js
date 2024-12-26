const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllReferals = async (req, res) => {
    try {
        if (req.user?.isAdmin) {
            const referals = await prisma.referal.findMany({
                
                include: {
                    referee: true,
                    referrer: true,
                }
            });
            return res.status(200).json(referals);
        }
        else {
            const referals = await prisma.referal.findMany({
                where: {
                  referrerId: req.user.id,
                },
                include:{
                    referee:true,
                }
              });
            return res.status(200).json(referals);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        if (req.user?.isAdmin) {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    points: true,
                    referalCode: true,
                    referedCode: true
                },
                include: {
                    Referal: true,
                    include: {
                        referee: true,
                        referrer: true
                    }
                }
            });
            res.status(200).json(users);
        }
        else {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = { getAllReferals, getAllUsers };