import initApi from ".";
import { VM, run, libBasic } from "cumlisp";

(async () => {
  let vm = new VM();
  libBasic.installBasic(vm);
  initApi(vm);
  let res = await run(
    `%(

        (set url "https://api.github.com/")

        (conlog (prop (await (fetch (url))) status))
        #| 200 |#

        (conlog (await (prop (await (fetch (url))) text)))
        #| a load of json |#

        (conlog (await (fetch-text (url))))
        #| same as above |#

        (conlog (await (fetch-json (url))))
        #| the json decoded to an object |#

        ()
    )`,
    vm
  );
  console.log(res);
})();
