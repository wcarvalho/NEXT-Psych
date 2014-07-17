function element(div) 
{
	this.div = div;
	this.create = function(){
		if (( typeof this.div !== 'undefined') ||
				( typeof this.tag !== 'undefined') ||
				( typeof this.id !== 'undefined')){
		access = document.createElement(this.id);
		access.setAttribute("id", this.id);
	  document.getElementById(this.div).appendChild(access);
	  this.element = access;			
		}
	};

	this.place = function(){
		this.style = document.getElementById(this.id).style;
		this.style.position = "absolute";
		if ((typeof width === 'undefined') || (width === -1))
				this.element.setAttribute("width", "400px");
		else this.element.setAttribute("width", width+"px");
		if ((typeof this.x === 'undefined')||(this.x === -1))
		{
			this.style.left = "50%";
			this.style.marginLeft = -(this.element.width)/2.0+"px";
		} 
		else this.style.left = this.style.left = this.x+"px";
		if ((typeof this.y === 'undefined')||(this.y === -1))
		{
			this.style.top = "50%";
			this.style.marginTop = -(this.element.height)/2.0+"px";	} 
		else this.style.top = this.y+"px";
	}

	this.content = function(){
		if (this.file === false)
			$("#"+id).html(this.what);
		else
			this.element.setAttribute("src", this.src)
	}

}








function Block(block)
{
	this.elements = [];
	this.filenames = [];
	this.ids = [];

	this.loadinstructions = function(){
		var file = block.instructions;
		var i = this.filenames.indexOf(temp);
		var temp = new element("data");
		temp.id = "instruction";
		temp.tag = "div";
		this.elements.push(temp);
	}

	this.loadfilenames = function(filelist){
		for (f = 0; f < filelist.length; ++f)
			this.filenames.push(filelist[f][1]);	
		console.log("this.filenames = ");	
		console.log(this.filenames);	
	}

	this.loadids = function(){
		for (var tr = 0; tr < block.Trials.length; ++tr){
			for (var ev = 0; ev < block.Trials[tr].length; ++ev){
				current = block.Trials[tr][ev];
				if (typeof current.what !== 'undefined')
					if(current.file !== false)
						this.ids.push(current.what);
			}			
		}
	}

	this.createElements = function(){
		ids = [];
		for (var tr = 0; tr < block.Trials.length; ++tr){
			for (var ev = 0; ev < block.Trials[tr].length; ++ev){ 
				thisev = block.Trials[tr][ev];
				if (typeof thisev.what != 'undefined')
				{
					el = new element("data", thisev.tag);
					what = thisev.what.trim();
					ids.push(what);
					if (thisev.file === false){
						el.id = block.Trials[tr][ev-1].what + "_follow";
						el.html = what;
						el.file = false;
					}
					else{
						el.id = what;
					}
					where = thisev.where;
					if (typeof where != 'undefined'){
						el.x = where[0];
						el.y = where[1];
						el.width = where[2];
					}
					el.trial = tr;
					el.event = ev;
					this.elements.push(el);
				}
			}	
		}
			console.log(this.elements);
	}

	this.checkElements = function(){
		if (this.filenames.length != 0)
		{
			for (i = 0; i < this.elements.length; ++i){
				var element = this.elements[i];
				if (this.filenames.indexOf(element.id) === -1)
					this.elements.splice(i, 1);
			}	
		}
		else{ alert("There are no files"); }
	}

	// this.checkelements = function(filelist){
	// 	for (i = 0; i < this.elements.length; ++i){
	// 		element = this.elements[i];
	// 		if (element.file !== false)
	// 		{
	// 			index = ids.indexOf(element.id);
	// 			this.elements[i].src = filelist[index][0];
	// 		}
	// 	}
	// 	console.log("finished checkelements");
	// }
	this.setelements = function(){
		for (el = 0; el < this.elements.length; ++el){
			element = this.elements[el];
			element.create();
			element.place();
			element.content();
		}
	}
}



function load_stimuli(stimarray, block)
{
	// sample = stimarray[0][0]; 
	// type = get_type(sample);

	B = new Block(block);
	B.loadinstructions();
	B.loadfilenames(stimarray);
	B.loadids();
	B.createElements();
	B.checkElements();
	B.setelements();
	// L.loadids();
	// L.loadblock();
	// L.checkelements();
	// L.setelements();


	// check_stimlist(stimarray, block);
	// for (var stim=0; stim<stimarray.length; ++stim)
	// {
	// 	current = stimarray[stim];
	// 	id = current[1];
	// 	src = current[0] + id;
	// 	div = "data";
	// 	x = current[2];
	// 	y = current[3];
	// 	width = current[4];
	// 	insert_stim(type, id, src, div, x, y, width);
	// }

}

function insert_stim(type, id, src, div, x, y, width)
{
	stim = document.createElement(type);
	stim.setAttribute("id", id);
	stim.setAttribute("src", src);
	stim.setAttribute("style", "display:none");
	stim.setAttribute("class", "stimuli");
  document.getElementById(div).appendChild(stim);

	if ((typeof width === 'undefined') || (width === -1))
		{
			stim.setAttribute("width", "400px");
		}
	else stim.setAttribute("width", width+"px");

  var s = document.getElementById(id).style;
	s.position = "absolute";	
	if ((typeof x === 'undefined')||(x === -1))
	{
		s.left = "50%";
		s.marginLeft = -(stim.width)/2.0+"px";
	} 
	else s.left = s.left = x+"px";
	
	if ((typeof y === 'undefined')||(y === -1))
	{
		s.top = "50%";
		s.marginTop = -(stim.height)/2.0+"px";	} 
	else s.top = y+"px";
}

// function get_type(direc)
// {
// 	s = "stimuli/";
// 	beginsat = direc.indexOf(s) + s.length; 
// 	restofword = direc.substring(beginsat, direc.length);
// 	endsat = beginsat + restofword.indexOf("/");
// 	return direc.substring(beginsat,endsat);
// }

// function check_stimlist(stimarray, block, type)
// {
// 	// lists of all stims in all events in block
// 	var stims = [];
// 	var stims_basic = [];
// 	var inner = [];
// 	for (var tr = 0; tr < block.Trials.length; ++tr)
// 	{
// 		for (var ev = 0; ev < block.Trials[tr].length; ++ev)
// 		{
// 			thisev = block.Trials[tr][ev];
// 			if ((typeof thisev.what != 'undefined'))
// 			{
// 				stim = thisev.what.trim();
				

// 				inner.push(stim);
// 				stims_basic.push(stim);
// 				where = thisev.where;
// 				if (typeof where != 'undefined')
// 					for (var key in where)
// 						inner.push(where[key]);			 
// 				stims.push(inner);
// 			}
// 			inner = [];
// 		}
// 	}
// 	console.log("stims = " + stims);
// 	console.log("stims_basic = " + stims_basic);

// 	// gos through every stim in stimarray and checks that stim is in one of the events
// 	for (stim = 0; stim < stimarray.length; ++stim)
// 	{
// 		current = stimarray[stim][1];
// 		block_tr = stims_basic.indexOf(current); 
// 		if (block_tr === -1)
// 		{
// 			stimarray.splice(stim, 1);
// 			--stim;
// 		}
// 		else
// 		{
// 			coordinates = stims[block_tr].slice(1,4);
// 			if (coordinates.length != 0)
// 				for (var key in coordinates)
// 					stimarray[stim].push(coordinates[key]);
// 		}
// 	}
		
// 	console.log(stimarray);
// }