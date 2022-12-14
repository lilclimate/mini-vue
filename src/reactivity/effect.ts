import { extend } from "../shared";

let activeEffect;
let shouldTrack = false;
export class ReactiveEffect {
	private _fn: any; 
	active = true;
	deps = [];
	onStop?: () => void;
	constructor(_fn, public scheduler) { 
		this._fn = _fn;
	}

	run() {
    if (!this.active) {
      return this._fn();
    }

    // 应该收集
    shouldTrack = true;
    activeEffect = this;
    const r = this._fn();

    // 重置
    shouldTrack = false;

    return r;
  }

	stop() { 
		if (this.active) {
			this.cleanupEffect(this);
			if (this.onStop) this.onStop();
			this.active = false;
		}
	}

	private cleanupEffect(effect) {
		effect.deps.forEach((dep: any) => {
			dep.delete(effect);
		});
		effect.deps.length = 0;
	}
}

const targetMap = new Map();
export function track(target, key) { 
	if (!isTracking()) return;
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
	trackEffect(dep);
}

export function trackEffect(dep) {
	if (dep.has(activeEffect)) return;

	dep.add(activeEffect);
	activeEffect.deps.push(dep);
}

export function isTracking() { 
	return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
	const depsMap = targetMap.get(target);	
	let dep = depsMap.get(key);

	triggerEffect(dep);
}

export function triggerEffect(dep: any) {
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler();
		} else {
			effect.run();
		}
	}
}

export function effect(fn, options: any = {}) { 
	const _effect = new ReactiveEffect(fn, options.scheduler);
	extend(_effect, options);

	_effect.run();
	const runner:any =  _effect.run.bind(_effect);
	runner.effect = _effect;
	return runner;
}	

export function stop(runner) { 
	runner.effect.stop();
}