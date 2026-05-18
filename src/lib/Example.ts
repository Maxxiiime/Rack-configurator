// Example, remove file
class Example {
	private value1: number;
	private value2: number;

	constructor(value1: number, value2: number) {
		this.value1 = value1;
		this.value2 = value2;
	}

	get sum() {
		return this.calcSum();
	}

	calcSum() {
		return this.value1 + this.value2;
	}
}

export default Example;
