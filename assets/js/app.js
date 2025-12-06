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
        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            changeLanguage(window.editor, selectedLanguage);
        });
    }
});

