# url-command

Use URLs and Objects to call functions.

Install: `npm i -s url-command`

Import: `require("@allnulled/url-command")` or `<script src="node_modules/@allnulled/url-command/url-command.js"></script>` 

Usage:

```js
URLCommand.from({
    commands: {
        hello(urlParams): () => {
            const { name } = urlParams;
            console.log("hello, " + name);
        }
    }
}).run("/commands/hello?name=world");
```

Test:

```js
require(__dirname + "/url-command.js")

// Ejemplo de uso
const handlers = {
  sum: ({ a, b }) => parseFloat(a) + parseFloat(b),
  maths: {
    multiply: ({ a, b }) => parseFloat(a) * parseFloat(b),
  },
  commands: {
    hello: (urlParams) => {
      const { name } = urlParams;
      const msg = "hello, " + name;
      console.log(msg);
      return msg;
    }
  }
};

const urls = [
  ["/commands/hello?name=world", "hello, world"],
  ["/sum?a=10&b=2", 12],
  ["/maths/multiply?a=10&b=2", 20],
];

describe("URLCommand API Test", function (it) {
  for (let index = 0; index < urls.length; index++) {
    const [url, result] = urls[index];
    it("Can run: " + url, function () {
      const output = URLCommand.from(handlers).run(url);
      ensure({ output }).is(result);
    });
  }
});
```