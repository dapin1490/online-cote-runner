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
    const addButtonLi = addButton.parentElement;

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

    // 초기 x 버튼 표시 상태 업데이트
    updateRemoveButtonsVisibility();

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

