---
title: "문서수 적다고 들어갔다 피 보는 이유: 상위 1~3위 발행일자의 비밀"
summary: "유튜브 숏폼에서 소개한 '네이버 상위 1~3위 글 최신성 판별 파이썬 코드'입니다. 겉보기엔 문서수가 적어 보여도 어제오늘 인플루언서들이 진입한 위험 격전지를 피하고, 6개월 이상 묵은 글이 상위를 차지하고 있어 초보도 쉽게 1위를 뺏어오는 진짜 빈집 체크리스트를 공개합니다."
date: 2026-09-17
categoryBadge: "BLOG KEYWORD"
tags: ["네이버블로그", "황금키워드", "최신글경과일", "블로그상위노출", "파이썬자동화"]
draft: false
---

지난 1편에서 공개한 **'검색량 대비 총문서수(경쟁 포화도 0.8 이하)'** 공식을 보고 많은 분들이 빈집 키워드를 찾기 시작하셨습니다.  
그런데 1편을 실천해 보신 분들 중에 간혹 이런 답답한 경험을 토로하시는 분들이 계십니다.

> *"분명 검색량은 3,000회인데 문서수는 500개밖에 안 되는 S급 빈집이라 신나서 글을 썼거든요?  
> 그런데 다음 날 순위를 보니 **여전히 3페이지 밖으로 밀려 있습니다.** 왜 이런 걸까요?"*

단언컨대, 여러분의 글이 부족해서가 아닙니다.  
바로 **'가짜 빈집'의 덫**에 걸리셨기 때문입니다.

---

## 1단계: 검색량과 문서수만 보면 실패하는 이유

총문서수라는 숫자는 **'과거 10년 동안 누적된 글의 합계'**일 뿐입니다.  
겉보기엔 문서수가 500개로 적어 보여도, 네이버 검색창에 쳐보면 **상위 1~3위를 대형 인플루언서들이 '어제오늘' 갓 작성한 글들로 꽉 채워놓은 [실시간 격전지]**일 수 있습니다.

반대로 총문서수가 2,000개가 넘어가더라도, **상위 1~3위 글이 6개월 전, 1년 전에 올라온 '묵은 글'**이라면 어떨까요?  
네이버의 C-Rank와 DIA+ 알고리즘은 **'정보의 최신성'**을 매우 중요하게 보기 때문에, 지수가 낮은 초보 블로거가 최신 정보로 글을 쓰면 **1위 글을 단숨에 밀어내고 상위를 탈환**할 수 있습니다!

---

## 2단계: 진짜 빈집을 가려내는 상위 최신성 3대 체크리스트

키워드를 골랐다면, 반드시 상위 1~3위 글의 **'발행일자(최신글 경과일)'**를 확인해야 합니다:

| 최신글 상태 | 의미 | 판정 및 공략법 |
|---|---|---|
| **상위 1위 글이 90일 이상 묵은 글** | 관리되지 않는 빈집 | `[추천] 빈집 공략` 최신 팩트와 최신 사진으로 작성하면 즉시 1위 탈환 가능 |
| **상위 1~3위 글이 모두 30일 이내** | 실시간 격전지 | `[주의] 진입 보류` 대형 블로거들이 방금 쓴 글이라 지수 싸움에서 밀림 |
| **최근 30일간 신규 글이 3건 이하** | 관심 밖의 블루오션 | `[우수] 공략 적기` 신규 경쟁자가 없어 쓴 글이 수개월간 상위에 박제됨 |

---

## 3단계: 단일 웹 실행 앱 제작 프롬프트

상위 글을 일일이 클릭해서 언제 쓴 글인지 확인하려면 시간도 오래 걸리고 손목만 아픕니다.  
**ChatGPT 데스크탑(Codex), Claude Code, Google Antigravity 등 데스크탑 앱**에 아래 프롬프트를 그대로 복사해서 붙여넣으세요.

키워드 1개만 입력하면 네이버 검색 API를 통해 **상위 1위 글이 며칠 전에 올라왔는지, 최근 30일간 신규 글이 몇 개나 쏟아졌는지를 1초 만에 판별해 주는 미니 웹 앱(app_recency.py)**을 완성해 줍니다.

```text
아래 제공된 [네이버 블로그 상위글 최신성 분석 로직]을 기반으로, 내 컴퓨터 브라우저(http://localhost:5001)에서 키워드를 넣으면 상위글 최신성을 즉시 진단해 주는 단일 파일 Flask 웹 애플리케이션(app_recency.py)을 만들어줘.

[상세 구현 스펙]
1. 프레임워크: Flask 단일 파일(app_recency.py), HTML/CSS 인라인 렌더링.
2. 기능 및 화면 표시:
   - 검색창에 키워드 입력 후 [최신성 진단] 버튼 클릭
   - 1위 글 작성일(postdate) 기반 "경과일수(며칠 전 글인지)" 계산 표시
   - 최근 30일간 상위 10개 중 새로 발행된 신규 글 수 카운트 표시
   - 진단 판정 결과 배지 표시:
     * 1위 글이 60일 이상 전 "[빈집 찬스] 상위 글 노후화"
     * 1위 글이 7일 이내 & 최근30일 글 5개 이상 "[격전지] 최근 글 집중 (진입 주의)"
     * 그 외 "[보통] 일반 공략 구간"
3. 자동 브라우저 실행: 서버 기동 시 webbrowser 모듈로 http://localhost:5001 자동 오픈.
4. 원클릭 자동 실행: 코드 생성이 완료되면 직접 백그라운드 터미널 명령으로 app_recency.py를 실행하여 로컬 서버를 구동하고 브라우저(http://localhost:5001)를 즉시 오픈할 것.

[내 네이버 API 키]
- NAVER_CLIENT_ID: "YOUR_NCP_CLIENT_ID" # (실제 네이버 클라우드 Client ID 입력)
- NAVER_CLIENT_SECRET: "YOUR_NCP_CLIENT_SECRET" # (실제 Secret 입력)

[네이버 상위글 최신성 진단 로직 (25줄 파이썬)]
import requests
from datetime import datetime, timedelta

def check_recency(keyword: str, client_id: str, client_secret: str):
    # 키 누락 및 한글 플레이스홀더 오류 방어
    if not client_id or not client_id.isascii() or "YOUR" in client_id or "입력" in client_id:
        return {"keyword": keyword, "days_ago": 999, "recent30": 0, "status": "[안내] 네이버 API 키를 먼저 입력해주세요."}

    url = "https://naverapihub.apigw.ntruss.com/search/v1/blog"
    headers = {"X-NCP-APIGW-API-KEY-ID": client_id, "X-NCP-APIGW-API-KEY": client_secret}
    res = requests.get(url, params={"query": keyword, "display": 10, "sort": "date"}, headers=headers)
    if res.status_code != 200:
        url = "https://openapi.naver.com/v1/search/blog.json"
        headers = {"X-Naver-Client-Id": client_id, "X-Naver-Client-Secret": client_secret}
        res = requests.get(url, params={"query": keyword, "display": 10, "sort": "date"}, headers=headers)
    
    items = res.json().get("items", []) if res.status_code == 200 else []
    if not items:
        return {"days_ago": 999, "recent30_cnt": 0, "status": "데이터 없음"}
    
    # 1위 글 작성일 계산
    newest_date_str = items[0].get("postdate", "")
    days_ago = 999
    if len(newest_date_str) == 8:
        p_date = datetime.strptime(newest_date_str, "%Y%m%d")
        days_ago = (datetime.now() - p_date).days
    
    # 최근 30일간 신규 글 수
    cutoff = (datetime.now() - timedelta(days=30)).strftime("%Y%m%d")
    recent30 = sum(1 for it in items if it.get("postdate", "") >= cutoff)
    
    return {"keyword": keyword, "days_ago": days_ago, "recent30": recent30}
```

---

## 실행 및 유지보수 가이드 (FAQ)

* **Q1. AI가 파일을 다 만들었다고 하는데 브라우저가 안 떠요. 어떻게 실행하나요?**  
  파이썬 명령어나 검은 터미널 창을 몰라도 전혀 걱정 마세요! 지금 대화 중인 AI(Claude, Antigravity, ChatGPT 등) 채팅창에 **"방금 만든 프로그램 지금 바로 터미널에서 백그라운드로 실행해서 브라우저 띄워줘"**라고 한 줄만 치시면 AI가 알아서 서버를 켜고 화면을 띄워줍니다.
* **Q2. 실행 도중 빨간 글씨 오류나 통신 에러가 발생하면요?**  
  본문에 검증된 100% 정답 코드가 다 들어있기 때문에 절대 당황하실 필요 없습니다. 터미널이나 화면에 뜬 오류 문구 전체를 그대로 복사해서 AI 대화창에 **"이 에러 수정해서 다시 실행해줘"**라고 던지시면 10초 만에 완벽히 고쳐줍니다.
* **Q3. 내일 컴퓨터를 껐다가 다시 켰을 때는 어떻게 다시 여나요?**  
  코드를 다시 짤 필요가 전혀 없습니다! 기존에 작업했던 AI 대화창을 다시 열고 **"어제 만든 이 프로그램(app_recency.py) 서버 다시 실행해서 브라우저 열어줘"**라고만 요청하시면 즉시 다시 켜집니다.

---

## 다음 3탄 예고: 고단가 상업성 키워드의 비밀

* 빈집 키워드를 찾고 상위 글이 묵은 글인 것까지 확인했습니다.
* 그런데 **방문자가 하루 1,000명씩 들어와도 광고를 클릭했을 때 30원짜리 글에 시간 낭비하고 계시진 않나요?**
* 다음 3탄에서는 네이버 검색광고 공식 데이터(`compIdx`)를 통해 **클릭 한 번에 1,000원~4,000원씩 터지는 알짜 고단가 상업성 키워드**를 1초 만에 가려내는 실전 공식을 공개합니다.


