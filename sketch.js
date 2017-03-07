/////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES /////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
var p1;         // Particle
var p2;         // Particle
var paddle1;    // Paddle
var Paddle2;    // Paddle
var particles;
var paddles;
var N = 10;
var M = 10;


/////////////////////////////////////////////////////////////////////////////////////////////////
// p5.js FUNCTIONS //////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// p5: setup() //////////////////////////////////////////////////////////////////////////////////
function setup() {
  // set canvas size
  createCanvas( windowWidth , windowHeight );
  rectMode( CORNER );
  // initialize paddles
  paddles = [];
  particles = [];
  for( n = 0 ; n < N ; n++ ) {
    // columns
    var pw = width / float(N);
    for( m = 0 ; m < M ; m++ ) {
      // rows
      var ph = height / float(M);
      paddles[m*N+n] = new Paddle( n*pw , m*ph , pw , ph , (n+0.1)*pw , 0.1*pw , 0.3*ph );
      particles[m*N+n] = new Particle( n*pw , m*ph , pw , ph , 0.05*pw , paddles[m*N+n] );
    }
  }
  //paddle1 = new Paddle( 10 , 20 , 200 , 100 , 20 , 10 , 40 );
  //paddle2 = new Paddle( 100 , 200 , 300 , 400 , 110 , 10 , 40 );
  // initialize particles
  //p1 = new Particle( 10 , 20 , 200 , 100 , 5 , paddle1 );
  //p2 = new Particle( 100 , 200 , 300 , 400 , 5 , paddle2 );
} // end of p5: setup()

// p5: draw() ///////////////////////////////////////////////////////////////////////////////////
function draw() {
  // draw the background
  background( 255 );
  
  for( i = 0 ; i < M*N ; i++ ) {
    paddles[i].evolve();
    particles[i].evolve();
    particles[i].draw();
    paddles[i].draw();
  }
  // evolve the paddles
  //paddle1.evolve();
  //paddle2.evolve();
  // evolve the particles
  //p1.evolve();
  //p2.evolve();
  
  // draw the particles
  //p1.draw();
  //p2.draw();
  // draw the paddles
  //paddle1.draw();
  //paddle2.draw();
  rect( 0 , 0 , 10 , 10 );
} // end of p5: draw()

/////////////////////////////////////////////////////////////////////////////////////////////////
// CLASS: Particle
//    A particle contained in a bounding box
/////////////////////////////////////////////////////////////////////////////////////////////////
// INPUTS:
//    xIn: x coordinate for upper-right corner of bounding box
//    yIn: y coordinate for upper-right corner of bounding box
//    wIn: width of bounding box
//    hIn: height of bounding box
//    rIn: radius of particle
//    paddleIn: Paddle object
/////////////////////////////////////////////////////////////////////////////////////////////////
function Particle( xIn , yIn , wIn , hIn , rIn , paddleIn ) {
  /////////////////////////////////////////////////////////////////////////////////////////
  // FIELDS: Particle /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  this.x = xIn;     // x coordinate for upper-right corner of bounding box
  this.y = yIn;     // y coordinate for upper-right corner of bounding box
  this.w = wIn;     // width of bounding box
  this.h = hIn;     // height of bounding box
  this.r = rIn;     // radius of particle
  this.paddle = paddleIn;
  // position of the particle (random location inside of bounding box)
  this.p = createVector( random(this.x,this.x+this.w) , random(this.y,this.y+this.h) );
  // velocity of the particle (random direction with magnitude 1)
  this.v = p5.Vector.random2D();
  
  /////////////////////////////////////////////////////////////////////////////////////////
  // METHODS: Particle ////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  
  /////////////////////////////////////////////////////////////////////////////////////
  // Particle Method: draw()
  //    draws the particle, its velocity direction, and the bounding box
  /////////////////////////////////////////////////////////////////////////////////////
  this.draw = function() {
    // draw bounding box
    rect( this.x , this.y , this.w , this.h );
    // draw particle
    ellipse( this.p.x , this.p.y , 2*this.r , 2*this.r );
    // draw perticle velocity
    line( this.p.x , this.p.y , this.p.x + 10*this.v.x , this.p.y + 10*this.v.y );
  } // end of Particle method: draw()///////////////////////////////////////////////////
  
  /////////////////////////////////////////////////////////////////////////////////////
  // Particle Method: evolve()
  //    updates the particle's position and velocity:
  //    ToDo: Particle needs to bounce off of walls of the bounding box
  //    NEEDS TO BE COMPLETED - SEE BELOW!!!!!!!!
  /////////////////////////////////////////////////////////////////////////////////////
  this.evolve = function() {
    // update the position by adding the velocity to it
    this.p.add( this.v );
    
    // check whether particle has moved outside of bounding box, and adjust the
    //   velocity accordingly:
    // if particle has gone off left edge
    if( this.p.x < this.x + this.r ) {
      // update the particle's velocity
      this.v.x = abs( this.v.x );
    }
    // if particle has gone off right edge
    if( this.p.x > this.x + this.w - this.r ) {
      // update the particle's velocity
      this.v.x = -abs( this.v.x );
    }
    // if particle has gone off upper edge
    if( this.p.y < this.y + this.r ) {
      // update the particle's velocity
      this.v.y = abs( this.v.y );
    }
    // if particle has gone off lower edge
    if( this.p.y > this.y + this.h - this.r ) {
      // update the particle's velocity
      this.v.y = -abs( this.v.y );
    }
    
    // check whether the particle has collided with the paddle
    if( this.p.x < this.paddle.x + this.paddle.w + this.r &&
        this.p.x > this.paddle.x - this.r &&
        this.p.y < this.paddle.y + this.paddle.h + this.r &&
        this.p.y > this.paddle.y - this.r ) {
      // determine particle distances from top bottom, left and right of paddle edges
      var dL = abs( this.paddle.x - this.p.x );
      var dR = abs( this.paddle.x + this.paddle.w - this.p.x );
      var dT = abs( this.paddle.y - this.p.y );
      var dB = abs( this.paddle.y + this.paddle.h - this.p.y );
      // if left distance is least, bounce left
      if( dL< dR && dL < dT && dL < dB ) {
        this.v.x = -abs( this.v.x );
      }
      // if right distance is least, bounce right
      if( dR< dL && dR < dT && dR < dB ) {
        this.v.x = abs( this.v.x );
      }
      // if top distance is least, bounce up
      if( dT< dL && dT < dR && dT < dB ) {
        this.v.y = -abs( this.v.y );
      }
      // if bottom distance is least, bounce down
      if( dB< dL && dB < dR && dB < dT ) {
        this.v.y = abs( this.v.y );
      }
      
    }
  } // end of Particle method: evolve() /////////////////////////////////////////////////////////
} // END OF CLASS: Particle /////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////
// CLASS: Paddle
//    A paddle contained in a bounding box
/////////////////////////////////////////////////////////////////////////////////////////////////
// INPUTS:
//    xbIn: x coordinate for upper-right corner of bounding box
//    ybIn: y coordinate for upper-right corner of bounding box
//    wbIn: width of bounding box
//    hbIn: height of bounding box
//    xIn: x position of upper-left corner of paddle
//    wIn: width of paddle
//    hIn: height of paddle
/////////////////////////////////////////////////////////////////////////////////////////////////
function Paddle( xbIn , ybIn , wbIn , hbIn , xIn , wIn , hIn ) {
  /////////////////////////////////////////////////////////////////////////////////////////
  // FIELDS: Particle /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  this.xb = xbIn;
  this.yb = ybIn;
  this.wb = wbIn;
  this.hb = hbIn;
  this.x = xIn;
  this.y = ybIn;
  this.w = wIn;
  this.h = hIn;
  this.yMin = ybIn;
  this.yMax = this.yb +this.hb - this.h;
  
  /////////////////////////////////////////////////////////////////////////////////////////
  // METHODS: Paddle ////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  
  /////////////////////////////////////////////////////////////////////////////////////
  // Paddle Method: draw()
  //    draws the paddle
  /////////////////////////////////////////////////////////////////////////////////////
  this.draw = function() {
    // draw paddle
    rect( this.x , this.y , this.w , this.h );
  } // end of Paddle method: draw()///////////////////////////////////////////////////
  
  /////////////////////////////////////////////////////////////////////////////////////
  // Paddle Method: evolve()
  //    updates the paddle's position:
  /////////////////////////////////////////////////////////////////////////////////////
  this.evolve = function() {
    // update the y position based on mouse y position
    this.y = mouseY;
    if( this.y < this.yMin ) { this.y = this.yMin; }
    if( this.y > this.yMax ) { this.y = this.yMax; }
  } // end of Paddle method: evolve() /////////////////////////////////////////////////////////
} // END OF CLASS: Paddle /////////////////////////////////////////////////////////////////////
