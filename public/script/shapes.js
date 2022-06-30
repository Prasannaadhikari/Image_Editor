function random_number_generator(limit){
    let value = Math.random()*limit + 10;
    console.log(value);
    return value;
}

function draw_shapes(item){
    ctx.globalCompositeOperation = "source-over";
    let x_pos = random_number_generator(parseInt(canvas.width));
    let y_pos = random_number_generator(parseInt(canvas.height)-100);
    console.log(x_pos, y_pos);
    ctx.drawImage(item, x_pos,y_pos, canvas.width*0.1, canvas.width*0.1);
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