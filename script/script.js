let brighten = document.querySelector("#brighten");
let blur_v = document.querySelector("#blur");
let contrast_v = document.querySelector("#contrast");
let hue_rotate_v = document.querySelector("#hue-rotate");
let saturate = document.querySelector("#saturate");

let no_flip = document.querySelector("#no-flip");
let hor_flip = document.querySelector("#flip-x");
let ver_flip = document.querySelector("#flip-y");

let uploadBtn = document.querySelector("#upload-button");
const image = document.querySelector("#chosen-image");

var canvas = document.getElementById('canvas-image');
var ctx = canvas.getContext('2d');
let flip=false;

function resetFilter(){
    brighten.value = "100";
    blur_v.value = "0";
    contrast_v.value = "100";
    hue_rotate_v.value = "0";
    saturate.value = "100";
    no_flip.checked = true;
    addFilter();
    flipImage();
}

uploadBtn.onchange = () => {
    resetFilter();
    document.querySelector(".image-container").style.display = "block";
    let reader = new FileReader();
    reader.readAsDataURL(uploadBtn.files[0]);
    reader.onload = () => {
        image.setAttribute("src", reader.result);
        ctx.drawImage(image, 50,50, 600, 500);
    }
    // image.onload = () =>;
}

let sliders = document.querySelectorAll(".filter input[type='range']");
sliders.forEach(slider => {
    slider.addEventListener("input", addFilter);
});

function addFilter(){
    ctx.filter = `brightness(${brighten.value}%) blur(${blur_v.value}px) contrast(${contrast_v.value}%)
    hue-rotate(${hue_rotate_v.value}deg) saturate(${saturate.value}%)`;
    ctx.drawImage(image, 50,50, 600, 500);
}

let checkboxes = document.querySelectorAll(".flip-option input[type='radio']");

checkboxes.forEach(checkbox => {
     checkbox.addEventListener("click", flipImage);
});


function flipImage(){
    if(hor_flip.checked){
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(-1,1);
        ctx.drawImage(image, 100,50, -650, 500);
        ctx.restore();
    }
    else if(ver_flip.checked){
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(1,-1);
        ctx.drawImage(image, 50,50, 600, -500);
        ctx.restore();
    }
    else{
        if(flip){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.save();
        ctx.scale(1,1);
        ctx.drawImage(image, 50,50, 600, 500);
        ctx.restore();
        flip = true;
    }
}
