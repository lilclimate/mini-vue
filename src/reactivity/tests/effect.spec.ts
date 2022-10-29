import { effect } from "../effect";
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
});