function App() {
  const defaultSides = 3;
  const self = this;
  this.sides = defaultSides;

  function main( tFrame ) {
    self.stopMain = window.requestAnimationFrame( main );
    render( tFrame );
    self.lastRender = tFrame;
  }

  const bindSidesInput = () => {
    self.sidesInput.change(() => {
      self.sides = parseInt(self.sidesInput.val());
      if (!Number.isInteger(self.sides)) {
        self.sides = defaultSides;
      }

      const maxEdges = 120;
      const minEdges = 3;

      self.sides = Math.min(maxEdges, Math.max(minEdges, self.sides));
      self.sidesInput.val(self.sides);
    });
  }

  this.webGLStart = () => {
    PhiloGL('polygon-canvas', {
      program: {
        from: 'ids',
        vs: 'shader-vs',
        fs: 'shader-fs'
      },
      onError: function() {
        alert("An error ocurred while loading the application");
      },
      onLoad: function(app) {
        self.app = app;
        self.sidesInput = $('#sides');
        self.sides = 3;

        bindSidesInput();

        var gl = app.gl,
            canvas = app.canvas,
            program = app.program,
            camera = app.cameravar;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        self.lastRender = performance.now();

        //setInitialState();
        main(performance.now()); // Start the cycle*/
      }
    });
  }

  function render(tFrame) {
    polygonToBuffer(self.app, self.sides, self.lastRender);
    drawPolygon(self.app, self.sides);
  }
}

function startApp() {
  var app = new App();
  app.webGLStart();
}
