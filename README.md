# RubyGems.org: Insert README

This is a userscript that inserts README in GitHub repository to https?://rubygems.org/gems/{gem_name}.

## How to Compile

Requires Node.js.

```
$ npm install gulp
$ npm install
$ gulp scripts
```

A userscript file will be written to `./dist`.

## Syntax Highlighting

As code blocks in README is highlighed with Pygments, you can enable syntax highlighing by adding a userstyle using Pygments CSS classes.

* [RailsCasts style](./userstyles/railscast.user.css)
