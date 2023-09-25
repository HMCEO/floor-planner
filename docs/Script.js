const canvas = document.getElementById("designCanvas");
const ctx = canvas.getContext("2d");
let drawing = false;
let drawingColor = "#000080";  // Primary Blue

canvas.addEventListener('mousedown', function () {
    drawing = true;
});

canvas.addEventListener('mouseup', function () {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

function draw(e) {
    if (!drawing) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = drawingColor;

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

function chooseDraw() {
    drawingColor = document.getElementById("colorPicker").value;
}

function chooseErase() {
    drawingColor = "#FFFFFF";  // White for erasing
}

function updateDrawColor(input) {
    drawingColor = input.value;
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

let zoomLevel = 1;

function zoomIn() {
    if (zoomLevel < 2) {
        zoomLevel += 0.1;
        canvas.style.transform = `scale(${zoomLevel})`;
    }
}

function zoomOut() {
    if (zoomLevel > 0.5) {
        zoomLevel -= 0.1;
        canvas.style.transform = `scale(${zoomLevel})`;
    }
}

let rooms = [];
let resizeHandleSize = 10;  // Size of the resize handle
let dragging = null;
let resizing = null;
let offsetX, offsetY;

canvas.addEventListener('mousedown', function (e) {
    rooms.forEach(room => {
        if (isCursorInRoom(e.clientX, e.clientY, room)) {
            dragging = room;
            offsetX = e.clientX - room.x;
            offsetY = e.clientY - room.y;
        }
    });
});

canvas.addEventListener('mouseup', function () {
    dragging = null;
    resizing = null;
});

canvas.addEventListener('mousemove', function (e) {
    if (dragging) {
        dragging.x = e.clientX - offsetX;
        dragging.y = e.clientY - offsetY;
        redrawCanvas();
    } else if (resizing) {
        resizing.width = e.clientX - resizing.x;
        resizing.height = e.clientY - resizing.y;
        redrawCanvas();
    }
});

function isCursorInRoom(x, y, room) {
    if (x > room.x + room.width - resizeHandleSize && x < room.x + room.width && y > room.y + room.height - resizeHandleSize && y < room.y + room.height) {
        resizing = room;
        return false;
    }
    return x > room.x && x < room.x + room.width && y > room.y && y < room.y + room.height;
}

function addRoom() {
    let room = {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        name: prompt("Enter room name:")
    };
    rooms.push(room);
    redrawCanvas();
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllRooms();
}

function drawAllRooms() {
    rooms.forEach(room => {
        ctx.strokeStyle = "#000080";  // Primary Blue
        ctx.fillStyle = "#FFA500";  // Construction Orange
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.rect(room.x, room.y, room.width, room.height);
        ctx.stroke();
        ctx.fillText(room.name, room.x + 5, room.y + 15);
        ctx.closePath();

        // Draw resize handle
        ctx.fillRect(room.x + room.width - resizeHandleSize, room.y + room.height - resizeHandleSize, resizeHandleSize, resizeHandleSize);
    });
}

function saveDesign() {
    localStorage.setItem('houseMotivationRooms', JSON.stringify(rooms));
    alert("Design saved!");
}

function loadDesign() {
    const savedRooms = localStorage.getItem('houseMotivationRooms');
    if (savedRooms) {
        rooms = JSON.parse(savedRooms);
        redrawCanvas();
    } else {
        alert("No saved design found!");
    }
}
