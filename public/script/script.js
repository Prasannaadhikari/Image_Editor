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


let checkboxes = document.querySelectorAll(".flip-option input[type='radio']");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");
let cdelete = document.querySelector(".delete");
let resize = document.querySelector(".resize");
let crop = document.querySelector(".crop");
let text = document.querySelector(".text");
let save_canvas = document.querySelector(".save");

class Canvas_Image{
    constructor(image){
        this.width = image.width;
        this.height = image.height;
        this.brightness = default_brightness;
        this.blur = default_blur;
        this.hue = default_hue;
        this.saturate = default_saturate;
        this.flip = false;
        this.index = index;
        this.index2 = index2;
        this.canvas = canvas;
        this.ctx = ctx;
        this.image = image;
        this.restore_arr = restore_arr;
        this.removed_ele = removed_ele;

        sliders.forEach(slider => {
            slider.addEventListener("input", () => {
                this.addFilter();
            });
        });

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("click", ()=>{
                this.flipImage();
            });
       });

       undo.addEventListener("click", ()=>{
            this.undo();
       });

       redo.addEventListener("click", ()=>{
        this.redo();
       });

       resize.addEventListener("click", ()=>{
        this.resize();
       });

       cdelete.addEventListener("click", ()=>{
        this.delete_canvas();
       });

       crop.addEventListener("click", ()=>{
        this.crop();
       });

       text.addEventListener("click", ()=>{
        this.text();
       });

       save_canvas.addEventListener("click", ()=>{
        this.save();
       });
    }

    resetFilter(){
        brighten.value = default_brightness;
        blur_v.value = default_blur;
        contrast_v.value = default_contrast;
        hue_rotate_v.value = default_hue;
        saturate.value = default_saturate;
        no_flip.checked = true;
        this.addFilter();
        this.flipImage();
    }

    new_image_load(){
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        this.ctx.drawImage(this.image, 0,0, this.image.width, this.image.height);
        this.restore_arr.push(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height));
        this.index+=1;
    }

    addFilter(){
        this.ctx.filter = `brightness(${brighten.value}%) blur(${blur_v.value}px) contrast(${contrast_v.value}%)
        hue-rotate(${hue_rotate_v.value}deg) saturate(${saturate.value}%)`;
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        this.restore_arr.push(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height));
        this.index+=1;
    }

    flipImage(){
        if(hor_flip.checked){
            this.ctx.save();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.scale(-1,1);
            this.ctx.drawImage(this.image, 0,0, -this.canvas.width, this.canvas.height);
            this.ctx.restore();
        }
        else if(ver_flip.checked){
            this.ctx.save();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.scale(1,-1);
            this.ctx.drawImage(this.image, 0,0, this.canvas.width, -this.canvas.height);
            this.ctx.restore();
        }
        else{
            if(this.flip){
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            this.ctx.save();
            this.ctx.scale(1,1);
            this.ctx.drawImage(this.image, 0,0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
            this.flip = true;
        }
    }

    undo(){
        if (this.index<=0){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else{
            this.index -=1;
            this.removed_ele.push(this.restore_arr.pop());
            this.index2+=1;
            this.ctx.putImageData(this.restore_arr[this.index], 0, 0);
        }
    }

    redo(){
        if (this.index2<=0){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else{
            this.ctx.putImageData(this.removed_ele[this.index2-1], 0, 0);
            this.removed_ele.pop();
            this.index2-=1;
        }
    }

    delete_canvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.querySelector(".image-container").style.display = "none";
    }

    redraw(image_w, image_h){
        this.canvas.width = image_w;
        this.canvas.height = image_h;
        this.ctx.drawImage(this.image, 0,0, image_w, image_h);
        this.restore_arr.push(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height));
        this.index+=1;
    }

    resize(){
        var i_width = this.image.naturalWidth;
        var i_height = this.image.naturalHeight;
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.redraw(parseInt(u_width), parseInt(u_height));
    }


    crop_image(start_x, start_y, end_x, end_y){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let r_startx = (Math.abs(start_x-canvas_x_pos)/max_width_canvas)*this.image.width;
        let r_starty = (Math.abs(start_y-canvas_y_pos)/max_height_canvas)*this.image.height;
        let r_image_width = (Math.abs(end_x-start_x)/max_width_canvas)*this.image.width;
        let r_image_height = (Math.abs(end_y-start_y)/max_height_canvas)*this.image.height;
        console.log(r_startx, r_starty, r_image_width, r_image_height,r_startx, r_starty, r_image_width, r_image_height);
        this.ctx.drawImage(this.image, r_startx, r_starty, r_image_width, r_image_height,r_startx, r_starty, r_image_width, r_image_height);
        this.restore_arr.push(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height));
        this.index+=1;
    }

    crop(){
        this.canvas.addEventListener("mousedown", (e)=>{
            start_x = e.clientX;
            start_y = e.clientY;
            mouse_down = true;
            console.log("Mouse Down", e.clientX, e.clientY);
        });
        
        this.canvas.addEventListener("mouseup", (e)=>{
            end_x = e.clientX;
            end_y = e.clientY;
            mouse_up = true;
            this.crop_image(start_x, start_y, end_x, end_y);
            console.log("Mouse Up", e.clientX, e.clientY);
        });
    }

    text(){
        this.ctx.globalCompositeOperation = "source-over";
        this.ctx.font = `${this.canvas.width * 0.05}px Calibri`;
        this.ctx.globalAlpha = 0.01;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1.0;
        var text = prompt("Enter the text you want to write: ");
        this.canvas.addEventListener("mousedown", (e)=>{
            let x_value = e.clientX - canvas_x_pos;
            let y_value = e.clientY - canvas_y_pos;
            this.ctx.fillText(text,(x_value/max_width_canvas)*this.canvas.width, (y_value/max_height_canvas)*this.canvas.height);
            this.restore_arr.push(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height));
            this.index+=1;
        });
    }

    save(){
        let linkElement = document.getElementById('link');
        linkElement.setAttribute('download', 'edited_image.jpg');
        let canvasData = this.canvas.toDataURL("image/png");
        // Replace it with a stream so that it starts downloading
        canvasData.replace("image/png", "image/octet-stream");
      
        // Set the location href to the canvas data
        linkElement.setAttribute('href', canvasData);
      
        // Click on the link to start the download 
        linkElement.click();
    }
}

uploadBtn.onchange = () => {
    document.querySelector(".image-container").style.display = "block";
    let reader = new FileReader();
    reader.crossOrigin = "Anonymous";
    reader.readAsDataURL(uploadBtn.files[0]);
    reader.onload = () => {
        image.setAttribute("src", reader.result);
        image.onload =()=>{
            const c1 = new Canvas_Image(image);
            c1.resetFilter();
            c1.new_image_load();
        }
    }
}