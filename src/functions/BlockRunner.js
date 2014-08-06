function BlockRunner(blocks, Data){
	var whichBlock = -1;
	var Ids = [];
	var M = new Mover;

	newCollector = function(type){ 
		this.collector = {};
		this.collector.block = whichBlock;
		this.collector.trial = this.whichTrial;
		this.collector.event = this.whichEvent;
		if (typeof type !== "undefined")
			this.collector.eventType = type;
		atCollectionPoint("Beginning");
	}

	atCollectionPoint = function(point){
		this.collector.point = point;
		Data.addObject(this.collector);
	}

	endCollector = function(){
		atCollectionPoint("End");	
	}

	showInMain = function(what){
		if (Ids.indexOf(what) === -1){
			M.setId(what);
			M.move("main_stage");
		}
		M.show();
		Ids.push(what);
	}

	hideInData = function(what){
		var index = Ids.indexOf(what);
		if (index !== -1){
			M.setId(what);
			M.move("data");
		}
		M.hide();
		Ids.splice(index, 1);
	}

	clearScreen = function(){
		while(Ids.length !== 0)
			hideInData(Ids[0]);
		$("main_stage").html("");
	}

	keyListener = function(keys, doThis){
		alert("keyListener");
		window.onkeypress = function(event){
			var press = event.keyCode;
			if (keys.indexOf(press) !== -1){
				doThis();
			}
		}
	}

	nextBlock = function(){
		if (blocks.length !== 0){
			console.log("nextBlock");
			this.whichTrial = -1;
			this.whichEvent = -1;
			var block = blocks.shift();
			++whichBlock;
			this.instructions = block.instructions;
			var randomize = block.randomize;
			this.trials = block.Trials;
			loadInstructions();
		}

	}

	nextTrial = function(){
		if (this.trials.length !== 0){
			var trial = this.trials.shift();
			++this.whichTrial;
			Data.addEvent("Loaded Trial " + this.whichTrial);
			nextEvent()
		}
		else
			nextBlock();

	}

	nextEvent = function(){
		if (trial.lenth !== 0){
			var Event = trial.shift();
			++this.whichEvent;
			loadEvent();
		}
		else
			nextTrial();
	}

	nextInstruction = function(){
		if (this.instructions.length !== 0)
		{
			this.instruction = this.instructions.shift();
			showInMain(this.instruction);
		}
		else
			return -1;
	}

	loadInstructions = function(){
		clearScreen();
		var keys = [32];
		console.log("Loading this.instructions");
		while (this.instructions.length > 0){
			console.log("this.instructions.length = " + this.instructions.length);
			nextInstruction();
			console.log("instruction = " + this.instruction);
			alert("about to listen for keys!");
			keyListener(keys, function(){
				alert("space pressed!");
				hideInData(this.instruction);
				nextInstruction();
			});
			if (this.instructions.length === 0){
				console.log("this.instructions.length = " + this.instructions.length);
				keyListener(keys, function(){
					nextTrial();
				});
			}
		}

	}
	


	loadId = function(){
		if(typeof Event.id !== "undefined")
			Id = Event.id;
		else
			Id = Event.filename;
	}

	chooseEvent = function(type){
		if (type === "Clear")
			clearEvent();
		if (type === "Timed")
			timedEvent();
		if (type === "Feedback")
			feedbackEvent();
		if (type === "Key")
			keyEvent();
		if (type === "TimedKey")
			timedKeyEvent();	
	}

	loadEvent = function(){
		loadId();
		var type = Event.eventType;
		newCollector(type);
		chooseEvent(type);
	}

	clearEvent = function(){
		if (Event.which[0] === "all")
			clearScreen();
		else {
			for (var j = 0; j < Event.which.length; ++j){
				hideInData(Event.which[j]);
			}
		}
		nextEvent();
	}

	timedEvent = function(){
		var duration = Event.duration;
		showInMain(Id);
		setTimeout(function(){
			endCollector();
			nextEvent();
		}, duration);
	}

	feedbackEvent = function(){
		var lastPress = Data.set[Data.set.length - 1].press;
		var allowedPress = Event.press;
		if ( allowedPress.indexOf(lastPress) === -1){
			Mimic = Event.mimics;
			chooseEvent(mimic);
		}
		else{
			endCollector();
			nextEvent();
		}
	}

	keyEvent = function(){
		showInMain(Id);
		var keys = Event.press;
		keyListener(keys, function(){
			this.collector.press = press;
			window.onkeypress = null;
			endCollector();
			nextEvent();
		});
	}	

	timedKeyEvent = function(){
		var duration = Event.duration;
		showInMain(Id);
		var keys = Event.press;
		var presses = 0;
		keyListener(keys, function(){
			while (presses < 1){
				this.collector.press = press;
				atCollectionPoint("Key Pressed");
				++presses;
			}
		});
		setTimeout( function(){
			endCollector();
			nextEvent();
		}, duration);
	}

	this.Run = function(){
		nextBlock();
	}

}

function Mover(id){
	
	this.setId = function(id){
		if (typeof id !== "undefined"){
			this.id = id;
			this.element = document.getElementById(id);
			this.style = this.element.style;
		}
	}
	this.setId(id);

	this.move = function(where){
		document.getElementById(where).appendChild(this.element);
	}

	this.show = function(){
		this.style.display = "";
	}

	this.hide = function(){
		this.style.display = "none";
	}

	this.place = function (x, y, width){

		if (( width === 'default') || (width === -1))
			{
				this.style.width = "300px";
			}
		else
			this.style.width = width+"px";

		if ((typeof x === 'undefined')||(x === -1))
		{
			this.style.left = "50%";
			var xwidth = (this.style.width);
			xwidth = xwidth.substring(0, xwidth.length - 2);
			xwidth = parseFloat(xwidth);
			this.style.marginLeft = -xwidth/2.0;
		} 
		else{
			this.style.left = x+"px";
		}
		
		if ((typeof y === 'undefined')||(y === -1))
		{
			this.style.top = "50%";
			var ywidth = (this.style.width);
			ywidth = ywidth.substring(0, ywidth.length - 2);
			ywidth = parseFloat(ywidth);
			this.style.marginTop = -ywidth/2.0;	} 
		else{
			this.style.top = y+"px";
		}
	}

}