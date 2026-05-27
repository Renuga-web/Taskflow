const User = require("../../models/User");
const Task = require("../../models/Task");
const { generateToken } = require("../../utils/generateToken");

const getAll = async () => {
  return await User.find().select("-password").sort({ createdAt: -1 });
};

const getById = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return user;
};

const create = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw Object.assign(new Error("User already exists"), { statusCode: 400 });

  const user  = await User.create(data);
  const token = generateToken(user._id);
  return { ...user.toJSON(), token };
};

const update = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });

  Object.assign(user, data);
  return await user.save();
};

const toggleStatus = async (id) => {
  const user = await User.findById(id);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });

  user.isActive = !user.isActive;
  await user.save();
  return { isActive: user.isActive };
};

const remove = async (id) => {
  const user = await User.findById(id);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });

  await Task.updateMany({ team: id }, { $pull: { team: id } });
  await user.deleteOne();
};

module.exports = { getAll, getById, create, update, toggleStatus, remove };