// Parameters
var pixelSize = 10;
var pixelSpacing = 1;
var xPixels = 106;
var yPixels = 17;
var fillColor = "#27ae60";
var emptyColor = "#1B1B19";
var cw = xPixels * pixelSize + (xPixels - 1); // Canvas width
var ch = yPixels * pixelSize + (yPixels - 1); // Canvas height
var plot = [];
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.canvas.width = cw;
context.canvas.height = ch;
var xpos = 0;
var ypos = 0;

// Fills array/canvas with zeros/squares
context.fillStyle = emptyColor;
for (var col = 0; col < xPixels; col++) {
	var currentCol = [];
	for (var row = 0; row < yPixels; row++) {
		currentCol.push([0,xpos,ypos,pixelSize,pixelSize]);
		context.fillRect(currentCol[row][1],currentCol[row][2],currentCol[row][3],currentCol[row][4]);
		ypos += pixelSize + pixelSpacing;
	}
	ypos = 0;
	xpos += pixelSize + pixelSpacing;
	plot.push(currentCol);	
}

var clicking = false; // Keeps track of if mouse is down.
var fill = false; // Keeps track of initial klick action.

$("#canvas").mousedown(function(e){
	clicking = true;
	var plotPos = getPlotPos(e);
	if (plot[plotPos[0]][plotPos[1]][0] == 0) {
		fill = true;
		fillPlot(e);
	} else {
		fill = false;
		deletePlot(e);
	}
});

$("body").mouseup(function(){clicking = false;});

$("#canvas").mousemove(function(e) {
	if(clicking == false) return;
	if (fill == true) {fillPlot(e);}
	else {deletePlot(e);}   	
});

function deletePlot(e) {
	var plotPos = getPlotPos(e);
	context.fillStyle = emptyColor;
	context.fillRect(plot[plotPos[0]][plotPos[1]][1],plot[plotPos[0]][plotPos[1]][2],plot[plotPos[0]][plotPos[1]][3],plot[plotPos[0]][plotPos[1]][4]);
	plot[plotPos[0]][plotPos[1]][0] = 0;
}

function fillPlot(e) {
	var plotPos = getPlotPos(e);
	context.fillStyle = fillColor;
	context.fillRect(plot[plotPos[0]][plotPos[1]][1],plot[plotPos[0]][plotPos[1]][2],plot[plotPos[0]][plotPos[1]][3],plot[plotPos[0]][plotPos[1]][4]);
	plot[plotPos[0]][plotPos[1]][0] = 1;
}

function getPlotPos(e) {
	var parentOffset = $("#canvas").offset();
   	var mouseX = (e.pageX - parentOffset.left);
   	var mouseY = (e.pageY - parentOffset.top);
	var borderOffsetX = mouseX;
	var borderOffsetY = mouseY;

	borderOffsetX = parseInt(borderOffsetX/(pixelSize + pixelSpacing), pixelSize)*pixelSize;
	borderOffsetY = parseInt(borderOffsetY/(pixelSize + pixelSpacing), pixelSize)*pixelSize;
	
	if (borderOffsetX > 0) {
		borderOffsetX = borderOffsetX.toString();
		borderOffsetX = borderOffsetX.slice(0, -1);
	}
	if (borderOffsetY > 0) {
		borderOffsetY = borderOffsetY.toString();
		borderOffsetY = borderOffsetY.slice(0, -1);
	}

	mouseX = mouseX - borderOffsetX;
	mouseY = mouseY - borderOffsetY;
	mouseX = parseInt(mouseX/10, 10)*10;
	mouseY = parseInt(mouseY/10, 10)*10;

	if (mouseX > 0) {
		mouseX = mouseX.toString();
		mouseX = mouseX.slice(0, -1);
	}
	if (mouseY > 0) {
		mouseY = mouseY.toString();
		mouseY = mouseY.slice(0, -1);
	}
	
	return [mouseX, mouseY];
}

$("#plotvalue").click(function() {
	var k = $("textarea").val();
	if (/^-?[\d.]+(?:e-?\d+)?$/.test(k)) {
		var binary = new BigNumber(k, 10);
		binary = binary.dividedBy(17);
		binary.toFormat(2);
		binary = binary.toString(2);
		var b = binary.length - 1;

		for (var i = xPixels - 1; i >= 0; i--) {
			for (var j = 0; j < yPixels; j++) {
				if (binary[b] == 0 || b < 0) {
					context.fillStyle = emptyColor;
					plot[i][j][0] = 0;
				}else if (binary[b] = 1) {
					context.fillStyle = fillColor;
					plot[i][j][0] = 1;
				}

				if (b >= 0) {
					b--;	
				}
				context.fillRect(plot[i][j][1],plot[i][j][2],plot[i][j][3],plot[i][j][4]);
			}
		}
	}
});

$("#calcvalue").click(function() {
	var binary = "";
	for (var i = 0; i < xPixels; i++) {
		for (var j = yPixels - 1; j >= 0; j--) {
			if (typeof binary != "undefined") {
				binary += plot[i][j][0];
			}else {
				binary = plot[i][j][0];
			}
		}
	}

	var k = new BigNumber(binary, 2);
	k.toFormat(10);
	k = k.times(17);
	k = k.toString(10);
	$("textarea").html(k);
});

$("#clear").click(function() {
	context.fillStyle = emptyColor;
	for (var i = 0; i < xPixels; i++) {
		for (var j = yPixels - 1; j >= 0; j--) {
			plot[i][j][0] = 0;
			context.fillRect(plot[i][j][1],plot[i][j][2],plot[i][j][3],plot[i][j][4]);
		}
	}
});