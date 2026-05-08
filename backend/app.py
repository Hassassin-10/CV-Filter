"""
CV Filter — Flask Backend Entry Point
Registers all module blueprints with /api prefix.
"""
import os
from flask import Flask
from flask_cors import CORS

from routes.basic import basic_bp
from routes.frequency import frequency_bp
from routes.segmentation import segmentation_bp
from routes.color import color_bp
from routes.morphology import morphology_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(basic_bp, url_prefix="/api/basic")
app.register_blueprint(frequency_bp, url_prefix="/api/frequency")
app.register_blueprint(segmentation_bp, url_prefix="/api/segmentation")
app.register_blueprint(color_bp, url_prefix="/api/color")
app.register_blueprint(morphology_bp, url_prefix="/api/morphology")


@app.route("/api/health")
def health():
    return {"status": "ok", "message": "CV Filter backend running"}


if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True, port=5001)
