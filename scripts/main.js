// ==UserScript==
// @name           {{name}}
// @description    {{description}}
// @version        {{version}}
// @author         {{author}}
// @match          http://rubygems.org/gems/*
// @match          https://rubygems.org/gems/*
// @namespace      {{namespace}}
// @license        {{license}}
// @grant          GM_info
// @grant          GM_getMetadata
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// ==/UserScript==

// Find github repository from links
var a = document.querySelectorAll('.gem__aside a');
var repo;
for(var i = 0; i < a.length; i++)
  if(/^(?:www\.)?github\.com$/.test(a[i].host) &&
     (repo = a[i].pathname.match(/^\/([^/]+)\/([^/]+)/)))
    break;

if(repo){
  if(typeof GM_info == 'undefined'){
    function GM_info(){
      if(typeof GM_getMetadata == 'function'){
        var script = {};
        ['name', 'version'].forEach(function(key){
          if(GM_getMetadata(key))
            script[key] = GM_getMetadata(key)[0];
        });
      }
      return {script: script};
    }
  }
  var userAgent = GM_info().script.name + ' (' + GM_info().script.version + ')';

  GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://api.github.com/repos/' + repo[1] + '/' + repo[2] + '/readme',
    headers: {'User-Agent': userAgent, 'Accept': 'application/vnd.github.v3.html+json'},
    onload: function(result){
      GM_addStyle("@@include('../tmp/style.css')");
      document.querySelector('main .l-overflow')
        .insertAdjacentHTML('beforeend', '<div class="l-colspan--l readme_box">' + result.responseText + '</div>');

      // Fix relative URLs
      var readmeBox = document.querySelector('.readme_box');
      [['a', 'href', '/blob/master'], ['img', 'src', '/raw/master']].forEach(function(i){
        var selector = i[0], attr = i[1], path = i[2];
        var elements = readmeBox.querySelectorAll(selector);

        Array.prototype.forEach.call(elements, function(element){
          var url = element.getAttribute(attr);
          if(!/^(\w+:)?\/\//.exec(url)){
            url = 'https://github.com/' + repo[1] + '/' + repo[2] + path + url.replace(/^([^/])/, '/$1');
            element.setAttribute(attr, url);
          }
        });
      });
    }
  });
}
