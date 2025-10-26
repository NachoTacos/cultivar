import serial
from os import environ
from time import sleep
from connect import connect_database

ser = serial.Serial(environ["SERIAL_PORT"])

database = connect_database(
    {
        "host": environ["DB_HOST"],
        "user": environ["DB_USER"],
        "password": environ["DB_PASS"],
        "database": environ["DB_DATABASE"],
        "port": 3306,
        "raise_on_warnings": True
    },
    10
    )

with database.cursor() as cursor:
    insertion = "INSERT INTO readings (temperature, air_hum, soil_hum, light) VALUES (%s, %s, %s, %s)"
    while True:
        #Read variables command
        ser.write(b'\x0000')

        input = ser.readline().decode("utf-8").removesuffix("\r\n")
        vars = input.split(",")
        if len(vars) !=4:
            continue
        
        print(vars)
        result = cursor.execute(insertion, tuple(vars))
        database.commit()

        #Time between readings
        sleep(60)