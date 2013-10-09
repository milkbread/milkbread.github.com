//Defining an individual object for reading the csv-file and storing all coordinates in an array
class Coords{

  float[][] x;
  float[][] y;
  float[] magnitude;
  String[] lines;
  int count1, count2, count3; 
  
 Coords(){
    //too hard coded...to be changed
      x = new float[3][10000];
      y = new float[3][10000];
  }
  //load the file
  void getCoords(){
     lines = loadStrings("2009EQ_bearbeitet.csv");    // Read input file
  }
  //read all lines and write the coordinates to an array
  void readLines(){
     count1 = 0; 
     count2 = 0; 
     count3 = 0; 
    int index = 1;
    magnitude = new float[lines.length];
    while (index < lines.length) {       // Iterate through lines in the file
       String[] values = split(lines[index], ';');
       magnitude[index] = float(values[6]);
       if(magnitude[index] < 5){
        x[0][count1] =  ((float(values[5]) + 180) / 360 * width);
        y[0][count1] =  ((-(float(values[4])) + 90) / 180 * height); 
        count1 = count1 + 1;  
      } else if ((magnitude[index] >= 5) && (magnitude[index] <= 7)){
        x[1][count2] =  ((float(values[5]) + 180) / 360 * width);
        y[1][count2] =  ((-(float(values[4])) + 90) / 180 * height);
         count2 = count2 + 1;  
      } else if (magnitude[index] > 7){
        x[2][count3] =  ((float(values[5]) + 180) / 360 * width);
        y[2][count3] =  ((-(float(values[4])) + 90) / 180 * height);
         count3 = count3 + 1;  
      }
      index = index + 1;
     }
     
     //x = (x + 180) / 360 * width;
     //y = (-y + 90) / 180 * height;
     println("All Coords are loaded!");
     println(count1 + " points with magnitude <5");
     println(count2+" points with magnitude betwenn 5 and 7");
     println(count3+" points with magnitude >7");
  }

}
