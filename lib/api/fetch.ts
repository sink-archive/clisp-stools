import { VM } from "cumlisp"
import { wrapSync } from "../utils"
import { wrapPromise } from "./promise"

export default (vm: VM) =>
    vm.install({
        fetch: wrapSync("fetch", 1, ([url]) => wrapPromise(fetch(url))),
        "fetch-text": wrapSync("fetch-text", 1, ([url]) => wrapPromise(fetch(url).then(r => r.text()))),
        "fetch-json": wrapSync("fetch-json", 1, ([url]) => wrapPromise(fetch(url).then(r => r.json())))
    })