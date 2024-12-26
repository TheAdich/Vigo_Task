const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminRequestApproval = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user.isAdmin) {
            return res.status(200).json({ message: "User is already an admin" });
        }
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                isAdmin: true
            }
        });
        const request = await prisma.request.findFirst({
            where: {
                userId: user.id,

            }
        })

        await prisma.request.update({
            where: {
                id: request.id
            },
            data: {
                status: "approved"
            }
        })

        return res.status(200).json({ message: "Admin request approved successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const adminRequestDenial = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user.isAdmin) {
            return res.status(200).json({ message: "User is already an admin" });
        }

        const request = await prisma.request.findFirst({
            where: {
                userId: user.id
            }
        });

        await prisma.request.update({
            where: {
                id: request.id
            },
            data: {
                status: "denied"
            }

        })

        return res.status(200).json({ message: "Admin request denied successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getAllAdminRequest = async (req, res) => {
    try {
        const requests = await prisma.request.findMany({
            where: {
                status: "pending"
            },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        })
        return res.status(200).json(requests);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const adminRequestCreate = async (req, res) => {
    try {
        const { userId } = req.body;
        //check if request exists
        const request = await prisma.request.findFirst({
            where: {
                userId: userId
            }
        })
        if (request) {
            //update the status to pending once again
            await prisma.request.update({
                where: {
                    id: request.id
                },
                data: {
                    status: "pending"
                }
            })
            return res.status(200).json({ message: "Admin request updated",request });
        }
        const newRequest = await prisma.request.create({
            data: {
                userId: userId,
            }
        })
        return res.status(201).json({ message: "Admin request created successfully", newRequest });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const adminRequestStatus = async (req, res) => {

    try {
        const request = await prisma.request.findFirst({
            where: {
                userId: req.user.id
            }
        })
        if (request) {
            return res.status(200).json({ message: request.status });
        }
        return res.status(404).json({ message: "Request not found" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { adminRequestApproval, adminRequestDenial, getAllAdminRequest, adminRequestCreate, adminRequestStatus };