# mock-backend/app/routes.py

from flask import Blueprint, jsonify
from .weather import weather_bp

main_bp = Blueprint('main', __name__)

@main_bp.route('/api/mock-data', methods=['GET'])
def get_mock_data():
    # Existing mock data endpoint
    data = {
        'message': 'This is mock data from the backend!',
        'status': 'success',
        'data': {
            'temperature': 22,
            'humidity': 45
        }
    }
    return jsonify(data)

# Register the weather blueprint
main_bp.register_blueprint(weather_bp)
