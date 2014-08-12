function main_content(prefix, file, also, that)
{
	page = prefix + file;
	$.get(page, function(content){
		$("#main_stage").html(content);
		if (typeof also !== "undefined"){
			$("#"+also).val(that);
		}
	});
}

//copied from http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
function getQueryVariable(variable) 
{
    var query = window.location.search.substring(1);
    var vars = query.split('&');			// split into array of strings delimited by "&"
    for (var i = 0; i < vars.length; i++) 
	{
        var pair = vars[i].split('=');	// split into array of strings delimited by "="
        if (decodeURIComponent(pair[0]) == variable) 
		{
            return decodeURIComponent(pair[1]);
        }
    }
    return(999999);
}
