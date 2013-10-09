// Defining all necessary variables

PImage img;
button[] buts;
button but;
boolean animated;

geomPoint[] geom;

animate anim;

int lastTime = 0;
int i = 0;

HScrollbar hs1;
float cach, chosenSize;
boolean scrollBol;

void setup() {
   //noLoop();                                     // Draw only once
   size(1000, 500);                             // Define canvas size
   smooth();
   // Load backdrop image
   img = loadImage("land_ocean_ice_2048.jpg");      
   img.resize(width, height);                 // Resize to fit canvas
   background(img);
   
   geom = this.readFile();
   animated = false;
   anim = new animate(geom,8);
   
   hs1 = new HScrollbar(width-450, height-50, 400, 10, 3*5+1);
   cach = 0;
   chosenSize = 0;
   scrollBol = false;
   
}

void draw() {
  
  this.showScrollbar(hs1);
  
  if ((cach == hs1.getPos()) && (scrollBol == true) && (cach != 0)){
      chosenSize = (((hs1.getPos()-(width-435))/50)+1.05); 
      println(int(chosenSize));
      this.drawPoints(geom, int(chosenSize),4);
      scrollBol = false;
      cach = 0;
   
  } else{
    cach = hs1.getPos();
  }
  
  buts = this.steering();
  but = this.animateB(animated);
    
  if (animated == true){
    tint(255,2);
    image(img, 0, 0); 	
    anim.startAnimation(animated,i);
    i++;
  }
  if (i == geom.length){
    noLoop();
  } 
  
}

//set the steerings
void mousePressed() {  
  //the point legend
  /*if ((mouseX >= buts[0].getXMin()) && (mouseX <= buts[0].getXMax()) && (mouseY >= buts[0].getYMin()) && (mouseY <= buts[0].getYMax())) {  
    this.drawPoints(geom, 5, 4);
  }
  if ((mouseX >= buts[1].getXMin()) && (mouseX <= buts[1].getXMax()) && (mouseY >= buts[1].getYMin()) && (mouseY <= buts[1].getYMax())) {  
    this.drawPoints(geom, 6, 8);
  }
  if ((mouseX >= buts[2].getXMin()) && (mouseX <= buts[2].getXMax()) && (mouseY >= buts[2].getYMin()) && (mouseY <= buts[2].getYMax())) {  
    this.drawPoints(geom, 7, 16);
  }*/
  //the reset Map button
  if ((mouseX >= buts[3].getXMin()) && (mouseX <= buts[3].getXMax()) && (mouseY >= buts[3].getYMin()) && (mouseY <= buts[3].getYMax())) {
    tint(255);
    image(img, 0, 0);
    this.steering();
    this.animateB(animated);
    
  }
  //the reset Animation button
  if ((mouseX >= buts[4].getXMin()) && (mouseX <= buts[4].getXMax()) && (mouseY >= buts[4].getYMin()) && (mouseY <= buts[4].getYMax())) {
    println("test");
    i = 0;
    
  }
  //the animation button
  if ((mouseX >= but.getXMin()) && (mouseX <= but.getXMax()) && (mouseY >= but.getYMin()) && (mouseY <= but.getYMax())) {  
    if (animated == true){
      animated = false;
      //anim.startAnimation(true);
      //noLoop();
    } else {
      animated = true;
      //loop();
    }
    this.animateB(animated);
  }
  
  //the scrollbar
  if ((mouseX >= width - 450) && (mouseX <= width -50) && (mouseY >= height - 55) && (mouseY <= height - 45)) {
    scrollBol = true;
  }
}


