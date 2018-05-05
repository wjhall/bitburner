myStocks=["ECP",    //370k/s @ 6bn capital
    "BLD",          //303
    "OMTK",         //448
    "FSIG",         //800
    "FLCM",         //694
    "CTYS"]         //1825

for(i=0;i<myStocks.length;i++){
    exec("sma.script","home",1,myStocks[i])
}