function BlockLoader(block, settings){

	this.Elements = new Elements();
	this.settings = settings;
	this.instructions = block.instructions;
	this.fullfiles = [];
	this.fileIndex = [];

	this.LoadInstructions = function(){
		for (var key in this.instructions){
			var cur_ins = this.instructions[key];
			var temp = Object();
			temp.id = cur_ins;
			temp.tag = "div";
			if (this.Elements.ids.indexOf(temp.id) === -1){
				this.Elements.add(temp, "data");
				var page = this.settings.get("html")+cur_ins;
				$.get(page, function(content){
				  document.getElementById(cur_ins).innerHTML = content;
				}).fail( function(){
					alert(page + "didn't load!");
				});
			}
		}
	}

	this.loadFullFiles = function(filelist){
		this.fullfiles = filelist;
		for (f = 0; f < filelist.length; ++f)
			this.fileIndex.push(filelist[f][1]);
	}

	this.loadElements = function(filelist){
		if (typeof filelist !=="undefined")
			this.loadFullFiles(filelist);
		for (var tr = 0; tr < block.Trials.length; ++tr){
			for (var ev = 0; ev < block.Trials[tr].length; ++ev){
				var current = block.Trials[tr][ev];
				if (typeof current.tag !== 'undefined'){
					var temp = Object();
					temp.tag = current.tag;

					if(current.file)
						temp.id = current.filename;
					else
						temp.id = current.id;

					if (this.Elements.ids.indexOf(temp.id) === -1){
						if (current.type === "media")
							this.addMediaProp(temp, current);

						temp.x = current.x;
						temp.y = current.y;
						temp.width = current.width;

						this.Elements.add(temp, "data");
						if (current.type === "text")
							this.addTextProp(temp, current);
						this.Elements.place();
					}

				}
			}
		}
	}

	this.addMediaProp = function(to, from){
		if (typeof this.fullfiles.length !== 0){
			console.log("from.filename = " + from.filename);
			console.log(this.fileIndex);
			var index = this.fileIndex.indexOf(from.filename);
			var full = this.fullfiles[index][0] + this.fullfiles[index][1];
			to.src = full;
		}
		else
			alert("you didn't load your files");
	}

	this.addTextProp = function(to, from){
		if (from.file)
			textFiletoDiv(from.filename, "."+to.id);
		else
			document.getElementById(to.id).innerHTML = from.content;
	}
}

function Elements(){
	this.set = [];
	this.raw = [];
	this.current = -1;
	this.latest = -1;
	this.ids = [];

	this.loadPageids = function(){
		var temps = document.getElementById("data").children;
		for(var i = 0; i < temps.length; ++i){
			this.ids.push(temps[i].id);
		}
	}

	this.loadPageids();

	this.setCurrent = function(which){
		if (typeof which !== "undefined")
			this.current = which;
		else
			this.current = this.latest;
	}
	this.add = function(e, where){
		this.raw.push(e);
		this.ids.push(e.id);
		var x = document.createElement(e.tag);
		x.id = e.id;
		if (typeof e.src !== "undefined")
			x.src = e.src;
	  document.getElementById(where).appendChild(x);
		this.set.push(x);
		++this.latest;
	}
	this.place = function(which){
		this.setCurrent(which);
		var current = this.set[this.current];
		var raw = this.raw[this.current];
		console.log("this.current = " + this.current);
		console.log("this.set[this.current].id = " + this.set[this.current].id);
		var X = document.getElementById(current.id);
		
		if ((typeof raw.width === 'undefined') || (raw.width === -1))
			{
				X.setAttribute("width", "400px");
			}
		else if (raw.width = "preserve"){
		}
		else 
			X.setAttribute("width", raw.width+"px");

		console.log("width = " + raw.width);
		var s = X.style;
		s.position = "absolute";	
		if ((typeof raw.x === 'undefined')||(raw.x === -1))
		{
			s.left = "50%";
			s.marginLeft = -(raw.width)/2.0+"px";
		} 
		else 
			s.left = s.left = raw.x+"px";
		
		if ((typeof raw.y === 'undefined')||(raw.y === -1))
		{
			s.top = "50%";
			s.marginTop = -(raw.height)/2.0+"px";	} 
		else 
			s.top = raw.y+"px";
	}
}
