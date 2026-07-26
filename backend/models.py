from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func

from database import Base


class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)

    password = Column(String(255), nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())


class Recommendation(Base):

    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    skills = Column(Text, nullable=False)

    experience = Column(String(50), nullable=False)

    goal = Column(String(100), nullable=False)

    recommendation = Column(Text, nullable=False)

    created_at = Column(TIMESTAMP, server_default=func.now())