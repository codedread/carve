[![Node.js CI](https://github.com/codedread/carve/actions/workflows/node.js.yml/badge.svg)](https://github.com/codedread/carve/actions/workflows/node.js.yml)
[![CodeQL](https://github.com/codedread/carve/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/codedread/carve/actions/workflows/codeql-analysis.yml)

# Carve

## About

Playing around with a simple SVG editor web app that has zero runtime dependencies.

Working towards building a [very basic editor](https://github.com/codedread/carve/projects/1), this
demo doesn't do much yet, but you can [try it out](https://codedread.github.io/carve/). It has a
couple shape tools, basic selection/move, delete, undo/redo.

## Supported Browsers

This demo uses modern web standards and technologies that are not broadly supported on the web,
such as the [Native File System API](https://wicg.github.io/file-system-access/) and
[Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements).
Some features (such as loading/saving to the native file system) will be degrade in browsers that
do not support the relevant web specification.

