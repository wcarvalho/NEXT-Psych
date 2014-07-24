<html>
	<head>
		<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
		<script src="src/functions/init_instruct.js" type="text/javascript"></script>
		<script src="src/functions/experiment.js" type="text/javascript"></script>
		<script src="src/functions/load.js" type="text/javascript"></script>
		<script src="src/functions/BlockLoader.js" type="text/javascript"></script>
		<script src="src/functions/BlockRunner.js" type="text/javascript"></script>
		<script src="src/functions/Collector.js" type="text/javascript"></script>
		<script src="src/functions/output.js" type="text/javascript"></script>

  </head>
	<body>

	<!-- =============================== php =============================== -->
		<?php
			include 'src/functions/functions.php';
			
			$d = jsonfile_array("src/settings.json");
			$direcfull = $d["primary"];

			$htmlfiles = array();
			$blocks = array();
			ListtoArray($direcfull . $d["html"] . "order.txt", $htmlfiles);				// html files loaded
			ListtoArray($direcfull . $d["blocks"] . "order.txt", $blocks);				// blocks loaded
			
			$files = array(array()); 
			load_direc($direcfull.$d["image"], $files);
			load_direc($direcfull.$d["audio"], $files);
			load_direc($direcfull.$d["video"], $files);
			load_direc($direcfull.$d["text"], $files);
			load_direc($direcfull."html/", $files);

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

				var blocks = [];
				var settings = <?php echo json_encode($d); ?>;
		    settings.get = function(what){
		    	return this.primary + this[what];
		    }
				var prefix = settings["primary"];

		    var files = <?php echo json_encode($files); ?>;
		    var htmlfiles = <?php echo json_encode($htmlfiles); ?>;
		    var blockfiles = <?php echo json_encode($blocks); ?>;

		    for (var key in blockfiles){
		    	blockfiles[key] = settings.get("blocks") + blockfiles[key];
					$.getJSON(blockfiles[key], function(data){
						blocks.push(data);
					}).fail(function() {
						alert( "error loading " + blockfiles[key]);
				  }).done(function(){
						B = new BlockLoader(blocks[blocks.length -1], settings);
						B.LoadInstructions();
						B.loadElements(files);
						if (blocks.length === blockfiles.length){
							D.addEvent("Loaded All Data");
					    begin_instructions(htmlfiles, prefix);
						}
				  });
		    }
	



				$('#next_btn').click(function(){
					if (htmlfiles.length !== 0)
						main_content(settings.get("html"), htmlfiles.shift());
					if (htmlfiles.length === 0)
						{ 
							$("#main_stage").html("");
							$('#next_btn').click(function(){
								$("#next_btn").hide();
								B = new BlockRunner(blocks, D);
								B.Run();
								// begin_block(prefix, blocks[0], D);

								// write_output(D, settings.get("output"));
							});
						}
				});

			});
		</script>

	<!-- =============================== javascript =============================== -->
	</body>

</html>