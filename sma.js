//init
sym=args[0];
stock=[sym,0,[],[],true,0,0]
    //0:symbol, 1:lastprice, 2:sma10,3:sma40,4:rising
    //5:sma10sum, 6:sma40sum:

itter=0

while(true) {
    print("looping, itter:"+itter)
    price = getStockPrice(sym);
    if (price != stock[1]) {
        //update lastprice
        stock[1]=price
        //count the lead in
        itter=itter+1
        //note old value                     
        old_rising = stock[4]
        //update sma10
        stock[2].push(price)
        stock[5]=stock[5]+price
        if(stock[2].length>10){
           temp=stock[2].shift()
            stock[5]=stock[5]-temp
        }
        //update sma40
        stock[3].push(price)
        stock[6]=stock[6]+price
        if(stock[3].length>40){
            temp=stock[3].shift()
            stock[6]=stock[6]-temp
        }
        //update rising once we get warmed up
        if(itter>43){
            avg10 = stock[5]/10
            avg40 = stock[6]/40
            if(avg10>avg40){
                new_rising=true
            }else{
                new_rising=false
            }
            stock[4]=new_rising
        }
        //trade if apt
        if(itter>45){
            if(new_rising && !old_rising){
                //was falling, now rising, buy
                value=getServerMoneyAvailable("home")/7;
                volume=value/price
                buyStock(stock[0],volume)
            }
            if(!new_rising && old_rising){
                //was rising, now falling, sell
                sellStock(stock[0],999999999999999999999)
            }
        }
    //print(stock)
    }
}