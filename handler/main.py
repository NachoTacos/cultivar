import serial
import os
import threading
from listen_command import listen_and_forward
from poll_sensors import read_sensors

ser = serial.Serial(os.environ["SERIAL_PORT"])

t1 = threading.Thread(target=listen_and_forward, kwargs={"serial": ser}, daemon=True)
t2 = threading.Thread(target=read_sensors, kwargs={"serial": ser}, daemon=True)

t1.start()
t2.start()

t1.join()
t2.join()