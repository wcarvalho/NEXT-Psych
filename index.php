<?php
session_start();
?>
<html>
	<!-- header with libraries/files that are loaded -->
	<head>
		<script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
		<script src="src/functions/init_instruct.js" type="text/javascript"></script>
		<script src="src/functions/experiment.js" type="text/javascript"></script>
		<script src="src/functions/load.js" type="text/javascript"></script>
		<script src="src/functions/BlockLoader.js" type="text/javascript"></script>
		<script src="src/functions/Collector.js" type="text/javascript"></script>
		<script src="src/functions/blockWriter.js" type="text/javascript"></script>		
		<script src="src/functions/randomize_array.js" type="text/javascript"></script>		

  </head>
	<body>

	<!-- =============================== php =============================== -->
		<?php
			include 'src/functions/include.php';

			$d = jsonToArray("settings.json");
			$prime_dir = $d["primary"];

			$htmlfiles = array();
			PushFileToArray($prime_dir . $d["html"] ."order.txt", $htmlfiles);				// html files loaded

			$blocks = array();
			PushFileToArray($prime_dir . $d["blocks"] . "order.txt", $blocks);				// blocks loaded
			
			$files = array(array()); 
			PushDirToArray($prime_dir.$d["image"], $files);
			PushDirToArray($prime_dir.$d["audio"], $files);
			PushDirToArray($prime_dir.$d["video"], $files);
			PushDirToArray($prime_dir.$d["text"], $files);
			PushDirToArray($prime_dir.$d["html"], $files);

			array_shift($files); // clears the first element of files (which is empty)
		?>
	<!-- =============================== html =============================== -->

		<!-- hidden div that stores all of the objects that are to be presented -->
		<div id="data" style="position: absolute; display:none"> </div> 
		<!-- div that displays screen events to the user -->
		<div id="main_stage" style=""> </div>
		<!-- div below the main display that holds buttons for progression through the instructional screens -->
		<div>
			<center><button id="start" value="start" >Press to Begin</button></center>
			<button id="next_btn" value="continue" style="display:none">Continue</button>
		</div>

	<!-- ============================ javascript =============================== -->
		<script type="text/javascript">

			$(document).ready(function(){

				D = new Data();
				D.addEvent("Began Script");
				D.addObject(getScreenDimensions());
				console.log(D);
				var settings = <?php echo json_encode($d); ?>;
		    settings.get = function(what){
		    	return this.primary + this[what];
		    }
		    var tempsubID;
				var prefix = <?php echo json_encode($prime_dir); ?>;
		    var htmlfiles = <?php echo json_encode($htmlfiles); ?>;
		    var files = <?php echo json_encode($files); ?>;
		    var blockfiles = <?php echo json_encode($blocks); ?>;

		    var b1 = settings.get("blocks")+blockfiles[0];

				$.getJSON(b1, function(data){
					block = data;
					if ((block.randomize > 0)||(block.randomize === true))
						shuffle(block.Trials);
					block.name = "block1";
					B = new BlockLoader(block, settings);
					B.loadElements(files);
					D.addEvent("Loaded all Data");
				}).done(function(){
			    show_instructions(htmlfiles, prefix);
				}).fail(function(data) {
					console.log( "error loading " + b1);
					console.log(data);
			  });



				$('#next_btn').click(function(){
					if (htmlfiles.length !== 0)
						main_content(settings.get("html"), htmlfiles.shift());
					else
						experiment();
				});

				function show_instructions(instructions, prefix)
				{
					hprefix = prefix + "html/";
					tempsubID = getQueryVariable("MID");
					main_content(hprefix, instructions.shift(), "subID", tempsubID.toString());
					$(start).click(function(){
						// tempsubID = document.getElementById("subID").value;
						block.ID = randomnumber=Math.floor(Math.random()*999999);
						console.log("block.ID = " + block.ID);
						$(start).hide();
						if (instructions.length !== 0){
							$(next_btn).show();
							main_content(hprefix, instructions.shift());
						}
						else{
							experiment();
						}
					});
				}

				function experiment(){
					$("#main_stage").html("");
					$("#next_btn").hide();
					var main = document.getElementById('main_stage');
					main.setAttribute("style","display:block;width:800px;height:600px");
					main.style.border = "thick solid #000000"
					main.style.position = "absolute";
					main.style.left = "50%";
					main.style.marginLeft = -(main.offsetWidth)/2.0+"px";
					begin_block(settings, block, D);
				}

			});
		</script>
		<script type="text/javascript">
			getScreenDimensions = function(){
				var size = {
					event: "browsersize",
				  width: window.innerWidth || document.body.clientWidth,
				  height: window.innerHeight || document.body.clientHeight
				}
				return size;
			}
		</script>

	</body>

</html>