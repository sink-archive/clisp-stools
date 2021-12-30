import initApi from "./initApi";
export default initApi;

import { VM, run, libBasic } from "cumlisp";

(async () => {
    let vm = new VM();
    libBasic.installBasic(vm);
    initApi(vm);
    let res = await run(`%(
        (set-func
            (fizz-buzz x)
            (if (== (mod (x) 3) 0)
                (if (== (mod (x) 5) 0)
                    fizzbuzz
                    fizz
                )
                (if (== (mod (x) 5) 0)
                    buzz
                    ""
                )
            )
        )

        "i went into node_modules and set the cost of function invocation to 0 btw
        otherwise list functions tend to eat that crap up instantly"
        (set l (list 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20))
        (conlog (map fizz-buzz (l)))
        (choose fizz-buzz (l))
    )`, vm);
    console.log(res);
})();