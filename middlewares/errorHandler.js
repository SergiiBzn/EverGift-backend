const errorHandler = (error, _req, res, _next) => {
  console.log(error);
  const status = error.cause || 500;
  res.status(status).json({ error: error.message || 'Server Error' });
};

export default errorHandler;
