import { asString, VM } from "cumlisp"
import { wrapPromise, wrapSync } from "../utils"

export default (vm: VM) =>
    vm.install({
        fetch: wrapSync("fetch", 1, ([url]) => wrapPromise(fetch(asString(url)))),
        "fetch-text": wrapSync("fetch-text", 1, ([url]) => wrapPromise(fetch(asString(url)).then(r => r.text()))),
        "fetch-json": wrapSync("fetch-json", 1, ([url]) => wrapPromise(fetch(asString(url)).then(r => r.json())))
    })