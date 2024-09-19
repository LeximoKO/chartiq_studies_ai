from pydantic import BaseModel


class StudyRequest(BaseModel):
    question: str

    # class Config:
    #     json_schema_extra = {
    #         "example": {
    #             "question": "Create a study that calculates a 10-period simple moving average (SMA) on the close price."
    #         }
    #     }
