import subprocess
import os
import platform

def run_commands():
    """
    Starts the backend and frontend development servers in new terminal windows.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))

    commands = [
        {
            "cmd": "php spark serve",
            "cwd": os.path.join(script_dir, "backend"),
            "title": "Backend Server (PHP Spark)"
        },
        {
            "cmd": "npm start",
            "cwd": os.path.join(script_dir, "frontend"),
            "title": "Frontend Server (NPM)"
        }
    ]

    print("Starting development servers...")

    for command_info in commands:
        cwd = command_info["cwd"]
        cmd = command_info["cmd"]
        title = command_info["title"]

        if not os.path.isdir(cwd):
            print(f"Error: Directory not found for '{title}': {cwd}")
            continue

        try:
            print(f"-> Starting '{title}' in directory '{cwd}'")
            if platform.system() == "Windows":
                subprocess.Popen(
                    f'start "{title}" cmd /k "{cmd}"',
                    cwd=cwd,
                    shell=True
                )
            else:
                try:
                    terminal_cmd = [
                        'xterm',
                        '-T',
                        title,
                        '-e',
                        f'bash -c "cd {cwd} && {cmd}; exec bash"'
                    ]
                    subprocess.Popen(terminal_cmd)
                except FileNotFoundError:
                    print(f"'xterm' not found. Please install it or modify 'run_dev.py' to use your preferred terminal.")

        except Exception as e:
            print(f"An error occurred while starting '{title}': {e}")

    print("\nBoth servers should be starting in new terminal windows.")

if __name__ == "__main__":
    run_commands()
