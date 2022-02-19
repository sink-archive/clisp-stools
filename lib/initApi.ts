import { VM } from "cumlisp";
import anonfuncs from "./api/anonfuncs";
import arithmetic from "./api/arithmetic";
import console from "./api/console";
import list from "./api/list";
import misc from "./api/misc";
import promise from "./api/promise";

export default (vm: VM) => {
    arithmetic(vm);
    console(vm);
    list(vm);
    misc(vm);
    promise(vm);
    anonfuncs(vm);
};
