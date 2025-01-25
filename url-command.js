(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['URLCommand'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['URLCommand'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  return {
    from: function (handlers) {
      const command = (url) => {
        if (!url) throw new Error("URL is required");
        if (typeof url !== "string") throw new Error("URL must be a string");
        if (typeof handlers !== "object" || handlers === null) {
          throw new Error("Handlers must be a valid object");
        }
        const [path, queryString] = url.split("?");
        const queryParams = queryString ? Object.fromEntries(new URLSearchParams(queryString).entries()) : {};
        const pathParts = path.split("/").filter(Boolean);
        let currentHandler = handlers;
        for (const part of pathParts) {
          if (currentHandler[part] === undefined) {
            throw new Error(`Handler for path "${path}" not found`);
          }
          currentHandler = currentHandler[part];
        }
        if (typeof currentHandler !== "function") {
          throw new Error(`Handler at path "${path}" is not a function`);
        }
        return currentHandler(queryParams);
      };
      command.run = command;
      return command;
    }
  };
});