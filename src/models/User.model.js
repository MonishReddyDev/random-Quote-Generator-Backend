
import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }

}, { timestamps: true })


userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password, salt)
        this.password = hashPassword
        next()

    } catch (error) {
        next(error)
    }

})


userSchema.methods.isValidpassword = async function (password) {
    try {
        return bcrypt.compare(password, this.password)
    } catch (error) {
        throw error

    }

}

const User = model("User", userSchema)

export default User