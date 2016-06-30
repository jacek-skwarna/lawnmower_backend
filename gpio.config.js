module.exports = {
	pins: {
		"1": {
			id: 1,
			type: 'switch',
			role: 'Front lights'
		},
		"5": {
			id: 5,
			type: 'switch',
			role: 'Blade'
		},
		"7": {
			id: 7,
			type: 'engineControll',
			role: 'Left engine enable-pin 1'
		},
		"11": {
			id: 11,
			type: 'engineControll',
			role: 'Left engine enable-pin 2'
		},
		"13": {
			id: 13,
			type: 'engineControll',
			role: 'Left engine input-pin 1'
		},
		"15": {
			id: 13,
			type: 'engineControll',
			role: 'Left engine input-pin 2'
		}
	},
	engineLeft: {
		enablePin1: 7,
		enablePin2: 11,
		inputPin1: 13,
		inputPin2: 15 
	}
};