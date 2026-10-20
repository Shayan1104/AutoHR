import sys
import os
import psycopg
from psycopg import sql

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings
from app.core.database import sync_engine, SyncSessionLocal
from app.core.security import get_password_hash
from app.models import Base, User, UserRole


def create_database_if_not_exists():
    """Connect to postgres default db and create autohr_db if not present."""
    print(f"Connecting to PostgreSQL server at {settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT} as {settings.POSTGRES_USER}...")
    try:
        conn = psycopg.connect(
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            dbname="postgres",
            autocommit=True,
        )
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s;", (settings.POSTGRES_DB,))
            exists = cur.fetchone()
            if not exists:
                print(f"Creating database '{settings.POSTGRES_DB}'...")
                cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(settings.POSTGRES_DB)))
                print(f"Database '{settings.POSTGRES_DB}' created successfully.")
            else:
                print(f"Database '{settings.POSTGRES_DB}' already exists.")
        conn.close()
    except Exception as e:
        print(f"Warning connecting to default database: {e}")
        print("Will attempt direct connection to target database...")


def init_schema_and_extensions():
    """Create extensions and all tables."""
    print(f"Connecting to database '{settings.POSTGRES_DB}' to apply extensions and create tables...")
    try:
        conn = psycopg.connect(
            host=settings.POSTGRES_SERVER,
            port=settings.POSTGRES_PORT,
            user=settings.POSTGRES_USER,
            password=settings.POSTGRES_PASSWORD,
            dbname=settings.POSTGRES_DB,
            autocommit=True,
        )
        with conn.cursor() as cur:
            print("Enabling extensions 'pgcrypto' and 'citext'...")
            cur.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
            cur.execute("CREATE EXTENSION IF NOT EXISTS citext;")
        conn.close()
    except Exception as e:
        print(f"Note on extensions: {e}")

    print("Creating all database tables via SQLAlchemy metadata...")
    Base.metadata.create_all(bind=sync_engine)
    print("Database tables created successfully!")


def seed_initial_admin():
    """Seed default HR administrator user if no users exist."""
    db = SyncSessionLocal()
    try:
        existing = db.query(User).filter(User.email == "admin@autohr.com").first()
        if not existing:
            admin_user = User(
                email="admin@autohr.com",
                full_name="HR Administrator",
                password_hash=get_password_hash("admin123"),
                role=UserRole.ADMIN,
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print("Initial admin user seeded: admin@autohr.com / admin123")
        else:
            print("Admin user already exists.")
    finally:
        db.close()


def main():
    print("=" * 60)
    print("  AutoHR Database Initialization Script")
    print("=" * 60)
    create_database_if_not_exists()
    init_schema_and_extensions()
    seed_initial_admin()
    print("=" * 60)
    print("  Database setup complete and ready for use!")
    print("=" * 60)


if __name__ == "__main__":
    main()
