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

let sliders = document.querySelectorAll(".filter input[type='range']");
sliders.forEach(slider => {
    slider.addEventListener("input", addFilter);
});


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
        restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
        index+=1;
        console.log(restore_arr);
    }
    // image.onload = () =>;
}

function addFilter(){
    ctx.filter = `brightness(${brighten.value}%) blur(${blur_v.value}px) contrast(${contrast_v.value}%)
    hue-rotate(${hue_rotate_v.value}deg) saturate(${saturate.value}%)`;
    
    ctx.drawImage(image, 50, 50, canvas.width, canvas.height);
    restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
    index+=1;
}

function redraw(image_w = 600, image_h= 500){
    if(image_w!=600 || image_h!= 500){
        canvas.width = parseInt(image_w) ;
        canvas.height = parseInt(image_h);
    }
    ctx.drawImage(image, 50,50, image_w, image_h);
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

function undo(){
    if (index<=0){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else{
        index -=1;
        removed_ele.push(restore_arr.pop());
        index2+=1;
        ctx.putImageData(restore_arr[index], 0, 0);
    }
}

function redo(){
    if (index2<=0){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else{
        ctx.putImageData(removed_ele[index2-1], 0, 0);
        removed_ele.pop();
        index2-=1;
    }
}

function delete_canvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resize(){
    var i_width = image.naturalWidth;
    var i_height = image.naturalHeight;
    var aspectratio = i_width / i_height;
    var u_width = prompt("Enter the required image width: ");
    var flag_aspectratio = prompt("Do you want to maintain th aspect ratio (1/0): ");
    console.log(flag_aspectratio);
    if(flag_aspectratio == 0){
        var u_height = prompt("Enter the required image height: ");
    }
    else{
        var u_height = Math.floor(u_width/aspectratio);
    }
    console.log(u_width, u_height, aspectratio);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redraw(u_width, u_height);
}

function crop_image(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, start_x-canvas_x_pos+threshold, start_y-canvas_y_pos, Math.abs(end_x-start_x)+threshold, Math.abs(end_y-start_y), start_x-canvas_x_pos, start_y-canvas_y_pos, Math.abs(end_x-start_x),  Math.abs(end_y-start_y));
}

function crop(){
    canvas.addEventListener("mousedown", (e)=>{
        start_x = e.clientX;
        start_y = e.clientY;
        mouse_down = true;
    });
    
    canvas.addEventListener("mouseup", (e)=>{
        end_x = e.clientX;
        end_y = e.clientY;
        mouse_up = true;
        crop_image(start_x, start_y, end_x, end_y);
    });
}