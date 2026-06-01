from flask import Flask
import subprocess
import os
import platform

app = Flask(__name__)

# Add security headers and custom CORS configuration to allow local frontend access
@app.after_request
def add_security_and_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    return response

@app.route('/launch/<app_name>')
def launch(app_name):
    app_key = app_name.lower().strip()
    current_os = platform.system().lower()
    
    # Define system commands per OS to ensure robust cross-platform capability (Windows, Linux, macOS)
    if current_os == "windows":
        allowed_apps = {
            "youtube": ["start", "https://youtube.com"],
            "whatsapp": ["start", "https://web.whatsapp.com"],
            "camera": ["start", "microsoft.windows.camera:"],
            "facebook": ["start", "https://facebook.com"],
            "settings": ["start", "ms-settings:"],
            # Google Package Additions
            "google": ["start", "https://google.com"],
            "playstore": ["start", "https://play.google.com"],
            "maps": ["start", "https://google.com/maps"]
        }
        use_shell = True
    elif current_os == "linux":
        allowed_apps = {
            "youtube": ["xdg-open", "https://youtube.com"],
            "whatsapp": ["xdg-open", "https://web.whatsapp.com"],
            "camera": ["cheese"], # 'cheese' is the standard Gnome/Ubuntu camera client
            "facebook": ["xdg-open", "https://facebook.com"],
            "settings": ["gnome-control-center"], # Standard Linux Gnome settings GUI
            # Google Package Additions
            "google": ["xdg-open", "https://google.com"],
            "playstore": ["xdg-open", "https://play.google.com"],
            "maps": ["xdg-open", "https://google.com/maps"]
        }
        use_shell = False
    elif current_os == "darwin": # macOS fallback
        allowed_apps = {
            "youtube": ["open", "https://youtube.com"],
            "whatsapp": ["open", "https://web.whatsapp.com"],
            "camera": ["open", "-a", "FaceTime"],
            "facebook": ["open", "https://facebook.com"],
            "settings": ["open", "-a", "System Settings"],
            # Google Package Additions
            "google": ["open", "https://google.com"],
            "playstore": ["open", "https://play.google.com"],
            "maps": ["open", "https://google.com/maps"]
        }
        use_shell = False
    else:
        return f"❌ Platform {platform.system()} is not fully supported for system commands.", 400

    if app_key not in allowed_apps:
        return f"❌ Unknown or unauthorized application: {app_name}", 400
        
    try:
        # Command execution uses strictly predefined, non-user-controlled arrays.
        subprocess.Popen(allowed_apps[app_key], shell=use_shell)
        return f"✅ {app_key.capitalize()} launched successfully on {platform.system()}!"
    except Exception as e:
        return f"🚫 Failed to launch {app_key} on {platform.system()}: {str(e)}", 500

if __name__ == "__main__":
    # Listen only on localhost / 127.0.0.1 for testing security boundaries
    app.run(host='127.0.0.1', port=5000, debug=True)
