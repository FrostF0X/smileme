import sys

def read_full(filepath):
    try:
        with open(filepath, 'r') as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                print(f"{i+1}: {line}", end='')
    except Exception as e:
        print(f"Error reading file: {e}")

if len(sys.argv) > 1:
    read_full(sys.argv[1])
else:
    print("Please provide a filepath")
