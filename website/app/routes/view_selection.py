# Description: Routes for viewing related information of the model:
#     1. Landing page
#     2. Allows user to select which view to go.

from flask import Blueprint, render_template

# Create a blueprint for model-related routes
view_selection_bp = Blueprint('view_selection', __name__)

@view_selection_bp.route('/')
def model_loading():
    return render_template('model_loading.html')

@view_selection_bp.route('/view-selection')
def view_selection():
    return render_template('view_selection.html')

# Serve the feature-centric page
@view_selection_bp.route('/feature-centric')
def feature_centric():
    return render_template('feature_centric.html')

# Serve the prompt-centric page
@view_selection_bp.route('/prompt-centric')
def prompt_centric():
    return render_template('prompt_centric.html')