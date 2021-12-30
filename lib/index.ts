import initApi from "./initApi";
export default initApi;

import { VM, run, libBasic } from "cumlisp";

(async () => {
    let vm = new VM();
    initApi(vm);
    libBasic.installBasic(vm);
    let res = await run(`%(
        (set-func
            (is-even x)
            (== (%% (x) 2) 0)
        )
        
        
        "(conlog (map (is-even) (list 1 2 3 4 5)))
        (filter is-even (list 1 2 3 4 5 6 7 8 9 10))"
    )`, vm);
    console.log(res);
})();