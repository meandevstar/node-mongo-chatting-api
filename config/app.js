module.exports = {
  jwtAlgorithm: process.env.JWT_ALGORITHM,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  jwtSecret: process.env.JWT_SECRET,
  socketPort: process.env.SOCKET_PORT
};