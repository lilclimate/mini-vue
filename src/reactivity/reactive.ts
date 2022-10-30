import {  mutableHandlers, readonlyHandlers } from "./baseHandlers";

function createReActiveObject(raw: any, baseHandlers) {
	return new Proxy(raw, baseHandlers);
}
export function reactive(raw) { 
	return createReActiveObject(raw, mutableHandlers);
}

export function readonly(raw) { 
	return createReActiveObject(raw, readonlyHandlers);
}