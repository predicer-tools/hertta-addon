from flask import Flask, jsonify, request
import requests
import time

app = Flask(__name__)

# Time-series control function
@app.route('/api/time-series-control', methods=['POST'])
def time_series_control():
    data = request.json
    entity_id = data.get('entityId')

    # Time-series control: Turn the heater on and off every 5 seconds for 30 seconds
    for i in range(3):
        print(f"Turning {entity_id} ON")
        control_heater(entity_id, "turn_on")
        time.sleep(5)  # Keep it ON for 5 seconds

        print(f"Turning {entity_id} OFF")
        control_heater(entity_id, "turn_off")
        time.sleep(5)  # Keep it OFF for 5 seconds
    
    return jsonify({"message": "Time-series control complete"}), 200

def control_heater(entity_id, action):
    # Your Home Assistant API logic to control the heater
    # Add your API token and logic for sending turn_on/turn_off commands
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
