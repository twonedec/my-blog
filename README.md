# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## ✍️ 콘텐츠 발행 컨벤션

### 새 글 파일명 (2026-09-24 결정)

새로 발행하는 글은 `src/content/posts/YYYY-MM-DD-키워드.md` 형식을 쓴다 (예: `2026-09-24-smartstore-dropshipping.md`). **번호 접두사(`16-`, `18-` 등)는 더 이상 쓰지 않는다.**

**왜**: 기존 번호 체계는 `_drafts/`(제작 순서 파일명) · `src/content/posts/`(발행 슬러그) · `public/images/side-income/`(썸네일 파일명) 세 군데에서 같은 번호를 손으로 맞춰야 했다. 2026-09-24에 실제 사고 발생 — 16번으로 발행된 글이 18번 이미지를 쓰고 있었음(초안 단계에서 16/17번을 건너뛰고 발행하며 번호가 어긋남). 날짜는 자동으로 유일하므로 이런 수동 동기화 자체가 필요 없어진다. 글 목록은 어차피 frontmatter `date` 기준 정렬이라 번호가 주던 "볼륨감"도 실질적 효용이 없었다.

**적용 범위**: 다음 글부터만 적용. 기존 1~16번 글은 URL 변경 비용(링크 끊김)이 더 커서 그대로 둔다.

**대표 이미지**: `public/images/side-income/*.png` 썸네일에 있던 "DADANOTE · VOL.NN" 배지는 전부 "DADANOTE"로 정리했다(번호 표시 자체를 없앰). 새 이미지를 만들 때도 번호를 박아넣지 않는다.

### 홈페이지 레이아웃 — 미니멀 쇼케이스 허브 (2026-09-25 결정)

현재 애드센스 심사를 위해 카테고리가 `Side Income` 1개로 단일화되어 있는 상태에서, 홈 화면과 카테고리 상세 페이지(`/side-income/`)의 중복을 해소하고 역할을 명확히 분리했다:
- **홈 화면 (`src/pages/index.astro`)**: 가벼운 1페이지 쇼케이스 허브.
  - 다다노트 에디토리얼 인트로
  - 최신 대표 가이드 1편 포커스
  - 다다노트 전용 실전 계산기 2종 (4대보험 & 성장 계산기)
  - 최근 발행 기록 3편 및 Side Income 전체 보관소 안내 링크
- **Side Income 페이지 (`src/pages/[category].astro`)**: 전체 글을 태그 필터(쿠팡, 애드센스, 크몽, 네이버)로 정밀하게 탐색하는 전문 라이브러리 역할 전담.
