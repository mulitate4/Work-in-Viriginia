from pydantic import BaseModel
from enum import Enum
from typing import Optional

class Model(BaseModel):
    string: str