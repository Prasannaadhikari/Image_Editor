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
    brighten.value = default_brightness;
    blur_v.value = default_blur;
    contrast_v.value = default_contrast;
    hue_rotate_v.value = default_hue;
    saturate.value = default_saturate;
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
        console.log(image.width, image.height);
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0,0, image.width, image.height);
        restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
        index+=1;
        console.log(restore_arr);
    }
}


function addFilter(){
    ctx.filter = `brightness(${brighten.value}%) blur(${blur_v.value}px) contrast(${contrast_v.value}%)
    hue-rotate(${hue_rotate_v.value}deg) saturate(${saturate.value}%)`;
    
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
    index+=1;
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
        ctx.drawImage(image, 0,0, -canvas.width, canvas.height);
        ctx.restore();
    }
    else if(ver_flip.checked){
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(1,-1);
        ctx.drawImage(image, 0,0, canvas.width, -canvas.height);
        ctx.restore();
    }
    else{
        if(flip){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.save();
        ctx.scale(1,1);
        ctx.drawImage(image, 0,0, canvas.width, canvas.height);
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

function redraw(image_w, image_h){
    canvas.width = image_w;
    canvas.height = image_h;
    console.log(canvas.width, canvas.height, image_w, image_h);
    ctx.drawImage(image, 0,0, image_w, image_h);
}

function resize(){
    var i_width = image.naturalWidth;
    var i_height = image.naturalHeight;
    var aspectratio = i_width / i_height;
    var u_width = prompt("Enter the required image width: ");
    var flag_aspectratio = prompt("Do you want to maintain th aspect ratio (1/0): ");
    console.log(flag_aspectratio);
    if(flag_aspectratio == 0){
        u_height = prompt("Enter the required image height: ");
    }
    else{
        u_height = Math.floor(u_width/aspectratio);
    }
    console.log(u_width, u_height, aspectratio);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redraw(parseInt(u_width), parseInt(u_height));
}

function crop_image(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(start_x-canvas_x_pos, start_y-canvas_y_pos, Math.abs(end_x-start_x)+threshold, Math.abs(end_y-start_y)+threshold, start_x-canvas_x_pos, start_y-canvas_y_pos, Math.abs(end_x-start_x)+threshold,  Math.abs(end_y-start_y)+threshold);
    ctx.drawImage(image, start_x-canvas_x_pos, start_y-canvas_y_pos, Math.abs(end_x-start_x)+threshold, Math.abs(end_y-start_y)+threshold, start_x-canvas_x_pos, start_y-canvas_y_pos, Math.abs(end_x-start_x)+threshold,  Math.abs(end_y-start_y)+threshold);
}

function crop(){
    canvas.addEventListener("mousedown", (e)=>{
        start_x = e.clientX;
        start_y = e.clientY;
        mouse_down = true;
        console.log("Mouse Down", e.clientX, e.clientY);
    });
    
    canvas.addEventListener("mouseup", (e)=>{
        end_x = e.clientX;
        end_y = e.clientY;
        mouse_up = true;
        crop_image(start_x, start_y, end_x, end_y);
        console.log("Mouse Up", e.clientX, e.clientY);
    });
}

function shapes(){
    let shape_item = document.querySelector("#shape_define").value;
    console.log(shape_item);
    
}

function frame(){
    let frame_item = document.querySelector("#frame_define").value;
    if(frame_item == 'f1'){
        if(frame_dis){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0,0, image.width, image.height);
            frame_dis = false;
        }
        let f1 = document.querySelector("#f1");
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(f1, 0,0, canvas.width, canvas.height);
        frame_dis = true;
    }

    else if(frame_item == 'f2'){
        if(frame_dis){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0,0, image.width, image.height);
            frame_dis = false;
        }
        let f2 = document.querySelector("#f2");
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(f2, 0,0, canvas.width, canvas.height);
        frame_dis = true;
    }

    else if(frame_item == 'f3'){
        if(frame_dis){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0,0, image.width, image.height);
            frame_dis = false;
        }
        let f3 = document.querySelector("#f3");
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(f3, 0,0, canvas.width, canvas.height);
        frame_dis = true;
    }

    else if(frame_item == 'f4'){
        if(frame_dis){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0,0, image.width, image.height);
            frame_dis = false;
        }
        let f4 = document.querySelector("#f4");
        ctx.globalCompositeOperation = "sorce-over";
        ctx.drawImage(f4, 0,0, canvas.width, canvas.height);
        frame_dis = true;
    }

    else if(frame_item == 'f5'){
        if(frame_dis){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0,0, image.width, image.height);
            frame_dis = false;
        }
        let f5 = document.querySelector("#f5");
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(f5, 0,0, canvas.width, canvas.height);
        frame_dis = true;
    }

    else if(frame_item == 'f6'){
        if(frame_dis){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0,0, image.width, image.height);
            frame_dis = false;
        }
        let f6 = document.querySelector("#f6");
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(f6, 0,0, canvas.width, canvas.height);
        frame_dis = true;
    }
}