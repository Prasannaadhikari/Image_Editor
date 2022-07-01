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
let save_canvas_todb = document.querySelector(".save_todb");
let saved_proj = document.querySelector(".saved_proj");

class Canvas_Image{
    /**
   * @param {image} image Html5 image object
   */
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

        //sliders for changing properties of images of canvas
        sliders.forEach(slider => {
            slider.addEventListener(Input, () => {
                this.addFilter();
            });
        });

        //flip the images
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener(Click, ()=>{
                this.flipImage();
            });
       });

    //undo the changes applied
       undo.addEventListener(Click, ()=>{
            this.undo();
       });


    //redo the undone changes
       redo.addEventListener(Click, ()=>{
        this.redo();
       });

    //resize the canvas 
       resize.addEventListener(Click, ()=>{
        this.resize();
       });

    //delete the canvas elements
       cdelete.addEventListener(Click, ()=>{
        this.delete_canvas();
       });

    //crop the required part of the canvas
       crop.addEventListener(Click, ()=>{
        this.crop();
       });

    //add the text to the canvas
       text.addEventListener(Click, ()=>{
        this.text();
       });

    //save canvas to own setup
       save_canvas.addEventListener(Click, ()=>{
        this.save();
       });

    //save canvas to database
       save_canvas_todb.addEventListener(Click, ()=>{
        this.save_todb();
       });
    }

    //start with default setting of image
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

    //load the new image into canvas
    new_image_load(){
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        this.ctx.drawImage(this.image, 0,0, this.image.width, this.image.height);
        this.restore_arr.push(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height));
        this.index+=1;
    }

    //add the properties to canvas element
    addFilter(){
        this.ctx.filter = `brightness(${brighten.value}%) blur(${blur_v.value}px) contrast(${contrast_v.value}%)
        hue-rotate(${hue_rotate_v.value}deg) saturate(${saturate.value}%)`;
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        this.restore_arr.push(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height));
        this.index+=1;
    }

    //flip the image
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

    //undo the changes applied
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

    //redo the undone changes
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

    //delete the canvas element
    delete_canvas(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.querySelector(".image-container").style.display = "none";
    }

    /**
   *
   * @param {image} redraw user defined width
   * @param {image} redraw user defined height
   */
    redraw(image_w, image_h){
        this.canvas.width = image_w;
        this.canvas.height = image_h;
        this.ctx.drawImage(this.image, 0,0, image_w, image_h);
        this.restore_arr.push(this.ctx.getImageData(0,0, this.canvas.width, this.canvas.height));
        this.index+=1;
    }


    //resize the image 
    resize(){
        var i_width = this.image.naturalWidth;
        var i_height = this.image.naturalHeight;
        var aspectratio = i_width / i_height;
        var u_width = prompt("Enter the required image width: ");
        var flag_aspectratio = prompt("Do you want to maintain th aspect ratio (1/0): ");
        if(flag_aspectratio == 0){
            u_height = prompt("Enter the required image height: ");
        }
        else{
            u_height = Math.floor(u_width/aspectratio);
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.redraw(parseInt(u_width), parseInt(u_height));
    }

    //crop the required part of canvas
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

    //add the text to the canvas
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

    //save the canavs locally
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

    //save the canvas content to firebase
    save_todb(){
        var i_width = this.image.naturalWidth;
        var i_height = this.image.naturalHeight;
        var aspectratio = i_width / i_height;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.redraw(100, 100/aspectratio);
        var filename = prompt("Enter the file name you want to save as: ");
        let linkElement = document.getElementById('link');
        linkElement.setAttribute('download', `${filename}.jpg`);
        let canvasData = {name: `${filename}.jpg`,
                        link: this.canvas.toDataURL("image/png")};
        
        console.log(this.canvas.toDataURL("image/png"));

        const sendImage =  async () => {
            const response = await fetch("http://localhost:4001/create", 
            {method:"POST",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                },
            body: JSON.stringify(canvasData)
            });
        }
        
        sendImage().then(canvasData => {
                console.log(canvasData);
            });
      
    }
}

//on upload of image make the canvas object
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


//retrieve the projects from firebase
saved_proj.addEventListener(Click, ()=>{
    console.log("retrieve project");
    let filename = prompt("Enter the file name you want to retrive: ");
        const getImage = async ()=>{
            const img_response = await fetch("http://localhost:4001/",{method:"GET"});
            const data = await img_response.json()
  
            console.log(data.length);
            for (let i=0; i<data.length; i++){
                if (`${filename}.jpg` == data[i].name){
                    return(data[i].link);
                }
            }
        }
        getImage().then(data, ()=>{
            console.log(data);
        })
});