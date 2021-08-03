# IMPORTS SECTION
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import motor.motor_asyncio

from api.v1.routes.router import router as Router
from webapp.app import router as WebAppRouter


# VARIABLES SECTION
app = FastAPI()
MONGO_DETAILS = ""


# ROUTERS SECTION
app.include_router(Router, tags=["Router"], prefix="api/v1/route")
app.include_router(WebAppRouter, tags=["Web-App"], prefix="")

app.mount("/static", StaticFiles(directory="webapp/static"), name="static")

# HELPER FUNCTIONS
def get_collection():
    return app.client.database.collection


# INITIAL SETUP
@app.on_event("startup")
async def startup():
    app.client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

    Router.get_collection = get_collection


@app.on_event("shutdown")
async def stop_db():
    await app.client.close()