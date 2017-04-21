'use strict';

var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();
var pathFn = require('path');
var fs = require('fs');
var he = require('he');

env.addFilter('uriencode', function(str) {
  return encodeURI(str);
});

env.addFilter('noemoji', function(str) {
  return str.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '');
});

env.addFilter('he', function(str) {
  return he.encode(str, {
    useNamedReferences: true
  });
});

var atomTmplSrc = pathFn.join(__dirname, '../atom.xml');
var atomTmpl = nunjucks.compile(fs.readFileSync(atomTmplSrc, 'utf8'), env);
var rss2TmplSrc = pathFn.join(__dirname, '../rss2.xml');
var rss2Tmpl = nunjucks.compile(fs.readFileSync(rss2TmplSrc, 'utf8'), env);

module.exports = function(locals) {
  var config = this.config;
  var feedConfig = config.xfeed;
  var template = feedConfig.type === 'rss2' ? rss2Tmpl : atomTmpl;

  var posts = locals.posts.sort('-date');
  posts = posts.filter(function(post) {
    return post.draft !== true;
  });

  if (feedConfig.limit) posts = posts.limit(feedConfig.limit);

  var url = config.url;
  if (url[url.length - 1] !== '/') url += '/';

  var xml = template.render({
    config: config,
    url: url,
    posts: posts,
    feed_url: config.root + feedConfig.path
  });

  return {
    path: feedConfig.path,
    data: xml
  };
};
