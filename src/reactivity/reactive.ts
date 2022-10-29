import { track, trigger } from "./effect";

export function reactive(raw) { 
	return new Proxy(raw, {
		get: createGetter(),
		set(target, key, value) {
			const res = Reflect.set(target, key , value)	

			trigger(target, key);
			return res;
		},
	});
}

const  createGetter = (isReadOnly = false) => (target: any, key: string | symbol) =>  {
	const res = Reflect.get(target, key);

	if (!isReadOnly) 
		track(target, key);
	return res;
}

export function readonly(raw) { 
	return new Proxy(raw, {
		get: createGetter(true),
		set() {
			return true	
		},
	});
}