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
- [ ] 테스트 케이스 상태 관리용 전역 변수 정의
  - [ ] Array of Objects 구조 설계
  - [ ] 각 케이스별 입력/예상 출력 저장 구조
- [ ] 현재 선택된 언어 상태 관리

### 2.3 탭(Tab) UI 로직 (0.8일)
- [ ] 탭 추가 기능 (`+` 버튼)
  - [ ] `+` 버튼 클릭 이벤트 리스너 등록
  - [ ] 최대 6개 제한 로직 구현
  - [ ] Bootstrap Nav Tabs에 동적 탭 요소 생성
  - [ ] 새 탭 활성화 및 포커스 이동
  - [ ] 테스트 케이스 배열에 빈 객체 추가
- [ ] 탭 삭제 기능 (`x` 버튼)
  - [ ] 각 탭에 `x` 버튼 동적 추가 (단, 1개일 때는 숨김)
  - [ ] `x` 버튼 클릭 이벤트 리스너 등록
  - [ ] 최소 1개 유지 로직 구현
  - [ ] 삭제 시 해당 인덱스 데이터 제거
  - [ ] 삭제 후 인접 탭 활성화 처리
- [ ] 탭 전환 시 입력창 값 바인딩(Sync)
  - [ ] Bootstrap Tab 이벤트(`shown.bs.tab`) 리스너 등록
  - [ ] 활성 탭 변경 시 해당 케이스 데이터 로드
    - [ ] Stdin textarea에 `input` 값 설정
    - [ ] Expected Output textarea에 `expectedOutput` 값 설정
  - [ ] 입력값 변경 시 자동 저장
    - [ ] Stdin textarea `input` 이벤트 → 현재 케이스 `input` 업데이트
    - [ ] Expected Output textarea `input` 이벤트 → 현재 케이스 `expectedOutput` 업데이트

### 2.4 레이아웃 드래그 리사이저 기능 (0.3일)
- [ ] 좌우 패널 사이 드래그 가능한 구분선 추가
  - [ ] CSS로 리사이저 div 요소 스타일링 (커서 변경, 배경색 등)
  - [ ] 좌우 패널 사이에 리사이저 요소 삽입
- [ ] 마우스 드래그 이벤트 처리
  - [ ] `mousedown` 이벤트 리스너 등록 (리사이저 요소)
  - [ ] `mousemove` 이벤트로 드래그 중 좌우 패널 너비 동적 조절
  - [ ] `mouseup` 이벤트로 드래그 종료 처리
- [ ] 최소/최대 너비 제한 설정
  - [ ] 좌측 패널 최소 너비: 40% (또는 300px)
  - [ ] 좌측 패널 최대 너비: 80% (또는 적절한 값)
  - [ ] 우측 패널 최소 너비: 20% (또는 200px)
- [ ] 모바일에서 드래그 기능 비활성화
  - [ ] 화면 너비 768px 미만에서는 리사이저 숨김 또는 비활성화

---

## Phase 3: API 연동 (예상 공수: 1.5일)

### 3.1 API 클라이언트 작성 (0.5일)
- [ ] `api.js` 모듈 생성
- [ ] Piston API 기본 호출 함수 작성
  - [ ] `fetch` 함수 기반 단일 요청 구현
    - [ ] Base URL: `https://emkc.org/api/v2/piston/execute`
    - [ ] POST 요청, Content-Type: `application/json`
    - [ ] 요청 body 구성 (language, version, files, stdin)
  - [ ] 요청/응답 에러 처리
    - [ ] `try-catch` 블록으로 네트워크 에러 처리
    - [ ] HTTP 상태 코드 확인 (200 외에는 에러 처리)
    - [ ] JSON 파싱 에러 처리
- [ ] 언어별 설정 상수 정의 (Python, C++)
  - [ ] Python: `{ language: "python", version: "*" }`
  - [ ] C++: `{ language: "cpp", version: "*" }`

### 3.2 병렬 실행 구현 (0.7일)
- [ ] `Promise.allSettled`를 사용한 다중 테스트 케이스 일괄 요청 로직
  - [ ] 활성화된 모든 테스트 케이스에 대해 API 요청 Promise 배열 생성
  - [ ] `Promise.allSettled()`로 모든 요청 병렬 실행
- [ ] 각 테스트 케이스별 독립적인 API 요청 생성
  - [ ] 현재 에디터 코드 가져오기
  - [ ] 각 케이스의 `input` 값을 `stdin`으로 설정
  - [ ] 선택된 언어에 맞는 API 파라미터 설정
- [ ] 요청 실패 시에도 나머지 결과 처리 보장
  - [ ] `allSettled` 결과 배열 순회
  - [ ] `status === 'fulfilled'`인 경우 성공 결과 처리
  - [ ] `status === 'rejected'`인 경우 에러 결과 처리
- [ ] 결과 배열 정렬 및 인덱스 매핑
  - [ ] 원본 테스트 케이스 인덱스와 결과 매핑
  - [ ] 결과 객체에 케이스 번호 포함
  - [ ] 결과를 케이스 순서대로 정렬

### 3.3 로딩 처리 (0.3일)
- [ ] 실행 중 `[Run All]` 버튼 비활성화
- [ ] 버튼 텍스트를 "Running..."으로 변경
- [ ] 로딩 스피너(Spinner) UI 표시
- [ ] 실행 완료 시 버튼 상태 복원

---

## Phase 4: 검증 및 결과 표시 (예상 공수: 1.5일)

### 4.1 에러 감지 로직 (0.3일)
- [ ] API 응답 중 `stderr` 존재 여부 확인
- [ ] Exit Code(`code`) 확인 로직
- [ ] 런타임 에러 판별 함수 구현
- [ ] 네트워크 에러 처리

### 4.2 정답 비교 로직 (0.4일)
- [ ] `stdout` vs `Expected Output` 문자열 정규화
  - [ ] 앞뒤 공백 제거 (`trim`)
  - [ ] 줄바꿈 정규화
- [ ] 문자열 비교 함수 구현
- [ ] Pass/Fail 판별 로직

### 4.3 결과 UI 렌더링 (0.8일)
- [ ] 종합 요약 카드 생성
  - [ ] Bootstrap Card 컴포넌트 사용
  - [ ] Total, Pass, Fail, Error 카운트 계산 및 표시
  - [ ] 각 카운트에 Bootstrap Badge 스타일 적용
- [ ] 개별 결과 아코디언 생성
  - [ ] Bootstrap Accordion 컴포넌트 사용
  - [ ] 각 테스트 케이스별 아코디언 아이템 동적 생성
  - [ ] Pass: 초록색 배지(`badge bg-success`) 및 실행 시간 표시
    - [ ] API 응답의 실행 시간 정보 표시 (있는 경우)
  - [ ] Fail: 주황색 배지(`badge bg-warning`) 및 Diff View 표시
    - [ ] Bootstrap Grid로 좌우 분할 (내 출력 / 예상 출력)
    - [ ] 각 출력 영역을 `<pre>` 태그로 표시
    - [ ] 차이점 강조를 위한 스타일링 (선택사항)
  - [ ] Error: 붉은색 배지(`badge bg-danger`) 및 `stderr` 원문 메시지 출력
    - [ ] `stderr` 텍스트를 `<pre>` 태그로 표시
    - [ ] 빨간색 텍스트 스타일 적용
- [ ] 결과 영역 스크롤 처리
  - [ ] 결과 콘솔 영역에 `max-height` 및 `overflow-y: auto` 설정
  - [ ] 결과 추가 시 자동 스크롤 (선택사항)

---

## Phase 5: 배포 및 공유 (예상 공수: 1.0일)

### 5.1 상태 압축/해제 (0.4일)
- [ ] 상태 직렬화 함수 작성
  - [ ] 상태 객체 구조 정의
    - [ ] `code`: 에디터 소스 코드
    - [ ] `language`: 선택된 언어 (C++ 또는 Python)
    - [ ] `testCases`: 테스트 케이스 배열 (input, expectedOutput)
  - [ ] `JSON.stringify()`로 JSON 문자열 변환
- [ ] `lz-string`을 이용한 압축 함수
  - [ ] `LZString.compressToEncodedURIComponent()` 사용
  - [ ] 압축된 문자열 반환
- [ ] 압축 해제 및 복원 함수
  - [ ] `LZString.decompressFromEncodedURIComponent()` 사용
  - [ ] JSON 파싱 (`JSON.parse()`)
  - [ ] 파싱 에러 처리 (try-catch)
- [ ] 한글 등 특수문자 인코딩 처리
  - [ ] `lz-string`이 자동으로 처리하지만, 테스트로 한글 데이터 검증

### 5.2 URL 해시 처리 (0.4일)
- [ ] 공유 버튼 클릭 이벤트 핸들러
  - [ ] 현재 상태 수집 (에디터 코드, 언어, 테스트 케이스)
  - [ ] 상태 압축 함수 호출
  - [ ] URL Hash(`/#data=...`) 업데이트
    - [ ] `window.location.hash = '#data=' + compressedData`
    - [ ] `history.replaceState()` 사용 (페이지 리로드 방지)
  - [ ] 클립보드 복사 기능
    - [ ] `navigator.clipboard.writeText()` 사용
    - [ ] 전체 URL (`window.location.href`) 복사
    - [ ] 클립보드 API 미지원 시 fallback (선택 텍스트)
  - [ ] 사용자 피드백 (alert 또는 toast)
    - [ ] Bootstrap Toast 또는 `alert()` 사용
    - [ ] "Link copied to clipboard!" 메시지 표시
- [ ] 페이지 로드 시 Hash 파싱 로직
  - [ ] `window.location.hash` 확인
    - [ ] `hash.startsWith('#data=')` 체크
  - [ ] 데이터 추출 및 디코딩
    - [ ] Hash에서 `data=` 이후 부분 추출
    - [ ] 압축 해제 함수 호출
  - [ ] 상태 복원 및 UI 업데이트
    - [ ] 에디터 내용 설정 (`editor.setValue()`)
    - [ ] 언어 선택 드롭다운 업데이트
    - [ ] 테스트 케이스 탭 자동 복구
      - [ ] 기존 탭 제거 후 새로 생성
      - [ ] 각 탭의 입력값 복원
      - [ ] 첫 번째 탭 활성화

### 5.3 최종 테스트 (0.2일)
- [ ] 주요 기능 테스트 케이스 점검
  - [ ] 코드 편집 및 언어 변경
  - [ ] 테스트 케이스 추가/삭제/전환
  - [ ] 코드 실행 및 채점
  - [ ] 공유 URL 생성 및 복원
- [ ] 반응형 레이아웃 테스트 (데스크톱/모바일)
- [ ] 브라우저 호환성 테스트 (Chrome, Edge, Safari, Firefox)
- [ ] 버그 수정 및 최적화

---

## 📊 진행 상황

- **총 예상 공수**: 약 6.5일
- **완료된 작업**: 0 / 15
- **진행 중인 작업**: 0
- **남은 작업**: 15

---

## 📝 참고 사항

1. **순차적 진행**: ID 순서대로 진행하는 것을 권장합니다.
2. **MVP 우선**: 4.3(결과 UI)에서 'Diff View'가 구현하기 까다롭다면, 우선 단순 텍스트 나열로 1차 완료 후 고도화하세요.
3. **난이도 높은 작업**:
   - 2.3(탭 로직): 상태 관리 및 동기화가 복잡
   - 3.2(병렬 실행): Promise 처리 및 에러 핸들링 중요
4. **코드 컨벤션**: 모든 코드는 [코드 컨벤션](./docs/6_코드%20컨벤션.md)을 준수해야 합니다.

