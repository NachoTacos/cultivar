import socket
import os
from serial import Serial
from time import sleep
import json

#Unix socket config
SOCKET_PATH = "/tmp/api_observer.sock"

#Remove previous socket if exists
if os.path.exists(SOCKET_PATH):
    os.remove(SOCKET_PATH)

server = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
server.bind(SOCKET_PATH)
os.chmod(SOCKET_PATH, 999)
server.listen()

def listen_and_forward(serial: Serial)-> None:
    while True:
        conn, _ = server.accept()
        data = conn.recv(1024)
        if data:
            print("Command input recieved")

            states = json.load(open("/srv/activation.json","r"))
            
            req = 1
            if states["illumination"]:
                req += 1
            if states["heat"]:
                req += 2

            serial.write(str(req).encode("utf-8"))
            sleep(2)
            output = serial.readline().decode("utf-8").removesuffix("\r\n")
            print(f"response: {output}")
        conn.close()