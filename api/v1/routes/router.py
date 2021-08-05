from fastapi import APIRouter, Body, HTTPException, Depends, Request
from fastapi.encoders import jsonable_encoder

from api.v1.models import *

router = APIRouter()

@router.post(path="/{number}")
async def endpoint(number: int):
    pass