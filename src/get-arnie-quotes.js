const { httpGet } = require('./mock-http-interface');

const OK_LABEL = 'Arnie Quote';
const FAIL_LABEL = 'FAILURE';

/**
 * Safely extract the `message` from a JSON response body.
 * Falls back to stringifying the body if parsing fails or `message` is missing.
 * @param {string|object} body
 * @returns {string}
 */
function extractMessage(body) {
  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body;
    return parsed && typeof parsed.message === 'string'
      ? parsed.message
      : String(body);
  } catch {
    return String(body);
  }
}

/**
 * Map a normalized HTTP response to the required result shape.
 * @param {{ status: number, body: string }} res
 * @returns {{ [OK_LABEL]: string } | { [FAIL_LABEL]: string }}
 */
function toResult(res) {
  const message = extractMessage(res.body);
  return res.status === 200 ? { [OK_LABEL]: message } : { [FAIL_LABEL]: message };
}

/**
 * Fetch one URL and return the final result entry (quote or failure).
 * @param {string} url
 * @returns {Promise<object>}
 */
async function getResultForUrl(url) {
  try {
    const res = await httpGet(url);
    return toResult(res);
  } catch (err) {
    const message = err && err.message ? err.message : 'Unknown error';
    return { [FAIL_LABEL]: message };
  }
}

/**
 * Execute HTTP GETs concurrently and return normalized results (in order).
 * @param {string[]} urls
 * @returns {Promise<Array<Record<string, string>>>}
 */
const getArnieQuotes = async (urls) => {
  if (!Array.isArray(urls) || urls.length === 0) return [];
  return Promise.all(urls.map(getResultForUrl));
};

module.exports = {
  getArnieQuotes,
};