<html>
	<head>
		<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
		<script src="src/functions/init_instruct.js" type="text/javascript"></script>
		<script src="src/functions/experiment.js" type="text/javascript"></script>
		<script src="src/functions/load.js" type="text/javascript"></script>
		<script src="src/functions/BlockLoader.js" type="text/javascript"></script>
		<script src="src/functions/Collector.js" type="text/javascript"></script>
		<script src="src/functions/blockWriter.js" type="text/javascript"></script>		

  </head>
	<body>

	<!-- =============================== php =============================== -->
		<?php
			include 'src/functions/functions.php';
			
			$d = jsonfile_array("src/settings.json");
			$direcfull = $d["primary"];

			$htmlfiles = array();
			ListtoArray($direcfull . "html/order.txt", $htmlfiles);				// html files loaded
			
			$files = array(array()); 
			load_direc($direcfull.$d["image"], $files);
			load_direc($direcfull.$d["audio"], $files);
			load_direc($direcfull.$d["video"], $files);
			load_direc($direcfull.$d["text"], $files);
			load_direc($direcfull.$d["html"], $files);

			array_shift($files);
		?>
	<!-- =============================== html =============================== -->

		<div id="data" style="position: absolute; display:none; left: ; top: 0">  </div>
		<div id="main_stage" style="">
		</div>
		<div>
			<button id="start" value="start" >Press to Begin</button>
			<button id="next_btn" value="continue" style="display:none">Continue</button>
			<input id="handler" type="hidden" onkeypress="myFunction()">
		</div>

	<!-- =============================== javascript =============================== -->
		<script type="text/javascript">


			$(document).ready(function(){
				D = new Data();
				D.addEvent("Began Script");

				var settings = <?php echo json_encode($d); ?>;
		    settings.get = function(what){
		    	return this.primary + this[what];
		    }
				var prefix = <?php echo json_encode($direcfull); ?>;
		    var htmlfiles = <?php echo json_encode($htmlfiles); ?>;
		    var files = <?php echo json_encode($files); ?>;
		    
		    bw = new blockWriter("Block1", D);
				bw.asJSON();

		 //    var b1 = settings.get("blocks")+"block1.json";
			// 	$.getJSON(b1, function(data){
			// 		block = data;
			// 		block.name = "block1";
			// 	}).done(function(){
			// 		B = new BlockLoader(block, settings);
			// 		B.LoadInstructions();
			// 		B.loadElements(files);
			// 		D.addEvent("Loaded all Data");
			//     begin_instructions(htmlfiles, prefix);
			// 	}).fail(function() {
			// 		alert( "error loading " + b1);
			//   });

			// 	$('#next_btn').click(function(){
			// 		if (htmlfiles.length !== 0)
			// 			main_content(settings.get("html"), htmlfiles.shift());
			// 		if (htmlfiles.length === 0)
			// 			{ 
			// 				$("#main_stage").html("");
			// 				$('#next_btn').click(function(){
			// 					$("#next_btn").hide();
			// 					begin_block(prefix, block, D);
			// 				});
			// 			}
			// 	});

			});
		</script>

	<!-- =============================== javascript =============================== -->
	</body>

</html>