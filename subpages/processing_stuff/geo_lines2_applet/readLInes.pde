geomLine[] readLines(){
  
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
      float x = float(data[0]);
      float y = float(data[1]);
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
geomLine[] readLines2(String dataName){
  
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
      float x = float(data[0]);
      float y = float(data[1]);
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
