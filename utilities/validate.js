export const validateEmail = function (email) {
  return email === "" || email.includes("@") === false ? false : true;
};

export const validatePassword = function (password) {
  return password.length < 8 ? false : true;
};

export const validateName = function (name) {
  return name.length === 0 ? false : true;
};
