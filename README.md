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
먼저 내가 이번 프로젝트에서 맡은 부분은 유저와, 배포다. Local 유저의 로그인을 위해서 Session 방식과 JWT 방식중 JWT을 택했다. 모바일 서비스를 만들기로 결정했고, 모바일엔 쿠키가 없으므로 JWT방식을 택했다.
엔드포인트는 api/v1/users가 기본이되고, 로그인은 OAuth2 유저와 로컬 유저가 동일한 방식을 사용해서 api/v1/auth로 설정했다. 사실 같은 엔드포인트로 만들었어도 됐었는데 초기엔 이것저것 시도해보다가 이렇게 하는게 맞다고생각해서 
따로 엔드포인트를 만들게되었다. 그리고 프론트분들과 상의했을때 회원가입에 이메일인증을 넣자는 아이디어가 나와서 처음에 SMTP서버와 통신하는 JavaMailSender를 사용해서 회원가입시 인증번호를 보내는 api를 만들었다.
추후에, 아이디/비밀번호 찾기 api도 필요해서 추가적으로 만들었다.
oauth관련해서는 모바일 앱과의 통신은 어떻게 하는지 몰라서 웹앱기준으로 만들었는데 나중에 프론트분들과 같이 작업하다가 모바일과 웹앱의 Oauth2 시퀀스가 다르다는걸 깨닫고 간단히 userId,providerType 만 입력받아 db에 입력받은 userId
가 있으면 로그인처리, 없으면 회원가입 처리를 해주는 api를 만들었다.
<br/>

- AWS EC2에 서버 배포:
먼저 서버배포는 부트캠프에서 배운 경험이 있는 AWS를 사용했다. 다른 클라우드 서비스보다도 프리티어가 1년정도 제공되어 굉장히 저렴한 가격에 배포를 했다.
먼저 가상서버로 EC2를 사용했다. 프리티어는 선택지가 t2.micro뿐이라 이걸 선택했고, AMI는 ubuntu로 선택했다.
프리티어라 메모리가 부족해 뻗어버리는 상황이 발생해 스왑파일을 만들어 메모리를 늘렸다.
(블로그 정리)[https://thcoding.tistory.com/103]
<br/>

- 도메인 구매 및 연결:
도메인은 가비아에서 구매해서 Route 53에서 호스팅 영역을 설정하고 레코드 생성해서 도메인과 연결했다.
DNS 설정은 가장 기본적인 A 레코드를 사용했다.
<br/>

- HTTPS 적용 (ACM, Route 53):
먼저 AWS의 Certificate Manager를 통해 SSL 인증서를 받고, Route 53에서 레코드를 생성하고 EC2 인바운드규칙을 443포트를 열어줬다.
그리고 로드 밸런서를 생성하고 A레코드를 수정해서 https 연결을 마쳤다.
(블로그 정리)[https://thcoding.tistory.com/121]
<br/>

- GitHub Actions를 활용한 CI/CD 구현:
CI/CD 파이프라인을 구축하기 위해서 한번 배워본적 있는 Github Actions를 사용해봤다. 처음엔 프론트코드까지 다 빌드를 했는데, 회의를 통해서 프론트 코드는 제외하고 빌드했다.
<br/>

```yaml

name: Java CI with Gradle

on:
  push:
    branches: ["dev"]
  pull_request:
    branches: ["dev"]

permissions:
  contents: read

env:
  S3_BUCKET_NAME: b-knockknock

jobs:
  build:
    name: Backend CI/CD
    runs-on: ubuntu-latest
    defaults:
      run:
        shell: bash
        working-directory: back/KnockKnock

    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 11
        uses: actions/setup-java@v3
        with:
          java-version: "11"
          distribution: "temurin"
      - name: Build with Gradle
        run: ./gradlew clean build -Pprofile=dev
      #       uses: gradle/gradle-build-action@bd5760595778326ba7f1441bcf7e88b49de61a25 # v2.6.0
      #       with:
      #         arguments: build
      # build한 후 프로젝트를 압축합니다.
      - name: Make zip file
        run: zip -r ./test2-deploy.zip . -x "Knock Knock/*"
        shell: bash

      # Access Key와 Secret Access Key를 통해 권한을 확인합니다.
      # 아래 코드에 Access Key와 Secret Key를 직접 작성하지 않습니다.
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY }} # 등록한 Github Secret이 자동으로 불려옵니다.
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} # 등록한 Github Secret이 자동으로 불려옵니다.
          aws-region: us-east-1

        # 압축한 프로젝트를 S3로 전송합니다.
      - name: Upload to S3
        run: aws s3 cp --region us-east-1 ./test2-deploy.zip s3://b-knockknock/test2-deploy.zip
      #     - name: Grant execute permission for gradlew
      #       run: chmod +x ./gradlew build
      #     CodeDeploy에게 배포 명령을 내립니다.
      - name: Code Deploy
        run: >
          aws deploy create-deployment --application-name knockknock
          --deployment-config-name CodeDeployDefault.AllAtOnce
          --deployment-group-name knockknock-group
          --s3-location bucket=$S3_BUCKET_NAME,bundleType=zip,key=test2-deploy.zip

```

(블로그 정리)[https://thcoding.tistory.com/111]

<br/>

- Docker 이미지 빌드 및 컨테이너 생성:
개발환경과 운영환경의 일치 등 다양한 장점으로 Docker를 사용해보고 싶었다. 그래서 EC2내에 도커를 설치하고, 이미지를 빌드하고, 이미지를 토대로 컨테이너를 만들고 컨테이너를 삭제한다.
위의 GithubActions의 gradle.yml 파일 마지막 단계에 Code Deploy 단계에서 AWS의 Code Deploy를 사용해 기존 컨테이너를 중지시키고 빌드된 이미지를 삭제하고 새로 이미지를 빌드하고
컨테이너를 실행해서 수정된 코드가 적용된다.
<br/>

- RDS를 이용한 MySQL 데이터베이스 관리:
먼저 RDS를 사용한 이유는 DB관리비용과 메모리부담을 줄이려 RDS를 사용하게 되었다. EC2인스턴스의 메모리가 작은데 DB까지 쓰게 되면 금방 뻗어버릴게 분명해서 RDS를 따로 쓰게 되었다.
그 외엔 확장성, 보안, 안전성 때문에도 사용했다.
