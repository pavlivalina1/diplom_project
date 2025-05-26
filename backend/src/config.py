import os
from dotenv import load_dotenv

load_dotenv()


base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, "object.db")
DATABASE_URL: str = os.getenv("SQLLITE_URL", "sqllite_url")


if __name__ == "__main__":
    print(f"DATABASE_URL: {DATABASE_URL}")