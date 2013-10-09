geomPoint[] readFile(){
  
  String[] lines;
  int i;
  geomPoint[] points;
  
  lines = loadStrings("2009EQ_bearbeitet.csv");
  points = new geomPoint[lines.length];
  i = 1;
  //println(lines.length);
  while (i < lines.length){
    String[] content = split(lines[i], ';');    
    
    float x = float(content[5]);
    float y = float(content[4]);
    points[i-1] = new geomPoint(x, y); 
    points[i-1].addMetadata(content[6]);
    points[i-1].addMetadata(content[1]);
    points[i-1].addMetadata(content[2]);
    points[i-1].addMetadata(content[3]);  
    i++;
  }
  return points;
}

 
