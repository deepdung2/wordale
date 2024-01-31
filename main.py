from fastapi import FastAPI
from pydantic import BaseModel #Request Body는 미리 포멧을 정해 줘야 함
from fastapi.staticfiles import StaticFiles #정적 파일

app = FastAPI()

#/answer라는 경로로 요청을 보내면 정답을 알려 줌
answer='TRAIN'

@app.get('/answer')
def get_answer():
    return answer

app.mount("/", StaticFiles(directory="static", html=True), name="static")
