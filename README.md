<h1 align="center">
  retryable-promise-any
  <br>
  <br>
</h1>
<p align="center" style="font-size: 1.2rem;">A zero dependency JavaScript module that helps you get critical information on the screen as soon as possible.
</p>


<hr />

[![Build Status][build-badge]][build]
[![downloads][downloads-badge]][npmcharts] [![version][version-badge]][package]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-badge]][prs]
[![size][size-badge]][unpkg-dist] [![gzip size][gzip-badge]][unpkg-dist]

![Example implementation](https://raw.githubusercontent.com/JonasBa/retryable-promise-any/master/RecentSearchesUX.gif)

## The problem:

As we are entering a time where our users expect our UI's and applications to responsible and fast, speed is becoming a foundation of a great UX. This requires us to re-think of how we interact with the server and how we ensure that critical information is not only retrieved, but retrieved in the minimal amount of time. So far, we have been used to retrying requests that fail, but how can we ensure that they are also delivered asap to our users and that a minimal amount of time is waster? Take for example, a search query. If that request takes 5 seconds to retrieve 200 results and ends up failing, we have wasted 5 seconds of our user's time. Retrying that same request again to receive only 100 results might reduce it's time to 2 seconds, but compounded we have wasted about 7 seconds of time, which is well enough for the user to go find a product they want on your competitor's website.

## Solution

retryable-promise-any module helps you build a safe retry mechanism that retries requests before they fail. Given the example above, you can still send your request, but decide to set the timeout to 2 seconds and only fetch 100 results after that time. The main idea is that you will create a race between those two requests and ensure that whichever is the first to respond with success is the one that renders results for your users. This improves user experience by ensuring minimal time is wasted, even in case of errors and that any time spent retrying is not being compounded.

__The module handles:__
- Ensuring request are raced to whichever is the first to respond (unlike Promise.all, a rejected promise doesn't short circuit the return)
- Custom timeout strategies, specify almost any strategy you want or pick from a few hand built ones
- Setting a max retryCount
## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [The problem:](#the-problem)
- [Solution](#solution)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

retryable-promise-any is published on npm's public registry, you can install it as a dependancy of your project with the following command.
```
npm install --save retryable-promise-any
```

## Usage

<!-- > [Standalone codesandbox example](https://codesandbox.io/s/8k21924m5l) <br/>
> [Algolia react-instantsearch codesandbox example](https://codesandbox.io/s/m18wjy69) <br/>
> [Algolia InstantSearch.js codesandbox example](https://codesandbox.io/s/62j3k7097r)
Initializing the module -->

```ts
import retryablePromiseAny from 'retryable-promise-any'

const search = retryablePromiseAny(
  (options) => search({hitsPerPage: 100 / options.currentRetryCount})
)
.then(renderResults)
.catch(handleAllFailures)

```

If you built something using retryable-promise-any that you want to show, feel free to send us a link and we'll include it to the documentation!

## Contributing

This project is open to contributions, if you have a question, proposal or feedback please open a pull request or issue, we only ask you to be kind and respectful :)

Special thanks to [Kent C. Dodds](https://twitter.com/kentcdodds?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor) for building downshift (making that demo was much easier)

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://circleci.com/gh/JonasBa/retryable-promise-any/tree/master.svg?style=svg
[build]: https://circleci.com/gh/JonasBa/retryable-promise-any
[coverage-badge]: https://img.shields.io/codecov/c/github/retryable-promise-any/retryable-promise-any.svg?style=flat-square
[coverage]: https://codecov.io/github/retryable-promise-any/retryable-promise-any
[version-badge]: https://img.shields.io/npm/v/retryable-promise-any.svg?style=flat-square
[package]: https://www.npmjs.com/package/retryable-promise-any
[downloads-badge]: https://img.shields.io/npm/dm/retryable-promise-any.svg?style=flat-square
[npmcharts]: http://npmcharts.com/compare/retryable-promise-any
[license-badge]: https://img.shields.io/npm/l/retryable-promise-any.svg?style=flat-square
[license]: https://github.com/retryable-promise-any/retryable-promise-any/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[react-badge]: https://img.shields.io/badge/%E2%9A%9B%EF%B8%8F-(p)react-00d8ff.svg?style=flat-square
[react]: https://facebook.github.io/react/
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/retryable-promise-any/dist/index.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/retryable-promise-any/dist/index.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/retryable-promise-any/dist/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square
[spectrum-badge]: https://withspectrum.github.io/badge/badge.svg
[spectrum]: https://spectrum.chat/retryable-promise-any
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[ryan]: https://github.com/ryanflorence
[compound-components-lecture]: https://courses.reacttraining.com/courses/advanced-react/lectures/3060560
[react-autocomplete]: https://www.npmjs.com/package/react-autocomplete
[jquery-complete]: https://jqueryui.com/autocomplete/
[examples]: https://codesandbox.io/search?refinementList%5Btags%5D%5B0%5D=retryable-promise-any%3Aexample&page=1
[yt-playlist]: https://www.youtube.com/playlist?list=PLV5CVI1eNcJh5CTgArGVwANebCrAh2OUE