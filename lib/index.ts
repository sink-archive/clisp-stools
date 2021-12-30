import initApi from "./initApi";
export default initApi;

import { VM, run } from "cumlisp";

(async () => {
    let vm = new VM();
    initApi(vm);
    let res = await run("%(hello yall)", vm);
    console.log(res);
})();
