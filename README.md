# 온라인 코딩테스트 실행 사이트

별도의 서버 구축이나 로그인, 설치 과정 없이 웹 브라우저에서 즉시 C++ 및 Python 코드를 작성하고, 다수의 테스트 케이스를 통해 로직을 검증하며, 결과를 URL로 손쉽게 공유할 수 있는 정적 웹 애플리케이션

## 🎯 프로젝트 개요

**Zero-Cost, Zero-Key, Zero-Setup** 원칙을 따르는 경량 온라인 IDE입니다.

- **Zero-Cost**: 완전 무료 운영 (GitHub Pages 호스팅)
- **Zero-Key**: API Key 불필요 (Public API 사용)
- **Zero-Setup**: 설치 및 로그인 불필요 (브라우저에서 즉시 실행)

### 타겟 사용자
- 알고리즘 문제 풀이(PS)를 하는 개발자 및 학생
- 코드 스니펫을 빠르게 테스트하고 싶은 개발자
- 교육용 예제를 공유하는 강사

## ✨ 주요 기능

### 1. 코드 편집기
- **지원 언어**: C++, Python 3
- **기능**: 구문 강조, 줄 번호, 자동 들여쓰기, 괄호 매칭
- **템플릿**: 언어 선택 시 "Hello World" 템플릿 자동 로드

### 2. 테스트 케이스 관리
- **다중 케이스**: 탭 인터페이스로 최대 6개까지 테스트 케이스 관리
- **입출력**: 각 케이스별 독립적인 입력(Stdin) 및 예상 출력(Expected Output) 설정

### 3. 코드 실행 및 채점
- **병렬 실행**: 모든 테스트 케이스를 동시에 실행하여 빠른 검증
- **자동 채점**: Pass/Fail/Error 자동 판별
- **상세 결과**: 실행 시간, 에러 메시지, Diff 비교 제공

### 4. 공유 기능
- **URL 공유**: 현재 코드와 테스트 케이스를 URL로 압축하여 공유
- **상태 복원**: 공유된 URL 접속 시 자동으로 코드 및 테스트 케이스 복원

## 🛠 기술 스택

| 분류 | 기술 | 용도 |
|------|------|------|
| **Hosting** | GitHub Pages | 정적 웹 호스팅 |
| **Core** | Vanilla JavaScript (ES6+) | 프레임워크 없는 경량 구현 |
| **UI Framework** | Bootstrap 5 (CDN) | 반응형 레이아웃 및 컴포넌트 |
| **Code Editor** | CodeMirror 6 (CDN) | 구문 강조 및 코드 편집 |
| **Execution Engine** | Piston API (Public) | 코드 실행 샌드박스 |
| **Data Compression** | lz-string | URL 기반 상태 압축 |

## 📁 프로젝트 구조

```
/
├── index.html          # 메인 페이지 (진입점)
├── README.md           # 프로젝트 설명서
├── TODO.md             # 작업 목록
└── assets/
    ├── css/
    │   └── style.css   # 커스텀 스타일
    ├── js/
    │   ├── app.js      # 메인 로직 (이벤트 핸들러, 초기화)
    │   └── api.js      # API 통신 모듈 (Piston API)
    └── images/         # 로고, 파비콘 등
```

## 🚀 시작하기

### 로컬 개발 환경 설정

1. **저장소 클론**
    ```bash
    git clone https://github.com/your-username/online-cote-runner.git
    cd online-cote-runner
    ```

2. **로컬 서버 실행**
    ```bash
    # Python 3
    python -m http.server 8000

    # Node.js (http-server)
    npx http-server -p 8000
    ```

3. **브라우저에서 접속**
    ```
    http://localhost:8000
    ```

### 배포

GitHub Pages를 통한 자동 배포:
1. GitHub 저장소의 Settings > Pages에서 소스 브랜치 선택
2. `main` 브랜치의 `/ (root)` 선택
3. 저장 후 자동으로 배포됨

## 📖 문서

프로젝트의 상세 문서는 `docs/` 폴더에서 확인할 수 있습니다:

- **[PRD+TRD](./docs/1_PRD+TRD.md)**: 제품 요구사항 및 기술 요구사항
- **[화면 설계서](./docs/2_화면%20설계서.md)**: UI/UX 설계 및 와이어프레임
- **[작업 분할 구조도](./docs/3_작업%20분할%20구조도.md)**: WBS 및 개발 일정
- **[API 연동 명세서](./docs/4_API%20연동%20명세서.md)**: Piston API 사용 가이드
- **[테스트 케이스](./docs/5_테스트%20케이스.md)**: 테스트 시나리오
- **[코드 컨벤션](./docs/6_코드%20컨벤션.md)**: 코딩 스타일 가이드

## 🗺 개발 로드맵

프로젝트는 5단계로 진행됩니다:

1. **Phase 1**: 기본 구조 및 UI (레이아웃, 탭 UI)
2. **Phase 2**: 에디터 연동 (CodeMirror 6 적용)
3. **Phase 3**: API 연동 (Piston API 병렬 호출)
4. **Phase 4**: 채점 및 에러 처리 (결과 판별 로직)
5. **Phase 5**: 공유 기능 (URL 압축/해제)

자세한 작업 목록은 [TODO.md](./TODO.md)를 참고하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 메시지 규칙

Semantic Commit Messages 형식을 따릅니다:

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `ui`: CSS 등 디자인 변경
- `docs`: 문서 수정
- `refactor`: 코드 리팩토링

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 🙏 감사의 말

- [Piston API](https://github.com/engineer-man/piston) - 코드 실행 엔진 제공
- [CodeMirror](https://codemirror.net/) - 코드 에디터 라이브러리
- [Bootstrap](https://getbootstrap.com/) - UI 프레임워크
