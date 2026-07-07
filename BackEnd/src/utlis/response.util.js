
export const ok = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const created = (res, data, message = "Created") => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

export const fail = (res, message = "Something went wrong", statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFound = (res, message = "Not found") => {
  return res.status(404).json({
    success: false,
    message,
  });
};