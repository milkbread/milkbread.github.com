import processing.core.*; 
import processing.xml.*; 

import java.applet.*; 
import java.awt.Dimension; 
import java.awt.Frame; 
import java.awt.event.MouseEvent; 
import java.awt.event.KeyEvent; 
import java.awt.event.FocusEvent; 
import java.awt.Image; 
import java.io.*; 
import java.net.*; 
import java.text.*; 
import java.util.*; 
import java.util.zip.*; 
import java.util.regex.*; 

public class geotest5_scroll extends PApplet {

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

public void setup() {
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

public void draw() {
  
  this.showScrollbar(hs1);
  
  if ((cach == hs1.getPos()) && (scrollBol == true) && (cach != 0)){
      chosenSize = (((hs1.getPos()-(width-435))/50)+1.05f); 
      println(PApplet.parseInt(chosenSize));
      this.drawPoints(geom, PApplet.parseInt(chosenSize),4);
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
public void mousePressed() {  
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
  public void getCoords(){
     lines = loadStrings("2009EQ_bearbeitet.csv");    // Read input file
  }
  //read all lines and write the coordinates to an array
  public void readLines(){
     count1 = 0; 
     count2 = 0; 
     count3 = 0; 
    int index = 1;
    magnitude = new float[lines.length];
    while (index < lines.length) {       // Iterate through lines in the file
       String[] values = split(lines[index], ';');
       magnitude[index] = PApplet.parseFloat(values[6]);
       if(magnitude[index] < 5){
        x[0][count1] =  ((PApplet.parseFloat(values[5]) + 180) / 360 * width);
        y[0][count1] =  ((-(PApplet.parseFloat(values[4])) + 90) / 180 * height); 
        count1 = count1 + 1;  
      } else if ((magnitude[index] >= 5) && (magnitude[index] <= 7)){
        x[1][count2] =  ((PApplet.parseFloat(values[5]) + 180) / 360 * width);
        y[1][count2] =  ((-(PApplet.parseFloat(values[4])) + 90) / 180 * height);
         count2 = count2 + 1;  
      } else if (magnitude[index] > 7){
        x[2][count3] =  ((PApplet.parseFloat(values[5]) + 180) / 360 * width);
        y[2][count3] =  ((-(PApplet.parseFloat(values[4])) + 90) / 180 * height);
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
public void drawPoints(geomPoint[] points, int filter, int poiSize){
  geomBBox bbox;
  bbox = this.getBboxFromPointArray(points);
  for(int i = 0; i<points.length-1; i++){
    //println(points[i+1].getMetadata()[0]);
    int value = PApplet.parseInt(points[i].getMetadata()[0]);
    //println(value);
    if (value == filter){
      geomPoint poi;
      poi = simpleTransform(points[i]);
      fill(255, 0, 0,128);
      stroke(255,128);   
      //println((value*value*value)/16); 
      int s = graphicPointSize(value);
      ellipse(poi.x, poi.y, s, s);
    }
  }
}

public void drawPoint(geomPoint points, int poiSize){
  //int value = int(points[i].getMetadata()[0]);
  geomPoint poi;
  poi = simpleTransform(points);
  ellipse(poi.x, poi.y, poiSize, poiSize);
    
}
public int graphicPointSize(float value){
  int si = PApplet.parseInt(((value*value*value)/16));
  return si;
}

public void writeText(String m, String d, String t){
  PFont f;
  f = loadFont("LiberationMono-Bold-24.vlw"); 
  fill(255);
  rect(300,height-50,180,20);  
  fill(0);   
  textFont(f,14);
  text(d+"."+m+".2009"+" "+t,300,height-35);//+values[3],300,height-20);

}

public void drawLegendPoint(String value){
  PFont f;
  f = loadFont("LiberationMono-Bold-24.vlw"); 
  fill(0);
  int s = graphicPointSize(PApplet.parseFloat(value));
  ellipse(500,height-40, s, s);
  text(value,450,height-35);

}


class animate{
  
  geomPoint[] geom;
  int sizeP;
  
  animate(geomPoint[] pois, int s){
    geom = pois;
    sizeP = s;
        
  }
public void startAnimation(boolean animate, int i){
  int si = graphicPointSize(PApplet.parseFloat(geom[i].getMetadata()[0]));
  fill(255, 0, 0,128); 
  stroke(255,128);   
  drawPoint(geom[i], si);
  writeText(geom[i].getMetadata()[1],geom[i].getMetadata()[2],geom[i].getMetadata()[3]);
  drawLegendPoint(geom[i].getMetadata()[0]);
  //println(i);
  }  
}
class geomBBox{

  float xS, xB, yS, yB;
  
  geomBBox(float xS2, float yS2, float xB2, float yB2){
    xS = xS2;
    xB = xB2;
    yS = yS2;
    yB = yB2;
  }
  
  public float getLengthH(){
    return xB-xS;
  }
  public float getLengthV(){
    return yB-yS;
  }
}
class geomPoint{

  float x;
  float y;
  String[] meta;
  int i;
  
  geomPoint(float x2, float y2){
    x = x2;
    y = y2;  
    i = 0; 
    meta = new String[50];    //-->50 Values of Metainformation should be enough
  }
  
  public void setX(float x2){
    x = x2;
  }
  public void setY(float y2){
    y = y2; 
  }
  public void addMetadata(String meta2){
    meta[i] = meta2;
    i++;
  }
  public void addMetaArray(String[] metaA){
    meta = metaA;
  }
  public String[] getMetadata(){
    return meta;
  }
}
public geomPoint transformPoint(geomPoint poi, geomBBox bbox){
  float distX, distY, x, y;
  geomPoint poi2;
  distX = bbox.getLengthH();
  distY = bbox.getLengthV();
  //transform the coordinates
  //Rule: X = (X-smallestX) / (Length along x-axis) * (width of picture)
  //      Y = (-Y-biggestY) / (Length along y-axis) * (heigth of picture)
  x = ((poi.x-bbox.xS) / (distX) * 500);
  y = ((-poi.y + bbox.yB) / (distY) * 500);
  poi2 = new geomPoint(x, y);
  
  return poi2;
}

public geomPoint simpleTransform(geomPoint poi){
  geomPoint poi2;
  float x, y;
  x = (poi.x + 180) / 360 * width;
  y = (-poi.y + 90) / 180 * height;
  poi2 = new geomPoint(x, y);
  
  return poi2;  
}

public geomBBox getBboxFromPointArray(geomPoint[] points){
  
  float biggestX, smallestX, biggestY, smallestY;
  biggestX = 0;
  smallestX = 200000000.0f;
  biggestY = 0;
  smallestY = 200000000.0f;
  
  int i = 0;
 
  for(int j = 0; j < points.length-1; j++){      
  
    if ((biggestX < points[j].x) && (points[j].x != 0)){
      biggestX = points[j].x;
    }
    if ((smallestX > points[j].x) && (points[j].x != 0)){
      smallestX = points[j].x;
    }
    if ((biggestY < points[j].y) && (points[j].y != 0)){
      biggestY = points[j].y;
    }
    if ((smallestY > points[j].y) && (points[j].y != 0)){
      smallestY = points[j].y;
    }     
  }
  
  println("biggestX: "+biggestX);
  println("smallestX: " + smallestX);
  println("biggestY: "+biggestY);
  println("smallestY: " + smallestY);
  
  geomBBox bBox;
  bBox = new geomBBox(smallestX, smallestY, biggestX, biggestY);
  return bBox;
}
class button {

  float x, y, wid, heig;
  String name;

  button(float x2, float y2, float w, float h, String name2) {
    x = x2;
    y = y2;
    wid = w;
    heig = h;
    name = name2;
    rect(x, y, wid, heig);
  }

  public float getXMin() {
    return x;
  }
  public float getXMax() {
    return x+wid;
  }
  public float getYMin() {
    return y;
  }
  public float getYMax() {
    return y+heig;
  }
  public float getWidth() {
    return wid;
  }
  public float getHeigth() {
    return heig;
  }
  public String buttonName() {
    return name;
  }
}

public button[] steering() {
  PFont f;
  f = loadFont("LiberationMono-Bold-24.vlw");

  //main text
  textFont(f);
  fill(0);
  text("Earthquakes in 2009", 20, height-20);

  //draw the buttons of the legend
  fill(200);
  noStroke();


  button[] buts;
  buts = new button[5];
  int bw, bh;
  bw = 60;
  bh = 25;
  /*buts[0] = new button(640,height-40,bw,bh,"< 5");
   buts[1] = new button(740,height-40,bw,bh,"< 7");
   buts[2] = new button(840,height-40,bw,bh,"> 7"); 
   
   stroke(0);
   fill(255, 0, 0);   
   ellipse(buts[0].getXMin()+10, buts[0].getYMin()+10,4,4);
   fill(175, 0, 0);
   ellipse(buts[1].getXMin()+10, buts[1].getYMin()+10,8,8);
   fill(125, 0, 0);
   ellipse(buts[2].getXMin()+10, buts[2].getYMin()+10,16,16);
   
   fill(0);
   textFont(f,14);
   int toffsetw = 25;
   int toffseth = 17;
   text(buts[0].buttonName(),buts[0].getXMin()+toffsetw,buts[0].getYMin()+toffseth);
   textFont(f,16);
   text(buts[1].buttonName(),buts[1].getXMin()+toffsetw,buts[1].getYMin()+toffseth);
   textFont(f,18);
   text(buts[2].buttonName(),buts[2].getXMin()+toffsetw,buts[2].getYMin()+toffseth);  
   */
  //draw the reset Map button
  fill(0);
  stroke(255);
  buts[3] = new button(425, height-20, 75, 20, "Reset Map");
  textFont(f, 10);
  fill(255);
  text(buts[3].buttonName(), buts[3].getXMin()+10, buts[3].getYMin()+13);  

  //draw the reset Animation button
  fill(0);
  stroke(255);
  buts[4] = new button(350, height-20, 75, 20, "Reset Anim");
  textFont(f, 10);
  fill(255);
  text(buts[4].buttonName(), buts[4].getXMin()+10, buts[4].getYMin()+13);   

  fill(0);
  int xPos = 450;
  for (int j = 1; j <= 9; j++) {    
    text(j, width-xPos, height-30);

    int s = graphicPointSize(j);
    ellipse((width-xPos), height-15, s, s);
    xPos = xPos - 50;
  }
  
  return buts;
}

public button animateB(boolean animate) {

  PFont f;
  f = loadFont("LiberationMono-Bold-24.vlw");

  //draw the animate button
  button but;
  fill(0);
  but = new button(300, height-20, 50, 20, "Animate");
  //rect(550,height-50,50,20);
  fill(255);   
  textFont(f, 10);
  if (animate == true) {           //the textchange for clicking on the animate/stop button     
    text("Stop", but.getXMin()+10, but.getYMin()+13); 
    //text("Stop",560,height-37);
  } 
  else {
    text(but.buttonName(), but.getXMin()+4, but.getYMin()+13); 
    //text("Animate",554,height-37);
  } 


  return but;
}

public void showScrollbar(HScrollbar hs) {
  hs1.update();
  hs1.display();
  float topPos = hs.getPos();
  fill(128);
  //rect(topPos,180,20,20);
}

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
public geomPoint[] readFile(){
  
  String[] lines;
  int i;
  geomPoint[] points;
  
  lines = loadStrings("2009EQ_bearbeitet.csv");
  points = new geomPoint[lines.length];
  i = 1;
  //println(lines.length);
  while (i < lines.length){
    String[] content = split(lines[i], ';');    
    
    float x = PApplet.parseFloat(content[5]);
    float y = PApplet.parseFloat(content[4]);
    points[i-1] = new geomPoint(x, y); 
    points[i-1].addMetadata(content[6]);
    points[i-1].addMetadata(content[1]);
    points[i-1].addMetadata(content[2]);
    points[i-1].addMetadata(content[3]);  
    i++;
  }
  return points;
}

 
/**
 * Scrollbar. 
 * 
 * Move the scrollbars left and right to change the positions of the images. 
 */
 
/*HScrollbar hs1, hs2;

PImage top, bottom;         // Two image to load
int topWidth, bottomWidth;  // The width of the top and bottom images


void setup()
{
  size(200, 200);
  noStroke();
  hs1 = new HScrollbar(0, 20, width, 10, 3*5+1);
  hs2 = new HScrollbar(0, height-20, width, 10, 3*5+1);
  top = loadImage("seedTop.jpg");
  topWidth = top.width;
  bottom = loadImage("seedBottom.jpg");
  bottomWidth = bottom.width;
}

void draw()
{
  background(255);
  
  // Get the position of the top scrollbar
  // and convert to a value to display the top image 
  float topPos = hs1.getPos()-width/2;
  fill(255);
  image(top, width/2-topWidth/2 + topPos*2, 0);
  
  // Get the position of the bottom scrollbar
  // and convert to a value to display the bottom image
  float bottomPos = hs2.getPos()-width/2;
  fill(255);
  image(bottom, width/2-bottomWidth/2 + bottomPos*2, height/2);
 
  hs1.update();
  hs2.update();
  hs1.display();
  hs2.display();
}
*/

class HScrollbar
{
  int swidth, sheight;    // width and height of bar
  int xpos, ypos;         // x and y position of bar
  float spos, newspos;    // x position of slider
  int sposMin, sposMax;   // max and min values of slider
  int loose;              // how loose/heavy
  boolean over;           // is the mouse over the slider?
  boolean locked;
  float ratio;

  HScrollbar (int xp, int yp, int sw, int sh, int l) {
    swidth = sw;
    sheight = sh;
    int widthtoheight = sw - sh;
    ratio = (float)sw / (float)widthtoheight;
    xpos = xp;
    ypos = yp-sheight/2;
    spos = xpos + swidth/2 - sheight/2;
    newspos = spos;
    sposMin = xpos;
    sposMax = xpos + swidth - sheight;
    loose = l;
  }

  public void update() {
    if(over()) {
      over = true;
    } else {
      over = false;
    }
    if(mousePressed && over) {
      locked = true;
    }
    if(!mousePressed) {
      locked = false;
    }
    if(locked) {
      newspos = constrain(mouseX-sheight/2, sposMin, sposMax);
    }
    if(abs(newspos - spos) > 1) {
      spos = spos + (newspos-spos)/loose;
    }
  }

  public int constrain(int val, int minv, int maxv) {
    return min(max(val, minv), maxv);
  }

  public boolean over() {
    if(mouseX > xpos && mouseX < xpos+swidth &&
    mouseY > ypos && mouseY < ypos+sheight) {
      return true;
    } else {
      return false;
    }
  }

  public void display() {
    fill(128);
    rect(xpos, ypos, swidth, sheight);
    if(over || locked) {
      fill(153, 102, 0);
    } else {
      fill(102, 102, 102);
    }
    rect(spos, ypos, sheight, sheight);
  }

  public float getPos() {
    // Convert spos to be values between
    // 0 and the total width of the scrollbar
    return spos * ratio;
  }
}
  static public void main(String args[]) {
    PApplet.main(new String[] { "--present", "--bgcolor=#666666", "--stop-color=#cccccc", "geotest5_scroll" });
  }
}
