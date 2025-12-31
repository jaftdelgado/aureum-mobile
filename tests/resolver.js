const path = require('path');

module.exports = (request, options) => {
  const normalizedRequest = request.replace(/\\/g, '/');
  if (
    normalizedRequest.includes('expo/src/winter') || 
    (normalizedRequest.includes('winter') && options.basedir.includes('node_modules'))
  ) {
    return path.resolve(__dirname, '__mocks__/empty.js');
  }

  return options.defaultResolver(request, options);
};