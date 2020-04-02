function compileShader(gl, shaderSource, shaderType){
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!success){
        throw ("could not compile shader:" + gl.getShaderInfoLog(shader));
    }

    return shader;
}

function createProgram(gl, vertShader, fragShader){
    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);

    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!success){
        throw ("program failed to link:" + gl.getProgramInfoLog (program));
    }

    return program;
}

function resize(canvas){
    var displayW = canvas.clientWidth;
    var displayH = canvas.clientHeight;

    if(canvas.width != displayW || 
        canvas.height != displayH){
            canvas.width = displayW;
            canvas.height = displayH;
        }
}