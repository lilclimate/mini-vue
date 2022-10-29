import { track, trigger } from "./effect";

export const createGetter = (isReadOnly = false) => (target: any, key: string | symbol) => {
	const res = Reflect.get(target, key);

	if (!isReadOnly)
		track(target, key);
	return res;
};
export const createSetter = () => (target: any, key: string | symbol, value: any) => {
	const res = Reflect.set(target, key, value);

	trigger(target, key);
	return res;
};

export const mutableHandlers = {
	get: createGetter(),
	set: createSetter(),
};

export const readonlyHandlers = {
	get: createGetter(true),
	set() {
		return true;
	},
};
