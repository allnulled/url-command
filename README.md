# url-command

Use URLs and Objects to call functions.

## Install

```sh
npm i -s url-command
```

## Import

In node.js:

```js
require("@allnulled/url-command");
```

In html:

```html
<script src="node_modules/@allnulled/url-command/url-command.js"></script>
```

## API

Use `URLCommand.from(object)` to create an instance.

Then use `urlcommand.run(text)` to run commands by URL.
  - It will call the function passing 1 object only, containing the parameters provided on `run`.

You can use `?...&argumentsOrder=a,b,c,d` to call functions using all the parameters.
  - It will call the function spreading the specified properties in the specified order.

## Usage

```js
const object = {
    command: {
        hello({ name }): () => console.log("hello, " + name)
    }
};
URLCommand.from(object).run("/command/hello?name=world");
```

## Test

```js
require(__dirname + "/url-command.js")

describe("URLCommand API Test", function (it) {
  // Ejemplo de uso
  const handlers = {
    sum: ({ a, b }) => parseFloat(a) + parseFloat(b),
    maths: {
      multiply: ({ a, b }) => parseFloat(a) * parseFloat(b),
      sumatory: (...args) => {
        let out = 0;
        for(let index=0; index<args.length; index++) {
          const arg = args[index];
          out += parseFloat(arg);
        }
        return out;
      }
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
    ["/maths/sumatory?a=40&b=7&c=2&d=1&argumentsOrder=a,b,c,d", 50],
  ];

  for (let index = 0; index < urls.length; index++) {
    const [url, result] = urls[index];
    it("Can run: " + url, function () {
      const output = URLCommand.from(handlers).run(url);
      ensure({ output }).is(result);
    });
  }
});
```