export interface ApiResponseData {
  scheduleId: number;
  title: string;
  content: string;
  period: string;
  startAt: string;
  endAt: string;
  alerts: number[];
  createdAt: string;
  modifiedAt: string;
  complete: boolean;
  tag: {
    name: string;
    color: string;
    tagId?: number;
  };
}

export interface ScheduleData {
  scheduleId: number;
  name: string;
  height: number;
  day: string;
  complete: boolean;
  startAt: string;
  endAt: string;
  content: string;
  period: string;
  alerts: number[];
  modifiedAt: string;
  tag: {
    name: string;
    color: string;
    tagId?: number;
  };
}

export interface SetScheduleData {
  title: string;
  name?: string;
  content: string;
  period: string;
  startAt: string;
  endAt: string;
  alerts: number[];
  complete: boolean;
  tagId?: number;
}

export type BoardDataItem = {
  tagId: number;
  name: string;
  color: string;
  scheduleCount: number;
};

export type SetBoardData = {
  tag: {
    name: string;
    color: string;
    tagId?: number;
  };
};
export interface SearchData {
  keyword: string;
  startAt: string;
  endAt: string;
}

type DayData = {
  dateString: string;
  day: number;
  month: number;
  timestamp: number;
  year: number;
};

const dateCache: {[key: string]: string} = {}; // 날짜 포맷 결과를 저장할 캐시 객체

const dateFormat = (dateString: string) => {
  if (dateCache[dateString]) {
    // 캐시에 저장된 결과가 있으면 캐시된 결과를 반환
    return dateCache[dateString];
  } else {
    // 캐시에 결과가 없으면 새로 계산하고 캐시에 저장
    const formattedDate = new Date(
      new Date(dateString).getTime() - new Date().getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split('T')[0];
    dateCache[dateString] = formattedDate; // 결과를 캐시에 저장
    return formattedDate;
  }
};

const convertResponseData = (resData: ApiResponseData) => {
  const {
    scheduleId,
    title,
    content,
    period,
    startAt,
    endAt,
    alerts,
    createdAt,
    modifiedAt,
    complete,
    tag,
  } = resData;

  const calendarData: ScheduleData = {
    scheduleId,
    name: title,
    height: 0,
    day: dateFormat(createdAt), // formatDate로 형식 일치시킴
    complete,
    startAt,
    endAt,
    modifiedAt,
    content,
    period,
    alerts,
    tag,
  };

  return calendarData;
};

export {convertResponseData, dateFormat};
