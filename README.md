
# 차량 운행데이터 시각화 프로그램
- 경북대학교 컴퓨터학부 교육과정인 종합설계프로젝트2 과목의 산학 연계 프로젝트입니다.
- 프로그램 버전: 1.0

## 사용 언어 및 라이브러리
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white"/> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/> <img src="https://img.shields.io/badge/styled components-DB7093?style=flat-square&logo=styledcomponents&logoColor=white"/> 


## 프로젝트 실행 방법
1. 프론트 사이드 실행
- my-react 폴더 열기
- 터미널에서 npm i 명령어로 모듈 설치
- npm start로 실행

2. 서버 사이드 실행
- junServer 폴더 열기
- 터미널에서 npm i 명령어로 모듈 설치
- node getData.js로 실행

## 실행 시 주의사항
- 로컬에 DB파일과 postgre가 설치되어 있어야 함.
- Axios 에러의 경우, postgre 로컬 비밀 번호 미일치로 인한 인증오류 이므로,<br>junServer 폴더의 getData.js 파일에서 postgre 패스워드를 본인 PC에 설치된 postgre 패스워드로 변경하면 됨.


## 프로젝트 결과 화면

### 전체 기능
<img src=https://github.com/chamin966/KNU_project2_team09/assets/76090919/bd5f8f59-b756-4899-9933-0e8a5f33f3fc width="300" height="250">　　<img src=https://github.com/chamin966/KNU_project2_team09/assets/76090919/e77c461b-0b47-455b-8a46-f08439879bc4 width="300" height="250">

틸팅　　　　　　　　　　　　　　　　　　　　확대/축소

<img src=https://github.com/chamin966/KNU_project2_team09/assets/76090919/5e4c00bc-e0be-4f7e-bbfa-d4d3c82345f7 width="300" height="250">　　<img src=https://github.com/chamin966/KNU_project2_team09/assets/76090919/f13db13c-657a-4da8-8a23-be09684740b6 width="300" height="250">

다크/라이트 모드 변환　　　　　　　　　　　차량이 지나가면 배차 요청 사라짐 

<img src=https://github.com/chamin966/KNU_project2_team09/assets/76090919/97fe70b3-dc83-408b-b8e0-3698538530eb width="300" height="250">　　<img src=https://github.com/chamin966/KNU_project2_team09/assets/76090919/b30a4cad-78a0-4fe8-824e-342eb256fd85 width="300" height="250">

재생 컨트롤러 시각 설정 펼침/접힘　　　　　　날짜 변경

<img src=https://github.com/chamin966/KNU_project2_team09/assets/76090919/af9ed80f-a9c0-41e9-b1db-26e9ab416822 width="300" height="250">　　<img src=https://github.com/chamin966/KNU_project2_team09/assets/76090919/8b9a480b-5bba-415d-b4b5-b968c335820c width="300" height="250">

데이터를 받아오는 동안 로딩중 표시　　　　　차량 목록 UI

  
  
### 전체 실행 화면

![종프2](https://github.com/chamin966/KNU_project2_team09/assets/76090919/b98ef6f4-d312-4258-a583-cc09aff3795f)

## 프로젝트 소개

본 프로젝트는 수요응답형 대중교통인 MOD 버스 서비스를 제공하고 있는 기업인 ‘Ciel’과 함께 진행한 종합설계프로젝트2 산학 연계 프로젝트의 일환입니다.

현재 기업이 운영 중인 MOD 서비스의 성능 개선과 활성화 방안 분석을 위해, 기업이 제공하는 데이터를 시각화할 수 있는 웹뷰 기반의 모바일 앱을 제공하는 것이 이번 프로젝트의 목표입니다.

## 주요 기능: 프론트엔드
- Deck.gl 라이브러리를 활용한 시각화 분석 웹 제작
- Turf.js 라이브러리를 이용한 차량 및 배차요청 애니메이션 배속, 일시정지 기능 구현
- Redux, Styled-Components 라이브러리를 활용하여 유지 보수성 향상 작업 진행
- 1080x720p의 태블릿 환경에 적합하도록 펼치고 접을 수 있는 UI 제작

## 주요 기능: 백엔드
- carPath.js, addData.js 함수를 이용하여 DB에서 차량의 운행 데이터 추출 및 가공
- requestAdd.js, pick_drop_data.js 함수 등을 활용하여 이용자의 배차요청 데이터 추출 및 재가공
- DB에서 데이터를 추출하기 위한 쿼리문 작성 및 보안
- 가공된 데이터를 프론트엔드 사이드에 전달

## 이슈 사항 및 아쉬운 점
- 테스트를 충분히 거치지 않아 활용 중에 예상치 못한 오류가 발생할 가능성이 있음

## 프로젝트를 통해 배운 점
- 새로운 라이브러리를 사용함에 있어 공식 문서를 활용하는 방법에 대한 숙련도 향상
- React Hook인 useState, useRef의 차이와 활용하는 방법에 대한 이해도 향상
- Node.js 및 React 활용에 대한 전반적인 이해도 및 활용능력 향상
- requestAnimationFrame 메서드로 60fps 애니메이션 생성하는 방법 학습
