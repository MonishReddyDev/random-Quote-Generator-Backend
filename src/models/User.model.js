
import { Schema, model } from "mongoose"
import bcrypt from "bcryptjs"

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
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


userSchema.pre('save', async function (next) {
    try {
        // Hash the password only if it's modified (or if it's a new document)
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(this.password, salt);
            this.password = hashPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidpassword = async function (password) {
    try {
        return bcrypt.compare(password, this.password)
    } catch (error) {
        throw error

    }

}

const User = model("User", userSchema)

export default User