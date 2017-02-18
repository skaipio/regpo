function App() {
  const defaultSides = 3;
  const self = this;
  this.sides = defaultSides;

  function main( tFrame ) {
    self.stopMain = window.requestAnimationFrame( main );
    var nextTick = self.lastTick + self.tickLength;
    var numTicks = 0;

    //If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
    //If tFrame = nextTick then 1 tick needs to be updated (and so forth).
    //Should keep track of how large numTicks is.
    //If it is large, then either game was asleep, or the machine cannot keep up.
    if (tFrame > nextTick) {
      var timeSinceTick = tFrame - self.lastTick;
      numTicks = Math.floor( timeSinceTick / self.tickLength );
    }

    queueUpdates( numTicks );
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

        self.lastTick = performance.now();
        self.lastRender = self.lastTick; //Pretend the first draw was on first update.
        self.tickLength = 50; //This sets your simulation to run at 20Hz (50ms)

        //setInitialState();
        main(performance.now()); // Start the cycle*/
      }
    });
  }

  function render(tFrame) {
    polygonToBuffer(self.app, self.sides, self.lastRender);
    drawPolygon(self.app, self.sides);
  }

  function queueUpdates( numTicks ) {
    for(var i=0; i < numTicks; i++) {
      self.lastTick = self.lastTick + self.tickLength; //Now lastTick is this tick.
      //update( self.lastTick );
    }
  }
}

function startApp() {
  var app = new App();
  app.webGLStart();
}
