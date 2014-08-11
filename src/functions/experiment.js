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
var keyMap = {};
var keys = [];

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
				$("#main_stage").html("");
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
		nextEvent();
		lastkeypress = 0;
		keyMap = {};
		keys = [];
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
		console.log("type = " + type);
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
	if (id !== ""){
		console.log("id for mover = " + id)
		$.getScript('src/functions/BlockRunner.js', function(){
			M = new Mover(id);
			M.place(ev.x, ev.y, ev.width);
		});
	}

	if (ev.press !== "undefined"){
		if (typeof ev.press === "number"){
			temp = ev.press;
			ev.press = [];
			ev.press.push(temp);
		}
		for (var key in ev.press){
			keyMap[ev.press[key]] = id;
			keys.push(ev.press[key]);
		}
	}
	console.log("keyMap = ");
	console.log(keyMap);
	chooseEvent(type);

}

function clearEvent()
{
	if (typeof ev.except === "undefined"){ ev.except = []; }
	if (typeof ev.except === "string"){
		var temp = ev.except;
		ev.except = [];
		ev.except.push(temp);
	}
	if (typeof ev.which === "string"){
		var temp = ev.which;
		ev.which = [];
		ev.which.push(temp);
	}

	console.log("clearing " + ev.which);
	console.log("except " + ev.except);
	if (ev.which[0] === "all"){
		var toClear = [];
		for (var i = 0; i < ids.length; ++i){
			toClear.push(ids[i]);
		}
		for (var i = 0; i < ev.except.length; ++i){
			var dontClear = toClear.indexOf(ev.except[i]);
			toClear.splice(dontClear, 1);
		}
		for(var i = 0; i < toClear.length; ++i){
			hideindata(toClear[i]);
		}
	}
	else{
		for(var j = 0; j < ev.which.length; ++j){
			console.log("hiding " + ev.which[j]);
			hideindata(ev.which[j]);
		}
	}
	nextEvent();
}

function timedEvent()
{
	collect.eventType = ev.eventType;
	if (id !== ""){
		collect.id = id;
		showinmain(id);
		print_attrs(id);
	}
	time = ev.duration;
	setTimeout( function(){
		Data.addObject(collect);
		nextEvent()
	}, time);
}

function feedbackEvent()
{
	if (typeof ev.press === "undefined"){ ev.press = []; }
	if ( ev.press.indexOf(lastkeypress) === -1 ){    // if last key press is NOT in press DO
		var mimic = ev.mimicks;
		console.log("mimic = " + mimic);
		if (ev.correct === "chosen"){
			id = keyMap[lastkeypress];
		}
		else{
			id = ev.correct;
		}
		if (typeof ev.except === "string"){
			var temp = ev.except;
			ev.except = [];
			ev.except.push(temp);
		}
		if (typeof ev.except === "undefined"){
			ev.except = [];
		}
		if (typeof id !== "undefined"){
			ev.except.push(id);
		}
		else{
			id = "";
		}
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
	executed = false;
	presses = 0;
	window.onkeypress = function(event)
	{
		press = event.keyCode;
		if (keys.indexOf(press) !== -1)
		{
			collect.press = press;
			lastkeypress = collect.press;
			Data.addObject(collect);
			++presses;
			window.onkeypress = null;
			window.clearTimeout(timeout);
			nextEvent();
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
		bw.asJSON();
		bw.asString();
	}).done(function(){
	});
}

function load_EvID()					// load most recent event and id
{
	ev = trial.shift();
	events.push(ev);
	id = "";
	if (typeof ev.id !== "undefined")
		id = ev.id;
	else{
		if (typeof ev.filename !== "undefined"){
			id = ev.filename;
		}
	}
}

// =====================================================================================
//							move and display elements
// =====================================================================================
function print_attrs(id){
	if (printer){
		var temp = document.getElementById(id);
	}

}

function showinmain(what)
{
	if (id !== ""){
		if (ids.indexOf(what) === -1){
			move_to("main_stage", what);
		}
		show(what);
		ids.push(what);
	}
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
	console.log("moving = " + what);
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