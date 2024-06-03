**API document:** 

<a href="https://documenter.getpostman.com/view/27121891/2sA35MyeC3" target="_blank">API doc</a>


**Configure connection**

![image](https://github.com/nhnhunnn/IoT/assets/104300929/376e7bbb-2801-4ba7-8bfe-54b932731b1e)


**Configure Arduino**

- Before you start, make sure to install some necessary libraries:
  
![image](https://github.com/nhnhunnn/IoT/assets/104300929/68c051c5-9a91-467b-97ea-3b7370688492)

- Declare mqtt broker information like port, your username and password used to access to mqtt broker, your WiFi name, password and IP address:
  
![image](https://github.com/nhnhunnn/IoT/assets/104300929/fc5eb4bc-2e7f-4faa-9929-83b2396f17c6)


**Run the application**

- Navigate to the software directory and run the project using the command: ```npm start```
- Start the server by running the server.js file: ``` node server.js ```
- Start the MQTT Broker by executing the command: ``` Windows + R --> cmd ```
- Navigate to the directory where Mosquitto is installed: ``` cd C:\Program Files\mosquitto ```
- Run the following commands: ```"net start mosquitto" or ".\mosquitto.exe -v -c mosquitto.conf"```





