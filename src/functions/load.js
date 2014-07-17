function load_stimuli(stimarray, block)
{

	check_stimlist(stimarray, block);
	console.log(stimarray);
	for (var stim=0; stim<stimarray.length; ++stim)
	{
		current = stimarray[stim];
		id = current[1];
		src = current[0] + id;
		div = "data";
		x = current[2];
		y = current[3];
		width = current[4];
		type = current[5];
		insert_stim(type, id, src, div, x, y, width);
	}

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

function get_type(direc)
{
	s = "stimuli/";
	beginsat = direc.indexOf(s) + s.length; 
	restofword = direc.substring(beginsat, direc.length);
	endsat = beginsat + restofword.indexOf("/");
	return direc.substring(beginsat,endsat);
}

function check_stimlist(stimarray, block)
{
	// lists of all stims in all events in block
	var stims = [];
	var stims_basic = [];
	var inner = [];
	for (var tr = 0; tr < block.Trials.length; ++tr)
	{
		for (var ev = 0; ev < block.Trials[tr].length; ++ev)
		{
			thisev = block.Trials[tr][ev];
			if ((typeof thisev.what != 'undefined'))
			{
				stim = thisev.what.trim();
				inner.push(stim);
				stims_basic.push(stim);
				where = thisev.where;
				if (typeof where != 'undefined')
					for (var key in where)
						inner.push(where[key]);			 
				inner.push(thisev.tag);
				stims.push(inner);
			}
			inner = [];
		}
	}

	// gos through every stim in stimarray and checks that stim is in one of the events
	for (stim = 0; stim < stimarray.length; ++stim)
	{
		current = stimarray[stim][1];
		block_tr = stims_basic.indexOf(current); 
		if (block_tr === -1)
		{
			stimarray.splice(stim, 1);
			--stim;
		}
		else
		{
			coordinates = stims[block_tr].slice(1,5);
			if (coordinates.length != 0)
				for (var key in coordinates)
					stimarray[stim].push(coordinates[key]);
		}
	}	
}