import { asString, VM, wrapFunc } from "cumlisp";
import { wrapSync } from "../utils";

export default (vm: VM) =>
    vm.install({
        // gets the value of the raw function, not really very helpful
        "get-raw-func": wrapSync("get-raw-func", 1, (args, scope) =>
            scope.getFunction(asString(args[0]))//([undefined], scope)
        ),
        // strcat but with a separator
        "strcat-sep": wrapSync("strcat-sep", -1, (args) =>
            args.slice(1).map(asString).join(asString(args[0]))
        ),
        // access props on a JS object
        prop: wrapSync(
            "prop",
            2,
            (args: any[] /* ew */) => args[0][asString(args[1])]
        ),
    });
