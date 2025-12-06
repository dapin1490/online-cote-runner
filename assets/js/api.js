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
 *
 * @param {string} language - 실행할 언어 ('python' 또는 'cpp')
 * @param {string} code - 실행할 소스 코드
 * @param {string} stdin - 표준 입력 데이터 (선택사항)
 * @returns {Promise<Object>} API 응답 객체
 * @throws {Error} 네트워크 에러 또는 API 에러 발생 시
 */
export async function executeCode(language, code, stdin = '') {
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

    try {
        // API 호출
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

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
        // 기타 에러는 그대로 전달
        throw error;
    }
}

