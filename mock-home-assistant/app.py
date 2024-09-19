from flask import Flask, jsonify, request, abort
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simulated Home Assistant API key (token)
VALID_API_KEY = 'hasskey'  # Replace this with your test token

# Simulated sensor data
mock_sensors = [
    {
        "entity_id": "sensor.temperature_living_room",
        "state": "22.5",
        "attributes": {
            "friendly_name": "Living Room Temperature",
            "unit_of_measurement": "°C"
        }
    },
    {
        "entity_id": "sensor.temperature_bedroom",
        "state": "19.0",
        "attributes": {
            "friendly_name": "Bedroom Temperature",
            "unit_of_measurement": "°C"
        }
    },
    {
        "entity_id": "sensor.humidity_living_room",
        "state": "45",
        "attributes": {
            "friendly_name": "Living Room Humidity",
            "unit_of_measurement": "%"
        }
    }
]

# Middleware to check API key
def check_api_key():
    auth_header = request.headers.get('Authorization', '')
    print(f"Received API Key: {auth_header}")  # Debug print
    if auth_header != f"Bearer {VALID_API_KEY}":
        print("Invalid API Key!")  # Debug print
        abort(401, description="Unauthorized: Invalid API key")
    print("API Key is valid!")  # Debug print

# Home Assistant API endpoint mock for '/api/states'
@app.route('/api/states', methods=['GET'])
def get_states():
    check_api_key()  # Validate the API key
    print("Sending mock sensor data...")  # Debug print
    return jsonify(mock_sensors)

# Running the app on port 8123, same as Home Assistant default port
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8123, debug=True)
