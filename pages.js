var VERIFY_TOKEN = "mygame";
var PAGES = [
	// Add your pages here, change key for each one, I use numberical values starting at 0
    {
        id: "2203277176590538",
        name: "Candy Crush",
        key: "0",
        title: "It's a brand new day, let's continue our adventure!",
        subtitle: "Your Friends are playing...",
        cta: "Play Now",
        imageurl: "https://pmcvariety.files.wordpress.com/2018/08/candy-crush-saga.jpg?w=1000&h=563&crop=1",
        payload: null,
        pat: "EAAfT3nFz0MoBANpkaVG7zq8ijHwnZA4JsLZAzCFhiz0jPRaCvYU9QaSVQKX95Dlr2ZA6RZCSQOw3o0nsuRSVOjfGZBxFHYm50y5bm5ldKkmQJzlFACfc6yvDZBdPDHnqFKsRgkZBv4LuCvNkYZBNYkH6tpItcPLTMFMZBztdmRCLOjwWwDITO6lZBg",
    },
	{
		id: "2324247294255216",
		name: "My game",
		key: "1",
		title: "Don't forget your daily free coins",
		subtitle: "We miss you, come back and play",
		cta: "Play Now",
		imageurl: "http://cdn.akamai.steamstatic.com/steam/apps/771710/ss_9c45538e93098a30e6974480a4d83323c2f0e236.jpg",
		payload: null,
		pat: "EAAEyFHJtNI8BAK6CO314NhIemddClVzGuOgG6a3QBAqhh57EAKwdibXHVhnKKesvn0n0MJ4ovwPIBo7ZA8PwNbnQcTTcZCthmLZC5xdkPHbjNN08SHrpZAwm3rvnotISZBeDWAH8UqWecOiz5VCnxJAJdXxr0kWHOmLJdLVsxuH6UXX0uEyQz",
    }
 
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
