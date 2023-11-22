# KnockKnock

본 리드미 내용은 제가맡은 기술적인 부분에 대해서만 기술되어있습니다.
<br/>
<br/>

- api명세서
![스크린샷 2023-11-22 오후 5 57 40](https://github.com/adsds126/KnockKnock/assets/110022522/f8666b80-239e-47e5-b063-7d8be675a1fb)


<br/>

### <span style=""> ⚙️ **Stack** </span>
<img src="https://img.shields.io/badge/Java-blue?style=flat-square&logo=Java&logoColor=white"/>
<img src="https://img.shields.io/badge/Spring-boot-6DB33F?style=flat-square&logo=Spring-boot&logoColor=white"/>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon-AWS-232F3E?style=flat-square&logo=Amazon-AWS&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon-EC2-FF9900?style=flat-square&logo=Amazon-EC2&logoColor=white"> <img src="https://img.shields.io/badge/Amazon-Rds-527FFF?style=flat-square&logo=Amazon-Rds&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon-S3-569A31?style=flat-square&logo=Amazon-S3&logoColor=white"/> <img src="https://img.shields.io/badge/Amazon-Route53-8C4FFF?style=flat-square&logo=Amazon-Route-53&logoColor=white"/> <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white"/>
<br/>

- Local User, OAuth2 User API 개발:

어떤 목적으로 이 API가 개발되었는지 간략히 설명하세요.
어떤 역할을 하는 API인지, 주요 기능은 무엇인지 기술하세요.
주요 엔드포인트와 해당 엔드포인트에서 사용되는 요청과 응답에 대한 예시를 제공하세요.
먼저 내가 이번 프로젝트에서 맡은 부분은 유저와, 배포다. Local 유저의 로그인을 위해서 Session 방식과 JWT 방식중 JWT을 택했다. 모바일 서비스를 만들기로 결정했고, 모바일엔 쿠키가 없으므로 JWT방식을 택했다.
엔드포인트는 api/v1/users가 기본이되고, 로그인은 OAuth2 유저와 로컬 유저가 동일한 방식을 사용해서 api/v1/auth로 설정했다. 사실 같은 엔드포인트로 만들었어도 됐었는데 초기엔 이것저것 시도해보다가 이렇게 하는게 맞다고생각해서 
따로 엔드포인트를 만들게되었다. 그리고 프론트분들과 상의했을때 회원가입에 이메일인증을 넣자는 아이디어가 나와서 처음에 SMTP서버와 통신하는 JavaMailSender를 사용해서 회원가입시 인증번호를 보내는 api를 만들었다.
추후에, 아이디/비밀번호 찾기 api도 필요해서 추가적으로 만들었다.
oauth관련해서는 모바일 앱과의 통신은 어떻게 하는지 몰라서 웹앱기준으로 만들었는데 나중에 프론트분들과 같이 작업하다가 모바일과 웹앱의 Oauth2 시퀀스가 다르다는걸 깨닫고 간단히 
<br/>
- AWS EC2에 서버 배포:

서버를 AWS EC2에 배포한 이유와 배포 프로세스를 간략하게 설명하세요.
사용한 AMI, 인스턴스 유형 등에 대한 기술적인 세부 사항을 언급하세요.
<br/>
- 도메인 구매 및 연결:

어떤 도메인을 구매했는지 설명하고, 해당 도메인을 연결하는 과정을 설명하세요.
DNS 설정 등에 대한 핵심 단계를 포함하세요.
<br/>
- HTTPS 적용 (ACM, Route 53):

ACM (AWS Certificate Manager) 및 Route 53을 사용하여 HTTPS를 어떻게 구현했는지 설명하세요.
SSL/TLS 인증서의 발급과 갱신, Route 53을 통한 DNS 레코드 설정 등에 대한 내용을 포함하세요.
<br/>
- GitHub Actions를 활용한 CI/CD 구현:

CI/CD를 구현한 동기와 이점에 대해 간략히 설명하세요.
GitHub Actions에서 사용한 워크플로우에 대한 핵심 세부 사항을 제공하세요.
빌드, 테스트, 배포의 각 단계를 어떻게 수행했는지 설명하세요.
<br/>
- Docker 이미지 빌드 및 컨테이너 생성:

Docker를 사용하여 애플리케이션을 패키징하고 배포하는 이유에 대해 간략히 설명하세요.
Docker 이미지를 빌드하고 컨테이너를 생성하는 과정에 대한 주요 단계를 서술하세요.
<br/>
- RDS를 이용한 MySQL 데이터베이스 관리:

RDS를 선택한 이유와 어떤 데이터베이스 스키마를 사용했는지 설명하세요.
RDS 설정 및 관리에 대한 핵심 내용을 언급하세요.
