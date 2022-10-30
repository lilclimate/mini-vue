import { isObject } from "../shared";
import { track, trigger } from "./effect";
import {  reactive, ReactiveFlags, readonly } from "./reactive";

export const createGetter = (isReadOnly = false) => (target: any, key: string | symbol) => {
	const res = Reflect.get(target, key);

	if (key === ReactiveFlags.IS_REACTIVE) {
		return !isReadOnly;
	} else if (key === ReactiveFlags.IS_READONLY) { 
		return isReadOnly
	}  

	if (isObject(res)) return isReadOnly ? readonly(res) : reactive(res);

	if (!isReadOnly)
		track(target, key);
	return res;
};
export const createSetter = () => (target: any, key: string | symbol, value: any) => {
	const res = Reflect.set(target, key, value);

	trigger(target, key);
	return res;
};


const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

export const mutableHandlers = {
	get,
	set,
};
export const readonlyHandlers = {
	get: readonlyGet,
	set(target, key ) {
			console.warn(`key: ${key} set fail, target: ${target} is readonly`);	
		return true;
	},
};
