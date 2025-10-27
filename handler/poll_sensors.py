from time import sleep
from connect import connect_database
import serial
import os

def read_sensors(serial: serial.Serial)-> None:
    #Database config
    database = connect_database(
        {
            "host": os.environ["DB_HOST"],
            "user": os.environ["DB_USER"],
            "password": os.environ["DB_PASS"],
            "database": os.environ["DB_NAME"],
            "port": 3306,
            "raise_on_warnings": True
        },
        10
        )
    with database.cursor() as cursor:
        while True:
            insertion = "INSERT INTO readings (temperature, air_hum, soil_hum, light) VALUES (%s, %s, %s, %s)"
            #Read variables command
            serial.write("0".encode("utf-8"))
            sleep(1)
            input = serial.readline().decode("utf-8").removesuffix("\r\n")
            vars = input.split(",")
            if len(vars) !=4:
                continue
            
            print(vars)
            result = cursor.execute(insertion, tuple(vars))
            database.commit()

            #Time between readings
            sleep(60)