/**
 * CodeMirror 에디터 인스턴스 생성 및 초기화
 */

import { EditorView, lineNumbers, keymap, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { foldGutter, foldKeymap, syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput } from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { executeCode, LANGUAGE_CONFIG } from './api.js';

/**
 * 언어별 Hello World 템플릿 코드
 */
const templates = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    python: `print("Hello, World!")`
};

/**
 * 테스트 케이스 상태 관리용 전역 변수
 * Array of Objects 구조: 각 케이스는 { input, expectedOutput } 형태
 */
let testCases = [
    {
        input: '',           // 표준 입력 (Stdin)
        expectedOutput: ''  // 예상 출력
    }
];

/**
 * 현재 선택된 언어 상태 관리
 */
let currentLanguage = 'cpp';

/**
 * 최대 테스트 케이스 개수
 */
const MAX_TEST_CASES = 6;

/**
 * 언어 모드에 따른 extension을 반환합니다.
 * @param {string} language - 언어 코드 ('cpp' 또는 'python')
 * @returns {Extension} - 언어 모드 extension
 */
function getLanguageExtension(language) {
    return language === 'python' ? python() : cpp();
}

/**
 * CodeMirror 에디터 인스턴스를 생성하고 초기화합니다.
 * @param {HTMLElement} container - 에디터를 마운트할 DOM 요소
 * @param {string} initialLanguage - 초기 언어 ('cpp' 또는 'python')
 * @returns {EditorView} - 생성된 에디터 뷰 인스턴스
 */
function createEditor(container, initialLanguage = 'cpp') {
    const startState = EditorState.create({
        doc: templates[initialLanguage] || templates.cpp,
        extensions: [
            lineNumbers(), // 줄 번호 표시
            highlightActiveLineGutter(), // 활성 줄 번호 강조
            highlightSpecialChars(), // 특수 문자 강조
            history(), // 실행 취소/다시 실행
            foldGutter(), // 코드 접기
            drawSelection(), // 선택 영역 그리기
            dropCursor(), // 드롭 커서
            EditorState.allowMultipleSelections.of(true), // 다중 선택 허용
            indentOnInput(), // 자동 들여쓰기
            bracketMatching(), // 괄호 매칭
            closeBrackets(), // 괄호 자동 닫기
            autocompletion(), // 자동 완성
            rectangularSelection(), // 사각형 선택
            crosshairCursor(), // 십자선 커서
            highlightActiveLine(), // 활성 줄 강조
            highlightSelectionMatches(), // 선택 일치 강조
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
            ]),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }), // 구문 강조
            getLanguageExtension(initialLanguage), // 언어 모드 및 구문 강조
            oneDark, // Dark Mode 테마
        ],
    });

    const editor = new EditorView({
        state: startState,
        parent: container,
    });

    return editor;
}

/**
 * 에디터의 언어 모드를 변경하고 템플릿을 로드합니다.
 * @param {EditorView} editor - CodeMirror 에디터 인스턴스
 * @param {string} language - 변경할 언어 코드 ('cpp' 또는 'python')
 */
function changeLanguage(editor, language) {
    const newState = EditorState.create({
        doc: templates[language] || templates.cpp,
        extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            foldGutter(),
            drawSelection(),
            dropCursor(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            crosshairCursor(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            keymap.of([
                ...closeBracketsKeymap,
                ...defaultKeymap,
                ...searchKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...completionKeymap,
            ]),
            syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
            getLanguageExtension(language),
            oneDark,
        ],
    });

    editor.setState(newState);
}

/**
 * 새 테스트 케이스 탭을 추가합니다.
 */
function addTestCase() {
    // 최대 개수 제한 확인
    if (testCases.length >= MAX_TEST_CASES) {
        alert(`최대 ${MAX_TEST_CASES}개의 테스트 케이스만 추가할 수 있습니다.`);
        return;
    }

    const newIndex = testCases.length; // 새 탭 인덱스 (0부터 시작)
    const caseNumber = newIndex + 1; // 표시용 케이스 번호 (1부터 시작)
    const tabId = `case-${caseNumber}-tab`;
    const contentId = `case-${caseNumber}`;

    // 테스트 케이스 배열에 빈 객체 추가
    testCases.push({
        input: '',
        expectedOutput: ''
    });

    // 탭 리스트 요소 선택
    const tabsList = document.getElementById('test-case-tabs');
    const addButton = document.getElementById('add-tab-btn');
    
    if (!addButton) {
        console.error('add-tab-btn을 찾을 수 없습니다.');
        return;
    }
    
    const addButtonLi = addButton.parentElement;
    
    if (!addButtonLi) {
        console.error('add-tab-btn의 parentElement를 찾을 수 없습니다.');
        return;
    }

    // 새 탭 버튼 생성
    const newTabLi = document.createElement('li');
    newTabLi.className = 'nav-item';
    newTabLi.setAttribute('role', 'presentation');
    newTabLi.innerHTML = `
        <button class="nav-link" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${contentId}" type="button" role="tab">
            Case ${caseNumber}
            <span class="ms-2 remove-tab-btn" data-case-index="${newIndex}" style="cursor: pointer; opacity: 0.7;" title="탭 삭제">×</span>
        </button>
    `;

    // + 버튼 앞에 새 탭 삽입
    tabsList.insertBefore(newTabLi, addButtonLi);

    // 탭 콘텐츠 영역 선택
    const tabContent = document.getElementById('test-case-content');

    // 새 탭 콘텐츠 생성
    const newTabPane = document.createElement('div');
    newTabPane.className = 'tab-pane fade';
    newTabPane.id = contentId;
    newTabPane.setAttribute('role', 'tabpanel');
    newTabPane.innerHTML = `
        <div class="p-3">
            <label for="stdin-input-${caseNumber}" class="form-label">Standard Input (Stdin)</label>
            <textarea class="form-control stdin-input" id="stdin-input-${caseNumber}" rows="5" placeholder="입력값을 넣으세요" data-case-index="${newIndex}"></textarea>

            <label for="expected-output-${caseNumber}" class="form-label mt-3">Expected Output</label>
            <textarea class="form-control expected-output" id="expected-output-${caseNumber}" rows="5" placeholder="정답 기대값을 넣으세요" data-case-index="${newIndex}"></textarea>
        </div>
    `;

    // 탭 콘텐츠에 추가
    tabContent.appendChild(newTabPane);

    // 새 탭의 입력창에 자동 저장 이벤트 리스너 등록
    const newStdinInput = newTabPane.querySelector('.stdin-input');
    const newExpectedOutput = newTabPane.querySelector('.expected-output');

    if (newStdinInput) {
        newStdinInput.addEventListener('input', () => {
            testCases[newIndex].input = newStdinInput.value;
        });
    }

    if (newExpectedOutput) {
        newExpectedOutput.addEventListener('input', () => {
            testCases[newIndex].expectedOutput = newExpectedOutput.value;
        });
    }

    // 새 탭 활성화
    const newTabButton = document.getElementById(tabId);
    const newTab = new bootstrap.Tab(newTabButton);
    newTab.show();

    // + 버튼 상태 업데이트 (6개일 때 비활성화)
    if (testCases.length >= MAX_TEST_CASES) {
        addButton.disabled = true;
        addButton.classList.add('disabled');
    }

    // 새 탭의 x 버튼에 이벤트 리스너 등록
    const newRemoveBtn = newTabLi.querySelector('.remove-tab-btn');
    if (newRemoveBtn) {
        newRemoveBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 탭 클릭 이벤트 방지
            removeTestCase(parseInt(newRemoveBtn.getAttribute('data-case-index')));
        });
    }

    // 모든 탭의 x 버튼 표시 상태 업데이트 (1개일 때는 숨김)
    updateRemoveButtonsVisibility();
}

/**
 * 테스트 케이스 탭을 삭제합니다.
 * @param {number} caseIndex - 삭제할 케이스의 인덱스 (0부터 시작)
 */
function removeTestCase(caseIndex) {
    // 최소 1개 유지 로직
    if (testCases.length <= 1) {
        alert('최소 1개의 테스트 케이스는 유지해야 합니다.');
        return;
    }

    // 삭제할 탭 요소 선택
    const tabId = `case-${caseIndex + 1}-tab`;
    const contentId = `case-${caseIndex + 1}`;
    const tabButton = document.getElementById(tabId);
    const tabPane = document.getElementById(contentId);

    if (!tabButton || !tabPane) {
        console.error(`탭을 찾을 수 없습니다: ${tabId}`);
        return;
    }

    // 삭제 전 활성 탭 확인
    const isActiveTab = tabButton.classList.contains('active');
    let targetTabIndex = -1;

    // 삭제 후 활성화할 탭 결정 (인접 탭)
    if (isActiveTab) {
        if (caseIndex > 0) {
            // 이전 탭 활성화
            targetTabIndex = caseIndex - 1;
        } else {
            // 다음 탭 활성화
            targetTabIndex = caseIndex + 1;
        }
    }

    // 테스트 케이스 배열에서 해당 인덱스 데이터 제거
    testCases.splice(caseIndex, 1);

    // 탭 버튼과 콘텐츠 제거
    tabButton.parentElement.remove();
    tabPane.remove();

    // 모든 탭의 번호와 인덱스 재설정
    reindexTabs();

    // + 버튼 상태 업데이트 (6개 미만일 때 활성화)
    const addButton = document.getElementById('add-tab-btn');
    if (addButton && testCases.length < MAX_TEST_CASES) {
        addButton.disabled = false;
        addButton.classList.remove('disabled');
    }

    // 삭제된 탭이 활성 탭이었다면 인접 탭 활성화
    if (isActiveTab && targetTabIndex >= 0 && targetTabIndex < testCases.length) {
        const targetTabId = `case-${targetTabIndex + 1}-tab`;
        const targetTabButton = document.getElementById(targetTabId);
        if (targetTabButton) {
            const targetTab = new bootstrap.Tab(targetTabButton);
            targetTab.show();
        }
    }

    // 모든 탭의 x 버튼 표시 상태 업데이트 (1개일 때는 숨김)
    updateRemoveButtonsVisibility();
}

/**
 * 모든 탭의 번호와 인덱스를 재설정합니다.
 */
function reindexTabs() {
    const tabsList = document.getElementById('test-case-tabs');
    const tabItems = tabsList.querySelectorAll('.nav-item:not(:last-child)'); // + 버튼 제외

    tabItems.forEach((tabItem, index) => {
        const caseNumber = index + 1;
        const tabButton = tabItem.querySelector('button[role="tab"]');
        const removeBtn = tabItem.querySelector('.remove-tab-btn');
        const tabId = `case-${caseNumber}-tab`;
        const contentId = `case-${caseNumber}`;

        // 탭 버튼 업데이트
        if (tabButton) {
            tabButton.id = tabId;
            tabButton.setAttribute('data-bs-target', `#${contentId}`);
            tabButton.innerHTML = `Case ${caseNumber}`;
            if (removeBtn) {
                tabButton.innerHTML += ` <span class="ms-2 remove-tab-btn" data-case-index="${index}" style="cursor: pointer; opacity: 0.7;" title="탭 삭제">×</span>`;
            }
        }

        // x 버튼 업데이트
        if (removeBtn) {
            removeBtn.setAttribute('data-case-index', index);
            // 이벤트 리스너 재등록
            removeBtn.replaceWith(removeBtn.cloneNode(true));
            const newRemoveBtn = tabItem.querySelector('.remove-tab-btn');
            newRemoveBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeTestCase(parseInt(newRemoveBtn.getAttribute('data-case-index')));
            });
        }

        // 탭 콘텐츠 업데이트
        const tabContent = document.getElementById('test-case-content');
        const tabPanes = tabContent.querySelectorAll('.tab-pane');
        if (tabPanes[index]) {
            const tabPane = tabPanes[index];
            tabPane.id = contentId;
            const stdinInput = tabPane.querySelector('.stdin-input');
            const expectedOutput = tabPane.querySelector('.expected-output');
            if (stdinInput) {
                const oldStdinId = stdinInput.id;
                stdinInput.id = `stdin-input-${caseNumber}`;
                stdinInput.setAttribute('data-case-index', index);
                const stdinLabel = tabPane.querySelector(`label[for="${oldStdinId}"]`);
                if (stdinLabel) {
                    stdinLabel.setAttribute('for', `stdin-input-${caseNumber}`);
                }
                // 이벤트 리스너 재등록
                stdinInput.replaceWith(stdinInput.cloneNode(true));
                const newStdinInput = tabPane.querySelector('.stdin-input');
                newStdinInput.addEventListener('input', () => {
                    testCases[index].input = newStdinInput.value;
                });
            }
            if (expectedOutput) {
                const oldOutputId = expectedOutput.id;
                expectedOutput.id = `expected-output-${caseNumber}`;
                expectedOutput.setAttribute('data-case-index', index);
                const outputLabel = tabPane.querySelector(`label[for="${oldOutputId}"]`);
                if (outputLabel) {
                    outputLabel.setAttribute('for', `expected-output-${caseNumber}`);
                }
                // 이벤트 리스너 재등록
                expectedOutput.replaceWith(expectedOutput.cloneNode(true));
                const newExpectedOutput = tabPane.querySelector('.expected-output');
                newExpectedOutput.addEventListener('input', () => {
                    testCases[index].expectedOutput = newExpectedOutput.value;
                });
            }
        }
    });

    // 모든 탭의 x 버튼 표시 상태 업데이트
    updateRemoveButtonsVisibility();
}

/**
 * 모든 탭의 x 버튼 표시 상태를 업데이트합니다.
 * (1개일 때는 숨김, 2개 이상일 때는 표시)
 */
function updateRemoveButtonsVisibility() {
    const removeButtons = document.querySelectorAll('.remove-tab-btn');
    removeButtons.forEach(btn => {
        if (testCases.length <= 1) {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'inline';
        }
    });
}

/**
 * 활성 탭의 입력창에 데이터를 로드합니다.
 * @param {number} caseIndex - 로드할 케이스의 인덱스 (0부터 시작)
 */
function loadTestCaseData(caseIndex) {
    if (caseIndex < 0 || caseIndex >= testCases.length) {
        console.error(`유효하지 않은 케이스 인덱스: ${caseIndex}`);
        return;
    }

    const caseData = testCases[caseIndex];
    const caseNumber = caseIndex + 1;
    const stdinInput = document.getElementById(`stdin-input-${caseNumber}`);
    const expectedOutput = document.getElementById(`expected-output-${caseNumber}`);

    if (stdinInput) {
        stdinInput.value = caseData.input || '';
    }
    if (expectedOutput) {
        expectedOutput.value = caseData.expectedOutput || '';
    }
}

/**
 * 현재 활성 탭의 입력값을 testCases 배열에 저장합니다.
 * @param {number} caseIndex - 저장할 케이스의 인덱스 (0부터 시작)
 */
function saveTestCaseData(caseIndex) {
    if (caseIndex < 0 || caseIndex >= testCases.length) {
        console.error(`유효하지 않은 케이스 인덱스: ${caseIndex}`);
        return;
    }

    const caseNumber = caseIndex + 1;
    const stdinInput = document.getElementById(`stdin-input-${caseNumber}`);
    const expectedOutput = document.getElementById(`expected-output-${caseNumber}`);

    if (stdinInput) {
        testCases[caseIndex].input = stdinInput.value;
    }
    if (expectedOutput) {
        testCases[caseIndex].expectedOutput = expectedOutput.value;
    }
}

/**
 * 활성 탭의 인덱스를 반환합니다.
 * @returns {number} 활성 탭의 인덱스 (0부터 시작), 없으면 -1
 */
function getActiveTabIndex() {
    const activeTab = document.querySelector('#test-case-tabs .nav-link.active');
    if (!activeTab) {
        return -1;
    }

    const tabId = activeTab.id;
    const match = tabId.match(/case-(\d+)-tab/);
    if (match) {
        return parseInt(match[1]) - 1; // 케이스 번호를 인덱스로 변환
    }

    return -1;
}

// DOM이 로드된 후 에디터 초기화
document.addEventListener('DOMContentLoaded', () => {
    const editorContainer = document.getElementById('editor-container');
    const languageSelect = document.getElementById('language-select');

    if (editorContainer) {
        // 초기 언어는 드롭다운의 선택된 값 또는 기본값 'cpp'
        const initialLanguage = languageSelect?.value || 'cpp';
        window.editor = createEditor(editorContainer, initialLanguage);
    }

    // 언어 선택 드롭다운 변경 이벤트 핸들러
    if (languageSelect && window.editor) {
        // 초기 언어 설정
        currentLanguage = languageSelect.value || 'cpp';

        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            currentLanguage = selectedLanguage; // 현재 언어 상태 업데이트
            changeLanguage(window.editor, selectedLanguage);
        });
    }

    // + 버튼 클릭 이벤트 리스너 등록
    const addTabButton = document.getElementById('add-tab-btn');
    if (addTabButton) {
        addTabButton.addEventListener('click', () => {
            addTestCase();
        });
    }

    // 첫 번째 탭의 x 버튼 이벤트 리스너 등록
    const firstRemoveBtn = document.querySelector('.remove-tab-btn[data-case-index="0"]');
    if (firstRemoveBtn) {
        firstRemoveBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 탭 클릭 이벤트 방지
            removeTestCase(0);
        });
    }

    // Run All 버튼 클릭 이벤트 리스너 등록
    const runAllButton = document.getElementById('run-all-btn');
    if (runAllButton) {
        runAllButton.addEventListener('click', async () => {
            // 로딩 상태 시작
            runAllButton.disabled = true;
            runAllButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Running...';

            try {
                // 테스트 케이스 순차 실행 (실시간 결과 표시)
                const results = await runAllTestCasesSequential();

                // 최종 결과 렌더링 (모든 케이스 완료)
                renderResults(results, -1);
            } catch (error) {
                console.error('실행 중 오류:', error);
                const resultConsole = document.getElementById('result-console');
                if (resultConsole) {
                    resultConsole.innerHTML = `<p class="text-danger">오류 발생: ${error.message}</p>`;
                }
            } finally {
                // 로딩 상태 종료
                runAllButton.disabled = false;
                runAllButton.textContent = 'Run All';
            }
        });
    }

    // 공유 버튼 클릭 이벤트 핸들러
    const shareButton = document.getElementById('share-btn');
    if (shareButton) {
        shareButton.addEventListener('click', async () => {
            try {
                // 에디터 초기화 확인
                if (!window.editor) {
                    throw new Error('에디터가 초기화되지 않았습니다.');
                }

                // LZString 라이브러리 확인
                if (typeof LZString === 'undefined') {
                    throw new Error('lz-string 라이브러리가 로드되지 않았습니다.');
                }

                // 현재 상태 수집 (에디터 코드, 언어, 테스트 케이스)
                const jsonString = serializeState();
                if (!jsonString) {
                    throw new Error('상태 직렬화에 실패했습니다.');
                }

                // 상태 압축 함수 호출
                const compressedData = compressState(jsonString);
                if (!compressedData) {
                    throw new Error('상태 압축에 실패했습니다.');
                }

                // URL Hash(`/#data=...`) 업데이트
                const newHash = '#data=' + compressedData;
                
                // history.replaceState 사용 (실패 시 window.location.hash만 사용)
                try {
                    if (window.history && typeof window.history.replaceState === 'function') {
                        window.history.replaceState(null, '', window.location.pathname + window.location.search + newHash);
                    } else {
                        // fallback: hash만 설정
                        window.location.hash = newHash;
                    }
                } catch (historyError) {
                    // history API 실패 시 hash만 설정
                    console.warn('history.replaceState 실패, hash만 설정:', historyError);
                    window.location.hash = newHash;
                }

                // 클립보드 복사 기능
                const fullUrl = window.location.href;
                try {
                    // navigator.clipboard.writeText() 사용
                    await navigator.clipboard.writeText(fullUrl);

                    // 사용자 피드백 (Bootstrap Toast 사용)
                    showToast('링크가 클립보드에 복사되었습니다!', 'success');
                } catch (clipboardError) {
                    // 클립보드 API 미지원 시 fallback
                    console.warn('클립보드 API 사용 불가, 대체 방법 사용');

                    // 텍스트 선택 방식으로 대체
                    const textArea = document.createElement('textarea');
                    textArea.value = fullUrl;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();

                    try {
                        document.execCommand('copy');
                        showToast('링크가 클립보드에 복사되었습니다!', 'success');
                    } catch (execError) {
                        showToast('링크 복사에 실패했습니다. URL을 수동으로 복사해주세요.', 'warning');
                    }

                    document.body.removeChild(textArea);
                }
            } catch (error) {
                console.error('공유 기능 오류:', error);
                console.error('에러 상세:', {
                    editor: !!window.editor,
                    LZString: typeof LZString,
                    errorMessage: error.message,
                    errorStack: error.stack
                });
                showToast(`공유 링크 생성에 실패했습니다: ${error.message}`, 'danger');
            }
        });
    }

    // 초기 x 버튼 표시 상태 업데이트
    updateRemoveButtonsVisibility();

    // 페이지 로드 시 Hash 파싱 로직
    restoreStateFromHash();

    // Bootstrap Tab 이벤트 리스너 등록 (탭 전환 시)
    const tabsList = document.getElementById('test-case-tabs');
    if (tabsList) {
        tabsList.addEventListener('shown.bs.tab', (e) => {
            // 이전 탭의 데이터 저장
            const previousTabId = e.relatedTarget?.id;
            if (previousTabId) {
                const prevMatch = previousTabId.match(/case-(\d+)-tab/);
                if (prevMatch) {
                    const prevIndex = parseInt(prevMatch[1]) - 1;
                    saveTestCaseData(prevIndex);
                }
            }

            // 새로 활성화된 탭의 데이터 로드
            const newTabId = e.target.id;
            if (newTabId && newTabId !== 'add-tab-btn') {
                const match = newTabId.match(/case-(\d+)-tab/);
                if (match) {
                    const newIndex = parseInt(match[1]) - 1;
                    loadTestCaseData(newIndex);
                }
            }
        });
    }

    // 입력창 자동 저장 이벤트 리스너 등록
    const tabContent = document.getElementById('test-case-content');
    if (tabContent) {
        // 기존 입력창에 이벤트 리스너 등록
        const stdinInputs = tabContent.querySelectorAll('.stdin-input');
        const expectedOutputs = tabContent.querySelectorAll('.expected-output');

        stdinInputs.forEach(input => {
            input.addEventListener('input', () => {
                const caseIndex = parseInt(input.getAttribute('data-case-index'));
                if (!isNaN(caseIndex)) {
                    testCases[caseIndex].input = input.value;
                }
            });
        });

        expectedOutputs.forEach(output => {
            output.addEventListener('input', () => {
                const caseIndex = parseInt(output.getAttribute('data-case-index'));
                if (!isNaN(caseIndex)) {
                    testCases[caseIndex].expectedOutput = output.value;
                }
            });
        });
    }

    // 레이아웃 드래그 리사이저 초기화
    initResizer();
});

/**
 * 레이아웃 드래그 리사이저를 초기화합니다.
 */
function initResizer() {
    const resizer = document.getElementById('panel-resizer');
    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');

    if (!resizer || !leftPanel || !rightPanel) {
        return;
    }

    let isResizing = false;
    let startX = 0;
    let startLeftWidth = 0;

    // mousedown 이벤트 리스너 등록
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;

        // 현재 패널 너비 계산 (Bootstrap Grid를 무시하고 실제 너비 사용)
        const container = leftPanel.parentElement;
        const containerWidth = container.offsetWidth;
        startLeftWidth = (leftPanel.offsetWidth / containerWidth) * 100;

        // 전역 마우스 이벤트 리스너 등록
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // 텍스트 선택 방지
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    });

    /**
     * 마우스 이동 중 이벤트 핸들러
     */
    function handleMouseMove(e) {
        if (!isResizing) return;

        const container = leftPanel.parentElement;
        const containerWidth = container.offsetWidth;
        const deltaX = e.clientX - startX;
        const deltaPercent = (deltaX / containerWidth) * 100;

        // 새 너비 계산
        let newLeftWidth = startLeftWidth + deltaPercent;

        // 최소/최대 너비 제한 적용
        const minLeftWidth = 40; // 최소 40%
        const maxLeftWidth = 80; // 최대 80%
        newLeftWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftWidth));

        // 패널 너비 업데이트 (flex-basis 사용)
        leftPanel.style.flex = `0 0 ${newLeftWidth}%`;
        rightPanel.style.flex = `0 0 ${100 - newLeftWidth}%`;

        // width 속성 제거 (flex로 제어)
        leftPanel.style.width = '';
        rightPanel.style.width = '';
    }

    /**
     * 마우스 업 이벤트 핸들러
     */
    function handleMouseUp() {
        if (!isResizing) return;

        isResizing = false;

        // 전역 이벤트 리스너 제거
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        // 텍스트 선택 및 커서 복원
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }
}

/**
 * 모든 테스트 케이스를 병렬로 실행합니다.
 *
 * @returns {Promise<Array>} 각 테스트 케이스의 실행 결과 배열 (케이스 인덱스 순서대로 정렬됨)
 */
async function runAllTestCases() {
    // 현재 에디터 코드 가져오기
    const code = window.editor.state.doc.toString();
    const language = currentLanguage;

    // 활성화된 모든 테스트 케이스에 대해 API 요청 Promise 배열 생성
    const promises = testCases.map((testCase, index) => {
        return executeCode(language, code, testCase.input)
            .then(result => ({
                caseIndex: index,
                status: 'fulfilled',
                result: result
            }))
            .catch(error => ({
                caseIndex: index,
                status: 'rejected',
                error: error
            }));
    });

    // Promise.allSettled()로 모든 요청 병렬 실행
    const results = await Promise.allSettled(promises);

    // 결과 배열 정렬 및 인덱스 매핑
    return results.map((result, i) => {
        if (result.status === 'fulfilled') {
            // fulfilled인 경우 내부 value에서 실제 결과 추출
            return result.value;
        } else {
            // rejected인 경우 (Promise 자체가 실패한 경우는 거의 없지만)
            return {
                caseIndex: i,
                status: 'rejected',
                error: result.reason
            };
        }
    }).sort((a, b) => a.caseIndex - b.caseIndex); // 케이스 인덱스 순서대로 정렬
}

/**
 * 모든 테스트 케이스를 순차적으로 실행합니다.
 * API 요청 한도 문제를 해결하기 위해 순차 실행 방식 사용
 *
 * @returns {Promise<Array>} 각 테스트 케이스의 실행 결과 배열 (케이스 인덱스 순서대로 정렬됨)
 */
async function runAllTestCasesSequential() {
    // 현재 에디터 코드 가져오기
    const code = window.editor.state.doc.toString();
    const language = currentLanguage;
    const results = [];

    // 초기 UI 렌더링 (모든 케이스가 대기 중 상태로 표시)
    renderResults([], 0);

    // for 루프를 사용한 순차 실행
    for (let i = 0; i < testCases.length; i++) {
        // 진행 중인 케이스 표시
        renderResults(results, i);

        try {
            // 각 테스트 케이스를 하나씩 실행하고 결과를 수집
            const result = await executeCode(language, code, testCases[i].input);
            results.push({
                caseIndex: i,
                status: 'fulfilled',
                result: result
            });
        } catch (error) {
            // 에러 발생 시에도 결과 배열에 포함
            results.push({
                caseIndex: i,
                status: 'rejected',
                error: error
            });
        }

        // 각 케이스 실행 완료 시마다 UI 업데이트
        renderResults(results, i + 1 < testCases.length ? i + 1 : -1);
    }

    return results;
}

/**
 * API 실행 결과를 검증하고 에러를 감지합니다.
 *
 * @param {Object} resultItem - runAllTestCases()에서 반환된 결과 항목
 * @param {number} caseIndex - 테스트 케이스 인덱스
 * @param {string} expectedOutput - 예상 출력값
 * @returns {Object} 검증 결과 { type: 'network_error' | 'runtime_error' | 'pass' | 'fail', message?, stderr?, code?, stdout?, expectedOutput? }
 */
function verifyResult(resultItem, caseIndex, expectedOutput = '') {
    // 네트워크 에러 확인
    if (resultItem.status === 'rejected') {
        return {
            type: 'network_error',
            message: resultItem.error?.message || '네트워크 오류가 발생했습니다.',
            caseIndex: caseIndex
        };
    }

    // API 응답이 없는 경우
    if (!resultItem.result || !resultItem.result.run) {
        return {
            type: 'network_error',
            message: 'API 응답이 올바르지 않습니다.',
            caseIndex: caseIndex
        };
    }

    const run = resultItem.result.run;

    // Exit Code 확인
    if (run.code !== 0) {
        return {
            type: 'runtime_error',
            message: '프로그램이 비정상적으로 종료되었습니다.',
            stderr: run.stderr || '',
            code: run.code,
            caseIndex: caseIndex
        };
    }

    // stderr 존재 여부 확인
    if (run.stderr && run.stderr.trim().length > 0) {
        return {
            type: 'runtime_error',
            message: '런타임 에러가 발생했습니다.',
            stderr: run.stderr,
            code: run.code || 0,
            caseIndex: caseIndex
        };
    }

    // 정상 실행 - 정답 비교 수행
    const normalizedStdout = normalizeOutput(run.stdout || '');
    const normalizedExpected = normalizeOutput(expectedOutput);
    const isMatch = compareOutputs(normalizedStdout, normalizedExpected);

    if (isMatch) {
        return {
            type: 'pass',
            stdout: run.stdout || '',
            expectedOutput: expectedOutput,
            caseIndex: caseIndex
        };
    } else {
        return {
            type: 'fail',
            stdout: run.stdout || '',
            expectedOutput: expectedOutput,
            caseIndex: caseIndex
        };
    }
}

/**
 * 출력 문자열을 정규화합니다.
 * 앞뒤 공백을 제거하고 줄바꿈 문자를 통일합니다.
 *
 * @param {string} output - 원본 출력 문자열
 * @returns {string} 정규화된 문자열
 */
function normalizeOutput(output) {
    if (!output) return '';
    // 앞뒤 공백 제거
    let normalized = output.trim();
    // 줄바꿈 정규화 (\r\n, \r을 \n으로 변환)
    normalized = normalized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return normalized;
}

/**
 * 두 출력 문자열을 비교합니다.
 *
 * @param {string} stdout - 실제 출력 (정규화된)
 * @param {string} expectedOutput - 예상 출력 (정규화된)
 * @returns {boolean} 일치 여부
 */
function compareOutputs(stdout, expectedOutput) {
    return stdout === expectedOutput;
}

/**
 * 실행 결과를 UI에 렌더링합니다.
 * 실시간 업데이트를 지원하여 부분 결과 배열도 처리할 수 있습니다.
 *
 * @param {Array} results - runAllTestCases() 또는 runAllTestCasesSequential()에서 반환된 결과 배열
 * @param {number} currentIndex - 현재 실행 중인 케이스 인덱스 (선택사항, 실시간 업데이트용)
 */
function renderResults(results, currentIndex = -1) {
    const resultConsole = document.getElementById('result-console');
    if (!resultConsole) return;

    // 각 결과를 검증
    const verifiedResults = results.map((resultItem, index) => {
        const expectedOutput = testCases[index]?.expectedOutput || '';
        return verifyResult(resultItem, index, expectedOutput);
    });

    // 카운트 계산 (완료된 케이스만 카운트)
    const counts = {
        total: testCases.length,
        pass: verifiedResults.filter(r => r.type === 'pass').length,
        fail: verifiedResults.filter(r => r.type === 'fail').length,
        error: verifiedResults.filter(r => r.type === 'runtime_error' || r.type === 'network_error').length
    };

    // 종합 요약 카드 HTML 생성
    const summaryCard = `
        <div class="card mb-3">
            <div class="card-body">
                <h6 class="card-title mb-2">결과 요약</h6>
                <div class="d-flex flex-wrap gap-2">
                    <span class="badge bg-secondary">Total: ${counts.total}</span>
                    <span class="badge bg-success">Pass: ${counts.pass}</span>
                    <span class="badge bg-warning">Fail: ${counts.fail}</span>
                    <span class="badge bg-danger">Error: ${counts.error}</span>
                </div>
            </div>
        </div>
    `;

    // 개별 결과 아코디언 HTML 생성
    let accordionItems = '';

    // 모든 테스트 케이스에 대해 반복 (완료된 것 + 진행 중인 것 + 아직 시작하지 않은 것)
    for (let index = 0; index < testCases.length; index++) {
        const caseNumber = index + 1;
        const isFirst = index === 0;
        const accordionId = `result-${caseNumber}`;

        let badgeClass = '';
        let badgeText = '';
        let accordionBody = '';

        // 진행 중인 케이스 확인
        if (currentIndex >= 0 && index === currentIndex) {
            badgeClass = 'bg-secondary';
            badgeText = '<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>실행 중...';
            accordionBody = `
                <div class="text-muted">
                    <p class="mb-0">테스트 케이스를 실행하고 있습니다...</p>
                </div>
            `;
        }
        // 아직 시작하지 않은 케이스
        else if (index >= verifiedResults.length) {
            badgeClass = 'bg-light text-dark';
            badgeText = '⏳ 대기 중';
            accordionBody = `
                <div class="text-muted">
                    <p class="mb-0">아직 실행되지 않았습니다.</p>
                </div>
            `;
        }
        // 완료된 케이스
        else {
            const verified = verifiedResults[index];

            if (verified.type === 'pass') {
                badgeClass = 'bg-success';
                badgeText = '✅ Pass';
                accordionBody = `
                    <div class="text-success">
                        <p class="mb-0">정답입니다!</p>
                    </div>
                `;
            } else if (verified.type === 'fail') {
                badgeClass = 'bg-warning';
                badgeText = '❌ Fail';
                accordionBody = `
                    <div class="row">
                        <div class="col-6">
                            <strong>내 출력:</strong>
                            <pre class="bg-light p-2 border rounded">${escapeHtml(verified.stdout || '')}</pre>
                        </div>
                        <div class="col-6">
                            <strong>예상 출력:</strong>
                            <pre class="bg-light p-2 border rounded">${escapeHtml(verified.expectedOutput || '')}</pre>
                        </div>
                    </div>
                `;
            } else if (verified.type === 'runtime_error') {
                badgeClass = 'bg-danger';
                badgeText = '⚠️ Error';
                accordionBody = `
                    <div class="text-danger">
                        <pre class="bg-light p-2 border rounded">${escapeHtml(verified.stderr || verified.message || '')}</pre>
                    </div>
                `;
            } else if (verified.type === 'network_error') {
                badgeClass = 'bg-danger';
                badgeText = '⚠️ Network Error';
                accordionBody = `
                    <div class="text-danger">
                        <p>${escapeHtml(verified.message || '네트워크 오류가 발생했습니다.')}</p>
                    </div>
                `;
            }
        }

        accordionItems += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${accordionId}">
                    <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${accordionId}" aria-expanded="${isFirst ? 'true' : 'false'}" aria-controls="collapse-${accordionId}">
                        <span class="badge ${badgeClass} me-2">${badgeText}</span>
                        Case ${caseNumber}
                    </button>
                </h2>
                <div id="collapse-${accordionId}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" aria-labelledby="heading-${accordionId}" data-bs-parent="#result-accordion">
                    <div class="accordion-body">
                        ${accordionBody}
                    </div>
                </div>
            </div>
        `;
    }

    const accordion = `
        <div class="accordion" id="result-accordion">
            ${accordionItems}
        </div>
    `;

    // 결과 콘솔에 렌더링
    resultConsole.innerHTML = summaryCard + accordion;

    // 결과 영역 자동 스크롤
    resultConsole.scrollTop = resultConsole.scrollHeight;
}

/**
 * HTML 특수 문자를 이스케이프합니다.
 *
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 현재 상태를 직렬화합니다.
 * 에디터 코드, 선택된 언어, 테스트 케이스 배열을 JSON 문자열로 변환합니다.
 *
 * @returns {string} JSON 문자열
 */
function serializeState() {
    const state = {
        code: window.editor.state.doc.toString(),
        language: currentLanguage,
        testCases: testCases
    };
    return JSON.stringify(state);
}

/**
 * 상태를 lz-string을 이용하여 압축합니다.
 * URL에 안전하게 포함할 수 있는 형식으로 압축합니다.
 *
 * @param {string} jsonString - JSON 문자열
 * @returns {string} 압축된 문자열
 */
function compressState(jsonString) {
    return LZString.compressToEncodedURIComponent(jsonString);
}

/**
 * URL Hash에서 상태를 복원합니다.
 * 페이지 로드 시 호출되어 공유된 상태를 복원합니다.
 */
function restoreStateFromHash() {
    // window.location.hash 확인
    const hash = window.location.hash;

    if (!hash || !hash.startsWith('#data=')) {
        console.log('Hash가 없거나 data=로 시작하지 않음:', hash);
        return; // Hash가 없거나 data=로 시작하지 않으면 복원하지 않음
    }

    try {
        console.log('상태 복원 시작...');
        // Hash에서 data= 이후 부분 추출
        const compressedData = hash.substring(6); // '#data=' 길이만큼 제거

        // 압축 해제 함수 호출
        const state = decompressState(compressedData);

        if (!state) {
            console.warn('상태 복원 실패: 압축 해제 또는 파싱 실패');
            return;
        }

        console.log('상태 복원 성공:', {
            hasCode: !!state.code,
            language: state.language,
            testCasesCount: state.testCases?.length || 0
        });

        // 상태 복원 및 UI 업데이트
        // 언어 선택 드롭다운 업데이트
        if (state.language) {
            currentLanguage = state.language;
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = state.language;
            }
        }

        // 에디터 내용 및 언어 모드 설정 (한 번에 처리)
        if (window.editor && state.code && state.language) {
            // 언어 모드에 맞는 extension 가져오기
            const languageExt = getLanguageExtension(state.language);
            
            // 새로운 state 생성 (복원할 코드와 올바른 언어 모드 사용)
            const newState = EditorState.create({
                doc: state.code,
                extensions: [
                    lineNumbers(),
                    highlightActiveLineGutter(),
                    highlightSpecialChars(),
                    history(),
                    foldGutter(),
                    drawSelection(),
                    dropCursor(),
                    EditorState.allowMultipleSelections.of(true),
                    indentOnInput(),
                    bracketMatching(),
                    closeBrackets(),
                    autocompletion(),
                    rectangularSelection(),
                    crosshairCursor(),
                    highlightActiveLine(),
                    highlightSelectionMatches(),
                    keymap.of([
                        ...closeBracketsKeymap,
                        ...defaultKeymap,
                        ...searchKeymap,
                        ...historyKeymap,
                        ...foldKeymap,
                        ...completionKeymap,
                    ]),
                    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                    languageExt,
                    oneDark,
                ],
            });
            window.editor.setState(newState);
        } else if (window.editor && state.code) {
            // 언어 정보가 없는 경우 현재 언어 모드 유지하면서 코드만 변경
            const currentExtensions = window.editor.state.facet(EditorState.extensions);
            const newState = EditorState.create({
                doc: state.code,
                extensions: currentExtensions,
            });
            window.editor.setState(newState);
        }

        // 테스트 케이스 탭 자동 복구
        if (state.testCases && Array.isArray(state.testCases) && state.testCases.length > 0) {
            // 기존 탭 제거 (첫 번째 탭 제외)
            const tabsList = document.getElementById('test-case-tabs');
            const tabContent = document.getElementById('test-case-content');

            if (tabsList && tabContent) {
                // 기존 탭들 제거 (첫 번째 탭과 add-tab-btn이 포함된 li 제외)
                const existingTabs = tabsList.querySelectorAll('.nav-item:not(:first-child)');
                existingTabs.forEach(tab => {
                    // add-tab-btn이 포함된 li는 제거하지 않음
                    const addButton = tab.querySelector('#add-tab-btn');
                    if (addButton) {
                        return; // 이 탭은 건너뛰기
                    }
                    
                    const tabId = tab.querySelector('button')?.getAttribute('data-bs-target');
                    if (tabId) {
                        const tabPane = document.querySelector(tabId);
                        if (tabPane) {
                            tabPane.remove();
                        }
                    }
                    tab.remove();
                });

                // 기존 탭 콘텐츠 제거 (첫 번째 탭 제외)
                const existingPanes = tabContent.querySelectorAll('.tab-pane:not(:first-child)');
                existingPanes.forEach(pane => pane.remove());

                // testCases 배열 업데이트 (복원할 데이터로 설정)
                const restoredTestCases = state.testCases.map(tc => ({
                    input: tc.input || '',
                    expectedOutput: tc.expectedOutput || ''
                }));

                // 첫 번째 탭 데이터 업데이트
                if (restoredTestCases.length > 0) {
                    const firstStdinInput = document.getElementById('stdin-input-1');
                    const firstExpectedOutput = document.getElementById('expected-output-1');
                    if (firstStdinInput) {
                        firstStdinInput.value = restoredTestCases[0].input || '';
                    }
                    if (firstExpectedOutput) {
                        firstExpectedOutput.value = restoredTestCases[0].expectedOutput || '';
                    }
                    console.log('첫 번째 탭 데이터 복원 완료:', {
                        input: restoredTestCases[0].input,
                        expectedOutput: restoredTestCases[0].expectedOutput
                    });
                }

                // 추가 탭 생성 (2번째부터) - addTestCase() 대신 직접 생성
                for (let i = 1; i < restoredTestCases.length; i++) {
                    const newIndex = i; // 새 탭 인덱스 (0부터 시작)
                    const caseNumber = i + 1; // 표시용 케이스 번호 (1부터 시작)
                    const tabId = `case-${caseNumber}-tab`;
                    const contentId = `case-${caseNumber}`;

                    // 탭 리스트 요소 선택
                    const addButton = document.getElementById('add-tab-btn');
                    if (!addButton) {
                        console.error('add-tab-btn을 찾을 수 없습니다.');
                        continue;
                    }
                    const addButtonLi = addButton.parentElement;
                    if (!addButtonLi) {
                        console.error('add-tab-btn의 parentElement를 찾을 수 없습니다.');
                        continue;
                    }

                    // 새 탭 버튼 생성
                    const newTabLi = document.createElement('li');
                    newTabLi.className = 'nav-item';
                    newTabLi.setAttribute('role', 'presentation');
                    newTabLi.innerHTML = `
                        <button class="nav-link" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${contentId}" type="button" role="tab">
                            Case ${caseNumber}
                            <span class="ms-2 remove-tab-btn" data-case-index="${newIndex}" style="cursor: pointer; opacity: 0.7;" title="탭 삭제">×</span>
                        </button>
                    `;

                    // + 버튼 앞에 새 탭 삽입
                    tabsList.insertBefore(newTabLi, addButtonLi);

                    // 새 탭 콘텐츠 생성
                    const newTabPane = document.createElement('div');
                    newTabPane.className = 'tab-pane fade';
                    newTabPane.id = contentId;
                    newTabPane.setAttribute('role', 'tabpanel');
                    newTabPane.innerHTML = `
                        <div class="p-3">
                            <label for="stdin-input-${caseNumber}" class="form-label">Standard Input (Stdin)</label>
                            <textarea class="form-control stdin-input" id="stdin-input-${caseNumber}" rows="5" placeholder="입력값을 넣으세요" data-case-index="${newIndex}">${restoredTestCases[i].input || ''}</textarea>

                            <label for="expected-output-${caseNumber}" class="form-label mt-3">Expected Output</label>
                            <textarea class="form-control expected-output" id="expected-output-${caseNumber}" rows="5" placeholder="정답 기대값을 넣으세요" data-case-index="${newIndex}">${restoredTestCases[i].expectedOutput || ''}</textarea>
                        </div>
                    `;

                    // 탭 콘텐츠에 추가
                    tabContent.appendChild(newTabPane);

                    // 새 탭의 입력창에 자동 저장 이벤트 리스너 등록
                    const newStdinInput = newTabPane.querySelector('.stdin-input');
                    const newExpectedOutput = newTabPane.querySelector('.expected-output');
                    if (newStdinInput) {
                        newStdinInput.addEventListener('input', () => {
                            const caseIndex = parseInt(newStdinInput.getAttribute('data-case-index'));
                            if (!isNaN(caseIndex) && testCases[caseIndex]) {
                                testCases[caseIndex].input = newStdinInput.value;
                            }
                        });
                    }
                    if (newExpectedOutput) {
                        newExpectedOutput.addEventListener('input', () => {
                            const caseIndex = parseInt(newExpectedOutput.getAttribute('data-case-index'));
                            if (!isNaN(caseIndex) && testCases[caseIndex]) {
                                testCases[caseIndex].expectedOutput = newExpectedOutput.value;
                            }
                        });
                    }

                    // x 버튼 이벤트 리스너 등록
                    const removeBtn = newTabLi.querySelector('.remove-tab-btn');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            removeTestCase(newIndex);
                        });
                    }

                    console.log(`탭 ${caseNumber} 데이터 복원 완료:`, {
                        input: restoredTestCases[i].input,
                        expectedOutput: restoredTestCases[i].expectedOutput
                    });
                }

                // testCases 배열을 복원된 데이터로 설정 (탭 생성 후)
                testCases = restoredTestCases;

                // 첫 번째 탭 활성화
                const firstTab = document.getElementById('case-1-tab');
                if (firstTab) {
                    const firstTabBootstrap = new bootstrap.Tab(firstTab);
                    firstTabBootstrap.show();
                }

                // x 버튼 표시 상태 업데이트
                updateRemoveButtonsVisibility();
                
                console.log('테스트 케이스 복원 완료:', {
                    totalTabs: testCases.length,
                    testCases: testCases
                });
            }
        }
        
        console.log('상태 복원 완료');
    } catch (error) {
        console.error('상태 복원 중 오류:', error);
        console.error('에러 스택:', error.stack);
    }
}

/**
 * 압축된 상태를 해제하고 복원합니다.
 * lz-string을 이용하여 압축 해제 후 JSON 파싱을 수행합니다.
 *
 * @param {string} compressedData - 압축된 문자열
 * @returns {Object|null} 상태 객체 { code, language, testCases } 또는 null (에러 시)
 */
function decompressState(compressedData) {
    try {
        // LZString.decompressFromEncodedURIComponent() 사용
        const jsonString = LZString.decompressFromEncodedURIComponent(compressedData);

        // 압축 해제 실패 시 null 반환
        if (!jsonString) {
            console.error('압축 해제 실패: 빈 문자열');
            return null;
        }

        // JSON 파싱
        const state = JSON.parse(jsonString);

        // 상태 객체 유효성 검증
        if (!state.code || !state.language || !Array.isArray(state.testCases)) {
            console.error('상태 객체 형식이 올바르지 않습니다.');
            return null;
        }

        return state;
    } catch (error) {
        // 파싱 에러 처리
        console.error('상태 복원 실패:', error);
        return null;
    }
}

/**
 * 상태 압축/해제 테스트 함수 (개발용)
 * 한글 등 특수문자가 포함된 데이터로 테스트합니다.
 * 브라우저 콘솔에서 테스트할 수 있도록 window 객체에 노출
 */
window.testStateCompression = function() {
    console.log('=== 상태 압축/해제 테스트 시작 ===');

    try {
        // 한글이 포함된 테스트 데이터 생성
        const testState = {
            code: 'print("안녕하세요")\nprint("Hello, World!")',
            language: 'python',
            testCases: [
                {
                    input: '한글 입력',
                    expectedOutput: '안녕하세요\nHello, World!'
                },
                {
                    input: '123',
                    expectedOutput: '246'
                }
            ]
        };

        // 직렬화
        const jsonString = JSON.stringify(testState);
        console.log('1. 직렬화 성공:', jsonString);

        // 압축
        const compressed = compressState(jsonString);
        console.log('2. 압축 성공:', compressed);
        console.log('   압축률:', ((1 - compressed.length / jsonString.length) * 100).toFixed(2) + '%');

        // 압축 해제
        const decompressed = decompressState(compressed);
        console.log('3. 압축 해제 성공:', decompressed);

        // 검증
        if (decompressed &&
            decompressed.code === testState.code &&
            decompressed.language === testState.language &&
            JSON.stringify(decompressed.testCases) === JSON.stringify(testState.testCases)) {
            console.log('✅ 모든 테스트 통과! 한글 및 특수문자 처리 정상');
            return true;
        } else {
            console.error('❌ 검증 실패: 데이터 불일치');
            return false;
        }
    } catch (error) {
        console.error('❌ 테스트 실패:', error);
        return false;
    }
};

/**
 * Bootstrap Toast를 표시합니다.
 *
 * @param {string} message - 표시할 메시지
 * @param {string} type - Toast 타입 ('success', 'warning', 'danger', 'info')
 */
function showToast(message, type = 'info') {
    // Toast 컨테이너 확인 또는 생성
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Toast ID 생성
    const toastId = 'toast-' + Date.now();

    // Toast HTML 생성
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">알림</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${escapeHtml(message)}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    // Toast 초기화 및 표시
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    toast.show();

    // Toast가 숨겨진 후 DOM에서 제거
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

/**
 * API 클라이언트 테스트 함수 (개발용)
 * 브라우저 콘솔에서 테스트할 수 있도록 window 객체에 노출
 */
window.testAPI = async function() {
    console.log('=== API 클라이언트 테스트 시작 ===');

    try {
        // Python 테스트
        console.log('\n1. Python 테스트 (간단한 출력)');
        const pythonCode = 'print("Hello, World!")';
        const pythonResult = await executeCode('python', pythonCode);
        console.log('✅ Python 실행 성공:', pythonResult);
        console.log('출력:', pythonResult.run.stdout);

        // Python 입력 테스트
        console.log('\n2. Python 입력 테스트');
        const pythonInputCode = 'a = int(input())\nprint(a * 2)';
        const pythonInputResult = await executeCode('python', pythonInputCode, '10');
        console.log('✅ Python 입력 테스트 성공:', pythonInputResult);
        console.log('출력:', pythonInputResult.run.stdout);

        // C++ 테스트
        console.log('\n3. C++ 테스트');
        const cppCode = '#include <iostream>\nint main() { std::cout << "Hello, World!" << std::endl; return 0; }';
        const cppResult = await executeCode('cpp', cppCode);
        console.log('✅ C++ 실행 성공:', cppResult);
        console.log('출력:', cppResult.run.stdout);

        // 에러 처리 테스트 (잘못된 언어)
        console.log('\n4. 에러 처리 테스트 (잘못된 언어)');
        try {
            await executeCode('invalid', 'print("test")');
        } catch (error) {
            console.log('✅ 에러 처리 성공:', error.message);
        }

        console.log('\n=== 모든 테스트 완료 ===');
        return true;
    } catch (error) {
        console.error('❌ 테스트 실패:', error);
        return false;
    }
};

