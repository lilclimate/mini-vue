import { effect,stop } from "../effect";
import { reactive } from "../reactive";
describe('effect', () => {
	it('happy path', () => {
		const user = reactive({
			age: 10,
		});	

		let nextAge;
		effect(() => { 
			nextAge = user.age + 1;
		});

		expect(nextAge).toBe(11);

		user.age = 20;
		expect(nextAge).toBe(21);
	});	

	it('should return runner when effect and call runner return result', () => { 
		let foo = 20;
		const runner = effect(() => { 
			foo++;
			return 'success'
		});	

		expect(foo).toBe(21);
		const result= runner();
		expect(result).toBe('success')
		expect(foo).toBe(22);
	});

	it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    // // should not run yet
    expect(dummy).toBe(1);
    // // manually run
    run();
    // // should have run
    expect(dummy).toBe(2);
  });

	it("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    expect(dummy).toBe(2);
    stop(runner);
    obj.prop = 3;
    expect(dummy).toBe(2);

    // stopped effect should still be manually callable
    runner();
    expect(dummy).toBe(3);
  });
	 it("onStop", () => {
    const obj = reactive({
      foo: 1,
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        onStop,
      }
    );

    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});