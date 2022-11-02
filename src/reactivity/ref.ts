import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffect, trigger, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
	private _value: any; 
	public dep;
	private _rawValue: any;
	private _v_isRef = true;
	constructor(value) {
		this._rawValue = value;
		this._value =isObject(value)?  reactive(value): value;
		this.dep = new Set();
	 }

	get value() { 
		this.trackRefValue(this);
		return this._value;
	}

	private trackRefValue(ref) {
		if (isTracking())
			trackEffect(ref.dep);
	}

	set value(newValue) { 
		if (!hasChanged(this._rawValue, newValue)) return;
		this._rawValue = newValue;
		this._value = this.convert(newValue);
		triggerEffect(this.dep);
	}

	private convert(value: any): any {
		return isObject(value) ? reactive(value) : value;
	}
}
export function ref(value) { 
	return new RefImpl(value);
}

export function isRef(ref) { 
	return !!ref._v_isRef;
}

export function unRef(ref) { 
	return isRef(ref) ? ref.value : ref;
}