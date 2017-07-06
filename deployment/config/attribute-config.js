/*
This is the config for displaying the attributes. It must have the same EntityTypes like the static data in the
backend. Then, according to the requirements, the attributes, that should be displayed on the GridView are named and
assigned the value 1 (integer).
 */
const attributeConfig = {
	"ProductFamily": {
		"IntroductionDate": 1,
		"NumberOfProductsInAction": 1
	},
	"Product": {
		"Brand": 1,
		"ProductId": 1,
		"Description": 1
	},
	"Configuration": {
		"CodingPlugId": 1,
		"SoftwareVersion": 1
	}
};

export default attributeConfig;
