# txCast by 6102bitcoin
# Schedule randomised Bitcoin transaction broadcasting to break timing analysis

import requests
import time
from datetime import datetime
from datetime import timedelta
from stem import Signal
from stem.control import Controller
import secrets

password = "test" # Change this to your tor password

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
        ip = session.get('http://httpbin.org/ip').text
        ip = ip.partition('\"origin\": \"')[2]
        ip = ip.rpartition('\"')[0] # Get only IP
    except Exception as e:
        print(str(e))
    else:
        return ip


def renew_tor_ip():
    with Controller.from_port(port=9051) as controller:
        controller.authenticate(password=password)
        controller.signal(Signal.NEWNYM)
    time.sleep(secrets.SystemRandom().randint(15, 30)) # Ensure new IP used


def fuzz(exact_value, lower_limit_fraction, upper_limit_fraction):
    lower_limit = int(exact_value * lower_limit_fraction)
    upper_limit = int(exact_value * upper_limit_fraction)
    fuzzed_value = exact_value + secrets.SystemRandom().randint(lower_limit, upper_limit)
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
    secrets.SystemRandom().shuffle(tx_list)

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
        random_time = secrets.SystemRandom().uniform(0, 1) * max_duration
        time_list.append(min_time + random_time)

    time_list.sort()

    # Print list of transactions & target broadcast times
    for i in range(0, len(tx_list)):
        print("Time: " + str(time_list[i]) + " | tx: " + str(tx_list[i]))

    return


def push_tx(payload):
    requests.post('http://explorerzydxu5ecjrkwceayqybizmpjjznk5izmitf2modhcusuqlid.onion/testnet/api/tx', data=payload) # or use 'https://blockstream.info/testnet/api/tx'
    print("############################# SENDING TRANSACTION #############################")
    print("Data Sent: " + str(payload))
    print("IP Address Used: " + str(get_current_ip()))


def process_tx(i):
    global next_broadcast_time

    renew_tor_ip()  # Renew tor IP address

    # Set broadcast values
    next_broadcast_tx = tx_list[i]
    next_broadcast_time = time_list[i]

    current_time = datetime.now()

    if current_time > next_broadcast_time:
        time_remaining = next_broadcast_time - next_broadcast_time
    else:
        time_remaining = next_broadcast_time - current_time

    time.sleep(time_remaining.total_seconds())
    push_tx(next_broadcast_tx)
    push_time = datetime.now()

    return push_time


def process_all():
    for i in range(0, len(tx_list)):
        print("")
        print("Transaction " + str(i+1) + " broadcast at " + str(process_tx(i)))
        print(str(len(tx_list)-i-1) + " Transactions Remaining")


def main():
    build_lists()
    process_all()
    print("")
    print("############################# TXCAST COMPLETE #############################")

main()
