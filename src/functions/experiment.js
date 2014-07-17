var Trials = [];
var trial = [];
var ev = {};
var id = "";
var trials = 0;
var ids = [];


function begin_block(prefix, block)
{
	Trials = block.Trials;
	$.getScript('src/functions/init_instruct.js', function()
	{
		main_content(hprefix, block.instructions);
		window.onkeypress = function(event)
		{
			if (event.keyCode === 32) loadTrial();
		}
	});
}

function loadTrial()
{
	++trials;
	console.log(Trials.length + " trials left");
	if(Trials.length != 0)
	{
		block.Data.addEvent("Loaded trial " + trials);
		block.Data.lastCollection();
		trial = Trials.shift();
		nextEvent()
	}
	else
		finished();
}

function nextEvent()
{
	if(trial.length != 0)
	{
		console.log("loading next event");
		loadEvent();
	}
	else
	{
		loadTrial();
	}
}

function loadEvent()
{
	var current = trial[0];
	var type = current.eventType;
	console.log("\t" + trial.length + " events left");
	console.log("\tnext type = " + type);
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
	console.log("\t\tclearEvent");
	ev = trial.shift();
	console.log("ev.which[0] = " + ev.which[0]);
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
		console.log("else");
	}
	nextEvent();
}

function timedEvent()
{
	collect = {};
	console.log("\t\ttimedEvent");
	load_EvID()
	collect.id = id;
	time = ev.duration;
	showinmain(id);
	console.log("\t\tsupposed to wait " + time/1000 + " seconds")
	setTimeout( function(){
		block.Data.addObject(collect);
		nextEvent()
	}, time);
}

function feedbackEvent()
{
	load_EvID();

}

function keydepEvent()
{
	collect = {};
	console.log("\t\tkeydepEvent");
	load_EvID();
	showinmain(id);
	collect.id = id;
	var keys = ev.correctkeys;
	window.onkeypress = function(event)
		{
			press = event.keyCode;
			if (keys.indexOf(press) != -1)
			{
				collect.press = press;
				document.onkeypress = null;
				block.Data.addObject(collect);
				nextEvent();
			}
		}
}

function timedkeyEvent()
{
	collect = {};
	console.log("\t\ttimedEvent");
	load_EvID();
	collect.id = id;
	time = ev.duration;
	showinmain(id);
	console.log("\t\tsupposed to wait " + time/1000 + " seconds")
	var keys = ev.correctkeys;
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
				alert("key pressed is " + event.charCode);
			}
		}
	}
	setTimeout( function(){
			block.Data.addObject(collect);
			nextEvent();
	}, time);
}

function finished()
{
	console.log(block.Data);
	alert("finished!!");
}

function load_EvID()					// load most recent event and id
{
	ev = trial.shift();
	if (typeof ev.id !== "undefined")
		id = ev.id;
	else
		id = ev.filename;
	console.log("\t\tchanging id to " + id);
}

// =====================================================================================
//							move and display elements
// =====================================================================================
function showinmain(what)
{
	if (ids.indexOf(what) === -1){
		move_to("main_stage", what);
	}
	console.log("show " + what +" in main");
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