# RubyGems.org: Insert README

This is a userscript that inserts README in GitHub repository to https?://rubygems.org/gems/{gem_name}.

## How to Compile

Requires Node.js.

```
$ npm install
$ npm run build
```

A userscript file will be written to `./dist`.

## Syntax Highlighting

Because tokens in code blocks is marked up, you can enable syntax highlighing by adding a userstyle.

* [RailsCasts style](./userstyles/railscasts.user.css)
