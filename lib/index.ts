import initApi from "./initApi";
export default initApi;

export * as utils from "./utils"

import { VM, run, libBasic } from "cumlisp";

(async () => {
    let vm = new VM();
    libBasic.installBasic(vm);
    initApi(vm);
    let res = await run(
        `%(

        #| todo: promises cannot be injected into the lisp environment with the current VM |#
        #|(set-func
          (promise-handler result)
          (conlog second)
        )
        (set prom (promise-delay 100))
        (promise-then (prom) promise-handler)
        (conlog first)
        (await (prom))
        (conlog third)|#
    )`,
        vm
    );
    console.log(res);
})();