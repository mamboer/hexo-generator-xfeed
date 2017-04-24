'use strict';
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();

var filters = {
  uriencode: function(str) {
    return encodeURI(str);
  },
  noemoji: function(str) {
    return str.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '');
  },
  noControlChars: function(str) {
    return str.replace(/[\x00-\x1F\x7F]/g, '');
  }
};

for (var p in filters) {
  env.addFilter(p, filters[p]);
};

module.exports  = {
  filters: filters,
  env: env,
  proxy: nunjucks
}
