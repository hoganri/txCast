# txCast
Randomised Bitcoin transaction broadcasting to break timing analysis (configured for testnet, further testing needed).

Implemented in
- Python
- Javascript

# Motivation

CoinJoin tools enable Bitcoin users to disassociate the past & future history of their bitcoin UTXOs (through a process called mixing). Users move their mixed coins to a secondary wallet for more secure storage (e.g. a Cold Wallet / Hardware wallet) and are potentially vulnerable to a timing attack whereby blockchain analysts cluster UTXO's using timing information (if users move multiple mixed coins in a short time period).

# Overview

txCast enables Bitcoin users to introduce a random and automated time delay between signed transaction broadcasts.

# Use:
Users copy signed transactions from their wallet of choice and paste them into txCast. They are prompted to enter the time delay which they are able to wait.

Signed transactions are broadcast using the blockstream.info API over tor.

# Setup:

## Javascript [New]
*Work In Progress - TOR circuit DOES NOT CHANGE between broadcasts.*

Install tor. These are the instructions for linux:
1. `sudo apt install tor` to install tor
2. `sudo service tor start` to start tor
3. `npm install electron -g` to install electron
3. `git clone https://github.com/6102bitcoin/txCast` to get the files
4. `cd txCast/JS` to move into the JS directory
5. `npm install` to install the dependencies
6. `npm start` to start the tool

# JS Screenshot
![](/txCast_JS.png)

## Python
*TOR circuit changes between broadcasts.*

Install tor. These are the instructions for linux:
1. `sudo apt install tor`
2. `sudo service tor start`
3. `tor --hash-password test` <- Don't use test for mainnet
4. edit /etc/tor/torrc & uncomment
       `ControlPort 9051`
       `HashedControlPassword 16:00000` <- Change this number to the output of step 3
5. `sudo service tor stop`
6. `sudo service tor start`
7. Set password to the password you entered in Step 3 on line 12 of the code (`password = "test"`)
8. [Download](https://github.com/6102bitcoin/txCast/blob/master/Python/txCast.py) the python script
9. Install following python packages:
- [requests](https://2.python-requests.org/en/master/) to use the blockstream API to push transactions
- [Stem](https://stem.torproject.org/) to use tor
10. Run the script with `python3 txCast.py`

# Python Screenshot
![](/txCast_python.png)

# Issues:
- How to refresh the tor connection after broadcasting (JS Version)?
- Configured for testnet (Must remove /testnet from blockstream url for mainnet

# Future Work:
- Have this work with your own node if this is deemed advantageous (I expect that it is not given the use of tor here).
- Have options for broadcasting when fees drop below some user set threshold / not broadcasting when fees go too high.
- Have some check that transaction is confirmed, or at least seen by another node on the network (Use a second API).
- Have this functionality added directly into wallets
