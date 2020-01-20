# txCast by 6102bitcoin
# Schedule randomised Bitcoin transaction broadcasting to break timing analysis

import requests
import time
from datetime import datetime
from datetime import timedelta
from random import randint, shuffle
from stem import Signal
from stem.control import Controller

password = "test"

tx_list = []
time_list = []
next_broadcast_time = ""


def get_current_ip():
    session = requests.session()

    # TO Request URL with SOCKS over TOR
    session.proxies = {}
    session.proxies['http']='socks5h://localhost:9050'
    session.proxies['https']='socks5h://localhost:9050'

    try:
        r = session.get('http://httpbin.org/ip')
    except Exception as e:
        print(str(e))
    else:
        return r.text


def renew_tor_ip():
    with Controller.from_port(port = 9051) as controller:
        controller.authenticate(password=password)
        controller.signal(Signal.NEWNYM)


def fuzz(exact_value, lower_limit_fraction, upper_limit_fraction):
    lower_limit = int(exact_value * lower_limit_fraction)
    upper_limit = int(exact_value * upper_limit_fraction)
    fuzzed_value = exact_value + randint(lower_limit, upper_limit)
    return fuzzed_value


def build_lists():
    # Create randomly sorted list of transactions to broadcast:
    finished = False
    while not finished:
        tx_next = input('Enter Next Signed Transaction (Type X To END): ')
        if tx_next == "X" or tx_next == "x":
            finished = True
            print("Number of Signed Transactions Entered: " + str(len(tx_list)))
        else:
            tx_list.append(tx_next)
    shuffle(tx_list)

    # Create ordered random times at which to broadcast:
    start = datetime.now()
    min_delay = timedelta(minutes=2)
    min_time = start + min_delay

    user_input_minutes = int(input('Minutes: '))
    user_input_hours = int(input('Hours: '))
    user_input_days = int(input('Days: '))

    max_delay = timedelta(minutes=user_input_minutes, hours=user_input_hours, days=user_input_days)
    max_time = min_time + max_delay

    number_of_times = len(tx_list)
    max_duration = max_time - min_time

    for i in range(0, number_of_times):
        random_time = 0.01 * randint(1, 100) * max_duration
        time_list.append(min_time + random_time)

    time_list.sort()

    # Print list of transactions & target broadcast times
    for i in range(0, len(tx_list)):
        print("Time: " + str(time_list[i]) + " | tx: " + str(tx_list[i]))

    return


def push_tx(payload):
    requests.post('https://blockstream.info/testnet/api/tx', data=payload)
    print("############################# SENDING TRANSACTION #############################" + str(payload))
    print("IP Address Used: " + str(get_current_ip()))


def process_tx(i):
    global next_broadcast_time

    # Set broadcast values
    next_broadcast_tx = tx_list[i]
    next_broadcast_time = time_list[i]

    current_time = datetime.now()
    time_remaining = next_broadcast_time - current_time

    time.sleep(time_remaining.total_seconds())

    renew_tor_ip()  # Renew tor IP address
    push_tx(next_broadcast_tx)

    return current_time


def process_all():
    for i in range(0, len(tx_list)):
        print("---")
        print("Transaction " + str(i+1) + " broadcast on " + str(process_tx(i)))
        print(str(len(tx_list)-i-1) + " Transactions Remaining")


def main():
    build_lists()
    process_all()

main()
