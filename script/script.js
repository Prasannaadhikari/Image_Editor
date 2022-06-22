let brighten = document.querySelector("#brighten");
let blur_v = document.querySelector("#blur");
let contrast_v = document.querySelector("#contrast");
let hue_rotate_v = document.querySelector("#hue-rotate");
let saturate = document.querySelector("#saturate");

let no_flip = document.querySelector("#no-flip");
let hor_flip = document.querySelector("#flip-x");
let ver_flip = document.querySelector("#flip-y");

let uploadBtn = document.querySelector("#upload-button");
let image = document.querySelector("#chosen-image");

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
    }
}

let sliders = document.querySelectorAll(".filter input[type='range']");
sliders.forEach(slider => {
    slider.addEventListener("input", addFilter);
});

function addFilter(){
    image.style.filter = `brightness(${brighten.value}%) blur(${blur_v.value}px) contrast(${contrast_v.value}%)
    hue-rotate(${hue_rotate_v.value}deg) saturate(${saturate.value}%)`;
    console.log(image.style.filter); 
}

let checkboxes = document.querySelectorAll(".flip-option input[type='radio']");

checkboxes.forEach(checkbox => {
     checkbox.addEventListener("click", flipImage);
});


function flipImage(){
    if(hor_flip.checked){
        image.style.transform = "scaleX(-1)";
    }
    else if(ver_flip.checked){
        image.style.transform = "scaleY(-1)";
    }
    else{
        image.style.transform = "scale(1,1)";
    }
}
