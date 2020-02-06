import axios from 'axios';

var FieldService =  {
	getField: function(id) {
		return {
		  "label": "Sales region",
		  "required": false,
		  "choices": [
			"Asia",
			"Australia",
			"Western Europe",
			"North America",
			"Eastern Europe",
			"Latin America",
			"Middle East and Africa"
		  ],
		  "displayAlpha": true,
		  "default": "North America"
		}
	},
	saveField: function (fieldJson) {
        // Add the code here to call the API (or temporarily, just log fieldJson to the console)
        console.log(fieldJson);
				 return axios.post('http://www.mocky.io/v2/566061f21200008e3aabd919',fieldJson);
	}
}

export default FieldService;