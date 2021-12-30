import { VM } from "cumlisp";
import { wrapSync } from "../utils";

export default (vm: VM) =>
    vm.install({
        conlog: wrapSync("conlog", -1, (args) => {
            console.log(...args);
            return args;
        }),
        conwarn: wrapSync("conwarn", -1, (args) => {
            console.warn(...args);
            return args;
        }),
        conerr: wrapSync("conerr", -1, (args) => {
            console.error(...args);
            return args;
        }),
    });
