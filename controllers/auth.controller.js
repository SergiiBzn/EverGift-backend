/** @format */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//********** POST users/register **********
export const register = async (req, res) => {
  const { email, password } = req.body;
  // check if the user already exists
  const existingUser = await User.exists({
    email,
  });
  if (existingUser) {
    throw new Error('Email already exists', {
      cause: 409,
    });
  }

  // hash the password
  const salt = await bcrypt.genSalt(13);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create a new user
  const user = (
    await User.create({
      email,
      password: hashedPassword,
    })
  ).toObject();

  // delete password from the user object to be sent back to the client
  delete user.password;
  res.json(user);
};

//********** POST users/login **********
export const login = async (req, res) => {
  // login
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
  })
    .select('+password')
    .lean(); //lean returns the document as a plain js object

  if (!user) {
    throw new Error('Invalid Credentials', {
      cause: 400,
    });
  }

  // check if the password match the entered password
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error('Invalid Credentials', {
      cause: 401,
    });
  }

  // define the payload
  const payload = {
    id: user._id,
    username: user.profil.name,
  };
  // generate a token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN_DAYS + 'd',
  });

  // user password should be deleted from the user object to be sent back to the client
  delete user.password;

  // store the token in the cookie and send the cookie back to the client in the response
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
  });

  res.json(user);
};

//********** DELETE users/logout **********
export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.status(204).json({
    message: 'Logged Out Successfully',
  });
};

//********** GET users/me **********
export const me = async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw (
      (new Error('Not Authenticated'),
      {
        cause: 401,
      })
    );
  }

  res.json(user);
};

//********** PUT users/me **********
export const updateUser = async (req, res) => {
  //TODO: was wollen wir updated?
  /* const {
    email,
    username,
    avatar,
    birthday
  } = req.body; */
  const { userId } = req;
  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidator: true,
  }); // to get the updated user object after the update operation

  if (!user) {
    throw new Error('User Not Found', {
      cause: 404,
    });
  }

  res.json(user);
};

//********** DELETE users/me **********
export const deleteUser = async (req, res) => {
  const { userId } = req;

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new Error('User Not Found', {
      cause: 404,
    });
  }

  res.json({
    message: 'User Deleted Successfully',
  });
};
