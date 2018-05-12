//options
attackServer="pserv-0";

//be quiet!!!
disableLog("getServerMaxMoney");
disableLog("getServerRam");
disableLog("getServerMinSecurityLevel");
disableLog("getServerSecurityLevel");
disableLog("getServerMoneyAvailable");

function readNodes(fPath){
    nodes=read(fPath);
    nodes=nodes.split(",");
    return nodes;
}

function scanAll(){
    nodes = [];
    newNodes = ['home'];
    newNodes2 = [];
    repeat=true;
    
    while(repeat) {
        newNodes2 = [];
        repeat=false;
        count=newNodes.length;
        for(i=0;i<count;i++){
            connected=scan(newNodes[i]);
            count2 = connected.length;
            for(j=0;j<count2;j++){
                if(!nodes.includes(connected[j]) && !newNodes.includes(connected[j]) && !newNodes2.includes(connected[j])){
                    newNodes2.push(connected[j]);
                    repeat=true;
                }
            }
        }
        nodes=nodes.concat(newNodes);
        newNodes=newNodes2;
    }
    
    write('nodes.txt',nodes,'w');
}

function scanRooted(){
    nodes=readNodes('nodes.txt');
    rooted=[];
    count=nodes.length;
    for(i=0;i<count;i++){
        if(hasRootAccess(nodes[i])){
            rooted.push(nodes[i]);
        }
    }
    tprint(rooted.length);
    write('rooted.txt',rooted,'w');
}

function hackNodes(){
	nodes=readNodes('nodes.txt');
	count=nodes.length;
	level=getHackingLevel();
	
	Programs=[
		fileExists("BruteSSH.exe"),
		fileExists("FTPCrack.exe"),
		fileExists("relaySMTP.exe"),
		fileExists("HTTPWorm.exe"),
		fileExists("SQLInject.exe")];
		
	availPrograms = Programs[0]+Programs[1]+Programs[2]+Programs[3]+Programs[4];
	
	for(i=0;i<count;i++){
		if(!hasRootAccess(nodes[i]) && (getServerRequiredHackingLevel(nodes[i])<=level) && (getServerNumPortsRequired(nodes[i])<=availPrograms)){
			if(Programs[0]){brutessh(nodes[i])}
			if(Programs[1]){ftpcrack(nodes[i])}
			if(Programs[2]){relaysmtp(nodes[i])}
			if(Programs[3]){httpworm(nodes[i])}
			if(Programs[4]){sqlinject(nodes[i])}
			nuke(nodes[i]);
		}
	}
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

function readAttackable(){
    rooted=readNodes('rooted.txt');
    rootCount=rooted.length;
    targetNodes=[];
    //check which are valid for attacking
    for (i=0;i<rootCount;i++){
        status=nodeStatus(rooted[i]);
        if(status!==-1){
            targetNodes.push(rooted[i]);
        }
    }
    return targetNodes;
}

/////The meaty bit/////
//read the nodes
//scanAll()
hackNodes();
scanRooted();

//prep attackServer
//killall(attackServer)
files=["weaken.script","grow.script","hack.script","daemon.script"];
scp(files,"home",attackServer);

//load nodes
targetNodes=readAttackable()
targetCount=targetNodes.length

//start daemons
for (i=0;i<targetCount;i++){
    exec("daemon.script",attackServer,1,targetNodes[i],attackServer)
}