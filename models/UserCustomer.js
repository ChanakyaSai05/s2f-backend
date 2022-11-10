const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
// Customer schema
const userSchemaCustomer = new mongoose.Schema(
  {
    // name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "" },
    // isAdmin: { type: Boolean, default: false },
    phone_number: { type: String },
    userType: { type: String },
  },
  { timestamps: true }
);
userSchemaCustomer.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
const Usercustomer = mongoose.model("Usercustomer", userSchemaCustomer);
function validateUser(user) {
  const schema = Joi.object({
    // name: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().min(5).max(255).required(),
    // isAdmin: Joi.boolean(),
    profilePic: Joi.string(),
    phone_number: Joi.string(),
    userType: Joi.string(),
  });

  return schema.validate(user);
}
exports.userSchemaCustomer = userSchemaCustomer;
exports.Usercustomer = Usercustomer;
exports.validate = validateUser;
