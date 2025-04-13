const canvas = document.getElementById("zulrah-viewer");
const ctx = canvas.getContext("2d");
const containerHeight = canvas.offsetHeight;
const img = new Image();

const hoverFill = "rgba(254, 105, 30, 0.07)";
const hoverBorder = "rgb(254, 105, 30)";
const activeFill = "rgba(62, 237, 126, 0.07)";
const activeBorder = "rgb(62, 237, 126)";

let hoveredRotation = -1;
let activeRotation = -1;

img.addEventListener("load", scaleCanvas);
img.src = "rotations.png";

function scaleCanvas() {
    let scale = 1;
    scale = canvas.offsetHeight / img.height;

    if (img.width * scale > window.innerWidth) {
        scale = window.innerWidth / img.width;
    }

    canvas.height = img.height * scale;
    canvas.width = img.width * scale;
    renderOverlay(undefined, undefined, activeRotation);
}

function renderBackground() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function renderOverlay(mouseX, mouseY, activeRotation) {
    renderBackground();

    const regions = 4;
    const width = canvas.width / regions;
    const height = canvas.height * 0.88;

    let hoveredIndex = -1;

    canvas.style.cursor = "default";

    for (let i = 0; i < regions; i++) {
        const left = width * i;
        const right = left + width;

        if (activeRotation == i) {
            drawRegionHighlight(left, width, height, activeBorder, activeFill);
            continue;
        }

        if (!(mouseX > left && mouseX < right && mouseY > 0 && mouseY < height))
            continue;

        drawRegionHighlight(left, width, height, hoverBorder, hoverFill);
        canvas.style.cursor = "pointer";

        hoveredIndex = i;
    }

    hoveredRotation = hoveredIndex;
}

function drawRegionHighlight(left, width, height, borderColor, fillColor) {
    ctx.beginPath();
    ctx.rect(left, 0, width, height);
    ctx.fillStyle = fillColor;
    ctx.fill();

    const borderWidth = 3;
    ctx.beginPath();
    ctx.rect(
        left + borderWidth / 2,
        borderWidth / 2,
        width - borderWidth,
        height - borderWidth
    );
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
}

function handleMouseClick(event) {
    activeRotation = hoveredRotation;
    render(event);
}

function render(event) {
    var canvasBounds = event.target.getBoundingClientRect();
    var x = event.clientX - canvasBounds.left;
    var y = event.clientY - canvasBounds.top;
    renderOverlay(x, y, activeRotation);
}

window.addEventListener("resize", scaleCanvas);
canvas.addEventListener("mousemove", render);
canvas.addEventListener("mouseleave", render);
canvas.addEventListener("click", handleMouseClick);
