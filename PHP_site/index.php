<html>
<head>
	<Title>
		Html-Note
	</Title>
</head>
<body>
	<?php $path = "D:\s_c\PHP\php_NoteHtml\datafile";
		  $filename = basename($path);
		  echo "$filename";
	?>
	<?php $f = fopen($path, "rt");
		  while(!feof($f)) {
		  	echo urldecode(fgets($f));
		  	echo "<br />";
		  }
		  fclose($f);
	?>
	<?php 
		$elemnt = file("$path");
		foreach($elemnt as $ele){
			if(trim($ele) == ""){
				//echo "$ele is null.";  // ""enable '$'ele. Elsewise '' direct show literacal.
			}
			else{
				list($el, $dat) = explode("<>", $ele);
				$el = urldecode($el);
				list($tit, $u) = explode("&u=", $el);
				echo "<a href=\"mailto:\">$dat : $tit,  &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp$u</a> <br />";
			}
			
		}
	?>
</body>
</html>