from fastapi import APIRouter, Request

from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

import os

router = APIRouter()

templates = Jinja2Templates(directory="webapp/templates/")

@router.get('/', response_class=HTMLResponse, include_in_schema=False)
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})