const { Joi, celebrate } = require('celebrate');

const linkExpression = /(http:\/\/|https:\/\/)(www\.)*\S*/;

module.exports.signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkExpression),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.currentUserValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
});

module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(linkExpression).required(),
  }),
});

module.exports.cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(linkExpression).required(),
  }),
});

module.exports.cardIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
});
