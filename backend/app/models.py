from pydantic import BaseModel, EmailStr, validator
from typing import List, Dict, Optional
import re

class PersonalInfo(BaseModel):
    name: str
    email: EmailStr
    mobile: str

    @validator('mobile')
    def validate_mobile(cls, v):
        if not re.match(r'^\d{10}$', v):
            raise ValueError('Mobile number must be 10 digits')
        return v

class Preferences(BaseModel):
    communication: str
    nightShift: bool
    timeFrom: str
    timeTo: str

class Applicant(BaseModel):
    personalInfo: PersonalInfo
    preferences: Preferences
    selectedSkills: List[str]
    proficiencies: Dict[str, str]

class ApplicantDB(Applicant):
    id: str
