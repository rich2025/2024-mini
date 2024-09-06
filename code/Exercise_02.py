#!/usr/bin/env python3
"""
PWM Tone Generator

based on https://www.coderdojotc.org/micropython/sound/04-play-scale/
"""

import machine
import utime

# GP16 is the speaker pin
SPEAKER_PIN = 16

# create a Pulse Width Modulation Object on this pin
speaker = machine.PWM(machine.Pin(SPEAKER_PIN))


def playtone(frequency: float, duration: float) -> None:
    speaker.duty_u16(1000)
    speaker.freq(frequency)
    utime.sleep(duration)


def quiet():
    speaker.duty_u16(0)


# freq: float = 30
duration: float = 0.15

print("Playing frequency (Hz):")

# for i in range(64):
#    print(freq)
#    playtone(freq, duration)
#    freq = int(freq * 1.1)

# Turn off the PWM
# quiet()

"""
With reference to: https://www.coderdojotc.org/micropython/sound/05-play-mario/
"""

tones = {
    "C4": 262, "D4": 294, "E4": 330, "F4": 349, "G4": 392, "A4": 440, "B4": 494,
    "C5": 523, "D5": 587, "E5": 659, "F5": 698, "G5": 784, "A5": 880, "B5": 988
}


twinkle = [
    "C4", "X", "C4", "X", "G4", "X", "G4", "X", "A4", "X", "A4", "X", "G4", "G4", "X",  
    "F4", "X", "F4", "X", "E4", "X", "E4", "X", "D4", "X", "D4", "X", "C4", "C4", "X", 
    "G4", "X", "G4", "X", "F4", "X", "F4", "X", "E4", "X", "E4", "X", "D4", "D4", "X",  
    "G4", "X", "G4", "X", "F4", "X", "F4", "X", "E4", "X", "E4", "X", "D4", "D4", "X",  
    "C4", "X", "C4", "X", "G4", "X", "G4", "X", "A4", "X", "A4", "X", "G4", "G4", "X",  
    "F4", "X", "F4", "X", "E4", "X", "E4", "X", "D4", "X", "D4", "X", "C4" , "C4", "C4"  
]

def playsong(mysong):
    for note in mysong:
        if note == "X":
            quiet()
        else:
            playtone(tones[note], duration)
            print(tones[note])
        utime.sleep(duration)
    
    quiet()

playsong(twinkle)


