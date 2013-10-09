class geomLine{
  
  geomPoint[] poi;
  int index;
  
  geomLine(int length){
    poi = new geomPoint[length];
    index = 0;
  }
  
  void addPoint(geomPoint poi2){
    poi[index] = poi2;
    index++;
  } 
  void addPointArray(geomPoint[] poiArray){
    int i = 0;
    while(i < poiArray.length){
      poi[i] = poiArray[i];
      i++;
    }
  }
  int getLength(){
    return poi.length;
  }
  geomPoint[] getAllPoints(){
    return poi;
  }
  geomPoint getPoint(int index){
    return poi[index];
  }
      
}
