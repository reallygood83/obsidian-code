# Obsidian Code

[![YouTube](https://img.shields.io/badge/YouTube-배움의달인-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v)
[![X Follow](https://img.shields.io/badge/X-@reallygood83-black?style=for-the-badge&logo=x)](https://x.com/reallygood83)
[![GitHub](https://img.shields.io/badge/GitHub-reallygood83-blue?style=for-the-badge&logo=github)](https://github.com/reallygood83)

옵시디언(Obsidian)을 사용하면서 "이 내용을 좀 정리해줘" 혹은 "이 파일을 수정해줘"라고 말만 하면 알아서 해주는 비서가 있다면 얼마나 좋을까요?  
**Obsidian Code**는 바로 그런 역할을 합니다. 옵시디언 사이드바에서 클로드(Claude)와 대화하며, 클로드가 여러분의 노트를 직접 읽고, 쓰고, 명령어도 실행하게 만드는 강력한 플러그인입니다.

단순히 질문에 대답만 하는 챗봇이 아닙니다. 여러분의 '디지털 정원(Vault)'을 관리하는 똑똑한 정원사라고 생각해보세요.

---

## 🌟 Obsidian Code만의 특별한 기능

### 📌 스마트 노트 핀 기능
여러 노트를 참고하면서 작업할 때 불편하셨나요? 이제 노트를 **핀(고정)**하면 다른 노트를 열어봐도 첨부된 노트가 바뀌지 않습니다!

- 파일 칩의 **📌 핀 버튼** 클릭 → 노트 고정
- 여러 노트를 열어 확인하면서도 컨텍스트 유지
- `Cmd/Ctrl + P` → "Attach current note to chat"으로 빠르게 노트 추가

### 🎯 직관적인 권한 모드
- **AUTO 모드**: Claude가 자동으로 파일 수정 및 명령 실행 (빠른 작업용)
- **Safe 모드**: 모든 작업에 승인 필요 (신중한 작업용)
- **Plan 모드**: 실행 없이 계획만 세우기

### 🧠 Obsidian Skills 자동 설치
Claude가 Obsidian 문법을 완벽히 이해하도록 도와주는 Skills를 원클릭 설치!
- `[[wikilinks]]`, `![[embeds]]`, `> [!callout]` 등 Obsidian 고유 문법 지원
- 설정 → Obsidian Skills → **Install Skills** 클릭

### 📎 다중 파일 컨텍스트
- `@`를 입력하여 여러 파일을 한 번에 첨부
- 첨부된 모든 파일이 **칩 형태**로 표시되어 한눈에 확인
- 각 칩에서 바로 열기, 핀, 삭제 가능

---

## ✨ 주요 기능 (Features)

*   **⚡️ 진짜 일하는 AI**: 클로드가 단순히 조언만 하는 게 아니라, 파일을 직접 생성하고 수정합니다. 터미널 명령어까지 실행할 수 있습니다.
*   **👀 눈치 빠른 비서**: 현재 여러분이 보고 있는 노트를 자동으로 참고합니다. `@`를 입력해서 특정 파일이나 폴더를 콕 집어 참고하라고 할 수도 있습니다.
*   **🖼️ 이미지 분석**: 이미지를 복사해서 붙여넣기(`Cmd/Ctrl+V`)하면 클로드가 내용을 분석해줍니다.
*   **✏️ 바로 수정하기**: 텍스트를 선택하고 단축키를 누르면, 그 부분만 쏙 골라 클로드가 수정해줍니다. (워드프로세서의 '변경 내용 추적'처럼 수정된 부분을 보여줍니다.)
*   **🧠 나만의 비서 교육**: `#`을 입력하면 클로드에게 "항상 이렇게 답변해"라고 지시사항(System Prompt)을 추가할 수 있습니다.
*   **🛠️ 도구 확장 (MCP)**: 외부 도구들과도 연결하여 기능을 무한히 확장할 수 있습니다.

---

## 🙋‍♂️ 개발자 및 소통 창구 (Connect)

이 플러그인은 여러분의 생산성을 극대화하기 위해 관리되고 있습니다. 궁금한 점이나 팁을 얻고 싶다면 아래 채널을 방문해주세요!

[![YouTube](https://img.shields.io/badge/YouTube-배움의달인-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v)
[![X Follow](https://img.shields.io/badge/Follow-@reallygood83-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/reallygood83)
[![GitHub](https://img.shields.io/badge/GitHub-reallygood83-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/reallygood83)

---

## 🚀 필수 선행 작업 (Prerequisites)

이 플러그인은 Anthropic의 **Claude Code CLI**를 기반으로 작동합니다. 사용 전 다음 단계를 반드시 완료해주세요.

1.  **Claude Code 설치**: 터미널(또는 CMD/PowerShell)을 열고 아래 명령어를 입력하여 설치합니다.
    ```bash
    npm install -g @anthropic-ai/claude-code
    ```
2.  **인증 완료**: 터미널에서 `claude`를 입력하여 실행한 후, **브라우저를 통해 Anthropic 계정 인증을 1회 완료**해야 합니다. 인증이 완료되어 터미널에서 Claude와 대화가 가능한 상태여야 플러그인이 정상 작동합니다.

---

## 🚀 설치 방법 (Installation)

### 방법 1: BRAT을 이용한 설치 (권장)

이 플러그인은 아직 옵시디언 커뮤니티 정식 목록에 등록되지 않았을 수 있습니다. BRAT을 이용하면 가장 편하게 설치하고 업데이트를 받을 수 있습니다.

1.  **BRAT 설치**: 옵시디언 설정 > 커뮤니티 플러그인 > '탐색'에서 `BRAT`을 검색하여 설치하고 활성화합니다.
2.  **플러그인 추가**: 
    *   명령어 팔레트(`Cmd/Ctrl + P`)를 엽니다.
    *   `BRAT: Add a beta plugin for testing`을 입력하고 선택합니다.
3.  **주소 입력**: 
    *   URL 입력창에 다음 주소를 복사해서 붙여넣습니다:
    *   `https://github.com/reallygood83/cc-obsidian`
4.  **활성화**: 
    *   설치가 완료되면 알림이 뜹니다.
    *   **설정(Settings) → 커뮤니티 플러그인(Community plugins)** 목록으로 가서 "Obsidian Code"를 찾아 켜주세요(Enable).

### 방법 2: 개발자용 설치 (직접 빌드)

코드를 직접 수정하거나 최신 개발 버전을 쓰고 싶은 분들을 위한 방법입니다.

1.  터미널을 열고 플러그인 폴더로 이동합니다.
    ```bash
    cd /path/to/vault/.obsidian/plugins
    git clone https://github.com/reallygood83/cc-obsidian.git
    cd cc-obsidian
    ```
2.  필요한 도구를 설치하고 빌드합니다.
    ```bash
    npm install
    npm run build
    ```
3.  옵시디언 설정에서 플러그인을 켭니다.

---

## 🎮 사용 방법 (Usage)

사용법은 아주 직관적입니다.

1.  **채팅 시작하기**: 왼쪽 리본 메뉴의 로봇 아이콘을 누르거나, 명령어 창(Command Palette)에서 채팅을 엽니다.
2.  **문맥 추가하기 (`@`)**:
    *   채팅창에 `@`를 입력해보세요. 내 저장소의 다른 파일이나 폴더를 선택해서 "이것 좀 봐줘"라고 할 수 있습니다.
    *   `@foler/`라고 쓰면 특정 폴더 안의 파일들만 보여줍니다.
3.  **노트 핀하기 (📌)**:
    *   파일 칩의 핀 아이콘을 클릭하면 해당 노트가 고정됩니다.
    *   다른 노트를 열어도 핀된 노트는 사라지지 않습니다!
4.  **명령어 템플릿 (`/`)**:
    *   `/`를 입력하면 자주 쓰는 명령어 모음이 나옵니다.
5.  **바로 고치기 (Inline Edit)**:
    *   노트에서 고치고 싶은 문장을 드래그해서 선택합니다.
    *   지정된 단축키를 누르면 클로드가 그 부분만 수정해줍니다.

---

## ⚙️ 설정 가이드 (Configuration)

설정 메뉴에서 클로드를 더 똑똑하게 만들 수 있습니다.

*   **사용자 이름**: 클로드가 여러분을 부를 이름을 정해주세요.
*   **Obsidian Skills**: Claude가 Obsidian 문법을 이해하도록 Skills를 설치하세요.
*   **미디어 폴더**: 이미지를 붙여넣을 때 저장될 위치를 정합니다.
*   **안전 모드 (Safety)**:
    *   클로드가 터미널 명령어를 쓸 때 위험한 명령(`rm -rf` 등)은 막습니다.
    *   파일을 수정하거나 명령을 내릴 때마다 허락을 받도록 설정할 수 있습니다(권장).
*   **Claude Code CLI 설정**: 만약 "Claude Code CLI not found" 오류가 뜬다면, 컴퓨터에 설치된 Claude의 위치를 직접 알려줘야 합니다. (터미널에서 `which claude` 또는 `where.exe claude`로 찾을 수 있습니다.)

---

## ❓ 자주 묻는 질문 (Troubleshooting)

**Q. "Claude Code CLI not found"라고 뜨면서 안 돼요!**  
A. 클로드 프로그램이 어디 있는지 플러그인이 못 찾아서 그렇습니다. 설정(Settings) -> Advanced 탭에 가서 `Claude Code CLI path`에 직접 경로를 입력해주세요.

**MacOS/Linux 예시:**
1. 터미널에 `which claude` 입력
2. 나온 경로(예: `/usr/local/bin/claude`)를 복사해서 붙여넣기

**Windows 예시:**
1. 파워쉘에 `where.exe claude` 입력
2. 나온 경로(예: `C:\Users\...\claude.exe`)를 복사해서 붙여넣기

---

## 📜 라이선스 (License)

이 프로젝트는 [MIT License](LICENSE)를 따릅니다.

## 🙏 감사의 말

이 플러그인은 Obsidian과 Anthropic의 위대한 도구들 덕분에 만들어졌습니다.

---

<p align="center">
  <a href="https://www.youtube.com/@%EB%B0%B0%EC%9B%80%EC%9D%98%EB%8B%AC%EC%9D%B8-p5v"><img src="https://img.shields.io/badge/YouTube-구독하기-red?style=for-the-badge&logo=youtube" alt="YouTube"></a>
  <a href="https://x.com/reallygood83"><img src="https://img.shields.io/badge/X-팔로우-black?style=for-the-badge&logo=x" alt="X Follow"></a>
</p>
