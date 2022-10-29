class ReactiveEffect {
	private _fn: any; 
	constructor(_fn, public scheduler) { 
		this._fn = _fn;
	}

	run() { 
		activeEffect = this;
		return this._fn();
	}
}

const targetMap = new Map();
export function track(target, key) { 
	let depsMap = targetMap.get(target);
	if (!depsMap) { 
		depsMap = new Map();
		targetMap.set(target, depsMap);
	} 

	let dep = depsMap.get(key);
	if (!dep) { 
		dep = new Set();
		depsMap.set(key, dep);
	}
	dep.add(activeEffect);
}

export function trigger(target, key) {
	const depsMap = targetMap.get(target);	
	let dep = depsMap.get(key);

	for (const effect of dep) { 
		if (effect.scheduler) {
			effect.scheduler()
		} else {
			effect.run();
		}
	}
}

let activeEffect;
export function effect(fn, options: any = {}) { 
	const _effect = new ReactiveEffect(fn, options.scheduler);

	_effect.run();
	return _effect.run.bind(_effect);
}	