const log = (...params) => {
  console.log(`${new Date().toJSON()}`, ...params);
};

const error = (message, ...params) => {
  console.error(`${new Date().toJSON()}`, ...params);
};

module.exports = {
  log,
  error,
};
