var pages = require("./pages.js");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var redis = require("redis");
var messaging = require("./messaging.js");

//var messaging = require("./messaging.js");

console.log('Hoooooooooooooooooolaaaa Bot Started ');

var red = redis.createClient(process.env.REDIS_URL);

red.on("error", (err) => {
    console.log("Redis error: " + err);
});

app.set("port", (process.env.PORT || 8000));
app.use(bodyParser.json());
app.use(cors());

app.listen(app.get("port"), function () {

    console.log('Listen GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');
});

app.get("/bot", function (request, response) {
    console.log('Bot Get  HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH');
    if (request.query["hub.mode"] === "subscribe" && request.query["hub.verify_token"] === pages.GetVertifyToken()) {
        response.status(200).send(request.query["hub.challenge"]);
    }
    else {
        response.sendStatus(403);
    }
});

app.post("/bot", function (request, response) {
    var data = request.body;
    console.log('1 received bot webhook');
    if (data.object === "page" && data.entry !== undefined) {
        console.log('2 Data object Page ');
        data.entry.forEach(function (entry) {
            if (entry.messaging !== undefined) {
                var page_id = entry.id;
                // Iterate over each messaging event
                entry.messaging.forEach(function (event) {
                    if (event.message) {
                        HandleMessage(event);
                        console.log("Someone sent a message ... ");
                    }
                    else if (event.game_play) {
                        console.log("Someone Plays the Game  ... ");
                        HandleGameplay(event, pages.GetGame(page_id));
                    }
                    else {
                        console.log("Webhook received unknown event: ");
                    }
                });
            }
        });
    }
    response.sendStatus(200);
});

function HandleMessage(event) {
}

function HandleGameplay(event, game) {
    var sender_id = event.sender.id;
    var player_id = event.game_play.player_id;
    var context_id = event.game_play.context_id;

	/*if (event.game_play.payload)
	{
		//
		// The variable payload here contains data set by
		// FBInstant.setSessionData()
		//
		var payload = JSON.parse(event.game_play.payload);
	}*/

    AddPlayer(sender_id, player_id, context_id, game);
}

function AddPlayer(sender_id, player_id, context_id, game) {
    var now = Date.now();
    var key = game.key + ":" + player_id;

    red.exists(key, function (err, exists) {
        if (!exists) {
            console.log("  Adding the Player to  Redis... ");
            // Player does not exist so add them
            // pid - Page scoped player id
            // cid - Context ID
            // tsm - Total sent messages since player last played
            // lt - Last time a message was sent (resets each timea message is sent or the player plays the game)
            if (context_id !== undefined)
                red.hmset(key, "pid", sender_id, "cid", context_id, "tsm", "0", "lt", now);
            else
                red.hmset(key, "pid", sender_id, "tsm", "0", "lt", now);


        }
        else {
            // Player has come back so reset send
            red.hmset(key, "tsm", "0", "lt", now);
            console.log("Reset the player  ... ");
        }
    });
}






//var SendRegularity = [
//    1,	// Day 1
//    1,	// Day 2
//    2,	// Day 4
//    2,	// Day 6
//    1,	// Day 7
//]

//function CanSend(tsm, days) {
//    if (tsm >= SendRegularity.length)
//        return false;
//    if (days > SendRegularity[tsm])
//        return true;
//    return false;
//}



//var cursor = 0;
//function ProcessPlayers() {
//    console.log("Processing Players Started .... ");
//    var now = Date.now();
//    red.scan(cursor, "COUNT", 50, function (err, res) {
//        if (!err) {
//            console.log(" Inside Scan   .... " + Date.now());
//            var keys = res[1];
//            for (var t = 0; t < keys.length; t++) {
//                red.hgetall(keys[t], function (err, obj) {
//                    var key = this.args[0];
//                    if (!err) {
//                        console.log(" Final Before Messaging.... " + Date.now());
//                        var days = 0;
//                        var tsm = obj.tsm | 0;

//                        tsm++;
//                        red.hmset(key, "tsm", tsm, "lt", now);
//                        messaging.MessagePlayer(key, obj, tsm, days);
//                        console.log("Messaging Player End  .... Key" + key + "   tsm:" + tsm);

//                    }
//                    else {
//                        console.log(err);
//                    }
//                });
//            }
//            cursor = res[0];
//        }
//    });
//}

//setInterval(ProcessPlayers, 100000);





var SendRegularity = [
	0,	// Day 1
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

function CheckAndRemovePlayer(key, tsm)
{
	if (tsm >= 5)
	{
		red.del(key);
		return true;
	}
	return false;
}

var cursor = 0;
function ProcessPlayers()
{
    console.log("Processing Players Started .... ");
	var now = Date.now();
	red.scan(cursor, "COUNT", 50, function(err, res) {
		if (!err)
        {
            
			var keys = res[1];
			for (var t = 0; t < keys.length; t++)
			{
				red.hgetall(keys[t], function(err, obj) {
					var key = this.args[0];
					if (!err)
                    {
                       
						var days = (now - obj.lt) / (3600000 * 24);
                        var tsm = obj.tsm | 0;

                        console.log("Before Messaging =>>>>>>>>>>>>>>>> Days : " + days + " TSM : " + tsm)
						if (CanSend(tsm, days))
						{
							tsm++;
							red.hmset(key, "tsm", tsm, "lt", now);
                            messaging.MessagePlayer(key, obj, tsm, days);
                            console.log("Messaging Player End  .... Key" + key + "   tsm:" + tsm);
						}
						else
                        {
                           
							CheckAndRemovePlayer(key, tsm);
						}
					}
					else
					{
						//console.log(err);
					}
				});
			}
			cursor = res[0];
		}
	});
}

setInterval(ProcessPlayers, 2000);