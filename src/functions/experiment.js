var Trials = [];
var trial = [];
var ev = {};
var id = "";
var trials = 0;
var ids = [];
var events = [];
var Data = {};

function begin_block(prefix, block, D)
{
	Data = D;
	console.log("BEGIN BLOCK!!");
	Trials = block.Trials;
	$.getScript('src/functions/init_instruct.js', function()
	{
		main_content(hprefix, block.instructions);
		window.onkeypress = function(event)
		{
			if (event.keyCode === 32){
				var code = loadTrial();
			}
			if (code === "exit")
			{
				console.log(code);
				return;
			}
		}
	});
}

function loadTrial()
{
	if(Trials.length != 0)
	{
		++trials;
		Data.addEvent("Loaded trial " + trials);
		trial = Trials.shift();
		nextEvent()
	}
	else
		return "exit";
}

function nextEvent()
{
	if(trial.length != 0)
	{
		loadEvent();
	}
	else
	{
		loadTrial();
	}
}

function loadEvent()
{	
	collect = {};
	load_EvID();
	var type = ev.eventType;
	if (type === "Clear")
		clearEvent();
	if (type === "Timed")
		timedEvent();
	if (type === "Feedback")
		feedbackEvent();
	if (type === "Key")
		keydepEvent();
	if (type === "TimedKey")
		timedkeyEvent();

}

function clearEvent()
{
	if (ev.which[0] === "all"){
		while(ids.length !== 0){
			hideindata(ids[0]);
		}
		$("#main_stage").html("");
	}
	else{
		for(var j = 0; j < ev.which.length; ++j){
			hideindata(ev.which[j]);
		}
	}
	nextEvent();
}

function timedEvent()
{
	collect.eventType = ev.eventType;
	collect.id = id;
	collect.at = "Beginning"
	Data.addObject(collect)
	collect.at = "Ending"
	time = ev.duration;
	showinmain(id);
	setTimeout( function(){
		Data.addObject(collect);
		nextEvent()
	}, time);
}

function feedbackEvent()
{
	var lastPressed = Data.set[Data.set.length - 1].press;
	var acceptablePresses = ev.press;
	if ( acceptablePresses.indexOf(lastPressed) === -1 ){
		var mimic = ev.mimics;
		console.log("mimic = "+ mimic);
		if (mimic === "Timed")
			timedEvent();
		if (mimic === "Key")
			keydepEvent();
		if (mimic === "TimedKey")
			timedkeyEvent();	
	}
	else
		nextEvent();
	
}

function keydepEvent()
{
	showinmain(id);
	collect.eventType = ev.eventType;
	collect.id = id;
	collect.at = "Beginning"
	Data.addObject(collect)
	collect.at = "Ending"
	var keys = ev.press;
	window.onkeypress = function(event)
		{
			var press = event.keyCode;
			if (keys.indexOf(press) != -1)
			{
				collect.press = press;
				window.onkeypress = null;
				Data.addObject(collect);
				nextEvent();
			}
		}
}

function timedkeyEvent()
{
	collect.eventType = ev.eventType;
	collect.id = id;
	collect.at = "Beginning"
	Data.addObject(collect)
	collect.at = "Ending"
	time = ev.duration;
	showinmain(id);
	var keys = ev.press;
	executed = false;
	presses = 0;
	window.onkeypress = function(event)
	{
		while (presses < 1)
		{
			press = event.keyCode;
			collect.press = press;
			if (keys.indexOf(press) != -1)
			{
				++presses;
			}
		}
	}
	setTimeout( function(){
			Data.addObject(collect);
			nextEvent();
	}, time);
}

function load_EvID()					// load most recent event and id
{
	ev = trial.shift();
	events.push(ev);
	if (typeof ev.id !== "undefined")
		id = ev.id;
	else
		id = ev.filename;
}

// =====================================================================================
//							move and display elements
// =====================================================================================
function showinmain(what)
{
	if (ids.indexOf(what) === -1){
		move_to("main_stage", what);
	}
	show(what);
	ids.push(what);
}

function hideindata(what)
{
	var i = ids.indexOf(what);
	if (i !== -1){
		move_to("data", what);
	}
	hide(what);
	ids.splice(i,1);
}

function move_to(div, what)
{
	document.getElementById(div).appendChild( document.getElementById(what) );
}

function show(what)
{
	x = document.getElementById(what);
	s = x.style;
	s.display = "";
}

function hide(what)
{
	x = document.getElementById(what);
	s = x.style;
	s.display = "none";
}