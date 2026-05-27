const User              = require("../../models/User");
const { generateToken } = require("../../utils/generateToken");

const formatUserResponse = (user, token) => ({
  _id:      user._id,
  name:     user.name,
  email:    user.email,
  role:     user.role,
  title:    user.title,
  isActive: user.isActive,
  avatar:   user.avatar,
  token,
});

const register = async ({ name, email, password, role, title }) => {
  const exists = await User.findOne({ email });
  if (exists) throw Object.assign(new Error("User already exists with this email"), { statusCode: 400 });

  const user  = await User.create({ name, email, password, role, title });
  const token = generateToken(user._id);
  return formatUserResponse(user, token);
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });

  if (!user.isActive) throw Object.assign(new Error("Account disabled — contact admin"), { statusCode: 403 });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });

  const token = generateToken(user._id);
  return formatUserResponse(user, token);
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user    = await User.findById(userId);
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw Object.assign(new Error("Current password is incorrect"), { statusCode: 401 });

  user.password = newPassword;
  await user.save();
};

module.exports = { register, login, changePassword };