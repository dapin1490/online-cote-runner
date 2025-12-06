/**
 * Piston API 클라이언트 모듈
 *
 * 코드 실행을 위한 Piston API 호출 함수들을 제공합니다.
 */

// API Base URL
const API_BASE_URL = 'https://emkc.org/api/v2/piston/execute';

// 언어별 설정 상수
export const LANGUAGE_CONFIG = {
    python: {
        language: 'python',
        version: '*'
    },
    cpp: {
        language: 'cpp',
        version: '*'
    }
};

/**
 * Piston API를 호출하여 코드를 실행합니다.
 * HTTP 429 오류 발생 시 자동으로 재시도합니다.
 *
 * @param {string} language - 실행할 언어 ('python' 또는 'cpp')
 * @param {string} code - 실행할 소스 코드
 * @param {string} stdin - 표준 입력 데이터 (선택사항)
 * @param {number} maxRetries - 최대 재시도 횟수 (기본값: 3)
 * @returns {Promise<Object>} API 응답 객체
 * @throws {Error} 네트워크 에러 또는 API 에러 발생 시
 */
export async function executeCode(language, code, stdin = '', maxRetries = 3) {
    // 언어 설정 가져오기
    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
        throw new Error(`지원하지 않는 언어입니다: ${language}`);
    }

    // 요청 body 구성
    const requestBody = {
        language: langConfig.language,
        version: langConfig.version,
        files: [
            {
                content: code
            }
        ],
        stdin: stdin
    };

    // 재시도 로직
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // API 호출
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            // HTTP 429 (요청 한도 초과) 오류 처리
            if (response.status === 429) {
                // 마지막 시도가 아니면 재시도
                if (attempt < maxRetries - 1) {
                    // Retry-After 헤더 확인 (초 단위)
                    const retryAfter = response.headers.get('Retry-After');
                    let waitTime = 2000; // 기본 대기 시간: 2초

                    if (retryAfter) {
                        // Retry-After 헤더가 있으면 해당 시간 사용 (초를 밀리초로 변환)
                        waitTime = parseInt(retryAfter) * 1000;
                    } else {
                        // Exponential backoff: 1초, 2초, 4초
                        waitTime = Math.pow(2, attempt) * 1000;
                    }

                    // 일정 시간 대기 후 재요청
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue; // 재시도
                } else {
                    // 최대 재시도 횟수 초과
                    throw new Error(`API 요청 한도 초과: HTTP 429 (${maxRetries}회 재시도 실패)`);
                }
            }

            // HTTP 상태 코드 확인
            if (!response.ok) {
                throw new Error(`API 요청 실패: HTTP ${response.status}`);
            }

            // JSON 파싱
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('응답 데이터 파싱에 실패했습니다.');
            }

            return data;
        } catch (error) {
            // 네트워크 에러 처리
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('네트워크 오류가 발생했습니다.');
            }

            // 마지막 시도이거나 HTTP 429가 아닌 경우 에러를 그대로 전달
            if (attempt === maxRetries - 1 || !error.message.includes('HTTP 429')) {
                throw error;
            }

            // HTTP 429 오류이고 재시도 가능한 경우, 위의 재시도 로직으로 처리
            // (이 부분은 실제로는 response.status === 429에서 처리되므로 여기서는 거의 실행되지 않음)
        }
    }
}

