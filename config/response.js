const response = (res,statusCode, message,data) => {
  res.status(statusCode).json({
    statusCode: statusCode, 
    message: message,
    data: data
  })
}

export default response