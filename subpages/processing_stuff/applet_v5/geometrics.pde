geomPoint transformPoint(geomPoint poi, geomBBox bbox){
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

geomPoint simpleTransform(geomPoint poi){
  geomPoint poi2;
  float x, y;
  x = (poi.x + 180) / 360 * width;
  y = (-poi.y + 90) / 180 * height;
  poi2 = new geomPoint(x, y);
  
  return poi2;  
}

geomBBox getBboxFromPointArray(geomPoint[] points){
  
  float biggestX, smallestX, biggestY, smallestY;
  biggestX = 0;
  smallestX = 200000000.0;
  biggestY = 0;
  smallestY = 200000000.0;
  
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
