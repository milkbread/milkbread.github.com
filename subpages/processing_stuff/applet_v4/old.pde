// Defining all necessary variables
/*float x, y, c;
int m, d;
int index;
PImage img;
PFont f;
boolean mags, pause;
boolean reset;
geomPoint[] geom;


void setup() {
   noLoop();                                     // Draw only once
   size(1000, 500);                             // Define canvas size
   smooth();
   // Load backdrop image
   img = loadImage("land_ocean_ice_2048.jpg");      
   img.resize(width, height);                 // Resize to fit canvas
   background(img);
   index = 1;                                  // initilize the loop-index to start from 2nd line in file
   f = loadFont("LiberationMono-Bold-24.vlw");    //load a font
   mags = false;                              //defines if the magnitude is displayed
   pause = true;                              //defines if the animation is paaused
   reset = false;                             //defines if the visualisation gets resetted
   geom = this.readFile();
   println(geom[0].meta[3]);
   this.drawPoints(geom, 7);
}

void draw() {
  
  
  //reset visualisation if applied
  if (reset == true){
    reset = false;
    noLoop();
  }
  //set image with an opacity of '2' --> realizes the smoothing of the points after a while
  tint(255,2);
  image(img, 0, 0);                                // Draw background
  //load a file and store inputstream to a Stringarray
  String[] lines;
  lines = loadStrings("2009EQ_bearbeitet.csv");    // Read input file
  //get the coordinates and additional informations from inputstring
  String[] values = split(lines[index], ';');     // Split lines into individual strings
  x = float(values[5]);                           // Retrieve x coordinate from 6th column
  y = float(values[4]);                           // Retrieve y coordinate from 5th column  
  c = float(values[6]);                          //Retrieve magnitude from 7th column --> it defines the point color
  m = int(values[1]);                            //Retrieve month
  d = int(values[2]);                            //Retrieve day
  String[] time = split(values[3], ':' );        //Retrieve time of the earthquake  
  
  // x and y are in geographic space and in degrees:
  // x = [-180, 180] and y = [-90, 90]
  x = (x + 180) / 360 * width;
  y = (-y + 90) / 180 * height;
  // x and y are now in "screen space" and in pixels:
  // x = [0, wdth] and y = [0, hght]
    
  //set the values for the visualisation of the earthquake points
  stroke(0);                            //all have a black stroke and differ in size and color
  if(c < 5){                            //maginitude smaller than 5
    fill(255, 0, 0);    
    ellipse(x, y, 4, 4);    
  } else if ((c >= 5) && (c <= 7)){    //magnitude between 5 and 7
    fill(175, 0, 0);
    ellipse(x, y, 8, 8);
  } else if (c > 7){                   //magnitude bigger than 7
    fill(125, 0, 0);
    ellipse(x, y, 16, 16);
  }
  //set the values for the visualisation of the magnitudes as rectangles
  if (mags == true){
    if (c > 7){          //magnitude bigger than 7 get a white stroke
      stroke(255);
    }
    else{                //magnitudes smaller than 7 get no stroke
      noStroke();
    }
    rect(x,0,10,c*10);   //set a rectangle at the x position of the point and with a length of the magnitude with factor 10  
    fill(255);            //set textcolor to white
    textFont(f,20);        //load a font with size 20
    text(int(c),x,(c*10));  //write the value of the magnitude to the end of the rectangle
  }
   
  //draw the reset button
  fill(0);
  rect(width-60,height-30,60,30);
  textFont(f,14);
  fill(255);
  text("reset",width-55,height-15);
      
  //draw interactive legend at the bottom of the image
    //the big rectangle
  fill(255);
  rect(0,height-50,600,50);
    //magnitude button
  fill(128,0,0);  
  rect(550,height-30,50,30);   
  textFont(f,10);
  fill(255);
  text("Magnit.",555,height-15);
    //main text
  textFont(f);
  fill(0);
  text("Earthquakes in 2009",20,height-20);
  text(d+"."+m+".2009"+" "+values[3],300,height-20);
    //the animate/stop button
  rect(550,height-50,50,20);
  fill(255);   
  textFont(f,10);
  if (pause == false) {           //the textchange for clicking on the animate/stop button     
    text("Stop",560,height-37);
  } 
  else{
    text("Animate",554,height-37);
  } 
    //point legend, point size and color 
  this.pointLegend();
  
  //stop the animation if all lines were visualised 
  if (index == (lines.length - 1)){
    noLoop();
  } 
  
    
  index = index + 1;
}

void pointLegend(){
  fill(200);
  noStroke();
  rect(640,height-40,60,20);
  rect(740,height-40,60,20);
  rect(840,height-40,60,20);
  stroke(0);
  fill(255, 0, 0);    
  ellipse(650,height-30, 4, 4);   
  fill(175, 0, 0);
  ellipse(750, height-30, 8, 8);
  fill(125, 0, 0);
  ellipse(850, height-30, 16, 16); 
  
  fill(0);
  textFont(f,14);
  text("< 5",665,height-26);
  textFont(f,16);
  text("< 7",765,height-26);
  textFont(f,18);
  text("> 7",865,height-26);
  
}

//set some values for the interactive steering of the animation
void mousePressed() {  
  // the animate/stop button
  if ((mouseX >= 550) && (mouseX <= 600) && (mouseY >= height-50) && (mouseY <= height-30)) {
     if (pause == false){
       noLoop();
       pause = true;
       rect(550,height-50,50,20); 
       fill(255);
       textFont(f,10);
       text("Animate",554,height-37);
     }
     else {
       loop();
       pause = false;       
     }     
  }
  //the Mags button
  if ((mouseX >= 550) && (mouseX <= 600) && (mouseY >= height-30) && (mouseY <= height)){
    if (mags == true){
      mags = false;
    }
    else{
      mags = true;
    }
  }
  //the reset button
  if ((mouseX >= width-60) && (mouseX <= width) && (mouseY >= height-30) && (mouseY <= height)) {  
     //println("Tataa"); 
     tint(255);
     image(img, 0, 0);
     loop();
     reset = true;    
  }
  //the point legend
  rect(640,height-40,60,20);
  rect(740,height-40,60,20);
  rect(840,height-40,60,20);
  if ((mouseX >= 640) && (mouseX <= 700) && (mouseY >= height-40) && (mouseY <= height-20)) {  
    //this.printCoords(0);
    loop();
    reset = true;
  }
  if ((mouseX >= 740) && (mouseX <= 800) && (mouseY >= height-40) && (mouseY <= height-20)) {  
    //this.printCoords(1);
    loop();
    reset = true;
  }
  if ((mouseX >= 840) && (mouseX <= 900) && (mouseY >= height-40) && (mouseY <= height-20)) {  
    //this.printCoords(2);
    loop();
    reset = true;
  }
}


  
*/ 
