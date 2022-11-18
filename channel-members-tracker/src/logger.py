from datetime import datetime, timezone

def log(message: str):
    time = datetime.now(timezone.utc)

    print(f'[{time}] {message}')
