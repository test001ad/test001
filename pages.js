var VERIFY_TOKEN = "mygame";
var PAGES = [
	// Add your pages here, change key for each one, I use numberical values starting at 0
    {
        id: "833719527002847",
        name: "Med test1",
        key: "0",
        title: "It's a brand new day, let's continue our adventure!",
        subtitle: "Your Friends are playing...",
        cta: "Play Now",
        imageurl: "https://www.cmo4hire.com/wp-content/uploads/2016/10/Blog-background-hello-world.jpg",
        payload: null,
        pat: "EAAIkfPKGV3EBAB5ZCuguCWMS98V9WEGd7UC82WH3OfhI3c3ZA13PLzF5TYZB587dZCUajAr3jsrDxwR9QUGkyngsMicZBnMFZBBqx1FIko9fsqJ7JbD0ygBAYdqiBiF3hMpl1wma9tuV46wsOHqWu739KoKfZCkXY1LHKqlzEQ5DAcZCNiRnD146",
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
