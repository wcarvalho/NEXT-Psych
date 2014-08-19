var Trials = [];
var trial = [];
var ev = {};
var id = "";
var trials = 0;
var evnum = 0;
var ids = [];
var events = [];
var Data = {};
var settings = {}
var printer = false;
var lastkeypress;
var keyMap = {};
var keys = [];
var subID = "";

function begin_block(S, block, D)
{
	Data = D;
	Trials = block.Trials;
	settings = S;
	subID = block.ID;
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

function resetTrialSettings(){
	lastkeypress = 0;
	keyMap = {};
	keyMap.event = "keyMap";
	keys = [];
	evnum = 0;
}

function loadTrial()
{
	if(Trials.length !==0)
	{
		++trials;
		console.log("Trial " + trials);
		Data.addEvent("Loaded trial " + trials);
		trial = Trials.shift();
		resetTrialSettings();
		nextEvent();
	}
	else
		finished();
}

function nextEvent()
{
	if(trial.length !==0)
	{
		++evnum;
		loadEvent();
	}
	else
	{
		loadTrial();
	}
}

chooseEvent = function(type){	

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

notUndefined = function(what, doThis){
	if (typeof what !== "undefined")
		doThis();
}

ifis = function(what, is, doThis){
	if (typeof what === is){
		doThis();
	}
}

intoArray = function(something){
	temp = something;
	something = [];
	something.push(temp);
}

function loadEvent()
{
	collect = {};
	load_EvID();
	collect.subeventType = ev.eventType;
	var type = ev.eventType;
	if ((typeof id !== "undefined")&&(id !== ""))
		collect.id = id;
		
	$.getScript('src/functions/BlockRunner.js', function(){
		if ( (typeof id !== "undefined")&&(id.length !== 0) ){
			M = new Mover(id);
			M.place(ev.x, ev.y, ev.width);
		}
	});

	// notUndefined(ev.press, function(){
	// 	ifis(ev.press, "number", intoArray(ev.press));
	// 	for (var key in ev.press){
	// 		keyMap[ev.press[key]] = id;
	// 		keys.push(ev.press[key]);
	// 	}
	// })

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
		addClearer(toClear);
	}
	else{
		for(var j = 0; j < ev.which.length; ++j){
			hideindata(ev.which[j]);
		}
		addClearer(ev.which);
	}
	nextEvent();
}

function addClearer(toClear){
	if (toClear.length !== 0){
		collect.Cleared = toClear;
		Data.addObject(collect);
	}
}

function timedEvent()
{
	showinmain(id);
	print_attrs(id);
	time = ev.duration;
	Data.addObject(collect);
	setTimeout( function(){
		nextEvent();
	}, time);
}

function feedbackEvent()
{
	if (typeof ev.press === "undefined"){ ev.press = []; }
	if ( ev.press.indexOf(lastkeypress) === -1 ){    // if last key press is NOT in press DO
		var mimic = ev.mimicks;
		collect.Mimicks = mimic;
		var chosen = keyMap[lastkeypress];
		collect.Correct = ev.correct;
		collect.Chosen = chosen;
		if (ev.correct === "chosen"){
			id = chosen;
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
			collect.id = id;
		}
		else{
			id = "";
		}
		chooseEvent(mimic);
	}
	else
		nextEvent();
	
}

keyListener = function(doExtra){
	window.onkeypress = function(event){
		press = event.keyCode;
		if (keys.indexOf(press) !== -1)
		{
			collect.press = press;
			lastkeypress = collect.press;
			collectKeyMap();
			Data.addObject(collect);
			window.onkeypress = null;
			if (typeof doExtra !== "undefined"){
				doExtra();
			}
			nextEvent();
		}
	}
}

function keydepEvent()
{
	showinmain(id);
	print_attrs(id);
	keyListener();
}

function timedkeyEvent()
{
	time = ev.duration;
	showinmain(id);
	keyListener();
	Data.addObject(collect);
	setTimeout( function(){
			nextEvent();
	}, time);
}

function timedorkeyEvent()
{
	time = ev.duration;
	showinmain(id);
	keyListener(function(){
		window.clearTimeout(timeout);
	});
	Data.addObject(collect);
	var timeout = setTimeout( function(){
		window.onkeypress = null;
		nextEvent();
	}, time);
}

function finished()
{
	$("#main_stage").html("");
	$.getScript('src/functions/blockWriter.js', function()
	{
		var fname = subID+"_"+FullTimeAndDate();
		bw = new blockWriter(fname, Data.set, settings);
	}).done(function(){
		setTimeout( function(){
			if (typeof block.post_experiment !== "undefined"){
				$.get(hprefix + block.post_experiment, function(content){
					$("#main_stage").html(content)
				}).
				done(function(){
					document.getElementById("swap").innerHTML = subID;
				});
			}
		}, 3000);
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

function collectKeyMap(){
	Data.addObject(keyMap);
}

function FullTimeAndDate(){
	var D = new Date();
	var DD = D.getDate();
	var YYYY = D.getFullYear();
	var MM = D.getMonth();
	var hh = D.getHours();
	var mm = D.getMinutes();
	return YYYY+"_"+MM+"_"+DD+"_"+hh+"_"+mm;
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