void drawPoints(geomPoint[] points, int filter, int poiSize){
  geomBBox bbox;
  bbox = this.getBboxFromPointArray(points);
  for(int i = 0; i<points.length-1; i++){
    //println(points[i+1].getMetadata()[0]);
    int value = int(points[i].getMetadata()[0]);
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

void drawPoint(geomPoint points, int poiSize){
  //int value = int(points[i].getMetadata()[0]);
  geomPoint poi;
  poi = simpleTransform(points);
  ellipse(poi.x, poi.y, poiSize, poiSize);
    
}
int graphicPointSize(float value){
  int si = int(((value*value*value)/16));
  return si;
}

void writeText(String m, String d, String t){
  PFont f;
  f = loadFont("LiberationMono-Bold-24.vlw"); 
  fill(255);
  rect(300,height-50,180,20);  
  fill(0);   
  textFont(f,14);
  text(d+"."+m+".2009"+" "+t,300,height-35);//+values[3],300,height-20);

}

void drawLegendPoint(String value){
  PFont f;
  f = loadFont("LiberationMono-Bold-24.vlw"); 
  fill(0);
  int s = graphicPointSize(float(value));
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
void startAnimation(boolean animate, int i){
  int si = graphicPointSize(float(geom[i].getMetadata()[0]));
  fill(255, 0, 0,128); 
  stroke(255,128);   
  drawPoint(geom[i], si);
  writeText(geom[i].getMetadata()[1],geom[i].getMetadata()[2],geom[i].getMetadata()[3]);
  drawLegendPoint(geom[i].getMetadata()[0]);
  //println(i);
  }  
}
