import initApi from "./initApi";
export default initApi;

import { VM, run, libBasic } from "cumlisp";

(async () => {
    let vm = new VM();
    libBasic.installBasic(vm);
    initApi(vm);
    let res = await run(`%(
        (set-func
            (is-even x)
            (== (mod (x) 2) 0)
        )
        
        (conlog (map is-even (list 1 2 3 4)))
        (filter is-even (list 1 2 3 4))
    )`, vm);
    console.log(res);
})();