var Trials = [];
var trial = [];
var ev = {};
var id = "";
var trials = 0;
var ids = [];
var events = [];
var Data = {};
var settings = {}
var printer = false;
var lastkeypress;

function begin_block(S, block, D)
{
	Data = D;
	Trials = block.Trials;
	settings = S;
	$.getScript('src/functions/init_instruct.js', function()
	{
		main_content(hprefix, block.instructions);
		window.onkeypress = function(event)
		{
			if (event.keyCode === 32){
				loadTrial();
			}
		}
	});
}

function loadTrial()
{
	if(Trials.length !==0)
	{
		++trials;
		Data.addEvent("Loaded trial " + trials);
		trial = Trials.shift();
		nextEvent()
	}
	else
		finished();
}

function nextEvent()
{
	if(trial.length !==0)
	{
		loadEvent();
	}
	else
	{
		loadTrial();
	}
}

	chooseEvent = function(type){
		console.log(type);
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
	if (type === "TimedOrKey")
		timedorkeyEvent();
	}


function loadEvent()
{	
	collect = {};
	load_EvID();
	var type = ev.eventType;
	if (type !== "Clear"){
		$.getScript('src/functions/BlockRunner.js', function(){
			M = new Mover(id);
			M.place(ev.x, ev.y, ev.width);
		});
	}
	chooseEvent(type);

}

function clearEvent()
{
	console.log("clearing!");
	console.log(ev.which);
	if (ev.which === "all"){
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
	time = ev.duration;
	showinmain(id);
	print_attrs(id);
	setTimeout( function(){
		Data.addObject(collect);
		nextEvent()
	}, time);
}

function feedbackEvent()
{
	console.log("ev.press = ")
	console.log(ev.press);
	console.log("lastkey = " + lastkeypress);
	if ( ev.press.indexOf(lastkeypress) === -1 ){
		var mimic = ev.mimicks;
		chooseEvent(mimic);
	}
	else
		nextEvent();
	
}

function keydepEvent()
{
	showinmain(id);

	print_attrs(id);

	collect.eventType = ev.eventType;
	collect.id = id;
	var keys = ev.press;
	window.onkeypress = function(event)
		{
			var press = event.keyCode;
			if (keys.indexOf(press) !==-1)
			{
				lastkeypress = collect.press;
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
	time = ev.duration;
	showinmain(id);
	var keys = ev.press;
	presses = 0;
	window.onkeypress = function(event)
	{
		while (presses < 1)
		{
			press = event.keyCode;
			collect.press = press;
			if (keys.indexOf(press) !==-1)
			{
				lastkeypress = collect.press;
				Data.addObject(collect);
				++presses;
				window.onkeypress = null;
			}
		}
	}
	setTimeout( function(){
			Data.addObject(collect);
			nextEvent();
	}, time);
}

function timedorkeyEvent()
{
	collect.eventType = ev.eventType;
	collect.id = id;
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
			if (keys.indexOf(press) !== -1)
			{
				lastkeypress = collect.press;
				Data.addObject(collect);
				++presses;
				window.onkeypress = null;
				window.clearTimeout(timeout);
				nextEvent();
			}
		}
	}
	var timeout = setTimeout( function(){
		if(presses < 1){
			Data.addObject(collect);
			nextEvent();		
		}
	}, time);
}

function finished()
{
	$.getScript('src/functions/blockWriter.js', function()
	{
		bw = new blockWriter("Block", Data, settings);
		// bw.asJSON();
		bw.asString();
	}).done(function(){
		alert("finished!");
	});
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
function print_attrs(id){
	if (printer){
		console.log(id);
		var temp = document.getElementById(id);
		console.log(temp);
		console.log("x = " + temp.offsetLeft);
		console.log("y = " + temp.offsetTop);
	}

}

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