const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width=window.innerWidth;//horizontal resolution (?) - increase for better looking text
canvas.height=window.innerHeight-20;//vertical resolution (?) - increase for better looking text
canvas.style.width=canvas.width;//actual width of canvas
canvas.style.height=canvas.height;//actual height of canvas

const circleRadius = 8;
const lineThickness = 1;
const lineColor = 'rgb(100,100,100)';
ctx.font = "10px Arial";

// Define a map to keep track of the circle positions
const circlePositions = new Map();

// Define a function to get the position of a circle based on its name
function getCirclePosition(name) {
    if (!circlePositions.has(name)) { // Check if we've seen this name before
        var index = students.findIndex((element) => element.name === name);
       
        let friendExists = "false";
        let friendIndex = 999;
        var position 

        //Check all the friends of thisStudent
        try{
            for(var i = 0; i < students[index].friends.length; i++){
                if(circlePositions.has(students[index].friends[i])){
                    friendExists = students[index].friends[i];
                    friendIndex = i;
                    break
                }
            }
        } catch {
            console.log(name)
        }
        

        //Check every other student for thisStudent as a friend, closest friendship wins
        for(var i = 0; i < students.length; i++){
            for(var j = 0; j < students[i].friends.length; j++){
                //If the other student has thisStudent as a friend, and otherStudent already has a position, and the 

                if(students[i].friends[j] == name && circlePositions.has(students[i].name) && j < friendIndex){
                    friendExists = students[i].name
                    friendIndex = j
                }
            }
        }

        var foundPosition = false

        if (friendExists == "false"){ //if no friends exists, create a random position
            while (!foundPosition){
                //Create the x and y positioins
                var flag = false
                var newX = Math.random() * (canvas.width-2*circleRadius)+circleRadius
                var newY = Math.random() * (canvas.height-2*circleRadius)+circleRadius

                // let [key, value] of  map.entries())
                //check each position if they overlap
                for (let [key,ppl] of circlePositions.entries()){ 
                    if(Math.abs(newX - ppl.x) < circleRadius*2 && Math.abs(newY - ppl.y) < circleRadius*2){
                    // if((newX < ppl.x + circleRadius*2 && newX > ppl.x - circleRadius*2) || (newY < ppl.y + circleRadius*2 && newY > ppl.y - circleRadius*2)){
                        flag = true
                        break
                    }
                }
                
                if (!flag){
                    foundPosition = true;
                    position = {
                        x: newX,
                        y: newY
                    };
                }
            }
    
        } else {
            var friendPos = circlePositions.get(friendExists);
            var max = 150
            // var distance = (.5 * Math.pow(friendIndex,2)+1) * circleRadius*2
            var distance = max +circleRadius*2+10 - (max/Math.sqrt((friendIndex+1)))

            while (!foundPosition){
                var flag = false

                var randAngle = Math.random() * 360;
                var newX = friendPos.x + distance * Math.cos(randAngle)
                var newY = friendPos.y + distance * Math.sin(randAngle)
                
                
                for (let ppl of circlePositions.values()){ //check if this position overlaps with any other position
                    if((newX < ppl.x + circleRadius*2 && newX > ppl.x - circleRadius*2) && (newY<ppl.y+circleRadius*2 && newY> ppl.y - circleRadius*2) || newX > canvas.width-circleRadius || newX < 0+circleRadius || newY > canvas.height-circleRadius || newY < 0+circleRadius){
                        flag = true
                        break
                    }
                }
                if (!flag){
                    foundPosition = true;
                    position = {
                        x: newX,
                        y: newY
                    };
                }
            }
        }
        
        circlePositions.set(name, position);
    }
    return circlePositions.get(name);
}



// Draw lines
for (let i = 0; i < students.length; i++) {
    // Get the current student's name and friends
    const name = students[i].name;
    const friends = students[i].friends;

    // Get the position of the current student's circle
    const position = getCirclePosition(name);

    // Set the stroke color and thickness for the current student's circle
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineThickness;

    // Loop through the current student's friends
    for (let j = 0; j < friends.length; j++) {
        // Get the name of the current friend
        const friendName = friends[j];
        // Get the position of the current friend's circle
        const friendPosition = getCirclePosition(friendName);

        // If the friend is also friends with the current student, make the line thicker
        // if (students.find((student) => student.name === friendName)?.friends.includes(name)) {
        //     ctx.lineWidth = lineThickness * 1.5;
        // }

        // Draw line from current circle to friend circle
        ctx.moveTo(position.x, position.y);
        ctx.lineTo(friendPosition.x, friendPosition.y);
        ctx.stroke();

    }
}

//DRAW CIRCLE
function drawCircle(name, xPos, yPos, circleColor){

    // Draw circle at position
    ctx.beginPath();
    ctx.arc(xPos, yPos, circleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = circleColor;
    ctx.fill();

    let text = name
    // let text = getInitials(name)
    let textwidth = ctx.measureText(text).width;
    ctx.fillStyle = 'white';
    // ctx.strokeStyle = "black";
    ctx.fillText(text, xPos - textwidth/2, yPos+3)

    
}

//DRAW CIRCLES
for (let i = 0; i < students.length; i++) {
    const name = students[i].name;
    const position = getCirclePosition(name);
    drawCircle(name, position.x, position.y, "#86eb34")
}
console.log(circlePositions)

function getInitials(name){
    var nameArr = name.split(" ");
    return (nameArr[0][0] + nameArr[1][0])
}


// Define a function to get the mouse position relative to the canvas
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Define a function to check if the mouse is over a position
function isMouseOverPosition(mouseX, mouseY, positionX, positionY) {
  var distance = Math.sqrt(
    (mouseX - positionX) * (mouseX - positionX) + (mouseY - positionY) * (mouseY - positionY)
  );
  return distance < circleRadius; // Change this value to adjust the detection range
}

var isDragging
var initialX, initialY
var initialPositions = new Map()

canvas.addEventListener("mousedown", function(e) {
    var mousePos = getMousePos(canvas, e);
    initialX = mousePos.x
    initialY = mousePos.y
    isDragging = true;

    for (let i = 0; i < students.length; i++) {
        position = {
            x: circlePositions.get(students[i].name).x,
            y: circlePositions.get(students[i].name).y
        };
        initialPositions.set(students[i].name,position)
    }

});
canvas.addEventListener("mouseup", function(e) {
    isDragging = false;
});

// Add an event listener to the canvas to detect mouse movements
canvas.addEventListener("mousemove",function(evt) {
    var mousePos = getMousePos(canvas, evt);



        

    for (let [key,ppl] of circlePositions.entries()) {
      if (isMouseOverPosition(mousePos.x, mousePos.y, circlePositions.get(key).x, circlePositions.get(key).y)) {
        // drawCircle(key,circlePositions.get(key).x, circlePositions.get(key).y, "white")
      }
    }

    if (isDragging) {
        ctx.fillStyle = "black"
        ctx.fillRect(0,0,canvas.width,canvas.height);

        for (let i = 0; i < students.length; i++) {
            // Get the current student's name and friends
            const name = students[i].name;
            const friends = students[i].friends;
        
            // Get the position of the current student's circle
            const position = getCirclePosition(name);
            const initialPosition = initialPositions.get(name);

            // var offsetX = 0
            // var offsetY = 0
            // if((mousePos.x - initialX) > 0)
            //      {offsetX = 10 * Math.cos(mousePos.x/initialX)} 
            // else {offsetX = -10 * Math.cos(mousePos.x/initialX)}
            // if((mousePos.y - initialY) > 0){offsetY = 10 * Math.sin(mousePos.y/initialY)} 
            // else {offsetY = -10 * Math.sin(mousePos.y/initialY)}
            position.x = initialPosition.x + mousePos.x - initialX
            position.y = initialPosition.y + mousePos.y - initialY


            // Set the stroke color and thickness for the current student's circle
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = lineThickness;
        
            for (let j = 0; j < friends.length; j++) {
                // Get the name of the current friend
                const friendName = friends[j];
                // Get the position of the current friend's circle
                const friendPosition = getCirclePosition(friendName);
                
                ctx.moveTo(position.x, position.y);
                ctx.lineTo(friendPosition.x, friendPosition.y);
                ctx.stroke();        
            } 
            drawCircle(name, position.x,position.y, "white")       
        }
      }
  },
  false
);