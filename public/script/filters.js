
let grayscale = document.querySelector("#grayscale");

//manipulate pixel for grayscale 
grayscale.addEventListener("input", ()=>{
    if (grayscale_filter){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        grayscale_filter = false;
    }else{

        if(pixelate_filter || flag_filter || sepia_filter){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            grayscale_filter = false;
            flag_filter = false;
            pixelate_filter = false;
            grayscale.checked = false;
            invert.checked = false;
            pixelate.checked = false;
        }
    let image_pixel = ctx.getImageData(0,0, canvas.width, canvas.height);
    let pixel_data = image_pixel.data;
    console.log(pixel_data);
    // Loop over each pixel and invert the color.
    
    for (var i = 0, n = pixel_data.length; i < n; i += 4) {
        var r = pixel_data[i];
        var g = pixel_data[i+1];
        var b = pixel_data[i+2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126*r + 0.7152*g + 0.0722*b;
        pixel_data[i] = pixel_data[i+1] = pixel_data[i+2] = v;
    }

    // Draw the ImageData at the given (x,y) coordinates.
    ctx.putImageData(image_pixel, 0, 0);
    grayscale_filter = true;
    }
});

//manipulate pixel for inversion 
let invert = document.querySelector("#invert");
invert.addEventListener("input", ()=>{
    if(grayscale_filter || sepia_filter || pixelate_filter){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        grayscale_filter = false;
        sepia_filter = false;
        pixelate_filter = false;
        grayscale.checked = false;
        sepia.checked = false;
        pixelate.checked = false;
    }
    let image_pixel = ctx.getImageData(0,0, canvas.width, canvas.height);
    let pixel_data = image_pixel.data;
    console.log(pixel_data);

    //invert the color.
    for (var i = 0, n = pixel_data.length; i < n; i += 4) {
        pixel_data[i*4] = 255-pixel_data[i*4]; // Red
        pixel_data[i*4+1] = 255-pixel_data[i*4+1]; // Green
        pixel_data[i*4+2] = 255-pixel_data[i*4+2];
    }

    // Draw the ImageData at the given (x,y) coordinates.
    ctx.putImageData(image_pixel, 0, 0);
    flag_filter = true;
});

//manipulate pixel for sepia filter 
let sepia = document.querySelector("#sepia");
sepia.addEventListener("input",()=>{
    if (sepia_filter){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        sepia_filter = false;
    }
    else{

        if(grayscale_filter || flag_filter || pixelate_filter){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            grayscale_filter = false;
            flag_filter = false;
            pixelate_filter = false;
            grayscale.checked = false;
            invert.checked = false;
            pixelate.checked = false;
        }
    let image_pixel = ctx.getImageData(0,0, canvas.width, canvas.height);
    let pixel_data = image_pixel.data;

    for(var i = 0; i < pixel_data.length; i += 4){
        var red = pixel_data[i];
        var green = pixel_data[i + 1];
        var blue = pixel_data[i + 2];
        var alpha = pixel_data[i + 3];

        // calculate value for red channel in pixel
        var outRed = (red * .393) + (green *.769) + (blue * .189); 
        var outGreen = (red * .349) + (green *.686) + (blue * .168);
        var outBlue = (red * .272) + (green *.534) + (blue * .131);

        // check if the value is less than 255, if more set it to 255
        pixel_data[i] = outRed < 255 ? outRed : 255; 
        pixel_data[i + 1] = outGreen < 255 ? outGreen : 255;
        pixel_data[i + 2] = outBlue < 255 ? outBlue : 255
        pixel_data[i + 3] = alpha;
        }
        
    ctx.putImageData(image_pixel, 0, 0);
    sepia_filter = true;
    }
});

//manipulate pixel for pixelate 
let pixelate = document.querySelector("#pixelate");
pixelate.addEventListener("input", ()=>{
    if (pixelate_filter){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        pixelate_filter = false;
    }else{

        if(grayscale_filter || flag_filter || sepia_filter){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            grayscale_filter = false;
            flag_filter = false;
            sepia_filter = false;
            grayscale.checked = false;
            invert.checked = false;
            sepia.checked = false;
        }
    let image_pixel = ctx.getImageData(0,0, canvas.width, canvas.height);
    let pixel_data = image_pixel.data;

    for (let y=0; y<canvas.height; y+=sample_size){
        for (let x=0; x<canvas.width; x+=sample_size){
            let p = (x+(y*canvas.width))*4;
            console.log(x, y, p);
            ctx.fillStyle = "rgba(" + pixel_data[p] +"," + pixel_data[p+1] + "," + pixel_data[p+2] + "," + pixel_data[p+3] +")";
            ctx.fillRect(x,y, sample_size, sample_size);
        }
    }
    pixelate_filter = true;
    }
});