// ==UserScript==
// @name           {{name}}
// @description    {{description}}
// @version        {{version}}
// @author         {{author}}
// @match          http://rubygems.org/gems/*
// @match          https://rubygems.org/gems/*
// @namespace      {{namespace}}
// @license        {{license}}
// ==/UserScript==

var a = document.querySelectorAll('.meta .links a');
var repo;
for(var i = 0; i < a.length; i++)
  if((repo = a[i].href.match(/https?:\/\/github\.com\/([^/]+)\/([^/]+)/)))
    break;

if(repo){
  if(typeof GM_info == 'undefined'){
    function GM_info(){
      var script = {};
      ['name', 'version'].forEach(function(key){
        if(GM_getMetadata(key))
          script[key] = GM_getMetadata(key)[0];
      });
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
      document.querySelector('.border:last-of-type')
        .insertAdjacentHTML('afterend', '<div class="border readme_box">' + result.responseText + '</div>');

      // Fix relative URLs
      var readmeBox = document.querySelector('.readme_box')
      [['a', 'href', '/blob/master'], ['img', 'src', '/raw/master']].forEach(function(i){
        var selector = i[0], attr = i[1], path = i[2];
        var elements = readmeBox.querySelectorAll(selector);

        Array.prototype.forEach.call(elements, function(element){
          var url = element.getAttribute(attr);
          if(!/^\w+:\/\//.exec(url)){
            url = 'https://github.com/' + repo[1] + '/' + repo[2] + path + url.replace(/^([^/])/, '/$1');
            element.setAttribute(attr, url);
          }
        });
      });
    }
  });
}
