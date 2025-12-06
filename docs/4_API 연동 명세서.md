# API 연동 명세서 (API Interface Specification)

## 1. 개요 (Overview)

- Target API: Piston Code Execution Engine (v2)
- Base URL: `https://emkc.org/api/v2/piston`
- Protocol: HTTPS / JSON
- Auth: None (Public API)

## 2. 런타임 정보 조회 (Get Runtimes)

앱 초기화 시 지원하는 언어의 정확한 버전 정보를 확인하거나, 하드코딩된 버전을 사용할지 결정하기 위해 참조합니다.

- Endpoint: `GET /runtimes`
- Description: 지원되는 모든 언어와 버전 목록을 반환합니다.
- Usage: 본 프로젝트에서는 C++과 Python의 `language` 및 `version` 값을 확인하는 용도로만 개발 단계에서 참조합니다. (실제 앱에서는 하드코딩 권장)

## 3. 코드 실행 (Execute Code)

핵심 기능인 코드 실행을 담당하는 엔드포인트입니다.

- Endpoint: `POST /execute`
- Content-Type: `application/json`

### 3.1 요청 (Request Body)

| 필드명 | 타입 | 필수 | 설명 | 예시 값 |
| --- | --- | --- | --- | --- |
| `language` | String | Y | 실행할 언어의 alias | `"python"`, `"c++"` |
| `version` | String | Y | 언어 버전 (와일드카드 권장) | `"*"` (최신 버전 사용) |
| `files` | Array | Y | 소스 코드 파일 배열 | `[{ "content": "print(1)" }]` |
| `stdin` | String | N | 표준 입력 데이터 (테스트 케이스 입력값) | `"10 20"` |
| `args` | Array | N | 컴파일/실행 시 추가 인자 (C++ 버전에 따라 필요할 수 있음) | `[]` |

### 3.2 응답 (Response Body)

API는 `run` 객체 안에 실행 결과를 담아 반환합니다.

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| `run` | Object | 실행 결과 메타데이터 |
| `run.stdout` | String | 표준 출력 결과 (정답 비교 대상) |
| `run.stderr` | String | 표준 에러 결과 (런타임 에러 감지용) |
| `run.code` | Integer | 종료 코드 (0: 정상, 그 외: 에러) |
| `run.output` | String | stdout과 stderr가 합쳐진 문자열 (단순 표시용) |

### 3.3 예시 (Example)

Request (Python Case):

```json
{
    "language": "python",
    "version": "*",
    "files": [
        {
            "content": "a = int(input())\nprint(a * 2)"
        }
    ],
    "stdin": "10"
}
```

Response (Success):

```json
{
    "language": "python",
    "version": "3.10.0",
    "run": {
        "stdout": "20\n",
        "stderr": "",
        "code": 0,
        "signal": null,
        "output": "20\n"
    }
}
```

Response (Runtime Error):

```json
{
    "language": "python",
    "version": "3.10.0",
    "run": {
        "stdout": "",
        "stderr": "Traceback (most recent call last):\n  File \"run\", line 1, in <module>\nValueError: invalid literal for int()...",
        "code": 1,
        "signal": null,
        "output": "Traceback..."
    }
}
```

## 4. 프론트엔드 처리 로직 (Implementation Guide)

### 4.1 언어별 설정 (Configuration)

요청 시 보낼 `language` 파라미터는 아래 상수를 사용합니다.

- Python: `{ language: "python", version: "*" }`
- C++: `{ language: "cpp", version: "*" }` (또는 `c++`)

### 4.2 병렬 처리 (Parallel Execution)

- 사용자가 N개의 테스트 케이스를 입력한 경우, `POST /execute` 요청을 N번 생성합니다.
- `Promise.allSettled()`를 사용하여 모든 요청을 병렬 전송합니다.

### 4.3 결과 판별 순서 (Verification Logic)

응답 받은 `result` 객체를 다음 순서로 검사합니다.

1. System Error: `fetch` 자체가 실패(Network Error)했거나 `Promise`가 `rejected` 상태인 경우 → "네트워크 오류" 표시.
2. Runtime Error: `run.code !== 0` 또는 `run.stderr.length > 0`인 경우 → "에러(Error)" 판정 및 `stderr` 출력.
3. Output Check: 위 에러가 없을 경우, `run.stdout.trim()`과 사용자 예상 출력의 `.trim()`을 비교.
    - 일치: "정답(Pass)"
    - 불일치: "오답(Fail)" 및 Diff 표시.