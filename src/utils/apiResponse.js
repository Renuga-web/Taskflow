const success = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

const error = (res, message = "Something went wrong", statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

const created = (res, data, message = "Created successfully") => {
  return success(res, data, message, 201);
};

module.exports = { success, error, created };