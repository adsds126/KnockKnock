import axios, {AxiosError} from 'axios';
import {ScheduleData, SetScheduleData} from '../util/dataConvert';
import {format} from 'date-fns';

type ScheduleItems = Record<string, ScheduleData[]>;

export const fetchScheduleItems = async (url: string, token: string): Promise<ScheduleItems> => {
  try {
    const response = await axios.get(`${url}api/v1/schedule`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    const fetchedData = response.data.body.data;
    const newItems: ScheduleItems = {};

    fetchedData.forEach((item: ScheduleData) => {
      if (item.tag === null) {
        item.tag = {
          name: '전체',
          color: '#757575',
          tagId: 0,
        };
      }
      const convertedData: ScheduleData = item;
      const dateKey = format(new Date(convertedData.startAt), 'yyyy-MM-dd');
      if (!newItems[dateKey]) {
        newItems[dateKey] = [];
      }
      newItems[dateKey].push(convertedData);
    });
    return newItems;
  } catch (error) {
    console.error('API call failed', error);
    throw error as AxiosError;
  }
};

export const fetchScheduleWithTag = async (
  url: string,
  token: string,
  tagId: number,
): Promise<ScheduleItems> => {
  try {
    const response = await axios.get(`${url}api/v1/tags/${tagId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const fetchedData = response.data.body.data.schedules;
    const newItems: ScheduleItems = {};
    const formatDateToUnifiedFormat = (dateString: string): string => {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
    };

    fetchedData.forEach((item: ScheduleData) => {
      item.startAt = formatDateToUnifiedFormat(item.startAt);
      item.endAt = formatDateToUnifiedFormat(item.endAt);

      const convertedData: ScheduleData = item;
      const dateKey = format(new Date(convertedData.startAt), 'yyyy-MM-dd');
      if (!newItems[dateKey]) {
        newItems[dateKey] = [];
      }
      newItems[dateKey].push(convertedData);
    });
    return newItems;
  } catch (error) {
    console.error('API call failed', error);
    throw error;
  }
};

export const postScheduleItem = async (url: string, token: string, data: SetScheduleData) => {
  try {
    const response = await axios.post(`${url}api/v1/schedule`, data, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error) {
    console.error('API call failed', error);
    throw error;
  }
};

export const patchScheduleItem = async (
  url: string,
  token: string,
  scheduleId: number,
  data: any,
) => {
  try {
    const response = await axios.patch(`${url}api/v1/schedule/${scheduleId}`, data, {
      headers: {Authorization: `Bearer ${token}`},
    });
    return response.data;
  } catch (error) {
    console.error('API call failed', error);
    return false;
  }
};

export const deleteScheduleItem = async (url: string, token: string, scheduleId: number) => {
  try {
    const response = await axios.delete(`${url}api/v1/schedule/${scheduleId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (response.status === 200 || response.status === 204) {
      return true;
    } else {
      console.error(`API responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('API call failed', error);
    return false;
  }
};
