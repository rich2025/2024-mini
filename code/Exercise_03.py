"""
Response time - single-threaded
"""

from machine import Pin
import time
import random
import json


N: int = 3
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


def scorer(t: list[int | str]) -> None: # changed from miss is type 'None' to type 'str'
    # %% collate results
    misses = t.count('X') # changes from type 'None' to 'X'
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
        avg_response_time = sum(t_good) / len(t_good)
    else:
        None
    
    
    data = {
        'Response Times': t,
        'Minimum Response Time': min_response_time,
        'Maximum Response Time': max_response_time,
        'Average Response Time': avg_response_time
        }

    # %% make dynamic filename and write JSON

    now: tuple[int] = time.localtime()

    now_str = "-".join(map(str, now[:3])) + "T" + "_".join(map(str, now[3:6]))
    filename = f"score-{now_str}.json"

    print("write", filename)

    write_json(filename, data)


if __name__ == "__main__":
    # using "if __name__" allows us to reuse functions in other script files

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
