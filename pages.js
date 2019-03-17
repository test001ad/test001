var VERIFY_TOKEN = "mygame";
var PAGES = [
	// Add your pages here, change key for each one, I use numberical values starting at 0
	{
		id: "2324247294255216",
		name: "My game",
		key: "0",
		title: "Don't forget your daily free coins",
		subtitle: "We miss you, come back and play",
		cta: "Play Now",
		imageurl: "<URL of image to show in message>",
		payload: null,
		pat: "EAAEyFHJtNI8BAK6CO314NhIemddClVzGuOgG6a3QBAqhh57EAKwdibXHVhnKKesvn0n0MJ4ovwPIBo7ZA8PwNbnQcTTcZCthmLZC5xdkPHbjNN08SHrpZAwm3rvnotISZBeDWAH8UqWecOiz5VCnxJAJdXxr0kWHOmLJdLVsxuH6UXX0uEyQz",
	},
];

function GetGame(page_id)
{
	for (var t = 0; t < PAGES.length; t++)
	{
		if (page_id === PAGES[t].id)
			return PAGES[t];
	}
}

function GetPage(which)
{
	return PAGES[which];
}

function GetVertifyToken()
{
	return VERIFY_TOKEN;
}

module.exports = 
{
	GetGame,
	GetPage,
	GetVertifyToken,
};
