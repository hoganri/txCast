# txCast
Randomised Bitcoin transaction broadcasting to break timing analysis (configured for testnet, further testing needed).

# Motivation

CoinJoin tools enable Bitcoin users to disassociate the past & future history of their bitcoin UTXOs (through a process called mixing). Users move their mixed coins to a secondary wallet for more secure storage (e.g. a Cold Wallet / Hardware wallet) and are potentially vulnerable to a timing attack whereby blockchain analysts cluster UTXO's using timing information (if users move multiple mixed coins in a short time period).

# Overview

txCast enables Bitcoin users to introduce a random and automated time delay between signed transaction broadcasts.

# Use:
Users copy signed transactions from their wallet of choice and paste them into the terminal individually. They are prompted to enter the time delay which they are able to tolerate in minutes, hours and days.

Signed transactions are broadcast using the blockstream.info API over tor with IP addresses changing between each broadcast.

# Setup:

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

[Download](https://github.com/6102bitcoin/txCast/blob/master/txCast.py) the python script

Install following python packages:
- [requests](https://2.python-requests.org/en/master/) to use the blockstream API to push transactions
- [Stem](https://stem.torproject.org/) to use tor

Run the script with `python3 txCast.py`

**Important Note:** The Blockstream API may be infrequently used push transactions. I recommend waiting until after the 01 March 2020 before using this on mainnet to ensure multiple people are using it, thus transactions sent to the blockstream node using txCast are not likely the same user.

# Screenshot
![](/txCast.png)

# Issues:
- tor integration may not be robust. Should connection be refreshed in a different way? (Used [this](https://techmonger.github.io/68/tor-new-ip-python/))
- Not sure how well this deals with daylight saving time clock changes (time will jump) or how to best deal with this?
- Configured for testnet (Must remove /testnet from blockstream url for mainnet, I recommend waiting till 01 March 2020 as explained above)
- Using time delay to ensure new IP is used, could instead compare IP values.
- Could use .onion site rather than clearnet (Blockstream endpoint)


# Future Work:
- Have this work with your own node if this is deemed advantageous (I expect that it is not given the use of tor here).
- Have options for broadcasting when fees drop below some user set threshold / not broadcasting when fees go too high.
- Have some check that transaction is confirmed, or at least seen by another node on the network (Use a second API).
- Have options for running this with a GUI
- Have this functionality added directly into wallets
