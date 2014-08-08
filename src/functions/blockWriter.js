function blockWriter(Filename, D, settings){
	this.set = D.set;
	this.fname = "../../" + settings.get("results") + Filename;
	console.log(this.fname);
	this.asString = function(){
		console.log("printing array");
		this.ajax_call("write_as_string.php", this.fname+"_result.txt");

	}
	this.asJSON = function(){
		console.log("printing json");
		this.ajax_call("write_as_json.php", this.fname+"_result.json");
	}

	this.ajax_call = function(script, filename){
		var myObj = {
			"set" : this.set,
			"file" : filename
		};
		console.log("myObj = ");
		console.log(myObj);
		dirScript = "src/functions/"+script;
		$.post(dirScript, myObj)
		.done(function( data ) {
    	console.log( dirScript + " successfully loaded" );
    	console.log( "printed data:");
    	console.log(data);
  	})
  	.fail(function( err ){
    	console.log( dirScript + " not successfully loaded" );
  	});
	}

}
