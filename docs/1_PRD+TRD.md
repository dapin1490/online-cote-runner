# 제품 요구사항 정의서 (PRD): Lightweight Online IDE

## 1. 프로젝트 개요 (Overview)

- 목표: 별도의 서버 구축이나 로그인, 설치 과정 없이 웹 브라우저에서 즉시 C++ 및 Python 코드를 작성하고, 다수의 테스트 케이스를 통해 로직을 검증하며, 결과를 URL로 손쉽게 공유할 수 있는 정적 웹 애플리케이션 개발.
- 핵심 가치: Zero-Cost (비용 0원), Zero-Key (API Key 미사용), Zero-Setup (설치 불필요).
- 타겟 사용자: 알고리즘 문제 풀이(PS), 코드 스니펫 테스트, 교육용 예제 공유가 필요한 개발자 및 학생.

## 2. 시스템 아키텍처 및 기술 스택 (Architecture & Tech Stack)

본 프로젝트는 Zero-Key Architecture를 채택하여, 보안 위험을 원천 차단하고 완전 무료로 운영됩니다.

- Hosting: GitHub Pages (정적 호스팅)
- Core Logic: Vanilla JavaScript (ES6+) (프레임워크 없이 경량화)
- UI Framework: Bootstrap 5 (via CDN) (반응형 레이아웃 및 컴포넌트)
- Code Editor: CodeMirror 6 (via CDN) (구문 강조 및 에디팅 기능)
- Execution Engine: Piston API (Public) (코드 실행 샌드박스)
- Data Serialization: lz-string (URL Hash 기반 데이터 압축 및 공유)

## 3. 기능 요구사항 (Functional Requirements)

### 3.1 코드 편집기 (Code Editor)

- 언어 지원: C++, Python 3.
- 기본 기능:
    - 언어 선택에 따른 구문 강조(Syntax Highlighting).
    - 줄 번호 표시, 자동 들여쓰기, 괄호 매칭.
    - 페이지 로드/언어 변경 시 "Hello World" 템플릿 코드 자동 로드.

### 3.2 테스트 케이스 관리 (Test Case Management)

- 다중 케이스 UI:
    - 탭(Tab) 인터페이스를 사용하여 개별 테스트 케이스 관리.
    - `+` 버튼으로 케이스 동적 추가 (최대 6개 권장).
    - 각 탭의 `x` 버튼으로 개별 케이스 삭제.
- 입력 데이터:
    - 각 케이스는 독립적인 입력(Stdin)과 예상 출력(Expected Output) 텍스트 영역을 가짐.

### 3.3 코드 실행 및 채점 (Execution & Verification)

- 일괄 병렬 실행 (Batch Parallel Execution):
    - '전체 실행' 버튼 클릭 시, 활성화된 모든 테스트 케이스에 대해 Piston API 요청 생성.
    - *`Promise.allSettled`*를 사용하여 병렬로 전송 및 처리 (일부 요청 실패 시에도 나머지 결과 처리 보장).
- 결과 판별 로직 (우선순위 순):
    1. 런타임 에러 (Runtime Error): API 응답의 `stderr` 필드가 비어있지 않거나 `code`가 0이 아닌 경우.
    2. 오답 (Fail): 에러가 없고, 실행 결과(`stdout`)가 예상 출력(`Expected Output`)과 다를 경우.
    3. 정답 (Pass): 에러가 없고, 실행 결과가 예상 출력과 일치할 경우.
- 데이터 전처리: 채점 시 양쪽 문자열의 앞뒤 공백 및 줄바꿈(`trim`) 제거 후 비교.

### 3.4 결과 리포팅 (Result Reporting)

- 통합 리포트: 실행 완료 후 하단 패널에 종합 결과 표시.
    - 예: *Total: 3, Pass: 1, Fail: 1, Error: 1*
- 상세 결과 표시:
    - Pass: 초록색 배지 및 실행 시간 표시.
    - Error: 붉은색 배지 및 `stderr` 원문 메시지 출력 (예: `ValueError`, `ZeroDivisionError`).
    - Fail: 주황색 배지 및 Diff (내 출력 vs 예상 출력) 비교 영역 표시.

### 3.5 공유 기능 (Sharing)

- 상태 저장 (State Persistence):
    - 현재 에디터의 소스 코드, 선택된 언어, 작성된 모든 테스트 케이스(입력/예상출력)를 JSON 객체로 구성.
- URL 인코딩:
    - JSON 데이터를 `lz-string` 라이브러리로 압축하여 URL Hash(`/#data=...`)에 포함.
- 상태 복원:
    - 공유 URL 접속 시, Hash 값을 디코딩하여 에디터 내용과 테스트 케이스 탭을 자동 복구.

## 4. 사용자 인터페이스 (UI/UX)

화면은 데스크톱 기준 좌우 분할(Split) 레이아웃을 사용하며, 모바일에서는 상하 배치로 전환됩니다.

| 영역 | 구성 요소 | 기능 설명 |
| --- | --- | --- |
| Header | 로고, 언어 선택(Select), 공유 버튼 | 상단 고정 바 |
| Left Panel | Code Editor | 코드 작성 영역 (화면 높이에 맞춰 확장) |
| Right Panel | [Top] Test Case Tabs | Case 1, Case 2, ... [+] 탭 메뉴 |
|  | [Middle] IO Area | 선택된 탭의 Input / Expected Output 입력창 |
|  | [Bottom] Result Console | 실행 버튼 및 결과 리포트 출력 영역 (스크롤 가능) |

## 5. 비기능 요구사항 (Non-Functional Requirements)

- 보안 (Security): 클라이언트 사이드 로직만 사용하며, 소스 코드 내 민감한 API Key 포함 금지.
- 성능 (Performance): 불필요한 리소스 로딩 최소화 (CodeMirror 등은 필요한 언어 팩만 로드).
- 안정성 (Reliability): 외부 API(Piston) 장애 시 사용자에게 "서버 응답 없음" 등의 명확한 피드백 제공.
- 호환성 (Compatibility): Modern Web Browsers (Chrome, Edge, Safari, Firefox) 최신 버전 지원.

## 6. 개발 마일스톤 (Milestones)

| 단계 | 목표 | 주요 작업 내용 |
| --- | --- | --- |
| Phase 1 | 기본 구조 및 UI | GitHub Pages 생성, Bootstrap 레이아웃(좌우 분할), 탭 UI 구현. |
| Phase 2 | 에디터 연동 | CodeMirror 6 적용, C++/Python 모드 활성화. |
| Phase 3 | API 연동 (병렬) | `fetch` 및 `Promise.allSettled`를 이용한 Piston API 병렬 호출 구현. |
| Phase 4 | 채점 및 에러 처리 | `stderr` 체크 로직, 정답 비교 로직, 결과 UI 렌더링 구현. |
| Phase 5 | 공유 기능 | `lz-string` 압축/해제 로직 적용, 최종 테스트 및 배포. |