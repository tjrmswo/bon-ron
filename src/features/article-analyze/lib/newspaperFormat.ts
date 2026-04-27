const SOURCE_MAP: Record<string, string> = {
  // 통신사
  'www.yna.co.kr': '연합뉴스',
  'www.newsis.com': '뉴시스',
  'www.news1.kr': '뉴스1',

  // 종합 일간지
  'www.chosun.com': '조선일보',
  'www.donga.com': '동아일보',
  'www.joongang.co.kr': '중앙일보',
  'www.hani.co.kr': '한겨레',
  'www.khan.co.kr': '경향신문',
  'www.kmib.co.kr': '국민일보',
  'www.segye.com': '세계일보',
  'www.munhwa.com': '문화일보',
  'www.seoul.co.kr': '서울신문',
  'www.hankookilbo.com': '한국일보',
  'www.naeil.com': '내일신문',
  'www.dt.co.kr': '디지털타임스',

  // 경제지
  'www.hankyung.com': '한국경제',
  'www.mk.co.kr': '매일경제',
  'www.sedaily.com': '서울경제',
  'biz.chosun.com': '조선비즈',
  'www.edaily.co.kr': '이데일리',
  'www.etnews.com': '전자신문',
  'www.fnnews.com': '파이낸셜뉴스',
  'www.thebell.co.kr': '더벨',
  'www.businesspost.co.kr': '비즈니스포스트',
  'www.inews24.com': '아이뉴스24',
  'www.bloter.net': '블로터',
  'www.zdnet.co.kr': 'ZDNet Korea',

  // 방송사
  'news.kbs.co.kr': 'KBS',
  'imnews.imbc.com': 'MBC',
  'news.sbs.co.kr': 'SBS',
  'www.ytn.co.kr': 'YTN',
  'www.yonhapnewstv.co.kr': '연합뉴스TV',
  'news.jtbc.co.kr': 'JTBC',
  'www.mbn.co.kr': 'MBN',
  'www.tvchosun.com': 'TV조선',
  'www.channela.com': '채널A',

  // 인터넷 매체
  'www.ohmynews.com': '오마이뉴스',
  'www.pressian.com': '프레시안',
  'www.mediatoday.co.kr': '미디어오늘',
  'www.newspim.com': '뉴스핌',
  'www.newdaily.co.kr': '뉴데일리',
  'www.pennmike.com': '펜앤드마이크',
  'www.sisain.co.kr': '시사IN',
  'www.sisajournal.com': '시사저널',
  'www.weekly.khan.co.kr': '주간경향',
  'news.tf.co.kr': '더팩트',
  'www.womennews.co.kr': '여성신문',
  'www.ddaily.co.kr': '디지털데일리',

  // 지역지
  'www.busan.com': '부산일보',
  'www.kookje.co.kr': '국제신문',
  'www.imaeil.com': '매일신문',
  'www.jemin.com': '제민일보',
  'www.jejunews.com': '제주신문',
};

export function getSourceName(originallink: string) {
  try {
    const domain = new URL(originallink).hostname;
    return SOURCE_MAP[domain] ?? domain; // 매핑 없으면 도메인 그대로 반환
  } catch {
    return '알 수 없음';
  }
}
