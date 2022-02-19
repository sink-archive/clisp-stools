import initApi from "./initApi";
export default initApi;

export * as utils from "./utils";

import { VM, run, libBasic } from "cumlisp";

(async () => {
  let vm = new VM();
  libBasic.installBasic(vm);
  initApi(vm);
  let res = await run(
    `%(

        (set prom1 (promise-delay 100))
        (set prom2 (promise-then
          (prom1)
          (anon-func (result) (
            (conlog then callback called)
            "second promise return"
            ))
        ))

        (conlog promises created)
        (conlog (await (prom1)))
        (conlog first promise resolved)
        (conlog (await (prom2)))
        (conlog after both promises resolved)

        ()
    )`,
    vm
  );
  console.log(res);
})();
