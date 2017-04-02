/** @module utils/common */

/**
 * Get URL
 * @memberof Utils
 * @param  {Object} req Express request object
 * @return {string}     URL
 */
exports.url = function(req) {
  return req.protocol + '://' + req.get('host') + req.originalUrl;
};

/**
 * Slugify string
 * @memberof Utils
 * @param  {string} string Plain text
 * @return {string}        Slug text
 */
exports.slugify = function(string) {
  return string.toLowerCase()
               .replace(/[^a-zA-Z0-9]+/g,'-')
               .replace(/^-+/, '')
               .replace(/-+$/, '');
}
