from time import sleep
from connect import connect_database
import serial
import os
from openai import OpenAI
import json
from time import perf_counter

#2 hours between each monitoring session
MONITORING_INTERVAL = 120000

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
        start = perf_counter()
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
            cursor.execute(insertion, tuple(vars))
            database.commit()

            #Use interval to decide how frequently to query
            if perf_counter() - start >= MONITORING_INTERVAL:
                print("initializing AI monitoring")
                cursor.execute("SELECT * FROM readings ORDER BY time_stamp DESC LIMIT 10")

                data = ""
                for (time_stamp, temperature, air_hum, soil_hum, light) in cursor: # type: ignore
                    #Using concatenations to avoid messing the formatting
                    data += "{" + f'"time_stamp":{time_stamp},"temperature":{temperature},"air_hum":{air_hum},"soil_hum":{soil_hum},"light":{light}' + "} \n"
                
                response = ai_manage(data)
                print(response)

                req = 1
                if response["illumination"]:
                    req += 1
                if response["heat"]:
                    req += 2
                serial.write(str(req).encode("utf-8"))

            #Time between readings
            sleep(60)

def ai_manage(prompt: str) -> dict:
    client = OpenAI(api_key=os.environ["API_KEY"], base_url="https://api.deepseek.com")

    system_prompt = '''
        The user will provide a json with climate variables. Parse the "question" and "answer" and output them in JSON format.
        Your answer will trigger control elements in an hydroponics garden.

        EXAMPLE INPUT:
        {"time_stamp":"2025-10-27 00:00:35","temperature":"36","air_hum":"32","soil_hum":"0","light":"1"}

        EXAMPLE JSON OUTPUT:
        {"illumination": boolean, "heat": boolean, "irrigation": boolean}    
        '''

    response = client.chat.completions.create(
        model="deepseek-reasoner",
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
            ],
        stream=False,
        response_format = {'type': 'json_object'}
    )

    result = response.choices[0].message.content
    if result:
        return json.loads(result)
    else:
        raise RuntimeError