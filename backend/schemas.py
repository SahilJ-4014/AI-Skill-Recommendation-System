from pydantic import BaseModel

class UserInput(BaseModel):
    user_id: int
    skills: str
    experience: str
    goal: str


from pydantic import BaseModel

class RegisterUser(BaseModel):
    full_name: str
    email: str
    password: str


class LoginUser(BaseModel):
    email: str
    password: str