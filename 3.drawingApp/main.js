const canvas = document.querySelector('canvas');
const toolBtns = document.querySelectorAll('.tool');
const fillColor = document.querySelector('#fill-color');
const sizeSlider = document.querySelector('#size-slider');
const colorBtns = document.querySelectorAll('.colors .option');
const colorPicker = document.querySelector('#color-picker');
const clearCanvasBtn = document.querySelector('.clear-canvas');
const saveImgBtn = document.querySelector('.save-img');

//Canvas context
let ctx = canvas.getContext('2d');

// global variables with default value
let prevMouseX;
let prevMouseY;
let snapshot;
let isDrawing = false;
let selectedTool = 'brush';
let brushWidth = 5;
let selectedColor = '#000000';

window.addEventListener('load', () => {
    // setting canvas width/height.. offset width/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', drawing);
canvas.addEventListener('mouseup', () => (isDrawing = false));

toolBtns.forEach((btn) => {
    // adding click event to all tool option
    btn.addEventListener('click', () => {
        // removing active class from the previous option and adding on current clicked option
        document.querySelector('.options .active').classList.remove('active');
        btn.classList.add('active');
        selectedTool = btn.id;
    });
});

sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value)); // passing slider value as brushSize

colorBtns.forEach((btn) => {
    // adding click event to all color button
    btn.addEventListener('click', () => {
        // removing selected class from the previous option and adding on current clicked option
        document
            .querySelector('.options .selected')
            .classList.remove('selected');
        btn.classList.add('selected');
        // passing selected btn background color as selectedColor value
        selectedColor = window
            .getComputedStyle(btn)
            .getPropertyValue('background-color');
    });
});

colorPicker.addEventListener('change', () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvasBtn.addEventListener('click', () => {
    // clearing whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImgBtn.addEventListener('click', () => {
    // creating <a> element
    const link = document.createElement('a');
    // passing current date as link download value
    link.download = `${Date.now()}.jpg`;
    // passing canvasData as link href value
    link.href = canvas.toDataURL();
    // clicking link to download image
    link.click();
});

function setCanvasBackground() {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // setting fill style back to the selectedColor, it'll be the brush color
    ctx.fillStyle = selectedColor;
}

function startDraw(event) {
    isDrawing = true;
    // passing current mouseX position as prevMouseX value
    prevMouseX = event.offsetX;
    // passing current mouseY position as prevMouseY value
    prevMouseY = event.offsetY;
    // creating new path to draw
    ctx.beginPath();
    // passing brushSize as line width
    ctx.lineWidth = brushWidth;
    // passing selectedColor as stroke style
    ctx.strokeStyle = selectedColor;
    // passing selectedColor as fill style
    ctx.fillStyle = selectedColor;
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function drawing(event) {
    // if isDrawing is false return from here
    if (!isDrawing) return;
    // adding copied canvas data on to this canvas
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === 'brush' || selectedTool === 'eraser') {
        // if selected tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : selectedColor;
        // creating line according to the mouse pointer
        ctx.lineTo(event.offsetX, event.offsetY);
        // drawing/filling line with color
        ctx.stroke();
    } else if (selectedTool === 'rectangle') {
        drawRect(event);
    } else if (selectedTool === 'circle') {
        drawCircle(event);
    } else {
        drawTriangle(event);
    }
}

function drawRect(event) {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating rect according to the mouse pointer
        return ctx.strokeRect(
            event.offsetX,
            event.offsetY,
            prevMouseX - event.offsetX,
            prevMouseY - event.offsetY
        );
    }

    ctx.fillRect(
        event.offsetX,
        event.offsetY,
        prevMouseX - event.offsetX,
        prevMouseY - event.offsetY
    );
}

function drawCircle(event) {
    // creating new path to draw circle
    ctx.beginPath();

    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(
        Math.pow(prevMouseX - event.offsetX, 2) +
            Math.pow(prevMouseY - event.offsetY, 2)
    );
    // creating circle according to the mouse pointer
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    // if fillColor is checked fill circle else draw border circle
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

function drawTriangle(event) {
    // creating new path to draw circle
    ctx.beginPath();
    // moving triangle to the mouse pointer
    ctx.moveTo(prevMouseX, prevMouseY);
    // creating first line according to the mouse pointer
    ctx.lineTo(event.offsetX, event.offsetY);
    // creating bottom line of triangle
    ctx.lineTo(prevMouseX * 2 - event.offsetX, event.offsetY);
    // closing path of a triangle so the third line draw automatically
    ctx.closePath();
    // if fillColor is checked fill triangle else draw border
    fillColor.checked ? ctx.fill() : ctx.stroke();
}
