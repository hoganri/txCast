# txCast
Randomised Bitcoin (testnet) transaction broadcasting to break timing analysis

# Overview
Signed transactions are broadcast using the blockstream.info API over tor with IP addresses changing between each broadcast.

I have performed initial tests using testnet and appears to perform as intended. **Further testing needed.**

*Note: I don't know how much the Blockstream API is currently used to push transactions. For this reason I recommend waiting until after the 01 March 2020 before using this on mainnet to ensure that a few people are using it, thus it is plausible that transactions sent to the blockstream node in this manner can't be linked.*

# Use:
User simply enters each signed transaction one by one, then enters the time delay they are willing to wait until all transactions have been broadcast (in minutes, hours and then days). 

![](/txCast.png)

# Setup:
You need the following python packages:
- [requests](https://2.python-requests.org/en/master/) to use the blockstream API to push transactions
- [Stem](https://stem.torproject.org/) to use tor

You have to install tor. These are the instructions for linux:
1. `sudo apt install tor`
2. `sudo service tor start`
3. `tor --hash-password test` <- Don't use test for mainnet
4. edit /etc/tor/torrc & uncomment
       `ControlPort 9051`
       `HashedControlPassword 16:00000` <- Change this number to the output of step 3
5. `sudo service tor stop`
6. `sudo service tor start`
7. Set password to the password you entered in Step 3 on line 12 of the code (`password = "test"`)

# Issues:
- tor integration may not be robust. Should connection be refreshed in a different way? (Used [this](https://techmonger.github.io/68/tor-new-ip-python/))
- Not sure how well this deals with daylight saving time clock changes (time will jump) or how to best deal with this?
- Configured for testnet (Must remove /testnet from blockstream url for mainnet)
- Not sure how long tor takes to renew IP, probably need a delay somewhere
- Is randomint random enough?

# Future Work:
- Have this work with your own node if this is deemed advantageous (I expect that it is not given the use of tor here).
- Have options for broadcasting when fees drop below some user set threshold / not broadcasting when fees go too high.
- Have some check that transaction is confirmed, or at least seen by another node on the network (Use a second API).
- Have options for running this with a GUI
- Have this functionality added directly into wallets
