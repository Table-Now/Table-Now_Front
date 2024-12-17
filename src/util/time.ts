// utils.ts

export const daysMap: { [key: string]: number } = {
  일요일: 0,
  월요일: 1,
  화요일: 2,
  수요일: 3,
  목요일: 4,
  금요일: 5,
  토요일: 6,
};

export const isOpenNow = (storeOpen: string, storeClose: string): boolean => {
  const koreaNow = new Date(); // 로컬 시간(한국 시간)

  const [openHour, openMinute] = storeOpen.split(":").map(Number);
  const [closeHour, closeMinute] = storeClose.split(":").map(Number);

  // 영업 시작 및 종료 시간을 설정
  const openTime = new Date(koreaNow);
  openTime.setHours(openHour, openMinute, 0);

  const closeTime = new Date(koreaNow);
  closeTime.setHours(closeHour, closeMinute, 0);

  return koreaNow >= openTime && koreaNow <= closeTime;
};

export const isWeekOff = (storeWeekOff: string): boolean => {
  const koreaNow = new Date();
  const todayIndex = koreaNow.getDay(); // 현재 요일 인덱스 (0 ~ 6)

  const weekOffDays = storeWeekOff?.split(",") || []; // 쉼표로 구분된 요일 목록
  return weekOffDays.some((day) => daysMap[day.trim()] === todayIndex);
};
