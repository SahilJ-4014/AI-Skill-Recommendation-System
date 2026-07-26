from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy import desc
import json

from database import SessionLocal
from models import Recommendation, User
from schemas import UserInput, RegisterUser, LoginUser
from ai import generate_recommendation
from auth import hash_password, verify_password

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI()
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
def root():
    return RedirectResponse(url="/static/login.html", status_code=307)

# ===========================
# REGISTER API
# ===========================

@app.post("/register")
def register(user: RegisterUser):

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        db.close()
        return {
            "status": "error",
            "message": "Email already registered."
        }

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {
        "status": "success",
        "message": "Registration successful."
    }


# ===========================
# LOGIN API
# ===========================

# ===========================
# LOGIN API
# ===========================

@app.post("/login")
def login(user: LoginUser):

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    # ===== DEBUG START =====
    print("\n================ LOGIN DEBUG ================")
    print("Email entered:", user.email)
    print("User found:", existing_user)

    if existing_user:
        print("Database Email:", existing_user.email)
        print("Stored Password:", existing_user.password)

        password_match = verify_password(
            user.password,
            existing_user.password
        )

        print("Password Match:", password_match)
    else:
        print("No user found with this email.")

    print("=============================================\n")
    # ===== DEBUG END =====

    if existing_user is None:
        db.close()
        return {
            "status": "error",
            "message": "Invalid email or password."
        }

    if not verify_password(user.password, existing_user.password):
        db.close()
        return {
            "status": "error",
            "message": "Invalid email or password."
        }

    response = {
        "status": "success",
        "message": "Login successful.",
        "user": {
            "id": existing_user.id,
            "full_name": existing_user.full_name,
            "email": existing_user.email
        }
    }

    db.close()

    return response

    db = SessionLocal()

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()


    if existing_user is None:
        db.close()
        return {
            "status": "error",
            "message": "Invalid email or password."
        }

    if not verify_password(user.password, existing_user.password):
        db.close()
        return {
            "status": "error",
            "message": "Invalid email or password."
        }

    response = {
        "status": "success",
        "message": "Login successful.",
        "user": {
            "id": existing_user.id,
            "full_name": existing_user.full_name,
            "email": existing_user.email
        }
    }

    db.close()

    return response


# ===========================
# RECOMMENDATION API
# ===========================

@app.post("/recommend")
def recommend(user: UserInput):

    recommendation_data = generate_recommendation(
        user.skills,
        user.experience,
        user.goal
    )

    db = SessionLocal()

    # recommendation = Recommendation(
    #     skills=user.skills,
    #     experience=user.experience,
    #     goal=user.goal,
    #     recommendation=json.dumps(recommendation_data)
    # )

    recommendation = Recommendation(
    user_id=user.user_id,
    skills=user.skills,
    experience=user.experience,
    goal=user.goal,
    recommendation=json.dumps(recommendation_data)
)

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)
    db.close()

    return recommendation_data


# ===========================
# HISTORY API
# ===========================

@app.get("/history/{user_id}")
def get_history(user_id: int):

    db = SessionLocal()

    # recommendations = (
    #     db.query(Recommendation)
    #     .order_by(desc(Recommendation.created_at))
    #     .all()
    # )

    recommendations = (
    db.query(Recommendation)
    .filter(Recommendation.user_id == user_id)
    .order_by(desc(Recommendation.created_at))
    .all()
)

    history = []

    for item in recommendations:

        history.append({
            "id": item.id,
            "skills": item.skills,
            "experience": item.experience,
            "goal": item.goal,
            "recommendation": json.loads(item.recommendation),
            "created_at": str(item.created_at)
        })

    db.close()

    return history