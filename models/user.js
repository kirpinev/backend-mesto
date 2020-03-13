const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: true,
    validate: {
      validator: email => validator.isEmail(email),
      message: 'Неправильный формат почты'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 8,
    select: false
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: link => validator.isURL(link),
      message: 'Неправильный формат ссылки'
    }
  }
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then(user => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then(matched => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return user;
      });
    });
};

userSchema.plugin(uniqueValidator, {
  message: 'Почта должна быть уникальной.'
});

module.exports = mongoose.model('user', userSchema);