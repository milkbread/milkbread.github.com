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
  
  void setX(float x2){
    x = x2;
  }
  void setY(float y2){
    y = y2; 
  }
  void addMetadata(String meta2){
    meta[i] = meta2;
    i++;
  }
  void addMetaArray(String[] metaA){
    meta = metaA;
  }
  String[] getMetadata(){
    return meta;
  }
}
