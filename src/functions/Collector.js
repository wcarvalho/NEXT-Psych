function Data(){
	this.set = [];

	this.begin = new Date();
	console.log(this.begin);
	this.startTime = this.begin.getTime();
	this.currentTime = this.startTime;

	this.TimeSoFar = function(){
		var lastTime = this.currentTime;
		this.current = new Date();
		this.currentTime = this.current.getTime();
		this.collect.TimeSinceStart = this.currentTime - this.startTime;
		this.collect.TimeSinceLast = this.currentTime - lastTime;
	}

	this.addEvent = function(event){
		this.collect = {};
		this.collect.event = event;
		this.TimeSoFar();
		this.set.push(this.collect);
		// this.lastCollection();
	}

	this.addObject = function(object){
		this.collect = object;
		this.TimeSoFar();
		this.set.push(this.collect);
		this.lastCollection();
	}
	this.lastCollection = function(){
		console.log(this.collect);
	}
}
