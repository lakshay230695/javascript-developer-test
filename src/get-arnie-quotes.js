const { httpGet } = require('./mock-http-interface');

const getArnieQuotes = async (urls) => {
  const results = await Promise.all(
    urls.map(async (url) => {
      const { status, body } = await httpGet(url);
      const { message } = JSON.parse(body);

      return status === 200
        ? { 'Arnie Quote': message }
        : { FAILURE: message };
    })
  );

  return results;
};

module.exports = {
  getArnieQuotes,
};