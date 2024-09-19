from pydantic import BaseModel


class StudyResponse(BaseModel):
    code: str

    # class Config:
    #     json_schema_extra = {
    #         "example": {
    #             "code": "function calculateSMA(data, period) { ... }"
    #         }
    #     }
