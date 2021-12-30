import { libBasic, Value, VM, VMScope } from "cumlisp";
import { asFloat, wrapSync } from "../utils";

// due to fun things in cumlisp, all numbers are represented as strings
// floats are a little screwy in core & lib-basic, but we make it work

const wrapSyncStr = (
    n: string,
    a: number,
    f: (args: Value[], scope: VMScope) => Value
) => wrapSync(n, a, (args, scope) => f(args, scope).toString());

export default (vm: VM) => {
    vm.install({
        round: wrapSyncStr("round", 1, (args) => Math.round(asFloat(args[0]))),
        "/": wrapSyncStr("/", 2, (args) => asFloat(args[0]) / asFloat(args[1])),
        mod: wrapSyncStr(
            "mod",
            2,
            (args) => asFloat(args[0]) % asFloat(args[1])
        ),
    });

    // incf / decf modifies a variable in place, just like a ++ operator.
    // they are passed the name of the variable, not the value of it to facilitate this.
    libBasic.setFunc(
        ["incf", "varname"],
        ["set", ["varname"], ["+", ["get", ["varname"]], "1"]],
        vm.globalScope
    );
    libBasic.setFunc(
        ["decf", "varname"],
        ["set", ["varname"], ["-", ["get", ["varname"]], "1"]],
        vm.globalScope
    );
};
