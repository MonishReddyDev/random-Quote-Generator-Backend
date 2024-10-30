import Joi from "joi";



const authSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required().min(2)
})

export default authSchema