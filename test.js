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

