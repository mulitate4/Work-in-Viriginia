# ------- #
# Imports #
# ------- #
from fastapi import Cookie, FastAPI, Body, HTTPException, status, Request
from fastapi.responses import JSONResponse

from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

import firebase_admin
from firebase_admin import firestore, credentials, auth
import pyrebase

import json


# --------- #
# Variables #
# --------- #
app = FastAPI()
firebase_config = json.load(open('./frontend-config.json'))

templates = Jinja2Templates(directory="webapp/templates/")
app.mount("/static", StaticFiles(directory="webapp/static"), name="static")


# ---------------- #
# Helper Functions #
# ---------------- #
async def verify_token(id_token) -> str:
    auth_backend = auth
    
    try:
        decoded_token = app.auth_backend.verify_id_token(id_token)
        return decoded_token["uid"]
    except:
        return None


# --------- #
# Endpoints #
# --------- #
@app.post(path="/api/login")
async def signIn(email: str = Body(..., embed=True), password: str = Body(..., embed=True)):    
    try:
        user: dict = app.auth_frontend.sign_in_with_email_and_password(email, password)
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Password Incorrect")
    
    data = {
        "localId": user["localId"],
        "email": user["email"],
        "refreshToken": user["refreshToken"],
        "idToken": user["idToken"]
    }
    
    response = JSONResponse(content=data, status_code=status.HTTP_200_OK)
    response.set_cookie("idToken", user["idToken"])
    response.set_cookie("refreshToken", user["refreshToken"])

    return response


@app.post(path="/api/join-hackathon/{id}")
async def get_hackathons(id: str, idToken = Cookie("idToken"), refreshToken = Cookie("refreshToken")):    
    uid = await verify_token(idToken)
    
    if not uid:
        user = app.auth_frontend.refresh(refreshToken)
        idToken = user["idToken"]
        uid = await verify_token(idToken)
    
    decoded_token = auth.verify_id_token(idToken)
    email = decoded_token["email"]
    
    hackathon_participants = app.db_backend.collection("hackathons").document(id).get().to_dict()["participants"]
    
    response = {"detail": "Already Joined"}
    
    if not email in hackathon_participants:
        hackathon_participants.append(email)
        data_to_set = {
            "participants": hackathon_participants
        }
        app.db_backend.collection("hackathons").document(id).set(data_to_set, merge=True)
        response = {"detail": "Joined Hackathon"}

    return JSONResponse(response, 200)



# ------ #
# Webapp #
# ------ #
@app.get(path="/login")
async def get_hackathons(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get(path="/register")
async def get_hackathons(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})


@app.get(path="/dashboard/hackathons")
async def get_hackathons(request: Request, idToken = Cookie("idToken"), refreshToken = Cookie("refreshToken")):
    user = None
    
    uid = await verify_token(idToken)
    
    if not uid:
        user = app.auth_frontend.refresh(refreshToken)
        uid = await verify_token(user["idToken"])
    
    snapshots = app.db_backend.collection("hackathons").get()
    
    hackathons_response = []
    
    for snapshot in snapshots:
        hackathon = snapshot.to_dict()
        hackathons_response.append(hackathon)
    
    response = templates.TemplateResponse("hackathon-dashboard.html", {"request": request, "hackathons": hackathons_response})
    return response


@app.get(path="/dashboard/hackathons/{id}")
async def get_hackathons(request: Request, id: str, idToken = Cookie("idToken"), refreshToken = Cookie("refreshToken")):
    user = None
    
    uid = await verify_token(idToken)
    
    if not uid:
        user = app.auth_frontend.refresh(refreshToken)
        idToken = user["idToken"]
        uid = await verify_token(idToken)
    
    hackathon = app.db_backend.collection("hackathons").document(id).get().to_dict()
    hackathon_participants = hackathon["participants"]
    
    decoded_token = auth.verify_id_token(idToken)
    email = decoded_token["email"]
    
    is_participating = False
    if email in hackathon_participants:
        is_participating = True
    
    print(hackathon_participants)
    print(email)
    print(is_participating)
    
    response = templates.TemplateResponse("hackathon.html", {"request": request, "hackathon": hackathon, "joined": is_participating})
    return response


# -------- #
# DB Setup #
# -------- #
@app.on_event("startup")
async def startup():
    cred = credentials.Certificate("./work-in-virginia-firebase-adminsdk-89yew-bdc69f2ebe.json")
    firebase_admin.initialize_app(cred)
    db_backend = firestore.client()
    
    pyrebase_app = pyrebase.initialize_app(firebase_config)
    auth_frontend = pyrebase_app.auth()
    
    app.db_backend = db_backend
    app.auth_frontend = auth_frontend


@app.on_event("shutdown")
async def stop_db():
    await app.client.close()