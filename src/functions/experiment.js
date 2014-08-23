var Trials = [];
var trial = [];
var ev = {};
var id = "";
var trial_i = 0;
var event_i = 0;
var ids = [];
var events = [];
var data = {};
var settings = {}
var printer = false;
var lastkeypress;
var keyMap = {};
var keys = [];
var subID = "";

//____ NEW Globals
var nTrials = 0;
var nEvents = 0;
//
function begin_block(S, block, D)
{
	loadSettings(block, S, D);
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

function loadSettings(Block, Settings, Data){
	settings = Settings;
	data = Data;
	Trials = block.Trials;
	nTrials = Trials.length;
	subID = block.ID;
}

function resetTrialSettings(){
	lastkeypress = 0;
	keyMap = {};
	keyMap.event = "keyMap";
	keys = [];
	event_i = 0;
	nEvents = trial.length;
}


function loadTrial()
{
	if (trial_i < nTrials){
		trial = Trials[trial_i];
		resetTrialSettings();
		console.log("Trial " + trial_i);
		data.addEvent("Loaded trial " + trial_i);
		++trial_i;
		nextEvent();
	}
	else{
		finished();
	}
}

function nextEvent()
{
	if (event_i < nEvents){
		loadEvent();
	}
	else{
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

function loadEvent()
{
	collect = {};
	ev = trial[event_i];
	++event_i;
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
		data.addObject(collect);
	}
}

function timedEvent()
{
	showinmain(id);
	print_attrs(id);
	time = ev.duration;
	data.addObject(collect);
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
			data.addObject(collect);
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
	data.addObject(collect);
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
	data.addObject(collect);
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
		bw = new blockWriter(fname, data.set, settings);
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
		}, 10*nTrials);
	});
}

function load_EvID()					// load most recent event and id
{
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
	data.addObject(keyMap);
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