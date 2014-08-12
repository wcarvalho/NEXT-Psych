function BlockLoader(block, settings){

	this.Elements = new Elements();
	this.settings = settings;
	this.instructions = block.instructions;
	this.fullfiles = [];
	this.fileIndex = [];

	// this.LoadInstructions = function(list){
	// 	if (typeof life !== "undefined")
	// 		var instructions = list;
	// 	else
	// 		var instructions = this.instructions;
	// 	for (var key in instructions){
	// 		var cur_ins = this.instructions[key];
	// 		var temp = Object();
	// 		temp.id = cur_ins;
	// 		temp.tag = "div";
	// 		if (this.Elements.ids.indexOf(temp.id) === -1){
	// 			this.Elements.add(temp, "data");
	// 			var page = this.settings.get("html")+cur_ins;
	// 			$.get(page, function(content){
	// 			  document.getElementById(cur_ins).innerHTML = content;
	// 			}).fail( function(){
	// 				alert(page + "didn't load!");
	// 			});
	// 		}
	// 		else{
	// 			console.log(temp.id + " already exists... lol");
	// 		}
	// 	}
	// }

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
					// console.log(temp);
					var temp = Object();
					temp.tag = current.tag;

					if(typeof current.filename !== "undefined")
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
			var index = this.fileIndex.indexOf(from.filename);
			var full = this.fullfiles[index][0] + this.fullfiles[index][1];
			to.src = full;
		}
		else
			alert("you didn't load your files");
	}

	this.addTextProp = function(to, from){
		// if (from.file)
		// 	textFiletoDiv(from.filename, "."+to.id);
		// else
			document.getElementById(to.id).innerHTML = from.content;
	}
}

function Elements(){
	this.set = [];
	this.raw = [];
	this.current = -1;
	this.latest = -1;
	this.ids = [];

	var allTags = document.body.getElementsByTagName('*');
	for (var tg = 0; tg< allTags.length; tg++) {
    var tag = allTags[tg];
    if (tag.id) {
      this.ids.push(tag.id);
		}   
	}


	this.setCurrent = function(which){
		if (which ==! "undefined")
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
		var raw = this.raw[this.current];			//this is the data collected from the block

		var X = document.getElementById(current.id); //this is a DOM element inside data
		var s = X.style;
		s.position = "absolute";	
	
		if ((typeof raw.width === 'default') || (raw.width === -1))
			{
				s.width = "300px";
			}
		else s.width = raw.width+"px";

		if ((typeof raw.x === 'undefined')||(raw.x === -1))
		{
			s.left = "50%";
			var xwidth = (X.style.width);
			xwidth = xwidth.substring(0, xwidth.length - 2);
			xwidth = parseFloat(xwidth);
			s.marginLeft = -xwidth/2.0;
		} 
		else{
			s.left = raw.x+"px";
		}
		
		if ((typeof raw.y === 'undefined')||(raw.y === -1))
		{
			s.top = "50%";
			s.marginTop = -(X.height)/2.0+"px";	} 
		else{
			s.top = raw.y+"px";
		}
	}
}
