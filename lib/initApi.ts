import { Value, VM, wrapFunc, asString } from "../../CumLISP/src/main";

export default (vm: VM) => 
    vm.install({
        "hello": wrapFunc("hello", 1, (args: Value[]) => Promise.resolve(`Hello, ${asString(args[0])} from Sink's Tools!`))
    })