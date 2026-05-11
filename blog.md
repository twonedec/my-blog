오늘 구축한 자동화 블로그 프로젝트의 비전과 상세 기술 사양, 그리고 텔레그램 봇을 포함한 향후 로드맵을 담은 상세 마크다운 파일입니다.

---

# 🚀 프로젝트: Life-Sync & Profit Automation (LSPA)

## 1. 프로젝트 비전 (Mission)

본 프로젝트는 '아빠의 데이터랩'이라는 페르소나 아래, 개인의 일상적 경험과 기술적 해결책을 결합하여 자동화된 수익형 자산으로 변환하는 것을 목표로 합니다. 단순한 기록을 넘어 구글 SEO에 최적화된 정보성 콘텐츠를 AI와 자동화 스크립트로 생성하여 지속 가능한 디지털 파이프라인을 구축합니다.

## 2. 블로그 성격 및 전략 (Strategy)

일상의 비효율을 코딩으로 해결하고, 그 과정을 '해결형 콘텐츠'로 재가공합니다.

* **경험의 자산화**: 가족 여행, 육아 정책, 장비 리뷰 등 실전 경험을 SEO 최적화 문서로 변환합니다.
* **기술적 일관성**: 모든 콘텐츠는 데이터 분석이나 직접적인 트러블슈팅 과정을 포함하여 주제 권위도(Topical Authority)를 확보합니다.
* **수익 자동화**: 텔레그램과 AI를 연동하여 글쓰기 공백을 최소화하고 검색 유입을 극대화합니다.

## 3. 핵심 카테고리 설계

* **Travel & Kids**: 9살(1학년), 5살 두 딸과 함께하는 제주, 경주, 안동 등 가족 여행 동선 및 활동 최적화 가이드.
* **Money & Policy**: DART 구조적 데이터 태그 기반의 하이브리드 주식 분석 리포트 및 아이 관련 정부 지원금 정보.
* **Tech & Gear**: Synology DS423+(18GB RAM 업그레이드), Mac Mini M4 실사용기 및 홈서버 구축 기술 지원.
* **Dev Log**: 한자 타자 연습 프로그램, 가족 관리 시스템, 주식 랭킹 알고리즘 등 일상 해결용 코딩 기록.

## 4. 기술 사양 (Technical Specs)

* **Workstation**: Apple Mac Mini M4 (16GB RAM) - 로컬 개발 및 디자인 수정.
* **Home Server**: Synology DS423+ (18GB RAM) - Docker 기반 자동화 스크립트 실행.
* **Frontend**: Astro Framework + Tailwind CSS (Light Mode 기반 가독성 최적화).
* **Deployment**: GitHub Repository ↔ Cloudflare Pages 자동 빌드/배포.
* **Live URL**: `[https://my-blog-7vg.pages.dev/](https://my-blog-7vg.pages.dev/)`

## 5. 현재 진행 상황 (2026-05-10)

* **환경 구축**: Mac Mini M4 내 Astro 프로젝트 초기화 및 Tailwind CSS 연동 완료.
* **UI 디자인**: 수익형 블로그에 적합한 라이트 모드 레이아웃 및 4대 핵심 카테고리 네비게이션 설정 완료.
              - 현재 메인페이지 왜 나머지 부분 미 완성.(초기화면만 완성 상태)
* **인프라 배포**: Cloudflare Pages와 GitHub를 연동하여 실시간 웹 호스팅 시작.
* **봇 생성**: 미진항 

## 6. 향후 로드맵 (Roadmap)

### Phase 1: 자동화 엔진 구축 (Immediate)

* **Gemini API 연동**: 구글 AI 스튜디오를 통해 SEO 글쓰기 특화 프롬프트 설계 및 API 발급.
* **NAS 파이썬 스크립트**: 텔레그램 메시지를 수신하여 Markdown 파일로 변환 후 GitHub에 자동 Push하는 Python 엔진 개발.

### Phase 2: 콘텐츠 상세화

* **Dynamic Routing 구현**: `src/pages/posts/[...slug].astro` 설정을 통해 개별 글 상세 페이지 디자인 완성.
* **네이버 글 재가공**: 기존 '아빠의 리뷰노트' 콘텐츠를 AI로 SEO 세탁하여 정보성 글로 순차 업로드.

### Phase 3: 데이터 파이프라인 확장

* **주식 리포트 자동화**: DART API 분석 결과값을 매일 아침 자동으로 포스팅하는 스케줄러 등록.
* **애드센스 승인**: 정보성 포스팅 20개 이상 확보 후 Google AdSense 연동 및 수익화 개시.

---

*Created by Gemini 3 Flash (Paid Tier) - 2026.05.10*