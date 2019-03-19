var messaging = require("./messaging.js");
var redis = require("redis");

var red = redis.createClient();
red.on("error", (err) =>
{
	console.log("Redis error: " + err);
});

var SendRegularity = [
	1,	// Day 1
	1,	// Day 2
	2,	// Day 4
	2,	// Day 6
	1,	// Day 7
]

function CanSend(tsm, days)
{
	if (tsm >= SendRegularity.length)
		return false;
	if (days > SendRegularity[tsm])
		return true;
	return false;
}



var cursor = 0;
function ProcessPlayers()
{
    console.log("Processing Players Started .... "+Date.now());
	var now = Date.now();
	red.scan(cursor, "COUNT", 50, function(err, res) {
		if (!err)
		{
            console.log(" Inside Scan   .... " + Date.now());
			var keys = res[1];
			for (var t = 0; t < keys.length; t++)
			{
				red.hgetall(keys[t], function(err, obj) {
					var key = this.args[0];
					if (!err)
                    {
                        console.log(" Final Before Messaging.... " + Date.now());
						var days = 0;
						var tsm = obj.tsm | 0;
						
							tsm++;
							red.hmset(key, "tsm", tsm, "lt", now);
							messaging.MessagePlayer(key, obj, tsm, days);
                            console.log("Messaging Player End  .... Key"+key+"   tsm:"+tsm);
					
					}
					else
					{
						console.log(err);
					}
				});
			}
			cursor = res[0];
		}
	});
}

setInterval(ProcessPlayers, 2000);
