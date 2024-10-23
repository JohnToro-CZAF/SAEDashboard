import json
import requests
from huggingface_hub import hf_hub_download

HUGGINGFACE_API_URL = "https://huggingface.co/{}/resolve/main/config.json"
def check_model_exists(sae_model: str) -> bool:
    try:
        # Make a HEAD request to Huggingface to check if the model exists
        response = requests.head(HUGGINGFACE_API_URL.format(sae_model))

        # If the status code is 200, the model exists
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.RequestException as e:
        print(f"Error checking model: {e}")
        return False

def download_config(sae_model: str) -> str:
    cfg_path = hf_hub_download(
        repo_id=sae_model, filename=f"config.json", force_download=True
    )
    with open(cfg_path, "r") as f:
        cfg = json.load(f)
    return cfg