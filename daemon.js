target=args[0]
attackServer=args[1]

disableLog("getServerMaxMoney");
disableLog("getServerRam");
disableLog("getServerMinSecurityLevel");
disableLog("getServerSecurityLevel");
disableLog("getServerMoneyAvailable");
disableLog("sleep");

reqHackSkill=getServerRequiredHackingLevel(target);
hackDiff=getServerMinSecurityLevel(target);
bbBaseGrowth = 1.03;
bbMaxGrowth = 1.0035;
bbFortAmt = 0.002;
bbWeakAmt = 0.05;
fundPct=0.9

function getBaseHackPct(reqHackSkill,hackDiff){
    hackPct = (100-hackDiff)/100;
    hackPct *= (1+myHackSkill-reqHackSkill)/myHackSkill;
    hackPct *= myMults.money;
    hackPct /= 240;
    
    return hackPct;
    //total is hackPct*threads
}

function getBaseGrowPct(serverGrowth,hackDiff){
    grow_rate = Math.min((1+((bbBaseGrowth-1)/hackDiff)),bbMaxGrowth);
    growPct = serverGrowth/100;
    growPct *= myMults.growth;
    growPct = Math.pow(grow_rate,growPct);
    return growPct;
    //total is growPct^threads
}

function ramCheck(host,amt){
    res = getServerRam(host);
    free=res[0]-res[1];
    return (free > amt);
}

function nodeStatus(target){
    //rely on scanning to assume target is rooted
    if(target=="home"){return -1}
    //invalid target
    if(getServerMaxMoney(target)===0){return -1}
    //needs weakening
    if(getServerMinSecurityLevel(target)!==getServerSecurityLevel(target)){return 0}
    //needs growth
    if(getServerMoneyAvailable(target)!==getServerMaxMoney(target)){return 1}
    //else ready to go nuts
    return 2;
}

while(true){
    myHackSkill=getHackingLevel();
    myMults = getHackingMultipliers();
    while(isRunning("weaken.script",attackServer,target)){
        sleep("1000");
    }
    status=nodeStatus(target);
    if(status===0){
        //weaken 2000 times
        n=1000
        if(ramCheck(attackServer,n*1.55)){
            exec("weaken.script",attackServer,n,target);
        }
    }
    if(status===1){
        //weaken and grow 2000 times
        n=1000
        if(ramCheck(attackServer,n*1.08*1.55)){
            exec("weaken.script",attackServer,Math.ceil(n*0.08),target);
            exec("grow.script",attackServer,n,target);
        }
    }
    if(status===2){
        //attack
        hackT=Math.floor(fundPct/getBaseHackPct(reqHackSkill,hackDiff));
        growT=Math.ceil(Math.log(1/(1-fundPct))/Math.log(getBaseGrowPct(getServerGrowth(target),hackDiff)))
        weakenT=Math.ceil(((hackT*0.002)+(growT*0.004))/0.05);
        totalRam=Math.ceil(hackT*1.65+growT*1.55+weakenT+1.55);
        // fail if inadequate ram
        if(ramCheck(attackServer,totalRam)){
            //attack!
            exec("weaken.script",attackServer,weakenT,target);
            exec("grow.script",attackServer,growT,target);
            exec("hack.script",attackServer,hackT,target);
        }
    }
}