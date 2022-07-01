function clear_frame(frame_dis){
    if(frame_dis){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0,0, image.width, image.height);
        frame_dis = false;
    }
}

/**
 * 
 * @param {object} f frameselected
 */
function draw_frame(f){
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(f, 0,0, canvas.width, canvas.height);
    // restore_arr.push(ctx.getImageData(0,0, canvas.width, canvas.height));
    // index+=1;
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