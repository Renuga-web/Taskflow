const User = require("../../models/User");

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return user;
};

const updateProfile = async (userId, { name, email, title, avatar }) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });

  if (name)   user.name   = name;
  if (email)  user.email  = email;
  if (title !== undefined) user.title  = title;
  if (avatar !== undefined) user.avatar = avatar;

  return await user.save();
};

const updateAvatar = async (userId, avatarUrl) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { avatar: avatarUrl },
    { new: true }
  ).select("-password");

  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return user;
};

module.exports = { getProfile, updateProfile, updateAvatar };