const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require('jsonwebtoken');

const jwtSign = util.promisify(jwt.sign);


const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword, role } = req.body;

        //* Validate request body
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                message: 'Invalid credentials',
                status: 'failed',
            })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Not matching passwords',
                status: 'failed',
            })

        }


        //* Hash the passsword
        const saltRounds = +process.env.SALT_ROUNDS;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.create({
            email,
            password: hashedPassword,
            role
        })

        const registeredUser = {
            ...user.toObject(),
            password: undefined,
            __v: undefined
        }

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: registeredUser,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    //* Validate request body
    if (!email || !password) {
        res.satuts(400).json({
            message: 'Missing email or password',
            status: 'failed'
        })
    }

    const user = await User.findOne({ email });
    //* Validate if user exists
    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password',
            status: 'failed'
        })
    }
    //* Compare the hashed password with the password in request body
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
        return res.status(401).json({
            message: 'Invalid email or password',
            status: 'failed'
        })
    }

    //* Generate token
    const token = await jwtSign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: '1h'
        }
    )

    //* Send the token as response
    res.status(200).json({
        message: 'User logged in successfully',
        status: 'success',
        data: {
            accessToken: token
        }
    })
}

//* Get all users in database
const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json({
        message: 'Users fetched successfully',
        status: 'success',
        data: users

    })
}

module.exports = {
    signup,
    login,
    getAllUsers
}