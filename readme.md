Index of files:
1. Stocks
  * stocks.script
  * sma.script
2. Hacking
  * main.script
  * daemon.script
  * hack.script
  * grow.script
  * weaken.script

## Stocks 		
### stocks.script
  * 2.9GB
  * no arguments, run single threaded
  * this executes a series of six daemon scripts onto a target server. Each runs the same strategy on a different stock symbol. The six are chosen for having been found to consistently give positive returns using the strategy.
### sma.script
  * 16.4GB
  * has one argument, the targeted stock symbol
  * run single threaded, is spawned by stocks.script rather than intended to be manually started.
  * for the first few minuites it keeps track of the 10 point and 40 point SMA for the price of the targeted stock. By comparing these we describe the stock as falling or rising. When the stock passes from rising to falling (or vice versa), (i.e the two SMA values cross each other) we close long positions and open a short position (or vice versa).
  
## Hacking
### main.script
  * 8.3GB, no args, 1 thread
  * Contains a number of custom functions to do with scanning for nodes and rooting them, then spawning daemons to manage attack of each server from a single server. 
#### scanAll()
  * scans all available nodes and records them to nodes.txt for later access, generally needs only run once
#### scanRooted()
  * scans nodes from nodes.txt and records to rooted.txt which have root access
#### hackNodes()
  * runs through the nodes in nodes.txt, and if not already rooted will try to root them. checks which port attacking .exe files are available and player hacking level to compare against individual servers to check if hacking is possible before trying
#### Non function bits
  * The above are called as appropriate, commenting is used to pick between them adaptation to arguments would be simple. the script will then attempt to spawn a daemon script file on the server identified by the attackServer variable on line 2. It will spawn a thread for each rooted node, with each thread managing attacks on that node.
  * main.script can be re-run to redo the scan/root/spawn without worrying about killing existing daemon threads as any existing daemons will prevent the script from being able to create a duplicate, so only newly rooted nodes will have a new daemon thread spawned.

### daemon.script
  * 8.2GB
  * 1 argument (target server), 1 thread. spawned by main.scirpt not manually
  * this manages the hack/grow/weaken threads for a targeted server
  * if the server is not at minimum security, this will spawn n weaken threads to reduce it. n can be manually adjusted when low ram is available
  * if the server is at min security, but not max money this will spawn n grow threads and simultanuously enough weaken threads to offset the server security increase from the grow attack
  * if the server is at min sercurity, and at max money, this will spawn enough hack threads to take 90% of the server money, enough grow threads to take it straigh back up to max money, and enough weaken threads to offset any security increase from these two.
  * weaken takes the longest, so timing is managed by checking if a weaken thread exists against that server and waiting if one exists. If no weaken thread exists it is assumed any grow/hack threads have also completed and it's safe to resume another hack/grow/weaken attack.
  * In end game, when attacking all servers, I've seen this spawn enough of the various threads to use up to ca. 100,000GB ram
### weaken/hack/grow.script
  * these just weaken/grow the server passed by the argument once, used by daemon.script.
  * hack is slightly different as hack chance may not be 100%, so if the first attemtp fails it tries one more time but no further.
