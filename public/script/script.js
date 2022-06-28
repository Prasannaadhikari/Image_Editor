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
    reader.crossOrigin = "Anonymous";
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
    restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
    index+=1;
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
    let r_startx = (Math.abs(start_x-canvas_x_pos)/max_width_canvas)*image.width;
    let r_starty = (Math.abs(start_y-canvas_y_pos)/max_height_canvas)*image.height;
    let r_image_width = (Math.abs(end_x-start_x)/max_width_canvas)*image.width;
    let r_image_height = (Math.abs(end_y-start_y)/max_height_canvas)*image.height;
    console.log(r_startx, r_starty, r_image_width, r_image_height,r_startx, r_starty, r_image_width, r_image_height);
    ctx.drawImage(image, r_startx, r_starty, r_image_width, r_image_height,r_startx, r_starty, r_image_width, r_image_height);
    restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
    index+=1;
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

function random_number_generator(limit){
    let value = Math.random()*limit + 10;
    console.log(value);
    return value;
}


function draw_shapes(item){
    ctx.globalCompositeOperation = "source-over";
    let x_pos = random_number_generator(620);
    let y_pos = random_number_generator(300);
    console.log(x_pos, y_pos);
    ctx.drawImage(item, x_pos,y_pos, 150, 150);
    restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
    index+=1;
}

function shapes(){
    let shape_item = document.querySelector("#shape_define").value;
    console.log(shape_item);
    if(shape_item == 's1'){
        let s1 = document.querySelector("#s1");
        draw_shapes(s1);
    }

    else if(shape_item == 's2'){
        let s2 = document.querySelector("#s2");
        draw_shapes(s2);
    }

    else if(shape_item == 's3'){
        let s3 = document.querySelector("#s3");
        draw_shapes(s3);
    }

    else if(shape_item == 's4'){
        let s4 = document.querySelector("#s4");
        draw_shapes(s4);
    }

    else if(shape_item == 's5'){
        let s5 = document.querySelector("#s5");
        draw_shapes(s5);
    }  
}

function emoji(){
    let emoji_item = document.querySelector("#emoji_define").value;
    console.log(emoji_item);
    if(emoji_item == 'e1'){
        let e1 = document.querySelector("#e1");
        draw_shapes(e1);
    }

    else if(emoji_item == 'e2'){
        let e2 = document.querySelector("#e2");
        draw_shapes(e2);
    }

    else if(emoji_item == 'e3'){
        let e3 = document.querySelector("#e3");
        draw_shapes(e3);
    }

    else if(emoji_item == 'e4'){
        let e4 = document.querySelector("#e4");
        draw_shapes(e4);
    }

    else if(emoji_item == 'e5'){
        let e5 = document.querySelector("#e5");
        draw_shapes(e5);
    }  

    else if(emoji_item == 'e6'){
        let e6 = document.querySelector("#e6");
        draw_shapes(e6);
    }
}

function clear_frame(frame_dis){
    if(frame_dis){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0,0, image.width, image.height);
        frame_dis = false;
    }
}

function draw_frame(f){
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(f, 0,0, canvas.width, canvas.height);
    restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
    index+=1;
    frame_dis = true;
}

function frame(){
    let frame_item = document.querySelector("#frame_define").value;
    if(frame_item == 'f1'){
        clear_frame(frame_dis);
        let f1 = document.querySelector("#f1");
        draw_frame(f1);
    }

    else if(frame_item == 'f2'){
        clear_frame(frame_dis);
        let f2 = document.querySelector("#f2");
        draw_frame(f2);
    }

    else if(frame_item == 'f3'){
        clear_frame(frame_dis);
        let f3 = document.querySelector("#f3");
        draw_frame(f3);
    }

    else if(frame_item == 'f4'){
        clear_frame(frame_dis);
        let f4 = document.querySelector("#f4");
        draw_frame(f4);
    }

    else if(frame_item == 'f5'){
        clear_frame(frame_dis);
        let f5 = document.querySelector("#f5");
        draw_frame(f5);
    }

    else if(frame_item == 'f6'){
        clear_frame(frame_dis);
        let f6 = document.querySelector("#f6");
        draw_frame(f6);
    }
}

function text(){
    //tempCtx.fillText("Hello from Prasanna",(canvas.width/2), canvas.height/2);
    ctx.globalCompositeOperation = "source-over";
    ctx.font = `${canvas.width * 0.05}px Calibri`;
    ctx.globalAlpha = 0.01;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    var text = prompt("Enter the text you want to write: ");
    // ctx.fillText("Hello from Prasanna",200,200);
    canvas.addEventListener("mousedown", (e)=>{
        let x_value = e.clientX - canvas_x_pos;
        let y_value = e.clientY - canvas_y_pos;
        ctx.fillText(text,(x_value/max_width_canvas)*canvas.width, (y_value/max_height_canvas)*canvas.height);
        restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
        index+=1;
    });
}