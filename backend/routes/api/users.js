const express = require("express");
const { check } = require("express-validator");
const asyncHandler = require("express-async-handler");

const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const db = require("../../db/models");


const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors,
];

// Sign up
router.post(
  '/',
  validateSignup,
  asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    const user = await User.signup({ email, username, password });

    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }),
);


router.get('/channels', 
  requireAuth, 
  asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log('userId:', id);
  const channels = await db.Channel.findAll({ 
    where: { userId: id },
    order: ['name']
  });
  res.json(channels || []);
}))


router.post('/channels', 
  requireAuth,
  asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id } = req.user;
  await db.Channel.create({ name, userId: id });

  const channels = await db.Channel.findAll({ 
    where: { userId: id },
    order: ['name']
  });
  res.json(channels);
}))


module.exports = router;