"""
Response time - single-threaded
"""

from machine import Pin
import time
import random
import json
import urequests as requests
import network
import urequests

firebase_url = "https://ec463-mini-ry-sk-default-rtdb.firebaseio.com"
firebase_secret = "U1zevgQHhKQLamXSsfb1IdpYMNi1vVxIGIJH5M21"

N: int = 10 # number of games
sample_ms = 10.0
on_ms = 500

def random_time_interval(tmin: float, tmax: float) -> float:
    """return a random time interval between max and min"""
    return random.uniform(tmin, tmax)


def blinker(N: int, led: Pin) -> None:
    # %% let user know game started / is over

    for _ in range(N):
        led.high()
        time.sleep(0.1)
        led.low()
        time.sleep(0.1)


def write_json(json_filename: str, data: dict) -> None:
    """Writes data to a JSON file.

    Parameters
    ----------

    json_filename: str
        The name of the file to write to. This will overwrite any existing file.

    data: dict
        Dictionary data to write to the file.
    """

    with open(json_filename, "w") as f:
        json.dump(data, f)

def upload_to_firestore(collection, document, data):
    # function to upload data using HTTP requests to interface with Firestore's REST API
    
    url = f"{firebase_url}/{collection}/{document}.json?auth={firebase_secret}"
    headers = {'Content-Type': 'application/json'}
    response = requests.put(url, data=json.dumps(data), headers=headers)
    if response.status_code == 200:
        print("Data Upload Successful")
    else:
        print("Data Upload Failed:", response.text)

def scorer(t: list[int | str]) -> None: # changed from miss is type 'None' to type 'str'
    # %% collate results
    misses = t.count('X')
    print(f"You missed the light {misses} / {len(t)} times")

    t_good = [x for x in t if isinstance(x, int) and x > 0]

    print(t) # changed to print misses represented as 'X'

    # add key, value to this dict to store the minimum, maximum, average response time
    # and score (non-misses / total flashes) i.e. the score a floating point number
    # is in range [0..1]
    
    # initialize statistics to value of 0
    min_response_time = 0
    max_response_time = 0
    avg_response_time = 0
    

    # calculate statistics
    if t_good:
        min_response_time = min(t_good)
        max_response_time = max(t_good)
        avg_response_time = sum(t_good) / len(t_good) # length of t_good or t?
    else:
        None

    
    def fetch_user(): # function to fetch user id from flask server
        user_id = None  # initialize variable
        try:
            response = urequests.get('http://10.0.0.53:5000/get_user_data') # hosted on local ipv4 address
            if response.status_code == 200:
                data = response.json()  # get response in JSON
                user_id = data.get('userId')  # extract user id from data

                if user_id is not None:
                    print('User ID:', user_id)
                else:
                    print('User ID not found in response')
            else:
                print('Failed to fetch data:', response.status_code)
            response.close()
        except Exception as e: # print error message if error
            print('Error:', e)

        return user_id  # return the user_id

    user_id = fetch_user() # capture user_id

    data = {
        'User ID' : user_id,
        'Response Times': t,
        'Minimum Response Time': min_response_time,
        'Maximum Response Time': max_response_time,
        'Average Response Time': avg_response_time
        }

        #uses the userid to sort data
   # path = 'users/{}/data.json'.format(user_id)

    #response = urequests.post(firebase_url + path +'?auth=' + firebase_secret,json=data)
    #print(response.text)
    #end here---------------------------------

    # %% make dynamic filename and write JSON

    now: tuple[int] = time.localtime()

    now_str = "-".join(map(str, now[:3])) + "T" + "_".join(map(str, now[3:6]))
    filename = f"score-{now_str}.json"

    # print("write", filename)

    write_json(filename, data)
    
    #collection_name = f"{now_str}" # write date and time as collection name
    collection_name = f"{user_id}"
    document_id = "Data"
    
    # Upload data to Firestore
    upload_to_firestore(collection_name, document_id, data) # upload data to realtime database
    
if __name__ == "__main__":
    # using "if __name__" allows us to reuse functions in other script files

    # referenced https://projects.raspberrypi.org/en/projects/get-started-pico-w/2
    wlan = network.WLAN(network.STA_IF) # connection to the network
    wlan.active(True)
    wlan.connect('mattrichdanbl', 'xy1234321*')
    while not wlan.isconnected():
        pass

    print("Connected to Wi-Fi")
    
    led = Pin("LED", Pin.OUT)
    button = Pin(16, Pin.IN, Pin.PULL_UP)

    t: list[int | str] = [] # changed to change misses from type 'None' to type 'str'

    blinker(3, led)

    for i in range(N):
        time.sleep(random_time_interval(0.5, 5.0))

        led.high()

        tic = time.ticks_ms()
        t0 = None
        while time.ticks_diff(time.ticks_ms(), tic) < on_ms:
            if button.value() == 0:
                t0 = time.ticks_diff(time.ticks_ms(), tic)
                led.low()
                break
        if t0 is None: # display a miss as 'X'
            t0 = 'X'
            
        t.append(t0)

        led.low()

    blinker(5, led)

    scorer(t)