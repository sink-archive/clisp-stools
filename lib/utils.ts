import {
    asBoolean,
    asInteger,
    falseValue,
    trueValue,
    Value,
    VMScope,
    wrapFunc,
} from "cumlisp";

const CONV_TO_BOOL = (x: Value) => (asBoolean(x) ? trueValue : falseValue);

const asFloat = (x: Value) => {
    try {
        return asInteger(x);
    } catch (e) {
        return parseFloat(x.toString());
    }
};

const wrapSync = (
    name: string,
    argCount: number,
    func: (args: Value[], scope: VMScope) => Value
) =>
    wrapFunc(name, argCount, (args, scope) =>
        Promise.resolve(func(args, scope))
    );

const err = (type: string, ...data: Value[]): [string, string, Value[]] => [
    "ERR",
    type.toUpperCase(),
    data,
];

export { CONV_TO_BOOL, asFloat, wrapSync, err };
