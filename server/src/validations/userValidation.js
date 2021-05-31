import Joi from 'joi'

const updateValidation = Joi.object({
    email: Joi
        .string()
        .required()
        .max(64)
        .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
    nick: Joi
        .string()
        .required()
        .max(32)
        .pattern(new RegExp(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšśžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð_-]+$/)),
    password: Joi
        .string()
        .required()
        .min(8)
        .max(64),
    newpassword: Joi
        .string()
        .allow('')
        .min(8)
        .max(64)
})

const loginValidation = Joi.object({
    email: Joi
        .string()
        .required()
        .max(64)
        .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
    password: Joi
        .string()
        .required()
        .min(8)
        .max(64)
})

const registerValidation = Joi.object({
    email: Joi
        .string()
        .required()
        .max(64)
        .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
    nick: Joi
        .string()
        .required()
        .max(32)
        .pattern(new RegExp(/^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšśžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð_-]+$/)),
    password: Joi
        .string()
        .required()
        .min(8)
        .max(64),
    repassword: Joi
        .ref('password'),
    rules: Joi
        .boolean()
        .invalid(false)
})

const userConfirmEmailValidation = Joi.object({
    email: Joi
        .string()
        .required()
        .max(64)
        .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
    password: Joi
        .string()
        .required()
        .min(8)
        .max(64)
})

const userConfirmValidation = Joi.object({
    token: Joi
        .string()
        .required()
})

const passwordResetEmailValidation = Joi.object({
    email: Joi
        .string()
        .required()
        .max(64)
        .pattern(new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
})

const passwordResetValidation = Joi.object({
    password: Joi
        .string()
        .required()
        .min(8)
        .max(64),
    repassword: Joi
        .ref('password'),
    token: Joi
        .string()
        .required()
})

export {updateValidation, loginValidation, registerValidation, userConfirmEmailValidation, userConfirmValidation, passwordResetEmailValidation, passwordResetValidation}
