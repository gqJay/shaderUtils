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

        uniform vec2 u_iResolution;
        uniform float u_rOne;
        uniform float u_blurOne;
        uniform vec3 u_colorOne;
        uniform vec2 u_onePs[33];
        uniform vec2 u_tarPosOne;
    
        uniform float u_rTwo;
        uniform float u_blurTwo;
        uniform vec3 u_colorTwo;
        //Last three vec2 doesn't be used.The reason is to use a only unique function getFactor;
        uniform vec2 u_twoPs[33];
        uniform vec2 u_tarPosTwo;
     
        uniform float u_rThree;
        uniform float u_blurThree;
        uniform vec3 u_colorThree
        uniform vec2 u_threePs[33];
        uniform vec2 u_tarPosThree;

        varying vec2 v_pos;
    
        float blurCircle(vec2 uv, vec2 tarPos, float r, float blur){
            float dis = length(uv - tarPos);
            return smoothstep(r, r - blur, dis);
        }
    
        float getFactor(vec2 uv, vec2 tarPos, float r, float blur){
            return blurCircle(uv, tarPos, r, blur);
        }
         
        void main()
        {
            vec2 pos = v_pos;
            pos *= 0.5;
            pos.x *= u_iResolution.x / u_iResolution.y;
        
        
            float factorOne = getFactor(pos, u_tarPosOne, u_rOne, u_blurOne);
            float factorTwo = getFactor(pos, u_tarPosTwo, u_rTwo, u_blurTwo);
            float factorThree = getFactor(pos, u_tarPosThree, u_rThree, u_blurThree);
    
            float factorSame = factorTwo * (1.0 - factorThree) + factorThree;
            float factorAll = factorOne * (1.0 - factorSame) + factorSame;
            gl_FragColor = vec4(u_colorOne * factorOne * (1.0 - factorSame) + u_colorTwo * factorSame + vec3(1.0) * (1.0 - factorAll) , 1.0);
        }`;

    var vertShader = compileShader(gl, vertStr, gl.VERTEX_SHADER);
    var fragShader = compileShader(gl, fragStr, gl.FRAGMENT_SHADER);
    var program = createProgram(gl, vertShader, fragShader);

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

    var onePs = [
        [-0.2, 0.1], [0.05, 0.12], [0.3, 0.14],
        [0.3, 0.14], [0.35, 0.02], [0.2, -0.1],
        [0.2, -0.1], [0.05, -0.15], [-0.1, -0.15],
        [-0.1, -0.15], [-0.3, 0.0], [-0.2, 0.1],
        [-0.2, 0.1], [0.05, 0.12], [0.3, 0.14],
        [0.3, 0.14], [0.35, 0.02], [0.2, -0.1],
        [0.2, -0.1], [0.05, -0.15], [-0.1, -0.15],
        [-0.1, -0.15], [-0.3, 0.0], [-0.2, 0.1],
        [-0.2, 0.1], [0.05, 0.12], [0.3, 0.14],
        [0.3, 0.14], [0.1, -0.05], [-0.1, -0.15],
        [-0.1, -0.15], [-0.3, 0.0], [-0.2, 0.1]
    ];

    var twoPs = [
        [0.1, -0.35], [-0.1, -0.23], [-0.3, -0.1],
        [-0.3, -0.1], [-0.25, 0.08], [0.0, 0.1],
        [0.0, 0.1], [0.1, 0.05], [0.2, -0.2],
        [0.2, -0.2], [0.4, -0.3], [0.1, -0.35],
        [0.1, -0.35], [-0.1, -0.23], [-0.3, -0.1],
        [-0.3, -0.1], [-0.25, 0.08], [0.0, 0.1],
        [0.0, 0.1], [0.1, 0.05], [0.2, -0.2],
        [0.2, -0.2], [0.4, -0.3], [0.1, -0.35],
        [0.1, -0.35], [-0.1, -0.23], [-0.3, -0.1],
        [-0.3, -0.1], [-0.05, -0.1], [0.2, -0.2],
        [-0.3, -0.1], [-0.05, -0.1], [0.3, -0.2]
    ];

    var threePs = [
        [0.6, 0.0], [0.4, -0.3], [0.0, -0.4],
        [0.0, -0.4], [-0.4, -0.3], [-0.6, 0.0],
        [-0.6, 0.0], [-0.4, 0.3], [0.0, 0.4],
        [0.0, 0.4], [0.4, 0.3], [0.6, 0.0],
        [0.6, 0.0], [0.4, -0.3],[0.0, -0.4],
        [0.0, -0.4], [-0.4, -0.3], [-0.6, 0.0],
        [-0.6, 0.0], [-0.4, 0.3], [0.0, 0.4],
        [0.0, 0.4], [0.4, 0.3], [0.6, 0.0],
        [0.6, 0.0], [0.4, -0.3], [0.0, -0.4],
        [0.0, -0.4], [-0.2, 0], [0.0, 0.4],
        [0.0, -0.4], [-0.2, 0], [0.0, 0.4]
    ];

    var onceMoveTimeOne = 0.6;
    var onceMoveTimeTwo = 0.66;
    var onceMoveTimeThree = 0.66;
    var stepOne = 11;
    var stepTwo = 10;
    var stepThree = 10;

    var iResolutionLoc = gl.getUniformLocation(program, "u_iResolution");

    var rOneUniLoc = gl.getUniformLocation(program, "u_rOne");
    var blurOneUniLoc = gl.getUniformLocation(program, "u_blurOne");
    var colorOneLoc = gl.getUniformLocation(program, "u_colorOne");
    var tarPosOneLoc = gl.getUniformLocation(program, "u_tarPosOne");

    var rTwoUniLoc = gl.getUniformLocation(program, "u_rTwo");
    var blurTwoUniLoc = gl.getUniformLocation(program, "u_blurTwo");
    var colorTwoLoc = gl.getUniformLocation(program, "u_colorTwo");
    var tarPosTwoLoc = gl.getUniformLocation(program, "u_tarPosTwo");

    var rThreeUniLoc = gl.getUniformLocation(program, "u_rThree");
    var blurThreeUniLoc = gl.getUniformLocation(program, "u_blurThree");
    var colorThreeLoc = gl.getUniformLocation(program, "u_colorThree");
    var tarPosThreeLoc = gl.getUniformLocation(program, "u_tarPosThree");

    var lastTime = new Date().getTime();
    var totalTime = 0;
    draw();
    
    function getPos(ps, step, onceMoveTime, time){
        var startIdx = parseInt(Math.floor(time / onceMoveTime) % step) * 3;
        var tarPos = bezierPos(ps[startIdx], ps[startIdx + 1], ps[startIdx + 2], (time % onceMoveTime) / onceMoveTime);
        return tarPos;
    }

    function bezierPos(pZero, pOne, pTwo, factor){
        return [Math.pow(1.0 - factor, 2.0) * pZero[0] + 2.0 * factor * (1.0 - factor) * pOne[0] + Math.pow(factor, 2.0) * pTwo[0], 
        Math.pow(1.0 - factor, 2.0) * pZero[1] + 2.0 * factor * (1.0 - factor) * pOne[1] + Math.pow(factor, 2.0) * pTwo[1]];
    }

    function draw(){
        resize(canvas);
        totalTime += (new Date().getTime() - lastTime) / 1000;
        lastTime = new Date().getTime();
        //render
        //init canvas
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
    
        gl.enableVertexAttribArray(posAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        var size = 2;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(posAttributeLocation, size, type, normalize, stride, offset);
    
        gl.uniform2f(iResolutionLoc, gl.canvas.width, gl.canvas.height);

        gl.uniform1f(rOneUniLoc, 0.6);
        gl.uniform1f(blurOneUniLoc, 0.6);
        gl.uniform3f(colorOneLoc, 0.0, 0.9, 1.0);
        var tarPosOne = getPos(onePs, stepOne, onceMoveTimeOne, totalTime);
        gl.uniform2f(tarPosOneLoc, tarPosOne[0], tarPosOne[1]);
    
        gl.uniform1f(rTwoUniLoc, 0.5);
        gl.uniform1f(blurTwoUniLoc, 0.5);
        gl.uniform3f(colorTwoLoc, 0.77, 0.19, 1.0);
        var tarPosTwo = getPos(twoPs, stepTwo, onceMoveTimeTwo, totalTime);
        gl.uniform2f(tarPosTwoLoc, tarPosTwo[0], tarPosTwo[1]);
    
        gl.uniform1f(rThreeUniLoc, 0.4);
        gl.uniform1f(blurThreeUniLoc, 0.4);
        gl.uniform3f(colorThreeLoc, 0.77, 0.19, 1.0);
        var tarPosThree = getPos(threePs, stepThree, onceMoveTimeThree, totalTime);
        gl.uniform2f(tarPosThreeLoc, tarPosThree[0], tarPosThree[1]);
    
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
        requestAnimationFrame(draw);
    }
}