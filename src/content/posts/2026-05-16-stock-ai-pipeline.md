---
title: "주식 프로그램 개발, NAS에서 AI 주식 리포트 자동화까지 — 삽질 기록과 실제 구조"
summary: "개인 NAS와 Claude API로 주식 자동화 시스템 직접 개발. 첫날부터 월 $30 나올 수 있는 비용 실수와 실제 작동 구조를 솔직하게 정리했습니다."
date: 2026-05-16
category: "Dev & Quant"
image: /images/2026-05-16-stock-ai-pipeline/img_02.png
---

매일 아침 카카오톡으로 보유 종목의 호재·악재 판단 결과를 받아볼 수 있습니다. 개인 NAS와 Claude API를 연결해 주식 프로그램을 직접 개발했습니다. 결론부터 말하면, 처음부터 비용 구조를 잘못 설계하면 첫날부터 월 $30 이상 나갈 수 있습니다. 이 글은 그 실패와 수정 과정을 솔직하게 적은 기록입니다.

![AI 추천 및 시장 동향 웹 대시보드](/images/2026-05-16-stock-ai-pipeline/img_02.png)

## 1. 바로 쓸 수 있는 핵심 구조 — 먼저 전체 그림을 봅니다

주식 프로그램 개발의 핵심 파이프라인은 6단계입니다.

뉴스 수집(collector.py) → 중복 제거(deduper.py) → DART 공시 수집(dart_collector.py) → AI 판단(engine.py) → 시장 스크리닝(recommender.py) → 카카오톡 발송(reporter.py)

운영 환경은 다음과 같습니다.

- **하드웨어**: Synology DS423+ NAS (24시간 가동 중인 집 서버 활용)
- **실행 방식**: Docker 컨테이너 + cron (평일 오전 8시 자동 실행)
- **알림 수단**: 카카오 비즈니스 메시지 API → 카카오톡

<style>
  .sv * { box-sizing: border-box; margin: 0; padding: 0; }
  .sv { font-family: 'Noto Sans KR', -apple-system, sans-serif; display: flex; flex-direction: column; gap: 40px; margin: 40px 0; }
  .sv .section-label { font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #475569; text-transform: uppercase; margin-bottom: 20px; text-align: center; }
  .sv .pipeline { background: #1e293b; border-radius: 20px; padding: 36px 28px 32px; border: 1px solid #334155; }
  .sv .pipeline-title { text-align: center; font-size: 18px; font-weight: 900; color: #f1f5f9; margin-bottom: 8px; }
  .sv .pipeline-sub { text-align: center; font-size: 12px; color: #64748b; margin-bottom: 32px; }
  .sv .pipeline-steps { display: flex; align-items: center; justify-content: center; gap: 0; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 8px; }
  .sv .step { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 110px; }
  .sv .step-num { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: white; }
  .sv .step-box { width: 100px; padding: 16px 8px; border-radius: 14px; text-align: center; border-top: 3px solid; background: rgba(255,255,255,0.03); }
  .sv .step-emoji { font-size: 24px; margin-bottom: 8px; }
  .sv .step-name { font-size: 12px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
  .sv .step-file { font-size: 9px; color: #64748b; margin-bottom: 6px; }
  .sv .step-desc { font-size: 9px; color: #94a3b8; line-height: 1.5; }
  .sv .arrow { font-size: 18px; color: #475569; flex-shrink: 0; padding: 0 4px; margin-top: 20px; }
  .sv .pipeline-footer { margin-top: 24px; text-align: center; background: #0f172a; border-radius: 10px; padding: 10px; font-size: 11px; color: #475569; }
  .sv .s1 .step-num { background: #0ea5e9; } .sv .s1 .step-box { border-color: #0ea5e9; }
  .sv .s2 .step-num { background: #10b981; } .sv .s2 .step-box { border-color: #10b981; }
  .sv .s3 .step-num { background: #8b5cf6; } .sv .s3 .step-box { border-color: #8b5cf6; }
  .sv .s4 .step-num { background: #f97316; } .sv .s4 .step-box { border-color: #f97316; }
  .sv .s5 .step-num { background: #ec4899; } .sv .s5 .step-box { border-color: #ec4899; }
  .sv .s6 .step-num { background: #eab308; } .sv .s6 .step-box { border-color: #eab308; }
  .sv .timeline { background: #1e293b; border-radius: 20px; padding: 36px 40px; border: 1px solid #334155; }
  .sv .timeline-title { font-size: 18px; font-weight: 900; color: #f1f5f9; margin-bottom: 6px; text-align: center; }
  .sv .timeline-sub { font-size: 12px; color: #64748b; margin-bottom: 36px; text-align: center; }
  .sv .tl-item { display: flex; gap: 24px; margin-bottom: 32px; position: relative; }
  .sv .tl-item:not(:last-child)::before { content: ''; position: absolute; left: 27px; top: 54px; width: 2px; height: calc(100% + 0px); background: #334155; }
  .sv .tl-left { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; }
  .sv .tl-badge { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 900; position: relative; z-index: 1; }
  .sv .tl-badge.fail { background: rgba(239,68,68,0.15); border: 2px solid #ef4444; color: #ef4444; }
  .sv .tl-badge.warn { background: rgba(234,179,8,0.15); border: 2px solid #eab308; color: #eab308; }
  .sv .tl-badge.success { background: rgba(16,185,129,0.15); border: 2px solid #10b981; color: #10b981; }
  .sv .tl-right { flex: 1; padding-top: 4px; }
  .sv .tl-version { font-size: 11px; font-weight: 700; letter-spacing: 2px; margin-bottom: 6px; }
  .sv .tl-version.fail { color: #ef4444; } .sv .tl-version.warn { color: #eab308; } .sv .tl-version.success { color: #10b981; }
  .sv .tl-heading { font-size: 15px; font-weight: 700; color: #f1f5f9; margin-bottom: 8px; }
  .sv .tl-desc { font-size: 13px; color: #94a3b8; line-height: 1.7; margin-bottom: 10px; }
  .sv .tl-tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .sv .tl-tag.fail { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
  .sv .tl-tag.warn { background: rgba(234,179,8,0.1); color: #eab308; border: 1px solid rgba(234,179,8,0.3); }
  .sv .tl-tag.success { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
  .sv .cost-chart { background: #1e293b; border-radius: 20px; padding: 36px 40px; border: 1px solid #334155; }
  .sv .cost-title { font-size: 18px; font-weight: 900; color: #f1f5f9; margin-bottom: 6px; text-align: center; }
  .sv .cost-sub { font-size: 12px; color: #64748b; margin-bottom: 36px; text-align: center; }
  .sv .bar-group { margin-bottom: 28px; }
  .sv .bar-label-row { display: flex; justify-content: space-between; margin-bottom: 8px; align-items: flex-end; }
  .sv .bar-label { font-size: 13px; color: #cbd5e1; font-weight: 500; }
  .sv .bar-amount { font-size: 20px; font-weight: 900; }
  .sv .bar-track { height: 36px; background: rgba(255,255,255,0.04); border-radius: 8px; overflow: hidden; }
  .sv .bar-fill { height: 100%; border-radius: 8px; display: flex; align-items: center; padding-left: 12px; font-size: 11px; font-weight: 700; color: white; }
  .sv .bar-danger { background: linear-gradient(90deg, #dc2626, #ef4444); }
  .sv .bar-warn { background: linear-gradient(90deg, #b45309, #eab308); }
  .sv .bar-ok { background: linear-gradient(90deg, #047857, #10b981); }
  .sv .bar-note { font-size: 11px; color: #475569; margin-top: 6px; }
  .sv .cost-summary { margin-top: 32px; background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; }
  .sv .cost-summary-icon { font-size: 28px; }
  .sv .cost-summary-text { font-size: 13px; color: #6ee7b7; line-height: 1.6; }
  .sv .gauge-section { background: #1e293b; border-radius: 20px; padding: 36px 40px; border: 1px solid #334155; }
  .sv .gauge-title { font-size: 18px; font-weight: 900; color: #f1f5f9; margin-bottom: 6px; text-align: center; }
  .sv .gauge-sub { font-size: 12px; color: #64748b; margin-bottom: 36px; text-align: center; }
  .sv .gauge-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
  .sv .gauge-card { background: rgba(255,255,255,0.03); border-radius: 14px; padding: 20px; border: 1px solid #334155; }
  .sv .gauge-card-title { font-size: 13px; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
  .sv .gauge-card-api { font-size: 11px; color: #475569; margin-bottom: 16px; }
  .sv .limit-bar-track { height: 12px; background: rgba(255,255,255,0.05); border-radius: 6px; overflow: visible; position: relative; margin: 12px 0 6px; }
  .sv .limit-bar-fill { height: 100%; border-radius: 6px; position: absolute; top: 0; left: 0; }
  .sv .limit-marker { position: absolute; top: -4px; width: 2px; height: 20px; background: #f1f5f9; border-radius: 1px; }
  .sv .limit-marker::after { content: attr(data-label); position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 9px; color: #94a3b8; white-space: nowrap; font-weight: 700; }
  .sv .limit-labels { display: flex; justify-content: space-between; font-size: 9px; color: #475569; }
  .sv .gauge-status { text-align: center; margin-top: 12px; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; display: inline-block; }
  .sv .gauge-status.over { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
  .sv .gauge-status.safe { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
  @media (max-width: 600px) { .sv .gauge-row { grid-template-columns: 1fr; } .sv .pipeline-steps { flex-direction: column; } .sv .arrow { transform: rotate(90deg); } }
</style>

<div class="sv">

<div class="pipeline">
  <p class="section-label">Visualization 01</p>
  <div class="pipeline-title">AI 주식 리포트 파이프라인</div>
  <div class="pipeline-sub">NAS에서 매일 오전 8시 자동 실행되는 6단계 처리 구조</div>
  <div class="pipeline-steps">
    <div class="step s1"><div class="step-num">1</div><div class="step-box"><div class="step-emoji">📡</div><div class="step-name">뉴스 수집</div><div class="step-file">collector.py</div><div class="step-desc">Google RSS<br>네이버 뉴스</div></div></div>
    <div class="arrow">→</div>
    <div class="step s2"><div class="step-num">2</div><div class="step-box"><div class="step-emoji">🔍</div><div class="step-name">중복 제거</div><div class="step-file">deduper.py</div><div class="step-desc">URL 해시<br>코사인 유사도</div></div></div>
    <div class="arrow">→</div>
    <div class="step s3"><div class="step-num">3</div><div class="step-box"><div class="step-emoji">📋</div><div class="step-name">DART 공시</div><div class="step-file">dart_collector.py</div><div class="step-desc">실적·수주<br>배당 공시</div></div></div>
    <div class="arrow">→</div>
    <div class="step s4"><div class="step-num">4</div><div class="step-box"><div class="step-emoji">🤖</div><div class="step-name">AI 판단</div><div class="step-file">engine.py</div><div class="step-desc">호재/악재<br>Gemini Flash</div></div></div>
    <div class="arrow">→</div>
    <div class="step s5"><div class="step-num">5</div><div class="step-box"><div class="step-emoji">📊</div><div class="step-name">시장 레이더</div><div class="step-file">recommender.py</div><div class="step-desc">3,000개<br>스크리닝</div></div></div>
    <div class="arrow">→</div>
    <div class="step s6"><div class="step-num">6</div><div class="step-box"><div class="step-emoji">💬</div><div class="step-name">카톡 발송</div><div class="step-file">reporter.py</div><div class="step-desc">카카오<br>비즈메시지</div></div></div>
  </div>
  <div class="pipeline-footer">⏰ 평일 오전 8시 자동 실행 &nbsp;•&nbsp; Docker + cron &nbsp;•&nbsp; Synology DS423+ NAS</div>
</div>

</div>

이 구조가 현재 실제로 작동하고 있는 시스템입니다. 아래부터는 이 구조에 도달하기까지 어떤 실수가 있었는지를 다룹니다.


## 2. 이 시스템을 만든 이유 — 아침 뉴스 확인의 현실

장이 열리기 전, 보유 종목 10~20개의 뉴스를 직접 다 찾아보는 건 현실적으로 불가능합니다.

네이버 증권 앱을 사용해봤습니다. 뉴스는 나오는데 "이게 호재냐 악재냐"를 직접 읽고 판단해야 합니다. 시간이 없을 때 제목만 보고 넘어가다가 중요한 악재를 놓친 경험이 있습니다.

그래서 나온 아이디어가 하나였습니다. AI에게 뉴스를 읽히고, 호재·악재 판단 결과만 받자. 마침 Claude API를 사용할 수 있는 환경이었고 집에 NAS가 있었습니다.


## 3. 가장 먼저 피해야 할 실수 3가지 — 개발 전에 반드시 확인하세요

주식 프로그램 개발 초기에 맞닥뜨린 문제들입니다. 같은 실수를 반복하지 않으시길 바랍니다.

**첫 번째 실수: API 비용 계산 없이 시작하기**

처음 설계는 단순했습니다. Claude Sonnet 하나로 종목 분석, 시장 스크리닝, 최종 추천까지 모두 처리하는 구조였습니다. 결과는 예상 월 비용 $15~20였습니다. 실제로는 3,000개 종목 전체를 Sonnet으로 돌리면 월 $30를 넘겼습니다.

AI 모델 하나로 모든 걸 처리하면 비용이 선형으로 늘어납니다. 역할 분리가 핵심입니다.

<div class="sv">
<div class="cost-chart">
  <p class="section-label">Visualization 03</p>
  <div class="cost-title">AI 모델 비용 비교</div>
  <div class="cost-sub">단일 모델 vs 역할 분리 후 월 예상 비용</div>
  <div class="bar-group">
    <div class="bar-label-row"><div class="bar-label">🔴 Claude Sonnet 단일 구조 (3,000종목 스크리닝)</div><div class="bar-amount" style="color:#ef4444">$30+/월</div></div>
    <div class="bar-track"><div class="bar-fill bar-danger" style="width:100%">전체 종목 Sonnet 처리</div></div>
    <div class="bar-note">초기 설계 — 첫 달부터 한도 초과</div>
  </div>
  <div class="bar-group">
    <div class="bar-label-row"><div class="bar-label">🟡 보유 종목만 Sonnet (21종목 분석)</div><div class="bar-amount" style="color:#eab308">$15~20/월</div></div>
    <div class="bar-track"><div class="bar-fill bar-warn" style="width:60%">종목 수 줄여도 기본 $1~2/일</div></div>
    <div class="bar-note">범위를 줄여봤지만 여전히 비쌈</div>
  </div>
  <div class="bar-group">
    <div class="bar-label-row"><div class="bar-label">🟢 역할 분리 (Gemini Flash-Lite + Sonnet 최소 사용)</div><div class="bar-amount" style="color:#10b981">$1~3/월</div></div>
    <div class="bar-track"><div class="bar-fill bar-ok" style="width:10%">최종 판단만 Sonnet</div></div>
    <div class="bar-note">현재 운영 구조 — 90% 이상 비용 절감</div>
  </div>
  <div class="cost-summary">
    <div class="cost-summary-icon">💡</div>
    <div class="cost-summary-text">핵심 원칙: <strong>비싼 AI는 꼭 필요한 순간에만</strong> 씁니다.<br>수집·필터링은 무료 소스와 규칙 기반 코드로 처리하고, 최종 판단에만 고성능 LLM을 최소 투입합니다.</div>
  </div>
</div>
</div>

**두 번째 실수: 뉴스 소스 쿼리 수 미계산**

Brave Search API를 메인 소스로 사용했습니다. 종목당 3가지 쿼리(목표주가, 수주, 뉴스)를 날렸는데, 보유 종목 21개 × 3쿼리 = 하루 63건, 월 평일 21일 기준으로 월 1,323건이 됩니다.

Brave Search 유료 플랜 한도는 월 1,000건입니다. 첫 달에 바로 한도를 초과했습니다.

<div class="sv">
<div class="gauge-section">
  <p class="section-label">Visualization 04</p>
  <div class="gauge-title">API 한도 초과 시각화</div>
  <div class="gauge-sub">첫 달에 바로 한도를 초과한 두 가지 사례</div>
  <div class="gauge-row">
    <div class="gauge-card">
      <div class="gauge-card-title">Brave Search API</div>
      <div class="gauge-card-api">유료 플랜 기본 한도: 월 1,000건</div>
      <div class="limit-bar-track">
        <div class="limit-bar-fill" style="width:75.6%; background: linear-gradient(90deg, #0ea5e9, #38bdf8);"></div>
        <div class="limit-marker" style="left: 75.6%;" data-label="한도 1,000건"></div>
        <div class="limit-bar-fill" style="width:24.4%; left:75.6%; background: linear-gradient(90deg, #ef4444, #fca5a5); border-radius: 0 6px 6px 0;"></div>
      </div>
      <div class="limit-labels"><span>0건</span><span style="color:#ef4444; font-weight:700;">1,323건 사용</span></div>
      <div style="margin-top:16px; font-size:12px; color:#94a3b8; line-height:1.7;"><strong style="color:#e2e8f0;">계산:</strong><br>21종목 × 3쿼리 = 63건/일<br>63건 × 21평일 = <strong style="color:#ef4444;">1,323건</strong><br>→ 한도 1,000건 대비 <strong style="color:#ef4444;">+323건 초과</strong></div>
      <div style="text-align:center; margin-top:12px;"><span class="gauge-status over">❌ 첫 달 한도 초과</span></div>
    </div>
    <div class="gauge-card">
      <div class="gauge-card-title">Claude Sonnet 비용</div>
      <div class="gauge-card-api">목표 예산: 월 $10 이하</div>
      <div class="limit-bar-track">
        <div class="limit-bar-fill" style="width:33.3%; background: linear-gradient(90deg, #8b5cf6, #a78bfa);"></div>
        <div class="limit-marker" style="left: 33.3%;" data-label="목표 $10"></div>
        <div class="limit-bar-fill" style="width:66.7%; left:33.3%; background: linear-gradient(90deg, #ef4444, #fca5a5); border-radius: 0 6px 6px 0;"></div>
      </div>
      <div class="limit-labels"><span>$0</span><span style="color:#ef4444; font-weight:700;">$30+ 발생</span></div>
      <div style="margin-top:16px; font-size:12px; color:#94a3b8; line-height:1.7;"><strong style="color:#e2e8f0;">원인:</strong><br>3,000종목 전체를 Sonnet으로 처리<br>→ 스크리닝 단계 비용이 가장 큼<br>→ <strong style="color:#ef4444;">목표 예산의 3배 초과</strong></div>
      <div style="text-align:center; margin-top:12px;"><span class="gauge-status over">❌ 예산 300% 초과</span></div>
    </div>
  </div>
  <div style="background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); border-radius:12px; padding:16px 20px; display:flex; align-items:center; gap:16px;">
    <div style="font-size:28px;">✅</div>
    <div style="font-size:13px; color:#6ee7b7; line-height:1.6;"><strong style="color:#10b981;">해결:</strong> Brave Search → Google RSS(무료) + 네이버 뉴스로 대체.<br>Claude Sonnet → Gemini Flash-Lite(무료 티어)로 전환 후 비용 문제 해소.</div>
  </div>
</div>
</div>

**세 번째 실수: 비공식 크롤링에 의존하기**

초기에 yfinance로 주가 데이터를 가져왔습니다. 비공식 Yahoo Finance 크롤링이라 가끔 막히고 데이터가 이상하게 들어왔습니다. 한국 주식 특성상 데이터 누락이나 지연도 잦았습니다.


## 4. 실제로 작동한 기획 — 기획서 v3의 핵심 원칙

처음 아이디어를 잡고 바로 코딩에 들어가지 않았습니다. 기획서를 3번 고쳤습니다.

<div class="sv">
<div class="timeline">
  <p class="section-label">Visualization 02</p>
  <div class="timeline-title">기획서를 세 번 고친 이유</div>
  <div class="timeline-sub">각 버전마다 치명적인 문제가 있었습니다</div>
  <div class="tl-item">
    <div class="tl-left"><div class="tl-badge fail">v1</div></div>
    <div class="tl-right">
      <div class="tl-version fail">VERSION 1 — 실패</div>
      <div class="tl-heading">"뉴스 전체를 Claude에 직접 넣기"</div>
      <div class="tl-desc">가장 단순한 구조였습니다. 종목별 뉴스를 모두 Claude Sonnet에 넣어 판단받는 방식. 종목 20개 × 뉴스 10건 × Sonnet 요금을 계산하니 <strong style="color:#ef4444">매일 $2~3, 한 달에 $40~60</strong>이 나왔습니다.</div>
      <span class="tl-tag fail">❌ 월 비용 $40~60 — 현실 불가</span>
    </div>
  </div>
  <div class="tl-item">
    <div class="tl-left"><div class="tl-badge warn">v2</div></div>
    <div class="tl-right">
      <div class="tl-version warn">VERSION 2 — 개선 시도</div>
      <div class="tl-heading">"요약본만 Claude에 보내기"</div>
      <div class="tl-desc">비용을 줄이려고 뉴스를 먼저 요약한 뒤 Claude에 넘기는 방식으로 수정했습니다. 문제는 <strong style="color:#eab308">요약 자체도 AI를 써야 한다는 것</strong>. 결국 비용이 비슷하게 나왔습니다.</div>
      <span class="tl-tag warn">⚠️ 근본 해결 아님 — 비용 동일</span>
    </div>
  </div>
  <div class="tl-item">
    <div class="tl-left"><div class="tl-badge success">v3</div></div>
    <div class="tl-right">
      <div class="tl-version success">VERSION 3 — 채택</div>
      <div class="tl-heading">"역할을 명확하게 분리하기"</div>
      <div class="tl-desc">수집은 무료 소스(Google RSS, 네이버), 1차 필터는 규칙 기반 코드, 2차 판단은 저렴한 AI, 최종 분석만 고성능 LLM. 구조가 정해지자 <strong style="color:#10b981">월 $3 이하로 운영 가능</strong>해졌습니다.</div>
      <span class="tl-tag success">✅ 월 $3 이하 — 현재 운영 중</span>
    </div>
  </div>
</div>
</div>

v3에서 정한 원칙은 다음과 같습니다.

- 뉴스 수집은 무료 소스 우선(Google RSS, 네이버)으로 처리합니다.
- 1차 필터는 규칙 기반 코드로 처리합니다.
- 2차 판단은 저렴한 AI 모델을 씁니다.
- 최종 분석만 Claude Sonnet을 최소한으로 사용합니다.

v3 구조부터 실제로 만들 수 있다는 확신이 생겼습니다.


## 5. 솔직한 평가 — 어렵지만 가능합니다

이 주식 프로그램 개발 프로젝트에서 느낀 점을 솔직하게 정리합니다.

**좋은 점**: 아침마다 직접 뉴스를 찾아보는 시간이 없어졌습니다. 호재·악재 판단 결과가 카카오톡으로 바로 옵니다.

**아쉬운 점**: 처음 설계를 잘못하면 비용이 생각보다 크게 나옵니다. API 한도와 비용을 먼저 계산하지 않으면 첫 달에 바로 문제가 생깁니다. yfinance 같은 비공식 데이터 소스는 장기 운영에 적합하지 않습니다.

**난이도**: Python 기초 이상은 필요합니다. Docker와 cron 설정도 익혀야 합니다. NAS가 없으면 별도 서버가 필요합니다.

2편에서는 세 가지 문제를 어떻게 해결했는지 다룹니다. Claude Sonnet에서 Gemini Flash-Lite 무료 모델로 전환한 방법, yfinance에서 KIS 공식 API로 바꾼 이유, 뉴스 소스를 2개에서 5개로 늘리면서도 비용을 낮춘 방법을 정리할 예정입니다.
