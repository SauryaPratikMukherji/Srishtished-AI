import subprocess
import sys
import os
import time

def start_services():
    project_root = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(project_root, "frontend")
    
    print("=" * 70)
    print("  JALPRAMAAN / AQUA NEXUS — Multi-Process App Launcher")
    print("=" * 70)
    print("\nStarting FastAPI Backend Service (Port 8000)...")
    
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=project_root)
    
    time.sleep(2)
    
    print("\nStarting Vite React Dummy Frontend (Port 5173 / dynamic)...")
    frontend_cmd = "npm run dev"
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir, shell=True)
    
    print("\n" + "=" * 70)
    print("  Services Started Successfully!")
    print("  - Backend API:  http://127.0.0.1:8000")
    print("  - API Docs:     http://127.0.0.1:8000/docs")
    print("  - Web Frontend: http://localhost:5173")
    print("=" * 70 + "\n")
    print("Press Ctrl+C in terminal to stop all services.")
    
    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down services...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    start_services()
