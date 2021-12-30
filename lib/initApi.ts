import {
    VM,
    wrapFunc,
    asString,
    asList,
    asInteger,
    libBasic,
    asBoolean,
    trueValue,
    falseValue,
    Value,
} from "cumlisp";

const CONV_TO_BOOL = (x: Value) => (asBoolean(x) ? trueValue : falseValue);

const asFloat = (x: Value) => {
    try {
        return asInteger(x);
    } catch (e) {
        return parseFloat(x.toString());
    }
}

export default (vm: VM) => {
    vm.install({
        // random utils
        get: wrapFunc("get", 1, (args, scope) =>
            scope.getFunction(asString(args[0]))([undefined], scope)
        ),

        // string concatenation
        "strcat-sep": wrapFunc("strcat-sep", -1, (args) =>
            Promise.resolve(args.slice(1).map(asString).join(asString(args[0])))
        ),

        // log functions log stuff to the console, and pass through their args as an array
        conlog: wrapFunc("conlog", -1, (args) => {
            console.log(...args);
            return Promise.resolve(args);
        }),
        conwarn: wrapFunc("conwarn", -1, (args) => {
            console.warn(...args);
            return Promise.resolve(args);
        }),
        conerr: wrapFunc("conerr", -1, (args) => {
            console.error(...args);
            return Promise.resolve(args);
        }),

        // classic functional programming list basics
        head: wrapFunc("head", 1, (args) =>
            Promise.resolve(asList(args[0])[0])
        ),
        tail: wrapFunc("tail", 1, (args) =>
            Promise.resolve(asList(args[0]).slice(1))
        ),
        "@": wrapFunc("@", -1, (args) => {
            const list = asList(args[0]);
            let working = [];
            for (const item of list)
                if (Array.isArray(item)) working.push(...item);
                else working.push(item);

            return Promise.resolve(working);
        }),
        "::": wrapFunc("::", 2, (args) =>
            Promise.resolve([args[0]].concat(asList(args[1])))
        ),

        reverse: wrapFunc("reverse", 1, (args) =>
            Promise.resolve(asList(args[0]).slice().reverse())
        ),
        map: wrapFunc("map", 2, async (args, scope) =>
            Promise.all(
                asList(args[1]).map(
                    async (x) =>
                        await vm.run([asString(args[0]), asString(x)], scope)
                )
            )
        ),
        filter: wrapFunc("filter", 2, async (args, scope) =>
            Promise.all(
                asList(args[1]).filter(async (x) => {
                    CONV_TO_BOOL(
                        await vm.run([asString(args[0]), asString(x)], scope)
                    );
                })
            )
        ),
        
        // arithmetic extras (JS)
        round: wrapFunc("round", 1, args => Promise.resolve(Math.round(asFloat(args[0])))),
        "/": wrapFunc("/", 2, (args) =>
            Promise.resolve(
                (asInteger(args[0]) / asInteger(args[1])).toString()
            )
        ),
    });

    // arithmetic extras (lisp)
    // incf / decf modifies a variable in place, just like a ++ operator.
    // they are passed the name of the variable, not the value of it to facilitate this.
    libBasic.setFunc(
        ["incf", "varname"],
        ["set", ["varname"], ["+", ["get", ["varname"]], "1"]],
        vm.globalScope
    );
    libBasic.setFunc(
        ["decf", "varname"],
        ["set", ["varname"], ["-", ["get", ["varname"]], "1"]],
        vm.globalScope
    );
    // wip
    /* libBasic.setFunc(
        ["mod", "val"],
        ["-", ["round", ["/", ["val"], "2"]]],
        vm.globalScope
    ) */
};
