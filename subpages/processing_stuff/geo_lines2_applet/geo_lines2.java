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

public class geo_lines2 extends PApplet {

PImage img, img2;
PFont f;
geomLine[] lines;
geomBBox bBox;
int i;

public void setup() {
  loop();                                     
  size(750, 500);
   
  smooth();
  //img = loadImage("vgtl-map.png");     
  //img.resize(width, height);                
  background(128);

  lines = this.readLines2("roads-vgtl-27-01-12.csv");
  bBox = this.getBboxFromLineArray(lines);
  
  i = 0;   
}

public void draw() {  
  if(i == lines.length-2){
    noLoop();
  }
  translate(125, 0);
  //while (i < lines.length-1){
    geomPoint[] points = lines[i].getAllPoints();
    geomPoint poi, poi2;
    for(int j = 0; j < points.length; j++){
      poi = transformPoint(points[j], bBox);      
      //ellipse(poi.x, poi.y, 4, 4);
      if (j != 0){
        poi2 = transformPoint(points[j-1], bBox);
        line(poi.x, poi.y, poi2.x, poi2.y);
      }      
    }
    i++;
  //} 
   //println(key);
   
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
class geomLine{
  
  geomPoint[] poi;
  int index;
  
  geomLine(int length){
    poi = new geomPoint[length];
    index = 0;
  }
  
  public void addPoint(geomPoint poi2){
    poi[index] = poi2;
    index++;
  } 
  public void addPointArray(geomPoint[] poiArray){
    int i = 0;
    while(i < poiArray.length){
      poi[i] = poiArray[i];
      i++;
    }
  }
  public int getLength(){
    return poi.length;
  }
  public geomPoint[] getAllPoints(){
    return poi;
  }
  public geomPoint getPoint(int index){
    return poi[index];
  }
      
}
class geomPoint{

  float x;
  float y;
  
  geomPoint(float x2, float y2){
   x = x2;
   y = y2;   
  }
  
  public void setX(float x2){
    x = x2;
  }
  public void setY(float y2){
    y = y2; 
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

public geomBBox getBboxFromLineArray(geomLine[] lines){
  
  float biggestX, smallestX, biggestY, smallestY;
  biggestX = 0;
  smallestX = 200000000.0f;
  biggestY = 0;
  smallestY = 200000000.0f;
  
  int i = 0;
  while (i < lines.length-1){
    geomPoint[] points = lines[i].getAllPoints();
    for(int j = 0; j < points.length; j++){      
  
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
    i++;
  }
  println("biggestX: "+biggestX);
  println("smallestX: " + smallestX);
  println("biggestY: "+biggestY);
  println("smallestY: " + smallestY);
  
  geomBBox bBox;
  bBox = new geomBBox(smallestX, smallestY, biggestX, biggestY);
  return bBox;
}
public geomLine[] readLines(){
  
  String[] lines;
  int i;
  geomLine[] lineArray;
  
  lines = loadStrings("roads-vgtl-27-01-12.csv");
  lineArray = new geomLine[lines.length];
  i = 1;
  //println(lines.length);
  while (i < lines.length){
    String[] content = split(lines[i], '(');      
    content = split(content[1], ')');
    content = split(content[0], ',');
    //println(content.length);
    int j = 0;
    geomPoint[] points;
    points = new geomPoint[content.length];
    while(j < content.length){
      String[] data = split(content[j], ' ');
      //println(data[0]);
      float x = PApplet.parseFloat(data[0]);
      float y = PApplet.parseFloat(data[1]);
      points[j] = new geomPoint(x, y); 
      j++;
    }
    //println(points.length);
    lineArray[i-1] = new geomLine(points.length);
    lineArray[i-1].addPointArray(points);
    i++;
  }
  return lineArray;
}
//*******************************************************
public geomLine[] readLines2(String dataName){
  
  String[] lines;
  int i;
  geomLine[] lineArray;
  
  lines = loadStrings(dataName);
  lineArray = new geomLine[lines.length];
  i = 1;
  //println(lines.length);
  while (i < lines.length){
    String[] content = split(lines[i], '(');      
    content = split(content[1], ')');
    content = split(content[0], ',');
    //println(content.length);
    int j = 0;
    geomPoint[] points;
    points = new geomPoint[content.length];
    while(j < content.length){
      String[] data = split(content[j], ' ');
      //println(data[0]);
      float x = PApplet.parseFloat(data[0]);
      float y = PApplet.parseFloat(data[1]);
      points[j] = new geomPoint(x, y); 
      j++;
    }
    //println(points.length);
    lineArray[i-1] = new geomLine(points.length);
    lineArray[i-1].addPointArray(points);
    i++;
  }
  return lineArray;
}
  static public void main(String args[]) {
    PApplet.main(new String[] { "--present", "--bgcolor=#666666", "--stop-color=#cccccc", "geo_lines2" });
  }
}
