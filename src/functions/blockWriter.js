function blockWriter(Filename, DataSet, settings, listname){
	this.dataset = DataSet;
	this.listname = 'defaultlist';
	this.fname = "../../" + settings.get("results") + Filename;
	var clearFileScript = "clearFile.php";
	var txtFileScript = "ListToTxt.php";
	var jsonFileScript = "ListToJSON.php";
	var jsonfile = this.fname + "_result.json";
	var txtfile = this.fname + "_result.txt";

	this.setListname = function(name){
		this.listname = name;
	}

	this.setDataSet = function(thisSet){
		this.dataset = thisSet;
	}

	this.setFilename = function(filename){
		this.fname = "../../" + settings.get("results") + filename;
	}



	cloneArray = function(object){
		var clone = [];
		jQuery.extend(clone,object);
		return clone;
	}

	if (typeof listname !== "undefined")
		this.listname = listname;

	ScriptFile = function (script){
		return "src/functions/"+script;
	}

	clearFile = function(file){
		var obj = { 'file' : file };
		$.post(ScriptFile(clearFileScript), obj);
	}	
	getTempArray = function(set, maxSize){
		var temp = [];
		var counter = 0;
		while ((counter < maxSize)&&(set.length !== 0)){
			var el = set.shift();
			temp.push(el);
			++counter;
		}
		return temp;
	}

	finalObject = function(list, max, file){
		obj = {
			'listname' : list,
			'max': max,
			'file' : file
		}
		return obj;
	}

	populateList = function(Set, listname){
		var counter = 0;
		var tempSize = 50;
		tempset = cloneArray(Set);
		var counterMax = Math.ceil(tempset.length/tempSize); 
		var List = listname;
		console.log(List);
		for (var i = 0; i < counterMax; ++i){
			console.log("i = " + i);
			console.log("counterMax = " + counterMax);
			console.log("length of before getTemp array = " + tempset.length);
			sendObject = {
				'listname' : List,
				'which' : i,
				 'set' : getTempArray(tempset, tempSize),
				 'max' : counterMax
			}
			console.log("length of after getTemp array = " + tempset.length);
			$.post(ScriptFile("populateArray.php"), sendObject).done(function(data){
				console.log(data);
				if (data === "1"){
					console.log("inside if");
					txtObj = finalObject(List, counterMax, txtfile);
					jsonObj = finalObject(List, counterMax, jsonfile);
					$.post(ScriptFile(txtFileScript), txtObj).done(function(data){
						console.log(data);
					});
					$.post(ScriptFile(jsonFileScript), jsonObj).done(function(data){
						console.log(data);
					});
				}
			});
		}
	}

	this.saveList = function(set, list){
		$.post(ScriptFile("declareGlobalArray.php"), {'name': list}).
		done(function(data){
			if (data === "1"){
				populateList(set, list);
			}
		});
	}

	this.saveList(this.dataset, this.listname);

























// 	this.asString = function(){
// 		var set = this.cloneArray(this.set);
// 		while (set.length !== 0){
// 			var temp = this.getTempArray(set);
// 			// this.ajax_call(, this.sentSetFile(txtfile, temp) );
// 		}

// 	}

// 	this.store_list = function(){
// 		var set = this.cloneArray(this.set);
// 		while (set.length !== 0){
// 			var temp = this.getTempArray(set);
// 			this.ajax_call("store_list.php", {'set': temp} );
// 		}
// 	}
		

// 	this.asJSON = function(){
// 		// this.ajax_call(, {'file': jsonfile} );
// 	}

// 	this.sentSetFile = function(file, set){
// 		object = {
// 			'file' : file,
// 			'set' : set
// 		}
// 		return object;
// 	}

// 	this.ajax_call = function(script, myObj){
// 		dirScript = ScriptFile(script);
// 		$.post(dirScript, myObj)
// 		.done(function( data ) {
// 			console.log("dirScript = " + dirScript);
//     	console.log( "returns:");
//     	console.log(data);
//   	})
//   	.fail(function( err ){
//     	console.log( dirScript + " not successfully loaded" );
//   	});
// 	}

}
