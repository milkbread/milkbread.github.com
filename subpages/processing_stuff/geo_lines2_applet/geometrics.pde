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

geomBBox getBboxFromLineArray(geomLine[] lines){
  
  float biggestX, smallestX, biggestY, smallestY;
  biggestX = 0;
  smallestX = 200000000.0;
  biggestY = 0;
  smallestY = 200000000.0;
  
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
