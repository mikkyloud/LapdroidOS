# LapdroidOS

An Android-style launcher interface built with JavaScript, with a Python Flask backend that opens apps and websites on your computer.

**Live demo (interface only):** [lapdroid-os.vercel.app](https://lapdroid-os.vercel.app)
The launch buttons need the backend running on your own computer. See "Run Locally" below.

## About
LapdroidOS is my first project. I built it to learn how a frontend and a backend work together, and how to build a safe API.

## How It Works
1. The frontend shows an Android-style interface with app icons.
2. Tapping an app sends a request to the Flask backend at `/launch/<app_name>`.
3. The backend checks the name against an allowlist and runs the matching command for your operating system.

## Features
- Android-style home screen built with JavaScript, HTML, and CSS
- Flask backend that launches YouTube, WhatsApp Web, Camera, Facebook, Settings, Google, Play Store (opens the website), and Maps
- Works on Windows, Linux, and macOS
- Security: allowlist of predefined commands, no user input passed to the system, security headers, and localhost-only server

## Built With
- JavaScript, HTML, CSS
- Python, Flask
- Deployed on Vercel (frontend)

## Run Locally
```bash
git clone https://github.com/mikkyloud/LapdroidOS.git
cd LapdroidOS/backend
pip install flask
python [your backend file name].py
```
Then open the frontend in your browser. On Windows you can also run `run_servers.ps1`. [Add your exact frontend step.]

## Author
**Olawuyi Emmanuel**, Computer Science student at Anchor University, Lagos

GitHub: [@mikkyloud](https://github.com/mikkyloud)
