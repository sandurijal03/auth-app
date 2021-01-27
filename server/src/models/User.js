import { Schema, model } from 'mongoose';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { pick } from 'lodash';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    requiredPasswordExpiresIn: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  let user = this;
  if (!user.isModified('password')) return next();
  user.password = await hash(user.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

userSchema.methods.generateJWT = async function () {
  let payload = {
    username: this.username,
    email: this.email,
    name: this.name,
    id: this._id,
  };
  return await sign(payload, process.env.SECRET, { expiresIn: '1w' });
};

userSchema.methods.generatePasswordReset = function () {
  this.requiredPasswordExpiresIn = Date.now() + 360000;
  this.resetPasswordToken = randomBytes(20).toString('hex');
};

userSchema.methods.getUserInfo = function () {
  return pick(this, ['_id', 'username', 'email', 'name', 'verified']);
};

export default model('User', userSchema);
