const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { Usercustomer, validate } = require("../models/UserCustomer");
const express = require("express");
const router = express.Router();

function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

// When the customer clicks on login it will call this route
router.post("/customer-login", async (req, res) => {
  // First line in all the routes first checks with Joi package whether there is any error or not
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //  If no error then checks if the user is already exist or not
  let user = await Usercustomer.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");
  // Checks for password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  //
  res.header("x-auth-token", token).status(200).send({
    token: token,
    user: user,
  });
});

router.post("/customer-register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await Usercustomer.findOne({ email: req.body.email });

  //   console.log(user);
  if (user) return res.status(400).send("User already registered");

  user = new Usercustomer(
    _.pick(req.body, [
      "name",
      "email",
      "password",
      "profilePic",
      "phone_number",
      "userType",
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();

  // res.send(_.pick(user, ["_id", "name", "email"]))
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).status(201).send({
    token: token,
    user: user,
  });
  // .send(_.pick(user, ["_id", "email"]));
});

module.exports = router;
