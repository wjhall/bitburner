myStocks=["ECP", "BLD", "OMTK",
    "FSIG","FLCM","CTYS"]

for(i=0;i<myStocks.length;i++){
    exec("sma.script","home",1,myStocks[i])
}