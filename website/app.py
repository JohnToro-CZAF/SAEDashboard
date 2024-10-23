from flask import Flask, request, jsonify, render_template
import requests
import os
import json
from datetime import datetime

app = Flask(__name__)

cache_dir = 'cache'

def create_cache_folder():
    unique_run = datetime.now().strftime('%Y%m%d%H%M%S')
    folder_path = os.path.join(cache_dir, unique_run)
    os.makedirs(folder_path, exist_ok=True)
    return folder_path

# Serve the model loading page
@app.route('/')
def model_loading():
    return render_template('model_loading.html')

# Serve the view selection page
@app.route('/view-selection')
def view_selection():
    return render_template('view_selection.html')

# Serve the feature-centric page
@app.route('/feature-centric')
def feature_centric():
    return render_template('feature_centric.html')

# Serve the prompt-centric page
@app.route('/prompt-centric')
def prompt_centric():
    return render_template('prompt_centric.html')

@app.route('/load-model', methods=['POST'])
def load_model():
    data = request.get_json()
    sae_model = data.get('saeModel')
    pretrained_model = data.get('pretrainedModel')
    dataset = data.get('dataset')
    num_rows = data.get('numRows')
    batch_size = data.get('batchSize')

    cache_path = create_cache_folder()

    # Simulate saving SaeVisData to JSON
    sae_vis_data = {
        "sae_model": sae_model,
        "pretrained_model": pretrained_model,
        "dataset": dataset,
        "num_rows": num_rows,
        "batch_size": batch_size
    }

    with open(os.path.join(cache_path, 'SaeVisData.json'), 'w') as f:
        json.dump(sae_vis_data, f)

    return jsonify({"message": "Model and data loaded", "run_id": cache_path})

@app.route('/query-related-features', methods=['POST'])
def query_related_features():
    data = request.get_json()
    examples = data.get('examples')
    # Query logic here
    return jsonify({"related_features": "Sample data for related features"})

@app.route('/run-prompt', methods=['POST'])
def run_prompt():
    data = request.get_json()
    prompt = data.get('prompt')
    # Query prompt processing
    return jsonify({"prompt_result": "Sample result from prompt"})

if __name__ == '__main__':
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)
    app.run(port=4040)
