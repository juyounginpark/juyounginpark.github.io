# 읽어주세요 

# 중요 !
### Chapter 단위로 branch 파기
- branch 양식 -> "add/chapter1_1"
- commit message 양식에 따라 작성하기
- "fix/chapter2로 jump되는 오류 수정"
- "chore: ~파일 정리"
- "add: chapter1_1_blossom 씬 추가"
```
git add .
git commit -m "메세지"
git push
```
- 위 내용 꼭 지키셔야함.

# commit message
- script 수정 시 -> script:
- 기능 추가 시 (interaction) -> feat:
- setting 변경 시 -> setting:


## Chapter 파일 분리

### script.rpy를 main으로 생각하기. (시작)
- Scenes 내 chapter label 작성하기
- 양식은 "chapter1_1"
- 챕터 내 별도 씬이 있을 경우 "chapter1_1_blossom:
- 하위 폴더 내 rpy파일들을 jump로 이동 가능함. 별도의 헤더라 모듈 필요 X

## characterImages && background 

- 이미지 해당 파일에 구분 지어 넣기

# 변수명은 camelCase로.

## 캐릭터 변수명

주인공|main 
박주연|parkjuyoun

## 캐릭터별 호감도 변수명

인물 이름	호감도 변수명
박주연	likeJuyoun
정성경	likeSungkyung
박여름	likeYeoreum
Monika	likeMonika
이현서 (조력자)	likeHyunseo
김민수 교수	likeProf