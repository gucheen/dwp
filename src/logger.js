const log = (message, ...params) => {
  console.log(`${new Date().toJSON()} ${message}`, ...params);
};

const error = (message, ...params) => {
  console.error(`${new Date().toJSON()} ${message}`, ...params);
};

module.exports = {
  log,
  error,
};
