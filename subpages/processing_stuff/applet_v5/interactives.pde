class button {

  float x, y, wid, heig;
  String name;

  button(float x2, float y2, float w, float h, String name2) {
    x = x2;
    y = y2;
    wid = w;
    heig = h;
    name = name2;
    rect(x, y, wid, heig);
  }

  float getXMin() {
    return x;
  }
  float getXMax() {
    return x+wid;
  }
  float getYMin() {
    return y;
  }
  float getYMax() {
    return y+heig;
  }
  float getWidth() {
    return wid;
  }
  float getHeigth() {
    return heig;
  }
  String buttonName() {
    return name;
  }
}

button[] steering() {
  PFont f;
  f = loadFont("LiberationMono-Bold-24.vlw");

  //main text
  textFont(f);
  fill(0);
  text("Earthquakes in 2009", 20, height-20);

  //draw the buttons of the legend
  fill(200);
  noStroke();


  button[] buts;
  buts = new button[5];
  int bw, bh;
  bw = 60;
  bh = 25;
  /*buts[0] = new button(640,height-40,bw,bh,"< 5");
   buts[1] = new button(740,height-40,bw,bh,"< 7");
   buts[2] = new button(840,height-40,bw,bh,"> 7"); 
   
   stroke(0);
   fill(255, 0, 0);   
   ellipse(buts[0].getXMin()+10, buts[0].getYMin()+10,4,4);
   fill(175, 0, 0);
   ellipse(buts[1].getXMin()+10, buts[1].getYMin()+10,8,8);
   fill(125, 0, 0);
   ellipse(buts[2].getXMin()+10, buts[2].getYMin()+10,16,16);
   
   fill(0);
   textFont(f,14);
   int toffsetw = 25;
   int toffseth = 17;
   text(buts[0].buttonName(),buts[0].getXMin()+toffsetw,buts[0].getYMin()+toffseth);
   textFont(f,16);
   text(buts[1].buttonName(),buts[1].getXMin()+toffsetw,buts[1].getYMin()+toffseth);
   textFont(f,18);
   text(buts[2].buttonName(),buts[2].getXMin()+toffsetw,buts[2].getYMin()+toffseth);  
   */
  //draw the reset Map button
  fill(0);
  stroke(255);
  buts[3] = new button(425, height-20, 75, 20, "Reset Map");
  textFont(f, 10);
  fill(255);
  text(buts[3].buttonName(), buts[3].getXMin()+10, buts[3].getYMin()+13);  

  //draw the reset Animation button
  fill(0);
  stroke(255);
  buts[4] = new button(350, height-20, 75, 20, "Reset Anim");
  textFont(f, 10);
  fill(255);
  text(buts[4].buttonName(), buts[4].getXMin()+10, buts[4].getYMin()+13);   

  fill(0);
  int xPos = 450;
  for (int j = 1; j <= 9; j++) {    
    text(j, width-xPos, height-30);

    int s = graphicPointSize(j);
    ellipse((width-xPos), height-15, s, s);
    xPos = xPos - 50;
  }
  
  return buts;
}

button animateB(boolean animate) {

  PFont f;
  f = loadFont("LiberationMono-Bold-24.vlw");

  //draw the animate button
  button but;
  fill(0);
  but = new button(300, height-20, 50, 20, "Animate");
  //rect(550,height-50,50,20);
  fill(255);   
  textFont(f, 10);
  if (animate == true) {           //the textchange for clicking on the animate/stop button     
    text("Stop", but.getXMin()+10, but.getYMin()+13); 
    //text("Stop",560,height-37);
  } 
  else {
    text(but.buttonName(), but.getXMin()+4, but.getYMin()+13); 
    //text("Animate",554,height-37);
  } 


  return but;
}

void showScrollbar(HScrollbar hs) {
  hs1.update();
  hs1.display();
  float topPos = hs.getPos();
  fill(128);
  //rect(topPos,180,20,20);
}

