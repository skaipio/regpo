const polygonToBuffer = (app, sides, time) => {
  // Offset to rotate 90 degrees
  const angleOffset = Math.PI / 2 + time * 0.001;
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
  }

  // If odd number of sides, add the last vertex
  if (sides % 2 > 0) {
    var x = Math.cos(angle * halved + angleOffset);
    var y = Math.sin(angle * halved + angleOffset);
    vertexPositions.push([x, y, 0]);
  }

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
  camera.view.$translate(0, 0, -5);
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
