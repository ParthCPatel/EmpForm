from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import csv
import io
from .models import Applicant, ApplicantDB
from .database import applicants_collection

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:5174",  # Vite alternative
    "http://localhost:5175",  # Current running port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "UserForm Backend is running"}

@app.post("/api/submit", response_model=ApplicantDB)
async def submit_application(applicant: Applicant):
    applicant_dict = applicant.dict()
    result = await applicants_collection.insert_one(applicant_dict)
    created_applicant = await applicants_collection.find_one({"_id": result.inserted_id})
    if created_applicant:
        created_applicant["id"] = str(created_applicant["_id"])
        del created_applicant["_id"]
        return created_applicant
    raise HTTPException(status_code=500, detail="Failed to create applicant")

@app.get("/api/applicants", response_model=List[ApplicantDB])
async def get_applicants():
    applicants = []
    cursor = applicants_collection.find({})
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        applicants.append(document)
    return applicants

from pydantic import BaseModel

class AdminCredentials(BaseModel):
    username: str
    password: str

@app.post("/api/export")
async def export_applicants(creds: AdminCredentials):
    print(f"DEBUG AUTH: Received username='{creds.username}', password='{creds.password}'")
    # Simple hardcoded auth for demonstration
    if creds.username != "admin" or creds.password != "L@Net123":
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Fetch all applicants
    cursor = applicants_collection.find({})
    applicants = []
    async for document in cursor:
        applicants.append(document)

    # Flatten data for CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Define headers
    headers = [
        "Name", "Email", "Mobile",
        "Communication", "Night Shift", "Time From", "Time To",
        "Skills (Proficiency)"
    ]
    writer.writerow(headers)

    for app in applicants:
        # Personal Info
        p_info = app.get("personalInfo", {})
        name = p_info.get("name", "")
        email = p_info.get("email", "")
        mobile = p_info.get("mobile", "")

        # Preferences
        prefs = app.get("preferences", {})
        comm = prefs.get("communication", "")
        night = "Yes" if prefs.get("nightShift") else "No"
        t_from = prefs.get("timeFrom", "")
        t_to = prefs.get("timeTo", "")

        # Skills & Proficiency
        # proficiencies is a dict: {"React": "Expert", ...}
        profs = app.get("proficiencies", {})
        # selectedSkills is a list: ["React", ...]
        # We can just iterate proficiencies
        skills_formatted = []
        for skill, level in profs.items():
            skills_formatted.append(f"{skill}: {level}")
        skills_str = "; ".join(skills_formatted)

        writer.writerow([
            name, email, mobile,
            comm, night, t_from, t_to,
            skills_str
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=applicants_export.csv"}
    )
