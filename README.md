# battlelog

Simple HTML5 blogging platform for personal use.
No back-end: no PHP, no Node.js, no back-end needed.
Imagine: you can deploy your Bloster to an S3 bucket and enjoy the fastness of AWS services.

It works by using a few JSON indices and an .md files for storing the content of each post.
Simple, fast, and it works like a charm.

## git

* GET /gists/:id - curl https://api.github.com/gists/4175331
*


## Architecture

index.html ->
  **entry point!**
  loads all index files by appending a timestamp to each of them
  to avoid caching

/bloster
  /indices/tags.json
  /indices/recent.json
  /indices/index.json
  /posts/[timestamps].md
    /posts/20150802102655.md

## Routes

/ **most recent posts**

/post/title **post specific route**

/about **custom route**
