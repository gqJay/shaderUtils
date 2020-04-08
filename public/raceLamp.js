function show(canvas){
    var gl = canvas.getContext("webgl");
    if(!gl){
        return;
    }

    var vertStr = `
        attribute vec4 a_position;
        varying vec2 v_pos;

        void main(){
            v_pos = a_position.xy;
            gl_Position = a_position;
        }
    `;

    // var fragStr = `
    //     precision mediump float;

    //     void main(){
    //         gl_FragColor = vec4(1, 0, 1, 1);
    //     }
    // `;

    var fragStr = `
        precision mediump float;
        
        uniform vec2 u_Resolution;
        uniform float u_border_width;
        uniform float u_border_length;
        uniform float u_transparent_length;
        uniform float u_Time;

        varying vec2 v_pos;

        float getBorderTransparent(vec2 fragCoord, float real_end, float fadeOutLength){
            float perimeter = (u_Resolution.x + u_Resolution.y) * 2.0;

            float t = 0.0;
            if(fragCoord.x < u_border_width){
                t = u_Resolution.y - fragCoord.y;
            }
            else if(fragCoord.y < u_border_width && fragCoord.x > u_border_width && fragCoord.x < u_Resolution.x - u_border_width){
                t = u_Resolution.y + fragCoord.x;
            }
            else if(fragCoord.x > u_Resolution.x - u_border_width){
                t = u_Resolution.y + u_Resolution.x + fragCoord.y;
            }
            else{
                t = u_Resolution.y + u_Resolution.x + u_Resolution.y + (u_Resolution.x - fragCoord.x);
            }

            float end = mod(real_end, perimeter);

            if(t > end && t < end + u_border_length){
                return mix(0.0, 1.0, (t - end) / fadeOutLength);
            }else if(t + perimeter > end && t + perimeter < end + u_border_length){
                return mix(0.0, 1.0, (t + perimeter - end) / fadeOutLength);
            }
            else{
                return 0.0;
            }
        }

        float getTransparent(vec2 fragCoord){
            if(fragCoord.x > u_border_width && fragCoord.x < u_Resolution.x - u_border_width && fragCoord.y > u_border_width && fragCoord.y < u_Resolution.y - u_border_width){
                return 0.0;
            }

            return getBorderTransparent(fragCoord, u_Time * 300.0, u_transparent_length) + getBorderTransparent(fragCoord, u_Time * 300.0 + u_Resolution.x + u_Resolution.y, u_transparent_length);
        }

        void main(){
            vec2 uv = v_pos * 0.5 + 0.5;
            vec2 fragCoord;
            fragCoord.x = uv.x * u_Resolution.x;
            fragCoord.y = uv.y * u_Resolution.y;

            vec3 pixelColor = 0.5 + 0.5 * cos(u_Time * 5.0 + uv.xyx + vec3(0, 2, 4));
            float transparent = getTransparent(fragCoord);
            gl_FragColor = vec4(pixelColor * transparent + vec3(1.0) * (1.0 - transparent), 1.0);
        }
    `;

    var vertShader = compileShader(gl, vertStr, gl.VERTEX_SHADER);
    var fragShader = compileShader(gl, fragStr, gl.FRAGMENT_SHADER);
    var program = createProgram(gl, vertShader, fragShader);
    gl.useProgram(program);

    //init attribute data
    var posAttributeLocation = gl.getAttribLocation(program, "a_position");
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    var pos = [
        -1, -1, 
        1, 1,
        1, -1,
        1, 1,
        -1, 1,
        -1, -1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posAttributeLocation);
    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(posAttributeLocation, size, type, normalize, stride, offset);

    var resolutionLoc = gl.getUniformLocation(program, "u_Resolution");
    var borderWidthLoc = gl.getUniformLocation(program, "u_border_width");
    var borderLengthLoc = gl.getUniformLocation(program, "u_border_length");
    var transparentLengthLoc = gl.getUniformLocation(program, "u_transparent_length");
    var timeLoc = gl.getUniformLocation(program, "u_Time");

    gl.uniform1f(borderWidthLoc, 10.0);
    gl.uniform1f(borderLengthLoc, 400.0);
    gl.uniform1f(transparentLengthLoc, 400.0);

    var lastTime = new Date().getTime();
    var totalTime = 0;
    draw();

    function draw(){
        resize(canvas);
        totalTime += (new Date().getTime() - lastTime) / 1000;
        lastTime = new Date().getTime();
        //render
        //init canvas
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    
        gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(timeLoc, totalTime);
    
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
        requestAnimationFrame(draw);
    }
}