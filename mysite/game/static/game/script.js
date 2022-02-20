const messages = ["It's RED player's turn",
                  "It's GREEN player's turn",
                  "It's BLUE player's turn",
                 ]

const pieces_img = ["triangle_img", "square_img", "circle_img"];

const players = ["red", "green", "blue"];

var game_started = false;

var cnt = 0

var game_phase = 1;

var board = new Array(10);
for(let i = 0; i < 10; i++){
    board[i] = new Array(10);
    for(let j = 0; j < 10; j++){
        board[i][j] = "empty";
    }
}

number_rolled = false;
piece_selected = null;

var rolled_number;

var winner_found = false;

var valid_moves = true;

$(document).ready( function() {

    document.getElementById("log").innerHTML="";

    document.getElementById("roll_button").hidden = true;
    document.getElementById("roll_button").disabled = true;

	$('#game_table').click( function(event) {

        if(!game_started) return;
        if(winner_found) return;
        if(!valid_moves) return;

        var target = $(event.target);
        $td = target.closest('td');

        var row   = $td.closest('tr').index();
        var col   = $td.index();

        if(game_phase==1){

            if(board[row][col]!="empty") return;

            var remainder = cnt % 3;
            var src = document.getElementById(pieces_img[remainder]).src;
            var table = document.getElementById("game_table")
            var cell_img = table.rows[row].cells[col].firstChild;
            cell_img.src = src;

            cell_img.classList.remove("empty");

            board[row][col] = players[remainder];

            table.rows[row].cells[col].style.backgroundColor = "black";

            winner_found = check_for_winner();
            if(winner_found) return;

            cnt++
            var remainder = cnt % 3;
            document.getElementById("message").innerHTML="Now playing: ";
            document.getElementById("player").innerHTML = players[remainder].toUpperCase();
            document.getElementById("player").style.color = players[remainder];

            if(cnt==15) {
                game_phase = 2;
                document.getElementById("roll_button").hidden = false;
                document.getElementById("roll_button").disabled = false;
            }

            return;

        }

        if(game_phase == 2){

            if(!number_rolled) {//roll number first

                document.getElementById("log").innerHTML="ROLL NUMBER FIRST";
                return;
            }

            if(!piece_selected) {//select piece

                if(board[row][col]=="empty") {
                    document.getElementById("log").innerHTML="FIELD EMPTY";
                    return;
                }
                var remainder = cnt % 3;
                if(board[row][col]!=players[remainder]) {
                    document.getElementById("log").innerHTML="NOT YOUR PIECE";
                    return;
                }
                piece_selected = [row,col];
                var valid = show_valid_moves(piece_selected, rolled_number);
                if(!valid){
                    piece_selected = null;
                }
            } else {
                if(piece_selected[0] == row && piece_selected[1] == col){//deselect piece
                    deselect_piece();
                    for(let i = 0; i < 10; i++){
                        for(let j = 0; j < 10; j++){
                            if(board[i][j] == "valid") {
                                var id = "" + i + j;
                                document.getElementById(id).style.backgroundColor = "black";
                                board[i][j] = "empty"   ;
                            }
                        }
                    }
                    piece_selected = null;
                    return;
                }
                if(board[row][col] != "valid"){
                    document.getElementById("log").innerHTML="FIELD NOT VALID";
                    return;
                }
                //move piece to new field
                var remainder = cnt % 3;
                var src = document.getElementById(pieces_img[remainder]).src;
                var table = document.getElementById("game_table")
                var cell_img = table.rows[row].cells[col].firstChild;
                cell_img.src = src;

                cell_img.classList.remove("empty");

                board[row][col] = players[remainder];

                table.rows[row].cells[col].style.backgroundColor = "black";

                //remove piece from old field
                var r = piece_selected[0];
                var c = piece_selected[1];

                var src = document.getElementById("empty_img").src;
                var table = document.getElementById("game_table")
                var cell_img = table.rows[r].cells[c].firstChild;
                cell_img.src = src;

                cell_img.classList.add("empty");

                board[r][c] = "empty";

                table.rows[r].cells[c].style.backgroundColor = "black";

                piece_selected = null;

                deselect_piece();

                winner_found = check_for_winner();
                if(winner_found) return;

                document.getElementById("rolled_number").innerHTML="";
                number_rolled = false;
                document.getElementById("roll_button").hidden = false;
                document.getElementById("roll_button").disabled = false;

                cnt++
                var remainder = cnt % 3;
                document.getElementById("message").innerHTML="Now playing: ";
                document.getElementById("player").innerHTML = players[remainder].toUpperCase();
                document.getElementById("player").style.color = players[remainder];

                document.getElementById("log").innerHTML="";
            }

            return;

        }
    });

    $("#game_table td").hover(
        function() {
            var row = $(this)[0].id.charAt(0);
            var col = $(this)[0].id.charAt(1);
            if(board[row][col]!="empty" || piece_selected != null || !game_started) return;
            $(this).css('background-color', "white");
        },
        function() {
            var row = $(this)[0].id.charAt(0);
            var col = $(this)[0].id.charAt(1);
            if(board[row][col]!="empty" || piece_selected != null || !game_started) return;
            $(this).css('background-color', "black");
        }
    );

    $('#roll_button').click( function() {

        document.getElementById("roll_sound").play();

        rolled_number = Math.floor(Math.random() * 6) + 1;
        document.getElementById("rolled_number").innerHTML=rolled_number;

        document.getElementById("roll_button").hidden = true;
        document.getElementById("roll_button").disabled = true;

        var remainder = cnt % 3;
        var player = players[remainder];
        valid_moves = check_for_valid_moves(player,rolled_number);

        if(!valid_moves){
            document.getElementById("skip_button").hidden = false;
            document.getElementById("skip_button").disabled = false;
            document.getElementById("log").innerHTML="NO VALID MOVIE AVAILABLE";
            return;
        }

        number_rolled = true;
        document.getElementById("log").innerHTML="";
    });

    $('#skip_button').click( function() {

        document.getElementById("skip_button").hidden = true;
        document.getElementById("skip_button").disabled = true;

        document.getElementById("rolled_number").innerHTML="";

        number_rolled = false;

        document.getElementById("roll_button").hidden = false;
        document.getElementById("roll_button").disabled = false;

        valid_moves = true;

        cnt++
        var remainder = cnt % 3;
        document.getElementById("message").innerHTML="Now playing: ";
        document.getElementById("player").innerHTML = players[remainder].toUpperCase();
        document.getElementById("player").style.color = players[remainder];
    });

    $('#start_game_button').click( function() {
        document.getElementById("start_game_button").hidden = true;
        document.getElementById("start_game_button").disabled = true;

        game_started = true;

        var remainder = cnt % 3; //3
        document.getElementById("message").innerHTML = "Now playing: "
        document.getElementById("player").innerHTML = players[remainder].toUpperCase();
        document.getElementById("player").style.color = players[remainder];

        document.getElementById("background_music").play();
    });

  });

function show_valid_moves(piece_selected, rolled_number){

    var row = piece_selected[0];
    var col = piece_selected[1];

    var res = false;

    //check all 8 directions
    for(var i = 0; i < 8; i++){
        var cnt = rolled_number;
        var r = row;
        var c = col;
        switch(i){
            case 0: c++; break;
            case 1: c++; r++; break;
            case 2: r++; break;
            case 3: r++; c--; break;
            case 4: c--; break;
            case 5: c--; r--; break;
            case 6: r--; break;
            case 7: r--; c++; break;
            default: throw "Error in: show_valid_moves - switch case"; break;
        }

        var valid = true;
        while(cnt > 0){
            if(r < 0 || r >= 10 || c < 0 || c >= 10){
                valid = false;
                break;
            }
            if(board[r][c]!="empty"){
                valid = false;
                break;
            }
            if(cnt > 1) {
                switch(i){
                    case 0: c++; break;
                    case 1: c++; r++; break;
                    case 2: r++; break;
                    case 3: r++; c--; break;
                    case 4: c--; break;
                    case 5: c--; r--; break;
                    case 6: r--; break;
                    case 7: r--; c++; break;
                    default: throw "Error in: show_valid_moves - switch case"; break;
                }
            }
            cnt--;
        }
        if(valid){
            var id = "" + r + c;
            board[r][c] = "valid";
            document.getElementById(id).style.backgroundColor = "gray";
            res = true;
        }
    }

    return res;

}

function deselect_piece(){
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            if(board[i][j] == "valid") {
                var id = "" + i + j;
                document.getElementById(id).style.backgroundColor = "black";
                board[i][j] = "empty";
            }
        }
    }
}

function check_for_winner(){
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){
            if(board[i][j]=="empty") continue;
            var piece = board[i][j];
            //check all 8 directions
            for(var k = 0; k < 8; k++){
                var counter = 4;
                var r = i;
                var c = j;
                switch(k){
                    case 0: c++; break;
                    case 1: c++; r++; break;
                    case 2: r++; break;
                    case 3: r++; c--; break;
                    case 4: c--; break;
                    case 5: c--; r--; break;
                    case 6: r--; break;
                    case 7: r--; c++; break;
                    default: throw "Error in: check_for_winner - switch case"; break;
                }

                var valid = true;
                while(counter > 0){
                    if(r < 0 || r >= 10 || c < 0 || c >= 10){
                        valid = false;
                        break;
                    }
                    if(board[r][c]!=piece){
                        valid = false;
                        break;
                    }
                    if(counter > 1) {
                        switch(k){
                            case 0: c++; break;
                            case 1: c++; r++; break;
                            case 2: r++; break;
                            case 3: r++; c--; break;
                            case 4: c--; break;
                            case 5: c--; r--; break;
                            case 6: r--; break;
                            case 7: r--; c++; break;
                            default: throw "Error in: check_for_winner - switch case"; break;
                        }
                    }
                    counter--;
                }

                if(valid){
                    var remainder = cnt % 3;
                    document.getElementById("message").innerHTML="Winner is: ";
                    document.getElementById("player").innerHTML = players[remainder].toUpperCase();
                    document.getElementById("player").style.color = players[remainder];

                    document.getElementById("play_again_button").hidden = false;
                    document.getElementById("play_again_button").disabled = false;


                    return true;
                }

            }
        }
    }
    return false;
}

function check_for_valid_moves(player, rolled_number){
    console.log("check_for_valid_moves");
    console.log("player: " + player);
    console.log("rolled_number: " + rolled_number);
    var res = false;
    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 10; j++){

            if(board[i][j]!=player) continue;

            var row = i;
            var col = j;
            console.log("row: " + row);
            console.log("col: " + col);
            //check all 8 directions
            for(var k = 0; k < 8; k++){
                var cnt = rolled_number;
                var r = row;
                var c = col;
                switch(k){
                    case 0: c++; break;
                    case 1: c++; r++; break;
                    case 2: r++; break;
                    case 3: r++; c--; break;
                    case 4: c--; break;
                    case 5: c--; r--; break;
                    case 6: r--; break;
                    case 7: r--; c++; break;
                    default: throw "Error in: show_valid_moves - switch case"; break;
                }

                var valid = true;
                while(cnt > 0){
                    console.log("cnt: " + cnt);
                    console.log("r: " + r);
                    console.log("c: " + c);
                    if(r < 0 || r >= 10 || c < 0 || c >= 10){
                        console.log("out of board");
                        valid = false;
                        break;
                    }
                    if(board[r][c]!="empty"){
                        console.log("direction blocked");
                        valid = false;
                        break;
                    }
                    if(cnt > 1) {
                        switch(k){
                            case 0: c++; break;
                            case 1: c++; r++; break;
                            case 2: r++; break;
                            case 3: r++; c--; break;
                            case 4: c--; break;
                            case 5: c--; r--; break;
                            case 6: r--; break;
                            case 7: r--; c++; break;
                            default: throw "Error in: show_valid_moves - switch case"; break;
                        }
                    }
                    cnt--;
                }
                if(valid){
                    console.log("valid move found");
                    res = true;
                }
            }
        }
    }

    console.log("valid move not found");
    return res;

}