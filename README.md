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

**1. Create an instance**

Use `URLCommand.from(object)` to create an instance.

**2. Run commands**

Then use `urlcommand.run(text)` to run commands by URL.

It will call the function passing 1 object only, containing the parameters provided on `run`.

**3. Run functions**

You can use the parameter `?...&argumentsOrder=a,b,c,d` to call functions using all the parameters allowed by JavaScript.

It will call the function spreading the specified properties in the specified order.

**4. Pass data too**

Apart from the querystring parameters, you can pass data, like objects and functions and whatever (no strings, I mean), with a second parameter on the `run` method.





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
  it.onError(console.log);
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
        return msg;
      },
      message(emitter, receiver, contents) {
        const msg = `${emitter} says to ${receiver}: "${contents}"`;
        return msg;
      },
      bye: (name) => {
        const msg = "bye, " + name;
        return msg;
      },
    }
  };

  const urls = [
    // Hello world: 
    ["/commands/hello?name=world", "hello, world"],
    // Unique object parameter function call: 
    ["/sum?a=10&b=2", 12],
    // Unique object parameter function call + Nestable path: 
    ["/maths/multiply?a=10&b=2", 20],
    // Spread function call (explicit): 
    ["/maths/sumatory?a=40&b=7&c=2&d=1&argumentsOrder=a,b,c,d", 50],
    // Spread function call (explicit): 
    ["/commands/message?a=origin&b=destination&c=This is a request&argumentsOrder=a,b,c", 'origin says to destination: "This is a request"'],
    // Spread function call (explicit) + real data (no strings-only): 
    ["/commands/bye?argumentsOrder=a", 'bye, Emily', { a: "Emily" }],
    // Spread function call (implicit): must have numbers, from 0 untill the last parameter, and nothing else, and it will spread the parameters.
    ["/maths/sumatory?0=0&1=100&2=200&3=300", 600],
  ];

  for (let index = 0; index < urls.length; index++) {
    const [url, result, args = {}] = urls[index];
    it("Can run: " + url, function () {
      const output = URLCommand.from(handlers).run(url, args);
      // console.log(output);
      ensure({ output }).is(result);
    });
  }
});
```