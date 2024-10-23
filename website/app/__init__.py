from flask import Flask
from .routes.model_routes import model_bp
from .routes.view_selection import view_selection_bp

def create_app():
    app = Flask(__name__)

    # Register blueprints for routes
    app.register_blueprint(model_bp)
    app.register_blueprint(view_selection_bp)
    
    return app
