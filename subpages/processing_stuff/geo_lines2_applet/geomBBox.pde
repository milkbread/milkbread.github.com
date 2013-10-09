class geomBBox{

  float xS, xB, yS, yB;
  
  geomBBox(float xS2, float yS2, float xB2, float yB2){
    xS = xS2;
    xB = xB2;
    yS = yS2;
    yB = yB2;
  }
  
  float getLengthH(){
    return xB-xS;
  }
  float getLengthV(){
    return yB-yS;
  }
}
