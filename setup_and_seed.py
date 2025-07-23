import subprocess
import os
import platform

def setup_and_seed():
    """
    Runs the database setup and seeding scripts.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(script_dir, "backend")

    commands = [
        "php public/setup.php",
        "php spark db:seed DatabaseSeeder"
    ]

    print("Starting database setup and seeding...")

    if not os.path.isdir(backend_dir):
        print(f"Error: Backend directory not found at '{backend_dir}'")
        return

    for cmd in commands:
        try:
            print(f"\nExecuting: '{cmd}' in '{backend_dir}'")
            # Run command and wait for it to complete
            result = subprocess.run(
                cmd,
                cwd=backend_dir,
                shell=True,
                check=True, # Raises an exception for non-zero exit codes
                capture_output=True, # Capture stdout and stderr
                text=True # Decode stdout/stderr as text
            )
            print(result.stdout)
            if result.stderr:
                print("Stderr:")
                print(result.stderr)
            print(f"Successfully executed: '{cmd}'")
        except subprocess.CalledProcessError as e:
            print(f"An error occurred while executing '{cmd}':")
            print(e.stdout)
            print(e.stderr)
            print("Stopping script due to error.")
            break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break
    else:
        print("\nDatabase setup and seeding completed successfully!")

if __name__ == "__main__":
    setup_and_seed()
