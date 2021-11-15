
var number = null;

const getNumber = () => number;
const genNumber = () => {
	number = null;
	while (number === null || number === 100) {
		number = Math.floor(Math.random() * 100);	
	}
	number += 1;
}

export { getNumber, genNumber };