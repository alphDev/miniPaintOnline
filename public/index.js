
function init() {
    let canvas_config = {
        limpiar: false
    }


    let mouse = {
        click: false,
        move: false,
        position: { x: 0, y: 0 },
        position_prev: { x: 0, y: 0 }
    };

    // Canvas
    const canvas = document.getElementById('dibujo');
    const clean = document.getElementById("limpiar");
    const context = canvas.getContext('2d');
    const width = 1200;
    const height = 800;

    canvas.width = width;
    canvas.height = height;

    const sockets = io();

    // event listener
    canvas.addEventListener('mousedown', (e) => {
        mouse.click = true;
  
    });

    canvas.addEventListener('mouseup', (e) => {
        mouse.click = false;

    });

    canvas.addEventListener('mousemove', (e) => {
        mouse.position.x = e.clientX;
        mouse.position.y = e.clientY;
        mouse.move = true
    });
    

     clean.addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        sockets.emit('limpiar', limpiar = true) // para posibles guardados
        
    })

    sockets.on('limpiar', (data) => {
        console.log("Cliente limpiar es = ", data);
        canvas_config.limpiar = data;
    })

    sockets.on('dibujando', (data) => {
        console.log(data);
            context.beginPath();
            context.lineWith = 1;
            context.moveTo(data.line[0].x - canvas.offsetLeft, data.line[0].y - canvas.offsetTop);
            context.lineTo(data.line[1].x - canvas.offsetLeft, data.line[1].y - canvas.offsetTop);
            context.stroke();

    })

    function mainLoop() {
          if(canvas_config.limpiar) {
              context.clearRect(0, 0, canvas.width, canvas.height);
              canvas_config.limpiar = false
          }
  
        
        if(mouse.click && mouse.move && mouse.position_prev) {
            sockets.emit('dibujando', { line: [mouse.position, mouse.position_prev]});
            mouse.move = false;
        }

        mouse.position_prev = {x: mouse.position.x, y: mouse.position.y};
        setTimeout(mainLoop, 25);
    }
    mainLoop();


}

document.addEventListener('DOMContentLoaded', init());