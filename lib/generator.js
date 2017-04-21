'use strict';

var nunjucks = require('./nunjucks');
var pathFn = require('path');
var fs = require('fs');
var he = require('he');


var atomTmplSrc = pathFn.join(__dirname, '../atom.xml');
var atomTmpl = nunjucks.proxy.compile(fs.readFileSync(atomTmplSrc, 'utf8'), nunjucks.env);
var rss2TmplSrc = pathFn.join(__dirname, '../rss2.xml');
var rss2Tmpl = nunjucks.proxy.compile(fs.readFileSync(rss2TmplSrc, 'utf8'), nunjucks.env);

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
