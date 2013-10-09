PImage img, img2;
PFont f;
geomLine[] lines;
geomBBox bBox;
int i;

void setup() {
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

void draw() {  
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
  
