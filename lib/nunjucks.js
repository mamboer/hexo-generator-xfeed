'use strict';
var he = require('he');
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();

var filters = {
  uriencode: function(str) {
    return encodeURI(str);
  },
  noemoji: function(str) {
    return str.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '');
  },
  xsafe: function(str) {
    return he.encode(str);
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
