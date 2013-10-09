// Defining all necessary variables
float x, y, c;
int m, d;
int index;
PImage img;
PFont f;
boolean mags, pause;
boolean reset;

// Defining the individual object 'Coords'
Coords coords;

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
   //initialize the indivdual object and...
   coords = new Coords();          
   coords.getCoords();                  //...read the content file and...
   coords.readLines();                  //...read all lines and get the coords
  
}

void draw() {
  
  //reset visualisation if applied
  if (reset == true){
    //image(img, 0, 0);
    reset = false;
    noLoop();
  }
  //set image with a opacity of '2' --> realizes the smoothing of the points after a while
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
  text("single",width-55,height-15);
      
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
  
  
  //stop the animation if all lines were visualised 
  if (index == (lines.length - 1)){
    noLoop();
  } 
  
    
  index = index + 1;
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
  if ((mouseX >= 650) && (mouseX <= 700) && (mouseY >= height-30) && (mouseY <= height-10)) {  
    this.printCoords(0);
    loop();
    reset = true;
  }
  if ((mouseX >= 750) && (mouseX <= 800) && (mouseY >= height-30) && (mouseY <= height-10)) {  
    this.printCoords(1);
    loop();
    reset = true;
  }
  if ((mouseX >= 850) && (mouseX <= 900) && (mouseY >= height-30) && (mouseY <= height-10)) {  
    this.printCoords(2);
    loop();
    reset = true;
  }
}
void printCoords(int val){
  int index = 0;
  while (index < coords.x[val].length){
    if (coords.x[val][index] != 0){
      if (val == 0){
        fill(255, 0, 0);    
        ellipse(coords.x[val][index], coords.y[val][index], 4, 4); 
      } else if (val == 1){
          fill(175, 0, 0);
          ellipse(coords.x[val][index], coords.y[val][index], 8, 8);
      } else if (val == 2){                   //magnitude bigger than 7
          fill(125, 0, 0);
          ellipse(coords.x[val][index], coords.y[val][index], 16, 16);
      }
    }
    index = index + 1;
  }

}
//Defining an individual object for reading the csv-file and storing all coordinates in an array
class Coords{

  float[][] x;
  float[][] y;
  float[] magnitude;
  String[] lines;
  int count1, count2, count3;
  
  Coords(){
    //too hard coded...to be changed
      x = new float[3][10000];
      y = new float[3][10000];
  }
  //load the file
  void getCoords(){
     lines = loadStrings("2009EQ_bearbeitet.csv");    // Read input file
  }
  //read all lines and write the coordinates to an array
  void readLines(){
     count1 = 0; 
     count2 = 0; 
     count3 = 0; 
    int index = 1;
    magnitude = new float[lines.length];
    while (index < lines.length) {       // Iterate through lines in the file
       String[] values = split(lines[index], ';');
       magnitude[index] = float(values[6]);
       if(magnitude[index] < 5){
        x[0][count1] =  ((float(values[5]) + 180) / 360 * width);
        y[0][count1] =  ((-(float(values[4])) + 90) / 180 * height); 
        count1 = count1 + 1;  
      } else if ((magnitude[index] >= 5) && (magnitude[index] <= 7)){
        x[1][count2] =  ((float(values[5]) + 180) / 360 * width);
        y[1][count2] =  ((-(float(values[4])) + 90) / 180 * height);
         count2 = count2 + 1;  
      } else if (magnitude[index] > 7){
        x[2][count3] =  ((float(values[5]) + 180) / 360 * width);
        y[2][count3] =  ((-(float(values[4])) + 90) / 180 * height);
         count3 = count3 + 1;  
      }
      index = index + 1;
     }
     
     //x = (x + 180) / 360 * width;
     //y = (-y + 90) / 180 * height;
     println("All Coords are loaded!");
     println(count1 + " points with magnitude <5");
     println(count2+" points with magnitude betwenn 5 and 7");
     println(count3+" points with magnitude >7");
  }

}
