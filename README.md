# @daybrush/page  [![npm version](https://badge.fury.io/js/%40daybrush%2Fpage.svg)](https://badge.fury.io/js/%40daybrush%2Fpage)

You can check the page in and out of the screen. 

Setting the range allows you to check in and out of the range.


[**API Documentation**](https://daybrush.com/page/release/latest/doc/index.html)

```
$ npm i @daybrush/page
```

```js
import Page from "@daybrush/page";

const pages = new Page.s({
  events: ["resize", "scroll"],
});

const page1 = new Page(".page1");

page1.on({
  "enter": e => {
    e.target.classList.add("enter");
  },
  "exit": e => {
    e.target.classList.remove("enter");
  },
});

const page2 = new Page(".page2");

page2.on({
  "enter": e => {
    e.target.classList.add("enter");
  },
  "exit": e => {
    e.target.classList.remove("enter");
  },
});
page2.range(["100% - 80", "100%"]).on({
  "enter": e => {
    utils.addClass(header, "white");
  },
  "exit": e => {
    utils.removeClass(header, "white");
  },
});
pages.add(page1);
pages.add(page2);

pages.scroll();
```