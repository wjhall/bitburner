Index of files:
1. Stocks
  *stocks.script
  *sma.script
2. Hacking
  *main.script
  *daemon.script
  *hack.script..*grow.script
  *weaken.script

		
stocks.script
	2.9GB
	no arguments, run single threaded
	this executes a series of six daemon scripts onto a target server. Each runs the same strategy on a different stock symbol. The six are chosen for having been found to consistently give positive returns using the strategy.
sma.script
	16.4GB
	has one argument, the targeted stock symbol
	run single threaded, is spawned by stocks.script rather than intended to be manually started.
	for the first few minuites it keeps track of the 10 point and 40 point SMA for the price of the targeted stock. By comparing these we describe the stock as falling or rising. When the stock passes from rising to falling (or vice versa), (i.e the two SMA values cross each other) we close long positions and open a short position (or vice versa).
	
