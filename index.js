const defaultSides = 3;

const bindRefresh = (app) => {
  $('#sides-form').submit((event) => {
    event.preventDefault();
    var sidesInput = $('#sides');
    var sides = parseInt(sidesInput.val());
    if (!Number.isInteger(sides) || sides < defaultSides) {
      sides = defaultSides;
    }
    polygonToBuffer(app, sides);
    drawPolygon(app, sides);
  });
}

const webGLStart = () => {
  PhiloGL('polygoner', {
    program: {
      from: 'ids',
      vs: 'shader-vs',
      fs: 'shader-fs'
    },
    onError: function() {
      alert("An error ocurred while loading the application");
    },
    onLoad: function(app) {
      bindRefresh(app);

      var gl = app.gl,
          canvas = app.canvas,
          program = app.program,
          camera = app.camera;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clearDepth(1);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      polygonToBuffer(app, defaultSides);
      drawPolygon(app, defaultSides);
    }
  });
}

// Offset to rotate 90 degrees
const angleOffset = Math.PI / 2;

const polygonToBuffer = (app, sides) => {
  const halved = Math.floor(sides / 2);
  var fullAngle = 2 * Math.PI;
  var angle = fullAngle / sides;
  var vertexPositions = [];
  for (var side = 0; side < halved; ++side) {
    var finalAngle = angle * side + angleOffset;
    var finalAngleOpposite = angle * (sides - side - 1) + angleOffset;
    var x1 = Math.cos(finalAngle), x2 = Math.cos(finalAngleOpposite);
    var y1 = Math.sin(finalAngle), y2 = Math.sin(finalAngleOpposite);
    vertexPositions.push([x1, y1, 0]);
    vertexPositions.push([x2, y2, 0]);
    console.log('vertex', x1, y1);
    console.log('opposite', x2, y2);
  }

  // If odd number of sides, add the last vertex
  if (sides % 2 > 0) {
    var x = Math.cos(angle * halved + angleOffset);
    var y = Math.sin(angle * halved + angleOffset);
    vertexPositions.push([x, y, 0]);
  }

  //vertexPositions = translate(vertexPositions, [3, 0, 0]);
  app.program.setBuffers({
    'triangle': {
      attribute: 'aVertexPosition',
      value: new Float32Array(flatten(vertexPositions)),
      size: 3
    }
  });
}

const drawPolygon = (app, sides) => {
  var gl = app.gl,
      program = app.program,
      camera = app.camera;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  camera.view.id();
  //Draw Triangle
  camera.view.$translate(-1.5, 0, -7);
  program.setUniform('uMVMatrix', camera.view);
  program.setUniform('uPMatrix', camera.projection);
  program.setBuffer('triangle');
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, sides);
}

const translate = (vertices, translationVector) => {
  return vertices.map((vertex) =>
    vertex.map((component, i) =>
      component + translationVector[i]));
};

const flatten = (arr) => arr.reduce((a, b) => a.concat(b));
