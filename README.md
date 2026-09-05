# 본론 (Bon-Ron)

> **"같은 사건, 다른 시각 — 여러 매체의 보도를 30초 안에 구조화해서 나란히 본다"**

**배포**: [bon-ron.vercel.app](https://bon-ron.vercel.app) | **GitHub**: [github.com/tjrmswo/bon-ron](https://github.com/tjrmswo/bon-ron) | **개발 기간**: 2026.04 ~ 2026.05 (1인 개발)

## 목차
- [프로젝트 소개](#-프로젝트-소개)
- [기술 스택](#-기술-스택)
- [아키텍처](#아키텍처)
- [기술적 의사결정](#-기술적-의사결정)
  - [1. GPT-4o-mini 유지 재확인 — 실측 비교 (vs Embeddings, GPT-5-mini, GPT-5.4-nano)](#1-gpt-4o-mini-유지-재확인--실측-비교-vs-embeddings-gpt-5-mini-gpt-54-nano)
  - [2. 실사용자 행동 데이터 기반 flat 모드 제거](#2-실사용자-행동-데이터-기반-flat-모드-제거)
  - [3. Zod preprocess로 LLM 비정형 응답 방어](#3-zod-preprocess로-llm-비정형-응답-방어)
  - [4. 분석 결과 영속화 및 카카오 공유 링크 설계](#4-분석-결과-영속화-및-카카오-공유-링크-설계)
  - [5. 배포 안정성 — Supabase 자동 정지 이슈 해결](#5-배포-안정성--supabase-자동-정지-이슈-해결)
- [실행 방법](#실행-방법)

## 📌 프로젝트 소개

같은 사건을 다루는 여러 언론사의 기사를 비교해보고 싶을 때, 직접 찾아서 읽는 건 너무 번거롭습니다. AI로 이미지·영상 조작이 쉬워진 환경에서 보도 방식 자체를 비교해보는 정보 판별력이 점점 더 필요해진다는 문제의식에서 출발했습니다.

**본론**은 검색어 하나로 여러 언론사의 보도 방식을 자동 수집하고, GPT-4o-mini가 WHO / WHAT / WHY / WHEN·WHERE / TONE 항목으로 구조화해 나란히 보여주는 뉴스 분석 서비스입니다. 포트폴리오 및 문제의식 검증을 위한 개인 프로젝트로, 기획부터 배포까지 단독으로 진행했습니다 (현재는 코드 품질 개선을 위한 리팩토링만 지속 중).

### 핵심 기능

- **검색 모드** — 네이버 뉴스 API로 기사 수집 → GPT-4o-mini 클러스터링으로 같은 사건별 그룹화 → 2개 선택 → 비교 분석
- **붙여넣기 모드** — 원하는 기사 본문을 직접 붙여넣어 단독 심층 분석
- **결과 공유** — 분석 결과가 고유 URL(`/result/[id]`)로 영구 저장되어 카카오 공유 가능
- **최근 분석 목록** — 메인 페이지에 최근 분석 사례를 노출해 서비스 방향성 제시

## 🛠 기술 스택

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=flat-square)
![Kakao](https://img.shields.io/badge/Kakao_SDK-FFCD00?style=flat-square&logo=kakao&logoColor=000000)

### Backend / Infra
![OpenAI](https://img.shields.io/badge/GPT--4o--mini-412991?style=flat-square&logo=openai&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Naver](https://img.shields.io/badge/Naver_Search_API-03C75A?style=flat-square&logo=naver&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)

## 아키텍처

검색 모드와 붙여넣기 모드 둘 다 동일한 분석 파이프라인(`/api/analyze`)으로 합류하고, LLM 응답은 Zod preprocess 방어 레이어를 거쳐 Supabase에 영속화됩니다.

```mermaid
flowchart TD
    User([사용자]) --> Mode{입력 방식}

    Mode -->|검색 모드| Search["/api/search<br/>네이버 뉴스 API"]
    Mode -->|붙여넣기 모드| Paste[기사 본문 직접 입력]

    Search --> SiteName["/api/site-name<br/>언론사명 파싱<br/>(SOURCE_MAP → og:site_name → 도메인)"]
    SiteName --> Cluster["/api/cluster<br/>GPT-4o-mini 클러스터링"]
    Cluster --> Select[사용자가 같은 사건 기사 2개 선택]

    Select --> Analyze["/api/analyze<br/>GPT-4o-mini 분석<br/>WHO·WHAT·WHY·WHEN·WHERE·TONE"]
    Paste --> Analyze

    Analyze --> Zod[Zod preprocess<br/>LLM 비정형 응답 방어]
    Zod --> Supabase[(Supabase<br/>분석 결과 영구 저장)]
    Supabase --> Result["/result/[id]<br/>결과 페이지 · 카카오 공유"]
    Result --> User

    Cluster -.GPT 호출 실패 시.-> Fallback[단일 그룹 반환<br/>Route 레벨 폴백]
    Fallback --> Select
```

### FSD 레이어 구조

```
src/
├─ app/                     # Next.js App Router (페이지, API Routes)
│   ├─ api/
│   │   ├─ analyze/         # 기사 분석 (GPT-4o-mini)
│   │   ├─ cluster/         # 클러스터링 (GPT-4o-mini)
│   │   ├─ search/          # 뉴스 검색 (네이버 API)
│   │   └─ site-name/       # 언론사명 파싱 (og:site_name)
│   └─ result/[id]/         # 분석 결과 페이지
│
├─ features/
│   └─ article-analyze/     # 핵심 기능 (검색, 분석, 결과 표시)
│       ├─ api/             # 서버 통신 훅
│       ├─ model/           # 비즈니스 로직, 상태 관리
│       ├─ lib/             # 유틸리티 함수
│       └─ ui/              # UI 컴포넌트
│
├─ entities/
│   └─ analysis/            # 분석 도메인 엔티티
│
└─ shared/                  # 공통 컴포넌트, 유틸리티
```

## 🔍 기술적 의사결정

아래 5개는 이력서·포트폴리오에 압축된 의사결정을 이 프로젝트 안에서 어떤 시행착오를 거쳐 내렸는지 풀어서 정리한 것입니다.

### 1. GPT-4o-mini 유지 재확인 — 실측 비교 (vs Embeddings, GPT-5-mini, GPT-5.4-nano)

#### 왜 문제였는가
뉴스 클러스터링은 이미 gpt-4o-mini 기반 LLM 호출로 구현되어 정상 동작하고 있었습니다. 다만 기사 수가 많아질수록 응답 속도가 느려지고 호출 비용도 누적돼, 처리 속도 개선과 비용 절감을 목표로 더 가볍고 저렴한 모델로 교체할 수 있는지를 검토하기 시작했습니다. 첫 시도는 `text-embedding-3-small` 임베딩 방식이었습니다 — LLM 호출 없이 벡터 유사도만으로 판단하면 속도·비용을 크게 줄일 수 있다고 봤기 때문입니다. 하지만 코사인 유사도 threshold를 0.40까지 낮춰도 "이란 협상 무산"과 "이란 핵 회담 결렬"처럼 같은 사건을 다르게 표현한 한국어 기사는 벡터 거리가 멀어 묶이지 않는 문제가 반복됐습니다. 임베딩만으로는 맥락 이해가 안 된다는 걸 재확인해 LLM 기반 접근을 유지하기로 했고, 그렇다면 기존 gpt-4o-mini보다 더 빠르고 저렴한 LLM이 있는지가 새로운 문제로 남았습니다.

#### 어떻게 결정했는가
1차로 시도한 GPT-5-mini는 `temperature: 0` 파라미터 자체가 지원되지 않아 에러가 발생했고, 3회 호출에 $0.02라는 비용도 감당하기 어려운 수준이라 후보에서 제외했습니다. 후보를 gpt-5.4-nano와 gpt-4o-mini 두 개로 좁히고, 동일 프롬프트로 순차 호출해 직접 실측했습니다. gpt-5.4-nano는 응답속도 2,069ms로 gpt-4o-mini(2,991ms)보다 44% 빨랐지만, 기사 수가 많아질수록 뒷부분 기사의 맥락 처리에 실패해 그룹 분류 오류가 발생했습니다. 비용도 예상과 반대였습니다 — gpt-5.4-nano는 입력 단가는 낮지만 출력 토큰이 3배 많이 나와, 실측 비용이 gpt-4o-mini보다 오히려 88% 더 높게 측정됐습니다. "빠르다"는 인상만으로 판단하지 않고 속도·정확도·실측 비용 세 축을 모두 놓고 비교한 뒤에야 gpt-4o-mini를 최종 채택했습니다.

| 모델 | 응답 속도 | 비용/회(20개 기사 기준) | 정확도 | 결과 |
|---|---|---|---|---|
| text-embedding-3-small | 1초대 | 거의 0 | 한국어 뉴스에서 실패 | ❌ 포기 |
| GPT-5-mini | 33초 | $0.007 | 미확인 | ❌ 비용·속도 불가 |
| gpt-5.4-nano | 2,069ms | $0.000692 | 뒷부분 맥락 처리 오류 | ❌ 정확도 문제 |
| gpt-4o-mini | 2,991ms | $0.000368 | 정상 | ✅ 채택 |

#### 결과와 트레이드오프
gpt-5.4-nano 대비 비용이 88% 더 높다는 실측 결과를 근거로 채택한 gpt-4o-mini가 실제 운영에서도 그대로 유지됐고, gpt-5.4-nano에서 발생했던 맥락 처리 오류도 재발하지 않았습니다. 입력 토큰을 기사당 title 40자 + description 60자로 제한하고 max_tokens을 1500으로 명시해, 20개 기사 기준 응답 속도도 평균 1.5~4.7초(약 2초대)로 단축했습니다. 다만 응답 속도 자체는 gpt-5.4-nano보다 여전히 느린 편이라, 기사 수가 더 늘어나는 시나리오에서는 스트리밍이나 배치 처리 같은 별도의 체감 속도 개선이 필요할 수 있습니다. 호출 실패나 기사 누락 시에는 해당 기사를 자동으로 "기타" 그룹에 배정하는 방어 로직을 Route 레벨에 별도로 구현해 서비스 중단을 방지했습니다.

> "더 빠르다"는 인상은 실측 앞에서 자주 뒤집혔습니다. 이후로는 체감 판단을 코드에 반영하기 전에 반드시 동일 조건에서 실측 비교부터 하는 습관이 생겼습니다.

### 2. 실사용자 행동 데이터 기반 flat 모드 제거

#### 왜 문제였는가
본론은 AI가 같은 사건끼리 묶어 보여주는 cluster 모드와, 그룹 없이 나열하는 flat 모드를 함께 제공하고 있었습니다. 두 모드 다 만들어는 놨지만, 어느 쪽이 실제로 서비스의 핵심 가치(같은 사건, 다른 시각 비교)에 기여하는지는 감으로만 판단하고 있었습니다.

#### 어떻게 결정했는가
개발자 커뮤니티(OKKY)에 서비스를 공개하고 실사용 후기를 요청해 실제 트래픽과 행동 로그를 확보했습니다. Supabase `experiment_logs` 테이블에 `compare_start`(비교 시작), `deselect`, `kakao_share`, `original_link_click` 같은 행동 이벤트를 미리 설계해 로깅해뒀고, dev/production 로그는 환경 컬럼으로 구분해 통계 오염을 방지했습니다. 커뮤니티 유입 실사용자 데이터 27건(7개 검색어)을 분석한 결과, flat 모드로 기사를 넘겨본 사례(예: 롤드컵 검색)에서 개별 기사를 열어보는 deselect 행동은 있었지만, 비교 기능 시작을 의미하는 compare_start 전환은 단 한 건도 없었습니다. "A/B 테스트가 아니라 실제 사용자 행동 데이터를 근거로 판단해야 한다"는 원칙에 따라 이 패턴을 그대로 의사결정에 반영했습니다.

#### 결과와 트레이드오프
flat 모드의 compare_start 전환 0건을 근거로 flat 모드를 제거하고 cluster 단일 모드로 통일했습니다. 같은 데이터 분석에서 클러스터당 노출 기사 수가 많을수록 사용자가 비교를 포기하는 선택 피로 패턴도 함께 발견해, 클러스터당 노출 기사 수를 최대 4개로 제한하는 후속 개선까지 이어갔습니다. 다만 표본 27건은 통계적으로 유의하다고 주장할 수 있는 규모는 아니었습니다. "0건"이라는 신호는 표본 크기와 무관하게 방향성이 명확했기에, 완벽한 통계적 근거를 기다리기보다 관찰된 실제 행동 패턴을 근거로 빠르게 의사결정하는 쪽을 택했습니다.

### 3. Zod preprocess로 LLM 비정형 응답 방어

#### 왜 문제였는가
OpenAI 응답이 비결정적이라 `keywords` 필드가 배열 대신 쉼표로 구분된 문자열로 오거나, null이어야 할 필드에 "없음"·"null" 같은 문자열이 섞여 들어오는 등 프롬프트 지시만으로는 통제되지 않는 비정형 응답이 반복됐습니다. 이런 응답이 그대로 UI에 바인딩되면 화면이 깨지거나 런타임 오류로 이어질 위험이 컸습니다.

#### 어떻게 결정했는가
프롬프트를 더 엄격하게 다듬어봤지만, 프롬프트 수정만으로는 LLM 출력을 완전히 제어할 수 없다는 한계를 확인했습니다. 그래서 Zod의 `preprocess`로 파싱 전 응답을 정제하는 스키마 레벨 방어 레이어를 구축했습니다. `keywords`는 `split(',')`으로 배열로 변환하고, 오염된 null 문자열은 정규식으로 제거한 뒤 `null`로 치환했습니다. 프롬프트 기준(40자)보다 Zod 기준(80자)에 여유를 둬, 프롬프트가 완벽히 지켜지지 않아도 과도하게 엄격한 파싱 실패로 이어지지 않도록 했습니다.

#### 결과
"프롬프트로 1차 제어 → Zod로 2차 방어 → 코드로 3차 보완"이라는 3단계 방어 패턴을 확립해, 화면 깨짐과 런타임 오류를 사전에 차단했습니다.

### 4. 분석 결과 영속화 및 카카오 공유 링크 설계

#### 왜 문제였는가
분석 결과를 클라이언트 상태로만 들고 있어, 새로고침하거나 다른 사람에게 공유하면 결과가 그대로 사라졌습니다. 비교 분석이라는 서비스의 핵심 산출물이 휘발성이라는 건 구조적인 문제였습니다.

#### 어떻게 결정했는가
Supabase PostgreSQL에 분석 결과를 저장하고 고유 id를 발급해 `/result/[id]` 동적 라우팅으로 결과 페이지를 구성했습니다. 로그인 기능 없이도 링크만으로 결과에 접근할 수 있게 설계해, 카카오톡 공유 같은 캐주얼한 공유 시나리오에 맞췄습니다.

#### 결과와 트레이드오프
비로그인 상태에서도 링크 공유만으로 결과를 재방문할 수 있는 구조로 전환했습니다. 다만 인증 없이 id만으로 접근 가능한 구조라, 결과 URL이 유출되면 누구나 볼 수 있다는 트레이드오프가 있습니다. 개인 식별 정보가 포함되지 않는 분석 결과라는 점에서 현재는 허용 가능한 리스크로 판단했습니다.

### 5. 배포 안정성 — Supabase 자동 정지 이슈 해결

#### 왜 문제였는가
Supabase 무료 티어는 7일간 DB 활동이 없으면 프로젝트를 자동으로 일시정지합니다. 포트폴리오·이력서에서 실제 동작하는 서비스로 링크되는 만큼, 방문 시점에 서비스가 꺼져 있으면 신뢰도에 직접적인 타격으로 이어질 수 있었습니다.

#### 어떻게 결정했는가
Pro 플랜 업그레이드도 검토했지만 개인 프로젝트에 매달 비용을 들일 만큼의 트래픽은 아니라고 판단해, GitHub Actions로 매일 1회(UTC 3시) DB에 가벼운 조회 쿼리를 보내는 heartbeat 워크플로우를 구성했습니다. Next.js API Route(`/api/heartbeat`)에 인증 헤더(`x-heartbeat-secret`)를 적용해 외부에서 임의로 호출하지 못하도록 막았습니다.

#### 결과
추가 비용 없이 무료 티어에서 서비스 상시 가동을 유지했고, 자동 정지로 인한 서비스 중단 위험을 제거했습니다.

## 실행 방법

### 사전 요구사항

- Node.js 18 이상
- pnpm

### 설치

```bash
git clone https://github.com/tjrmswo/bon-ron.git
cd bon-ron
pnpm install
```

### 환경변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력합니다.

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# 네이버 검색 API
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 카카오 (선택)
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_js_key
```

### 개발 서버 실행

```bash
pnpm dev
```

[http://localhost:4000](http://localhost:4000) 에서 확인

### 빌드

```bash
pnpm build
pnpm start
```
