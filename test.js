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
    ["/commands/hello?name=world", "hello, world"],
    ["/sum?a=10&b=2", 12],
    ["/maths/multiply?a=10&b=2", 20],
    ["/maths/sumatory?a=40&b=7&c=2&d=1&argumentsOrder=a,b,c,d", 50],
    ["/commands/message?a=origin&b=destination&c=This is a request&argumentsOrder=a,b,c", 'origin says to destination: "This is a request"'],
    ["/commands/bye?argumentsOrder=a", 'bye, Emily', { a: "Emily" }],
  ];

  for (let index = 0; index < urls.length; index++) {
    const [url, result, args = {}] = urls[index];
    it("Can run: " + url, function () {
      const output = URLCommand.from(handlers).run(url, args);
      ensure({ output }).is(result);
    });
  }
});