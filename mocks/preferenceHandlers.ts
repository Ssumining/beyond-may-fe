import { http, HttpResponse, delay } from "msw";

import { API_ENDPOINTS } from "@/services/constant/endpoint";
import type { PreferenceQuestion } from "@/types/preference";

/**
 * 성향 검사 질문 mock.
 *
 * 실제 서비스에서는 백엔드가 전체 문제 풀 중 랜덤으로 선별해 내려준다.
 * 이 mock은 그 동작을 흉내 내기 위해, 아래 풀에서 무작위 7개를 뽑아 반환.
 * 백엔드 응답이 확정되면 이 파일을 제거한다.
 *
 * 질문 데이터는 기획 확정본(백엔드 반영 리스트)과 동일하게 유지한다.
 *
 *
 * TODO: 실제 선별 개수(현재 7)·랜덤 규칙은 서버 소관. (backend)
 *   프론트는 "받은 배열 길이"만 사용하므로 개수가 바뀌어도 UI 변경 x.
 */

/** 서버가 한 번에 내려주는 문항 수 (백엔드 확정 전 임시값) */
const SERVED_QUESTION_COUNT = 7;

/** 전체 문제 풀 (실제로는 백엔드 DB에 존재). order는 응답 시 재부여하므로 0으로 둠 */
const QUESTION_POOL: PreferenceQuestion[] = [
  {
    questionId: 1,
    order: 0,
    text: "여행 첫날, 광주에 도착하면 가장 먼저 가고 싶은 곳은?",
    options: [
      { optionId: 101, label: "A", text: "한글 이름이 예쁜 동네 책방" },
      { optionId: 102, label: "B", text: "SNS에서 본 그 빵집 줄서기" },
      { optionId: 103, label: "C", text: "국립아시아문화전당 전시" },
      { optionId: 104, label: "D", text: "옛 전남도청 앞 광장" },
    ],
  },
  {
    questionId: 2,
    order: 0,
    text: "여행지에서 사진을 찍는다면, 어떤 장면을 남기고 싶나?",
    options: [
      { optionId: 201, label: "A", text: "햇살 드는 카페 창가" },
      { optionId: 202, label: "B", text: "플레이팅이 예쁜 한 끼" },
      { optionId: 203, label: "C", text: "전시장의 독특한 조형물" },
      { optionId: 204, label: "D", text: "오래된 건물의 빈티지한 외관" },
    ],
  },
  {
    questionId: 3,
    order: 0,
    text: '친구가 "광주 가면 뭐 해?"라고 물으면 가장 먼저 떠오르는 답은?',
    options: [
      { optionId: 301, label: "A", text: "조용한 책방 투어" },
      { optionId: 302, label: "B", text: "맛집 리스트 짜기" },
      { optionId: 303, label: "C", text: "비엔날레나 공연 일정 체크" },
      { optionId: 304, label: "D", text: "5·18 사적지나 근대 건축 둘러보기" },
    ],
  },
  {
    questionId: 4,
    order: 0,
    text: "하루 일정에서 가장 많은 시간을 쓰고 싶은 활동은?",
    options: [
      { optionId: 401, label: "A", text: "카페에 앉아 멍 때리기" },
      { optionId: 402, label: "B", text: "여러 맛집 도장 깨기" },
      { optionId: 403, label: "C", text: "전시·공연 천천히 감상하기" },
      { optionId: 404, label: "D", text: "역사적 장소에서 이야기 찾아보기" },
    ],
  },
  {
    questionId: 5,
    order: 0,
    text: "여행 중 SNS에 올리고 싶은 콘텐츠 스타일은?",
    options: [
      { optionId: 501, label: "A", text: '"오늘의 무드" 감성 일기형' },
      { optionId: 502, label: "B", text: '"이 집 진짜 맛있음" 맛집 후기형' },
      { optionId: 503, label: "C", text: '"여기 인생샷 명소" 전시·공간형' },
      { optionId: 504, label: "D", text: '"이런 의미가 있는 곳이었다" 정보형' },
    ],
  },
  {
    questionId: 6,
    order: 0,
    text: "동행이 늦잠을 자서 시간이 비었다. 어떻게 보낼까?",
    options: [
      { optionId: 601, label: "A", text: "근처 책방에서 책 구경" },
      { optionId: 602, label: "B", text: "혼자 브런치 카페 탐색" },
      { optionId: 603, label: "C", text: "작은 갤러리나 전시 들르기" },
      { optionId: 604, label: "D", text: "동네 골목 산책하며 옛 흔적 찾기" },
    ],
  },
  {
    questionId: 7,
    order: 0,
    text: "광주 여행 후기를 쓴다면 제목은?",
    options: [
      { optionId: 701, label: "A", text: '"사색하기 좋은 도시, 광주"' },
      { optionId: 702, label: "B", text: '"광주는 먹으러 가는 도시"' },
      { optionId: 703, label: "C", text: '"예술이 흐르는 도시, 광주"' },
      { optionId: 704, label: "D", text: '"기억과 함께 걷는 도시"' },
    ],
  },
  {
    questionId: 8,
    order: 0,
    text: "여행지에서 가장 가치를 두는 경험은?",
    options: [
      { optionId: 801, label: "A", text: "나만의 여유와 생각할 시간" },
      { optionId: 802, label: "B", text: "새롭고 트렌디한 맛" },
      { optionId: 803, label: "C", text: "감각적이고 예술적인 자극" },
      { optionId: 804, label: "D", text: "의미와 역사를 배우는 것" },
    ],
  },
  {
    questionId: 9,
    order: 0,
    text: "동명동에 갔다면 가장 끌리는 장소는?",
    options: [
      { optionId: 901, label: "A", text: "분위기 좋은 독립서점" },
      { optionId: 902, label: "B", text: "줄서서 먹는 디저트 맛집" },
      { optionId: 903, label: "C", text: "소품샵이나 작은 갤러리" },
      { optionId: 904, label: "D", text: "오래된 골목의 옛 가옥" },
    ],
  },
  {
    questionId: 10,
    order: 0,
    text: "비 오는 날 광주 여행, 어디로 갈까?",
    options: [
      { optionId: 1001, label: "A", text: "통창 카페에서 책 읽기" },
      { optionId: 1002, label: "B", text: "따뜻한 국물 맛집" },
      { optionId: 1003, label: "C", text: "실내 전시관 관람" },
      { optionId: 1004, label: "D", text: "박물관에서 역사 둘러보기" },
    ],
  },
  {
    questionId: 11,
    order: 0,
    text: "여행 동선을 짤 때 가장 중요하게 보는 기준은?",
    options: [
      { optionId: 1101, label: "A", text: "한적하고 조용한 곳인지" },
      { optionId: 1102, label: "B", text: "맛집 밀집도" },
      { optionId: 1103, label: "C", text: "볼거리(전시·공연) 다양성" },
      { optionId: 1104, label: "D", text: "의미 있는 장소가 포함됐는지" },
    ],
  },
  {
    questionId: 12,
    order: 0,
    text: "양림동에 간다면 가장 기대되는 것은?",
    options: [
      { optionId: 1201, label: "A", text: "한옥 카페에서의 여유" },
      { optionId: 1202, label: "B", text: "골목 맛집 발견" },
      { optionId: 1203, label: "C", text: "근대 건축의 예술적 디테일" },
      { optionId: 1204, label: "D", text: "선교사 사택 등 역사 이야기" },
    ],
  },
  {
    questionId: 13,
    order: 0,
    text: '여행에서 "힐링됐다"고 느끼는 순간은?',
    options: [
      { optionId: 1301, label: "A", text: "좋아하는 책 한 권과 커피 한 잔" },
      { optionId: 1302, label: "B", text: "기대 이상의 맛있는 한 끼" },
      { optionId: 1303, label: "C", text: "마음을 울리는 작품을 만났을 때" },
      { optionId: 1304, label: "D", text: "그 장소의 사연을 알게 됐을 때" },
    ],
  },
  {
    questionId: 14,
    order: 0,
    text: "광주의 매력을 한마디로 표현하면?",
    options: [
      { optionId: 1401, label: "A", text: '"조용히 머물고 싶은 도시"' },
      { optionId: 1402, label: "B", text: '"먹으러 또 가고 싶은 도시"' },
      { optionId: 1403, label: "C", text: '"볼거리가 많은 도시"' },
      { optionId: 1404, label: "D", text: '"기억할 게 많은 도시"' },
    ],
  },
  {
    questionId: 15,
    order: 0,
    text: "여행 마지막 날, 가장 아쉬운 건?",
    options: [
      { optionId: 1501, label: "A", text: "더 둘러보지 못한 책방·카페" },
      { optionId: 1502, label: "B", text: "더 못 먹어본 맛집들" },
      { optionId: 1503, label: "C", text: "못 본 전시·공연" },
      { optionId: 1504, label: "D", text: "더 못 들은 도시의 이야기" },
    ],
  },
  {
    questionId: 16,
    order: 0,
    text: "여행 중 우연히 발견한 좁은 골목길, 내 시선이 가장 먼저 머무는 곳은?",
    options: [
      {
        optionId: 1601,
        label: "A",
        text: "잔잔한 음악 소리가 새어 나오는 작은 지하 공간",
      },
      {
        optionId: 1602,
        label: "B",
        text: "고소한 버터 냄새가 풍기는 신상 베이커리의 입간판",
      },
      {
        optionId: 1603,
        label: "C",
        text: "담벼락에 그려진 독특한 그래피티나 감각적인 포스터",
      },
      {
        optionId: 1604,
        label: "D",
        text: "세월의 흔적이 그대로 묻어나는 빛바랜 옛 간판",
      },
    ],
  },
  {
    questionId: 17,
    order: 0,
    text: "여행지에서 가장 '돈과 시간'이 아깝지 않다고 느끼는 플렉스(Flex)는?",
    options: [
      {
        optionId: 1701,
        label: "A",
        text: "마음에 드는 독립서점에서 책 세 권과 굿즈 충동 구매",
      },
      {
        optionId: 1702,
        label: "B",
        text: "예약하기 힘든 파인다이닝이나 로컬 핫플 디저트 풀코스",
      },
      {
        optionId: 1703,
        label: "C",
        text: "한정판 굿즈가 포함된 특별 미디어아트 전시 티켓",
      },
      {
        optionId: 1704,
        label: "D",
        text: "전문 해설사와 함께 깊이 있게 걷는 역사·건축 로컬 투어",
      },
    ],
  },
  {
    questionId: 18,
    order: 0,
    text: "완벽한 하루를 보내고 숙소로 돌아왔을 때, 내가 느끼는 가장 큰 뿌듯함은?",
    options: [
      {
        optionId: 1801,
        label: "A",
        text: "복잡했던 머릿속이 맑아지고 나만의 문장을 정리했을 때",
      },
      {
        optionId: 1802,
        label: "B",
        text: "웨이팅 맛집들을 모두 성공하고 배부르게 하루를 마쳤을 때",
      },
      {
        optionId: 1803,
        label: "C",
        text: "내 마음에 쏙 드는 영감 가득한 공간과 인생샷을 건졌을 때",
      },
      {
        optionId: 1804,
        label: "D",
        text: "교과서나 뉴스에서만 보던 장소의 숨은 서사를 직접 체감했을 때",
      },
    ],
  },
  {
    questionId: 19,
    order: 0,
    text: "KTX를 타고 광주송정역에 막 내린 순간, 내가 켠 지도 앱에서 가장 먼저 검색하는 단어는?",
    options: [
      { optionId: 1901, label: "A", text: "#조용한 #독립서점" },
      { optionId: 1902, label: "B", text: "#창억떡 #로컬맛집" },
      { optionId: 1903, label: "C", text: "#광주극장 #복합문화공간" },
      { optionId: 1904, label: "D", text: "#518사적지 #근대건축" },
    ],
  },
  {
    questionId: 20,
    order: 0,
    text: "광주의 핫플레이스 '동명동'에 도착했다. 골목길을 걷다 내가 불쑥 들어가고 싶은 문은?",
    options: [
      {
        optionId: 2001,
        label: "A",
        text: "간판도 작고 조용해서 나만의 아지트 같은 독립서점",
      },
      {
        optionId: 2002,
        label: "B",
        text: "SNS에서 요즘 제일 뜨거운 크림순대국이나 신상 디저트 맛집",
      },
      {
        optionId: 2003,
        label: "C",
        text: "실험적인 미디어아트나 독특한 소품들을 전시해 둔 복합 갤러리 숍",
      },
      {
        optionId: 2004,
        label: "D",
        text: "세월의 결이 깃든 오래된 가옥을 그대로 보존해 둔 빈티지 공간",
      },
    ],
  },
  {
    questionId: 21,
    order: 0,
    text: "내가 여행지를 결정할 때, 인스타그램이나 유튜브에서 검색하는 핵심 키워드는?",
    options: [
      { optionId: 2101, label: "A", text: "#혼자여행 #생각정리 #한적한북카페" },
      { optionId: 2102, label: "B", text: "#빵지순례 #웨이팅맛집 #인생디저트" },
      {
        optionId: 2103,
        label: "C",
        text: "#전시회추천 #미디어아트 #인생샷명소",
      },
      {
        optionId: 2104,
        label: "D",
        text: "#역사투어리즘 #근대문화골목 #역사여행",
      },
    ],
  },
];

/** Fisher-Yates 셔플로 풀에서 count개를 뽑아 order를 1부터 재부여 */
const pickRandomQuestions = (count: number): PreferenceQuestion[] => {
  const shuffled = [...QUESTION_POOL];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled.slice(0, count).map((question, index) => ({
    ...question,
    order: index + 1,
  }));
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const preferenceHandlers = [
  http.get(`${BASE_URL}${API_ENDPOINTS.preference.questions}`, async () => {
    // 로딩 화면 연출용 지연. 실제 백엔드 연결 시 제거.
    await delay(800);
    return HttpResponse.json({
      code: 200,
      data: { questions: pickRandomQuestions(SERVED_QUESTION_COUNT) },
      message: "OK",
    });
  }),
];
