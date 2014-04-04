

(function($){
	var boardSize = 10;
	
	function getCell(i, j){
		return $('#cell-'+ i + '-' + j);
	}
	
//	function getCellClass(row, col){
//		return getCell(row, col).attr('class');
//	}
//	
//	function setCellClass(row, col, c){
//		return getCell(row, col).attr('class', c);
//	}
	
	function getSurroundingList(cell){
		var cellID = $(cell).attr('id');
		var matches = cellID.match('cell-([0-9]+)-([0-9]+)');
		var cellRow = parseInt(matches[1]);
		var cellCol = parseInt(matches[2]);
		var list = new Array();
		console.log('cell: ' + cellRow + ',' + cellCol);
		if(cellRow > 0){
			/* top left */
			if(cellCol > 0){
				list.push(getCell(cellRow - 1, cellCol - 1));
			}
			/* top middle */
			list.push(getCell(cellRow - 1, cellCol));
			/* top right */
			if((cellCol + 1) < boardSize){
				list.push(getCell(cellRow - 1, cellCol + 1));
			}
		}
		/* mid left */
		if(cellCol > 0){
			list.push(getCell(cellRow, cellCol - 1));
		}
		/* mid middle */
		//list.push(getCell(cellRow, cellCol));
		/* mid right */
		if((cellCol + 1) < boardSize){
			/* top left */
			list.push(getCell(cellRow, cellCol + 1));
		}
		if((cellRow + 1) < boardSize){
			/* bottom left */
			if(cellCol > 0){
				list.push(getCell(cellRow + 1, cellCol - 1));
			}
			/* bottom middle */
			list.push(getCell(cellRow + 1, cellCol));
			/* bottom right */
			if((cellCol + 1) < boardSize){
				list.push(getCell(cellRow + 1, cellCol + 1));
			}
		}
		console.log('surrounding list len ' + list.length);
		return list;
	}
	
	function minesInCells(list){
		var i;
		var mineCount = 0;
		for(i = 0; i < list.length; i++){
			if($(list[i]).attr('class') == 'cell-mine'){
				mineCount += 1;
			}
			if($(list[i]).attr('class') == 'cell-flagged-mine'){
				mineCount += 1;
			}
		}
		return mineCount;
	}
	
	function getCellRowCol(cell){
		var cellID = $(cell).attr('id');
		var matches = cellID.match('cell-([0-9]+)-([0-9]+)');
		var cellRow = parseInt(matches[1]);
		var cellCol = parseInt(matches[2]);
		return [cellRow, cellCol];
	}
	
	function clickSurroundingEmpties(cell, list){
		var i;
		var mineCount = 0;
		var cellRowCol = getCellRowCol(cell);
		for(i = 0; i < list.length; i++){
			if($(list[i]).attr('class') == 'cell-empty'){
				var nextRowCol = getCellRowCol(list[i]);
				if(cellRowCol[0] == nextRowCol[0]){
					emptyClicked(list[i]);
				}
				if(cellRowCol[1] == nextRowCol[1]){
					emptyClicked(list[i]);
				}
			}
		}
		return mineCount;
	}
	
	function emptyClicked(cell){
		/* Get surrounding cells. */
		var surroundingCells = getSurroundingList(cell);
		/* Find number of mines around, mark cell. */
		var mineCount = minesInCells(surroundingCells);
		cell.attr('class', 'cell-cleared-' + mineCount);
		cell.html(mineCount);
		/* Expand out and click other empty cells nearby. */
		clickSurroundingEmpties(cell, surroundingCells);
	}
	
	function flagClick(cell){
		var cellClass = cell.attr('class');
		if(cellClass == 'cell-flagged-mine' || cellClass == 'cell-flagged-empty'){
			var newClass = (cellClass == 'cell-flagged-mine') ? 'cell-mine' : 'cell-empty';
			cell.attr('class', newClass);
			cell.html('&nbsp;');
		}
		else{
			var newClass = (cellClass == 'cell-mine') ? 'cell-flagged-mine' : 'cell-flagged-empty';
			cell.attr('class', newClass);
			cell.html('F');
		}
	}
	
	function checkWin(){
		var unClearedCount = $('.cell-empty').length;
		console.log(unClearedCount);
		if(unClearedCount <= 0){
			alert('you win!');
		}
	}
	
	function eventSetup(){
		$('.cell-empty').click(function(e){
			console.log(e.which);
			emptyClicked($(this));
			checkWin();
		});
		$('.cell-mine').click(function(e){
			alert('Game Over!');
		});

		$('.cell-mine').bind('contextmenu', function(){ 
		    flagClick($(this));
		});
		$('.cell-empty').bind('contextmenu', function(){ 
		    flagClick($(this));
		});
	}
	
	$(document).ready(function(){
		var i,j;
		var mineFrequency = 0.35;
		for(i = 0; i < boardSize; i++){
			var rowHTML = '<div class="row">';
			for(j = 0; j < boardSize; j++){
				var hasMine = Math.random() < mineFrequency;
				var cellClass = hasMine ? 'cell-mine' : 'cell-empty';
				rowHTML += ('<span class="' + cellClass + '" id="cell-'+ i + '-' + j + '">&nbsp;</span>');
			}
			rowHTML += '</div>'
			$('#board').append(rowHTML);
		}
		eventSetup();
	});
	
	
	
}(jQuery));

