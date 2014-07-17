function begin_instructions(instructions, prefix)
{
	hprefix = prefix + "html/";
	main_content(hprefix, instructions.shift());
	// alert("about to click!");
	$(start).click(function(){
		$(start).hide();
		$(next_btn).show();
		main_content(hprefix, instructions.shift());
	});
}

function main_content(prefix, file)
{
	page = prefix + file;
	$.get(page, function(content){
		$("#main_stage").html(content);
	});
}
