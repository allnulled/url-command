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
  const isOnlyConsecutiveNumbers = function(queryParams) {
    const queryKeysSource = Object.keys(queryParams);
    const queryKeys = queryKeysSource.map(key => "" + key);
    const output = [];
    for(let index=0; index<queryKeys.length; index++) {
      if(queryKeys.indexOf("" + index) === -1) {
        return false;
      }
      if(queryParams[index]) {
        output.push(queryParams[index]);
      } else {
        output.push(queryParams["" + index]);
      }
    }
    return output;
  };
  return {
    from: function (handlers) {
      let beforeRun = undefined;
      let afterRun = undefined;
      const onRun = function(callback, args) {
        let output = undefined;
        if(typeof beforeRun === "function") {
          beforeRun(...args);
        }
        output = callback(...args);
        if(typeof afterRun === "function") {
          afterRun(...args);
        }
        return output;
      };
      const command = (url, queryParamsExtender = {}) => {
        if (!url) throw new Error("URL is required");
        if (typeof url !== "string") throw new Error("URL must be a string");
        if (typeof handlers !== "object" || handlers === null) {
          throw new Error("Handlers must be a valid object");
        }
        const [path, queryString] = url.split("?");
        const queryParams = queryString ? Object.fromEntries(new URLSearchParams(queryString).entries()) : {};
        Object.assign(queryParams, queryParamsExtender);
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
        const isSpreadable = isOnlyConsecutiveNumbers(queryParams);
        if(isSpreadable && isSpreadable.length) {
          return onRun(currentHandler, isSpreadable);
        } else if(queryParams.argumentsOrder) {
          const args = [];
          const argKeys = queryParams.argumentsOrder.split(",").map(arg => arg.trim());
          for(let index=0; index<argKeys.length; index++) {
            const argKey = argKeys[index];
            const argValue = queryParams[argKey] || null;
            args.push(argValue);
          }
          return onRun(currentHandler, args);
        } else {
          return onRun(currentHandler, [queryParams]);
        }
      };
      command.run = command;
      command.beforeRun = function(callback) {
        if(typeof callback !== "function") {
          throw new Error("Required parameter «callback» to be a function on «beforeRun»");
        }
        beforeRun = callback;
      };
      command.afterRun = function(callback) {
        if(typeof callback !== "function") {
          throw new Error("Required parameter «callback» to be a function on «afterRun»");
        }
        afterRun = callback;
      };
      return command;
    }
  };
});

