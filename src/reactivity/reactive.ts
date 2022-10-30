import {  mutableHandlers, readonlyHandlers } from "./baseHandlers";

function createReActiveObject(raw: any, baseHandlers) {
	return new Proxy(raw, baseHandlers);
}

export const enum ReactiveFlags { 
	IS_REACTIVE = '__v_isReactive',
	IS_READONLY = '__v_isReadonly',
}

export function isReactive(value) { 
	return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) { 
	return !!value[ReactiveFlags.IS_READONLY]
}

export function reactive(raw) { 
	return createReActiveObject(raw, mutableHandlers);
}

export function readonly(raw) { 
	return createReActiveObject(raw, readonlyHandlers);
}