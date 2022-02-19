import { asList, asString, falseValue, VM, wrapFunc } from "cumlisp";
import { asFunc, wrapSync } from "../utils";

let nextId = 0;
const getId = () => nextId++;

export default (vm: VM) =>
  vm.install({
    // creates an anonymous function
    // see https://github.com/lexisother/CumLISP/blob/326d57279334bc13540b59736bf9b4603e3b63df/src/VM/lib-basic.ts#L16
    "anon-func": async (createArgs, scope) => {
      if (createArgs.length !== 3)
        throw new Error("Incorrect form for anon-func");

      const id = getId();

      const signature = asList(createArgs[1]).map(asString);
      return wrapFunc(`anon func ${id}`, signature.length, async (runArgs) => {
        const subScope = scope.extend();
        for (let i = 0; i < signature.length; i++)
          subScope.addFunction(
            signature[i],
            wrapSync(
              `anon func ${id} arg ${signature[i]}`,
              0,
              () => runArgs[i]
            ),
            true
          );

        return scope.vm.run(asList(createArgs[2]), subScope);
      });
    },

    // calls a lisp function.
    // quite useful as a standin for a spread operator
    // and of course, is capable of calling anonymous lisp functions
    call: wrapSync("call", 2, ([func, args], scope) =>
      asFunc(func, scope)([, ...asList(args)], scope)
    ),

    // calls a javascript function with the given args
    // must be a function not a string
    "call-js": wrapSync("call-js", 2, ([func, args]) => {
      if (typeof func !== "function")
        throw new Error("call-js requires a function as the first argument");
      return func(...asList(args)) ?? falseValue;
    }),
  });
