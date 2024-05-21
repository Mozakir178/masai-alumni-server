const crypto = require("crypto");

console.log('hello')
const AuthUtils = {
  comparePasswords:  (inputPassword, storedPassword) => {
    return inputPassword === storedPassword;
  },

  generateResetToken:  () => {
    return crypto.randomBytes(20).toString("hex");
  },
};

module.exports = AuthUtils;
