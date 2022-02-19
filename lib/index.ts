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

        (set prom (promise-delay 100))
        (promise-then
          (prom)
          (anon-func (result) (conlog second))
        )

        (conlog first)
        (await (prom))
        (conlog third)

        ()
    )`,
    vm
  );
  console.log(res);
})();
