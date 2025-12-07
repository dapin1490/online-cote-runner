# TODO: 온라인 코딩테스트 실행 사이트

## 📋 작업 목록

작업은 Phase별로 순차적으로 진행됩니다. 각 작업의 상세 내용은 [작업 분할 구조도](./docs/3_작업%20분할%20구조도.md)를 참고하세요.

---

## Phase 1: 프로젝트 설정 및 UI (예상 공수: 1.0일)

### 1.1 리포지토리 설정 (0.2일)
- [x] GitHub Repository 생성
- [x] GitHub Pages 활성화
- [x] `index.html` 기본 구조 생성

### 1.2 라이브러리 로드 (0.3일)
- [x] Bootstrap 5 CDN 스크립트 태그 삽입
- [x] CodeMirror 6 CDN 스크립트 태그 삽입
  - [x] Import map 방식으로 ES 모듈 로드
  - [x] esm.sh CDN 사용 (CORS 문제 해결)
  - [x] 버전 명시 없이 최신 버전 자동 로드
- [x] lz-string CDN 스크립트 태그 삽입
- [x] 필요한 언어 팩만 로드하도록 최적화

### 1.3 레이아웃 구현 (0.5일)
- [x] Bootstrap Grid System 기반 좌우 분할 레이아웃 구현
  - [x] 데스크톱: 2-Column Split View (좌우 비율 9:3)
  - [x] 모바일: 1-Column Stack View (반응형 처리)
- [x] 헤더 네비게이션 바 구현
  - [x] 로고 및 프로젝트명
  - [x] 언어 선택 드롭다운 (C++, Python)
  - [x] 공유 버튼
- [x] 우측 패널 기본 구조 구현
  - [x] 테스트 케이스 탭 영역
  - [x] 입출력 입력창 영역
  - [x] 실행 제어 및 결과 콘솔 영역

---

## Phase 2: 에디터 및 데이터 관리 (예상 공수: 1.5일)

### 2.1 에디터 초기화 (0.5일)
- [x] CodeMirror 인스턴스 생성
  - [x] `div#editor-container` 요소에 에디터 마운트
  - [x] 기본 설정 (lineNumbers, indentUnit, bracketMatching)
- [x] C++ 모드 및 구문 강조 적용
  - [x] `@codemirror/lang-cpp` 패키지 로드
  - [x] C++ 언어 모드 설정
- [x] Python 모드 및 구문 강조 적용
  - [x] `@codemirror/lang-python` 패키지 로드
  - [x] Python 언어 모드 설정
- [x] Dark Mode 테마 적용
  - [x] `@codemirror/theme-one-dark` 또는 커스텀 다크 테마 적용
- [x] 줄 번호, 자동 들여쓰기, 괄호 매칭 활성화
  - [x] `lineNumbers()` extension 추가
  - [x] `indentOnInput()` extension 추가
  - [x] `bracketMatching()` extension 추가
- [x] 언어 변경 시 "Hello World" 템플릿 자동 로드
  - [x] 언어별 템플릿 코드 정의 (C++, Python)
  - [x] 언어 선택 드롭다운 변경 이벤트 핸들러

### 2.2 데이터 구조 설계 (0.2일)
- [x] 테스트 케이스 상태 관리용 전역 변수 정의
  - [x] Array of Objects 구조 설계
  - [x] 각 케이스별 입력/예상 출력 저장 구조
- [x] 현재 선택된 언어 상태 관리

### 2.3 탭(Tab) UI 로직 (0.8일)
- [x] 탭 추가 기능 (`+` 버튼)
  - [x] `+` 버튼 클릭 이벤트 리스너 등록
  - [x] 최대 6개 제한 로직 구현
  - [x] Bootstrap Nav Tabs에 동적 탭 요소 생성
  - [x] 새 탭 활성화 및 포커스 이동
  - [x] 테스트 케이스 배열에 빈 객체 추가
- [x] 탭 삭제 기능 (`x` 버튼)
  - [x] 각 탭에 `x` 버튼 동적 추가 (단, 1개일 때는 숨김)
  - [x] `x` 버튼 클릭 이벤트 리스너 등록
  - [x] 최소 1개 유지 로직 구현
  - [x] 삭제 시 해당 인덱스 데이터 제거
  - [x] 삭제 후 인접 탭 활성화 처리
- [x] 탭 전환 시 입력창 값 바인딩(Sync)
  - [x] Bootstrap Tab 이벤트(`shown.bs.tab`) 리스너 등록
  - [x] 활성 탭 변경 시 해당 케이스 데이터 로드
    - [x] Stdin textarea에 `input` 값 설정
    - [x] Expected Output textarea에 `expectedOutput` 값 설정
  - [x] 입력값 변경 시 자동 저장
    - [x] Stdin textarea `input` 이벤트 → 현재 케이스 `input` 업데이트
    - [x] Expected Output textarea `input` 이벤트 → 현재 케이스 `expectedOutput` 업데이트

### 2.4 레이아웃 드래그 리사이저 기능 (0.3일)
- [x] 좌우 패널 사이 드래그 가능한 구분선 추가
  - [x] CSS로 리사이저 div 요소 스타일링 (커서 변경, 배경색 등)
  - [x] 좌우 패널 사이에 리사이저 요소 삽입
- [x] 마우스 드래그 이벤트 처리
  - [x] `mousedown` 이벤트 리스너 등록 (리사이저 요소)
  - [x] `mousemove` 이벤트로 드래그 중 좌우 패널 너비 동적 조절
  - [x] `mouseup` 이벤트로 드래그 종료 처리
- [x] 최소/최대 너비 제한 설정
  - [x] 좌측 패널 최소 너비: 40% (또는 300px)
  - [x] 좌측 패널 최대 너비: 80% (또는 적절한 값)
  - [x] 우측 패널 최소 너비: 20% (또는 200px)
- [x] 모바일에서 드래그 기능 비활성화
  - [x] 화면 너비 768px 미만에서는 리사이저 숨김 또는 비활성화

---

## Phase 3: API 연동 (예상 공수: 1.5일)

### 3.1 API 클라이언트 작성 (0.5일)
- [x] `api.js` 모듈 생성
- [x] Piston API 기본 호출 함수 작성
  - [x] `fetch` 함수 기반 단일 요청 구현
    - [x] Base URL: `https://emkc.org/api/v2/piston/execute`
    - [x] POST 요청, Content-Type: `application/json`
    - [x] 요청 body 구성 (language, version, files, stdin)
  - [x] 요청/응답 에러 처리
    - [x] `try-catch` 블록으로 네트워크 에러 처리
    - [x] HTTP 상태 코드 확인 (200 외에는 에러 처리)
    - [x] JSON 파싱 에러 처리
- [x] 언어별 설정 상수 정의 (Python, C++)
  - [x] Python: `{ language: "python", version: "*" }`
  - [x] C++: `{ language: "cpp", version: "*" }`
- [x] 테스트 함수 추가 (개발용)
  - [x] `app.js`에 `window.testAPI()` 함수 추가
  - [x] 브라우저 콘솔에서 API 호출 테스트 가능하도록 구현
  - [x] Python/C++ 실행 및 에러 처리 테스트 포함: 브라우저 콘솔에 `await testAPI()` 실행

### 3.2 ~~병렬 실행 구현 (0.7일)~~ → 3.4 순차 실행 및 실시간 결과 표시 구현 (0.5일) ⚠️ 추가됨
- [x] `Promise.allSettled`를 사용한 다중 테스트 케이스 일괄 요청 로직
  - [x] 활성화된 모든 테스트 케이스에 대해 API 요청 Promise 배열 생성
  - [x] `Promise.allSettled()`로 모든 요청 병렬 실행
- [x] 각 테스트 케이스별 독립적인 API 요청 생성
  - [x] 현재 에디터 코드 가져오기
  - [x] 각 케이스의 `input` 값을 `stdin`으로 설정
  - [x] 선택된 언어에 맞는 API 파라미터 설정
- [x] 요청 실패 시에도 나머지 결과 처리 보장
  - [x] `allSettled` 결과 배열 순회
  - [x] `status === 'fulfilled'`인 경우 성공 결과 처리
  - [x] `status === 'rejected'`인 경우 에러 결과 처리
- [x] 결과 배열 정렬 및 인덱스 매핑
  - [x] 원본 테스트 케이스 인덱스와 결과 매핑
  - [x] 결과 객체에 케이스 번호 포함
  - [x] 결과를 케이스 순서대로 정렬

### 3.3 로딩 처리 (0.3일)
- [x] 실행 중 `[Run All]` 버튼 비활성화
- [x] 버튼 텍스트를 "Running..."으로 변경
- [x] 로딩 스피너(Spinner) UI 표시
- [x] 실행 완료 시 버튼 상태 복원

### 3.4 순차 실행 및 실시간 결과 표시 구현 (0.5일) ⚠️ 추가됨
> **추가 사유**: API 요청 한도 문제로 인해 병렬 실행 대신 순차 실행으로 변경 필요
> - Piston API 및 GitHub Pages의 API 요청 한도 제한으로 병렬 실행 시 대부분 요청 한도 초과 오류 발생
> - 순차 실행으로 변경하여 한도 문제 해결 및 실시간 결과 표시로 UX 개선

- [x] 순차 실행 로직 구현
  - [x] `for...of` 또는 `for` 루프를 사용한 순차 실행
  - [x] 각 테스트 케이스를 하나씩 실행하고 결과를 수집
  - [x] 각 케이스 실행 완료 후 다음 케이스 실행
  - [x] 요청 한도 초과 오류(HTTP 429) 발생 시 일정 시간 대기 후 재요청
- [x] 실시간 결과 표시 구현
  - [x] 각 케이스 실행 완료 시마다 UI 업데이트
  - [x] 진행 중인 케이스와 완료된 케이스를 구분하여 표시
  - [x] 진행 중인 케이스에 로딩 스피너 표시
  - [x] 완료된 케이스는 즉시 결과 표시 (Pass/Fail/Error)
- [x] 요청 실패 시에도 나머지 결과 처리 보장
  - [x] try-catch로 각 케이스 실행 에러 처리
  - [x] 에러 발생 시에도 다음 케이스 계속 실행
  - [x] 에러 결과를 결과 배열에 포함

---

## Phase 4: 검증 및 결과 표시 (예상 공수: 1.5일)

### 4.1 에러 감지 로직 (0.3일)
- [x] API 응답 중 `stderr` 존재 여부 확인
- [x] Exit Code(`code`) 확인 로직
- [x] 런타임 에러 판별 함수 구현
- [x] 네트워크 에러 처리

### 4.2 정답 비교 로직 (0.4일)
- [x] `stdout` vs `Expected Output` 문자열 정규화
  - [x] 앞뒤 공백 제거 (`trim`)
  - [x] 줄바꿈 정규화
- [x] 문자열 비교 함수 구현
- [x] Pass/Fail 판별 로직

### 4.3 결과 UI 렌더링 (0.8일)
- [x] 종합 요약 카드 생성
  - [x] Bootstrap Card 컴포넌트 사용
  - [x] Total, Pass, Fail, Error 카운트 계산 및 표시
  - [x] 각 카운트에 Bootstrap Badge 스타일 적용
- [x] 개별 결과 아코디언 생성
  - [x] Bootstrap Accordion 컴포넌트 사용
  - [x] 각 테스트 케이스별 아코디언 아이템 동적 생성
  - [x] Pass: 초록색 배지(`badge bg-success`) 및 실행 시간 표시
    - [ ] API 응답의 실행 시간 정보 표시 (있는 경우) - API 응답에 실행 시간 정보가 없어서 구현 보류
  - [x] Fail: 주황색 배지(`badge bg-warning`) 및 Diff View 표시
    - [x] Bootstrap Grid로 좌우 분할 (내 출력 / 예상 출력)
    - [x] 각 출력 영역을 `<pre>` 태그로 표시
    - [ ] 차이점 강조를 위한 스타일링 (선택사항) - 기본 스타일로 구현
  - [x] Error: 붉은색 배지(`badge bg-danger`) 및 `stderr` 원문 메시지 출력
    - [x] `stderr` 텍스트를 `<pre>` 태그로 표시
    - [x] 빨간색 텍스트 스타일 적용
- [x] 결과 영역 스크롤 처리
  - [x] 결과 콘솔 영역에 `max-height` 및 `overflow-y: auto` 설정
  - [x] 결과 추가 시 자동 스크롤 (선택사항)

---

## Phase 5: 배포 및 공유 (예상 공수: 1.0일)

### 5.1 상태 압축/해제 (0.4일)
- [x] 상태 직렬화 함수 작성
  - [x] 상태 객체 구조 정의
    - [x] `code`: 에디터 소스 코드
    - [x] `language`: 선택된 언어 (C++ 또는 Python)
    - [x] `testCases`: 테스트 케이스 배열 (input, expectedOutput)
  - [x] `JSON.stringify()`로 JSON 문자열 변환
- [x] `lz-string`을 이용한 압축 함수
  - [x] `LZString.compressToEncodedURIComponent()` 사용
  - [x] 압축된 문자열 반환
- [x] 압축 해제 및 복원 함수
  - [x] `LZString.decompressFromEncodedURIComponent()` 사용
  - [x] JSON 파싱 (`JSON.parse()`)
  - [x] 파싱 에러 처리 (try-catch)
- [x] 한글 등 특수문자 인코딩 처리
  - [x] `lz-string`이 자동으로 처리하지만, 테스트로 한글 데이터 검증

### 5.2 URL 해시 처리 (0.4일)
- [x] 공유 버튼 클릭 이벤트 핸들러
  - [x] 현재 상태 수집 (에디터 코드, 언어, 테스트 케이스)
  - [x] 상태 압축 함수 호출
  - [x] URL Hash(`/#data=...`) 업데이트
    - [x] `window.location.hash = '#data=' + compressedData`
    - [x] `history.replaceState()` 사용 (페이지 리로드 방지)
  - [x] 클립보드 복사 기능
    - [x] `navigator.clipboard.writeText()` 사용
    - [x] 전체 URL (`window.location.href`) 복사
    - [x] 클립보드 API 미지원 시 fallback (선택 텍스트)
  - [x] 사용자 피드백 (alert 또는 toast)
    - [x] Bootstrap Toast 또는 `alert()` 사용
    - [x] "Link copied to clipboard!" 메시지 표시
- [x] 페이지 로드 시 Hash 파싱 로직
  - [x] `window.location.hash` 확인
    - [x] `hash.startsWith('#data=')` 체크
  - [x] 데이터 추출 및 디코딩
    - [x] Hash에서 `data=` 이후 부분 추출
    - [x] 압축 해제 함수 호출
  - [x] 상태 복원 및 UI 업데이트
    - [x] 에디터 내용 설정 (`editor.setState()`)
    - [x] 언어 선택 드롭다운 업데이트
    - [x] 테스트 케이스 탭 자동 복구
      - [x] 기존 탭 제거 후 새로 생성
      - [x] 각 탭의 입력값 복원
      - [x] 첫 번째 탭 활성화

### 5.3 최종 테스트 (0.2일)
- [ ] 주요 기능 테스트 케이스 점검
  - [ ] 코드 편집 및 언어 변경
  - [ ] 테스트 케이스 추가/삭제/전환
  - [ ] 코드 실행 및 채점
  - [ ] 공유 URL 생성 및 복원
- [ ] 반응형 레이아웃 테스트 (데스크톱/모바일)
- [ ] 브라우저 호환성 테스트 (Chrome, Edge, Safari, Firefox)
- [ ] 버그 수정 및 최적화

## 기타 기능 및 UI/UX 개선
- [ ] 화면 크기 조절하여 가로 스크롤바 생기지 않게 하기
- [ ] footer에 깃허브 링크(https://github.com/dapin1490) 추가하기
- [ ] 언어 선택 버튼을 공유 버튼 바로 옆으로 옮기기
- [ ] 코드 입력칸 폰트 바꾸기
  ```html
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding&display=swap');
  </style>
  ```
  ```css
    .nanum-gothic-coding-regular {
    font-family: "Nanum Gothic Coding", monospace;
    font-weight: 400;
    font-style: normal;
  }
  ```

---

## 📊 진행 상황

- **총 예상 공수**: 약 6.5일
- **완료된 작업**: 15 / 16
- **진행 중인 작업**: 0
- **남은 작업**: 1 (5.3 최종 테스트)

---

## 📝 참고 사항

1. **순차적 진행**: ID 순서대로 진행하는 것을 권장합니다.
2. **MVP 우선**: 4.3(결과 UI)에서 'Diff View'가 구현하기 까다롭다면, 우선 단순 텍스트 나열로 1차 완료 후 고도화하세요.
3. **난이도 높은 작업**:
   - 2.3(탭 로직): 상태 관리 및 동기화가 복잡
   - 3.2(병렬 실행): Promise 처리 및 에러 핸들링 중요
4. **코드 컨벤션**: 모든 코드는 [코드 컨벤션](./docs/6_코드%20컨벤션.md)을 준수해야 합니다.

