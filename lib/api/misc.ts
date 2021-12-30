import { asString, VM, wrapFunc } from "cumlisp";
import { wrapSync } from "../utils";

export default (vm: VM) =>
    vm.install({
        // gets the value of a variable by name
        // useful in funcs that mutate a var in place
        get: wrapFunc("get", 1, (args, scope) =>
            scope.getFunction(asString(args[0]))([undefined], scope)
        ),
        // strcat but with a separator
        "strcat-sep": wrapSync("strcat-sep", -1, (args) =>
            args.slice(1).map(asString).join(asString(args[0]))
        ),
        // access props on a JS object, useful with fetch-obj
        prop: wrapSync(
            "prop",
            2,
            (args: any[] /* ew */) => args[0][asString(args[1])]
        ),
        // log and ignore errors, useful with network
        "err-ignore": wrapSync("err-ignore", 1, (args) =>
            Array.isArray(args[0]) && args[0][0] == "ERR" ? "" : args[0]
        ),
        "err-log": wrapSync("err-log", 1, (args) => {
            if (Array.isArray(args[0]) && args[0][0] == "ERR") {
                console.log(
                    `Sink's Tools Error (${args[0][1]}):`,
                    ...args[0].slice(2)
                );
                return "";
            }
            return args[0];
        }),
    });
