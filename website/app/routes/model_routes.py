# Description: Routes for model-related operations:
    # 1. Real-time validating Huggingface repo,
    # 2. Loading the config file for the model. 
    # 3. Visualize the information of the model through the UI.

from flask import Blueprint, jsonify, request
from app.services.model_query import check_model_exists, download_config

# Create a blueprint for model-related routes
model_bp = Blueprint('model', __name__)

@model_bp.route('/validate-model', methods=['POST'])
def validate_model():
    print("Validating model")
    data = request.get_json()
    sae_model = data.get('saeModel')

    if not sae_model:
        return jsonify({"valid": False, "message": "No model name provided"}), 400

    # Check if the model exists on Huggingface
    is_valid = check_model_exists(sae_model)

    return jsonify({"valid": is_valid})

@model_bp.route('/query-model-info', methods=['POST'])
def load_config():
    data = request.get_json()
    sae_model = data.get('saeModel')

    if not sae_model:
        return jsonify({"error": "Model name not provided"}), 400
    
    #Download the config file for the model, caching it locally
    cfg_json = download_config(sae_model)

    return jsonify(cfg_json)
