import { VM } from "cumlisp";
import arithmetic from "./api/arithmetic";
import console from "./api/console";
import list from "./api/list";
import misc from "./api/misc";

export default (vm: VM) => {
    arithmetic(vm);
    console(vm);
    list(vm);
    misc(vm);
};
