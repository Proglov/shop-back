const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { isAdmin, isPhoneValid, isEmailValid } = require('../../lib/Functions');



const UserSignUp = async (_parent, args, context) => {
    const { phone } = args;

    const { User } = context.db

    try {
        if (isPhoneValid(phone)) {
            const newUser = new User({
                phone
            })

            await newUser.save();

            const token = await JWT.sign({
                userId: newUser.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token
            }
        }
        throw new Error("phone number is invalid!")


    } catch (error) {
        return {
            message: error.message,
            token: null
        }
    }



}


const UserUpdate = async (_parent, args, context) => {
    const {
        id,
        name,
        email,
        username,
        password,
        address,
        phone
    } = args.input;
    const { User } = context.db;
    const { userInfo } = context;

    try {

        //check if req contains token
        if (!userInfo) {
            throw new Error("You are not authorized!")
        }

        //don't let the user if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId)) && userInfo?.userId !== id) {
            throw new Error("You are not authorized!")
        }

        const user = await User.findById(id);

        //check if there is a new password and it's valid
        if (password && password !== user.password && password.length < 8) {
            throw new Error("Password Should have more than 8 characters")
        }

        //check if phone is valid
        if (phone && !isPhoneValid(phone)) {
            throw new Error("Phone is not valid")
        }

        //check if email is valid
        if (email && !isEmailValid(email)) {
            throw new Error("Email is not valid")
        }

        //check if email already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("Email Already Exists")
            }
        }


        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    email,
                    username,
                    password,
                    address,
                    phone
                }
            },
            { new: true }
        );

        const token = await JWT.sign({
            userId: updatedUser.id
        }, process.env.JWT_SIGNATURE, {
            expiresIn: 86400
        })

        return {
            message: null,
            token
        }


    } catch (error) {
        return {
            message: error.message,
            User: null
        }
    }



}

const UserDelete = async (_parent, args, context) => {
    const { id } = args;

    const { User } = context.db
    const { userInfo } = context;

    try {
        //check if req contains token
        if (!userInfo) {
            throw new Error("You are not authorized!")
        }

        //don't let the user if they're neither admin nor they don't own the account
        if (!(await isAdmin(userInfo?.userId))) {
            throw new Error("You are not authorized!")
        }

        const user = await User.findByIdAndDelete(id)

        return {
            message: `User ${user.id} has been deleted`,
            status: true
        }


    } catch (error) {
        return {
            message: error.message,
            status: false
        }
    }



}

const UserSignInWithPhone = async (_parent, args, context) => {
    const { phone } = args;

    const { User } = context.db

    try {
        const user = await User.findOne({
            phone
        })

        if (user) {
            const token = await JWT.sign({
                userId: user.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token
            }
        }

        throw new Error("no user found")


    } catch (error) {
        return {
            message: error.message,
            token: null
        }
    }



}

const UserSignInWithEmailOrUsername = async (_parent, args, context) => {
    const { emailOrUsername, password } = args;

    const { User } = context.db

    try {
        const userWithEmail = await User.findOne({
            email: emailOrUsername
        })

        if (userWithEmail) {

            const isMatch = await bcrypt.compare(password, userWithEmail.password)

            if (!isMatch) throw new Error("Invalid Credentials")

            const token = await JWT.sign({
                userId: userWithEmail.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token
            }
        }

        const userWithUsername = await User.findOne({
            username: emailOrUsername
        })

        if (userWithUsername) {

            const isMatch = await bcrypt.compare(password, userWithUsername.password)

            if (!isMatch) throw new Error("Invalid Credentials")

            const token = await JWT.sign({
                userId: userWithUsername.id
            }, process.env.JWT_SIGNATURE, {
                expiresIn: 86400
            })

            return {
                message: null,
                token
            }
        }

        throw new Error("no user found")


    } catch (error) {
        return {
            message: error.message,
            token: null
        }
    }

}

module.exports = {
    UserSignUp,
    UserUpdate,
    UserDelete,
    UserSignInWithPhone,
    UserSignInWithEmailOrUsername
}