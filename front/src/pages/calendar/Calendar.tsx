import React, {useState} from 'react';
import {Agenda} from 'react-native-calendars';
import {StyleSheet, View, StatusBar, Platform, Dimensions} from 'react-native';
import calendarData from './calendarData.json';
import {variables} from '../../style/variables';
import {loadItems} from './CalendarUtil';
import {theme, markedDates} from './style.calendar';
import {MarkedDate, ItemsData} from './style';
import ProfileHeader from '../../components/ProfileHeader';
import LinearGradient from 'react-native-linear-gradient';
import ScheduleItemList from '../../components/ScheduleItemList';

const {width, height} = Dimensions.get('window');

const Calendar: React.FC = () => {
  const [items, setItems] = useState<ItemsData>({}); // 랜더링 할 아이템 state로 저장 & 업데이트
  const [selected, setSelected] = useState(() => new Date()); // 선택한 날짜 state로 저장 & 업데이트
  const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  const multiDotProps = (): Record<string, MarkedDate> => {
    const markedDates: Record<string, MarkedDate> = {};

    calendarData.forEach((data, index) => {
      const date = data.startAt.split(' ')[0];
      const tag = data.tag;

      if (!markedDates[date]) {
        markedDates[date] = {
          selected: selected === new Date(date),
          selectedColor: 'white',
          selectedTextColor: variables.main,
          marked: true,
          dots: [],
        };
      }

      if (tag) {
        const dot = {
          key: String(index),
          color: tag.color,
          selectedDotColor: tag.color,
        };
        markedDates[date].dots.push(dot);
      }
    });

    return markedDates;
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <Agenda
        style={styles.calendar}
        onDayPress={day => {
          setSelected(new Date(day.dateString));
        }}
        items={items}
        renderList={items => ScheduleItemList(items, setItems)}
        markingType={'multi-dot'}
        loadItemsForMonth={day => loadItems(day, setItems, calendarData)}
        selected={today}
        showClosingKnob={false}
        showSixWeeks={true}
        theme={theme}
        markedDates={{...markedDates(selected, today), ...multiDotProps()}}
        pagingEnabled={true} // 페이지 단위로 스냅하도록 설정
        initialNumToRender={5}
        windowSize={3}
        maxToRenderPerBatch={3}
        updateCellsBatchingPeriod={20}
        removeClippedSubviews={false}
        onEndReachedThreshold={0.1}
      />
      <LinearGradient
        style={[styles.linearGradient]}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1.2}}
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
      />
      <StatusBar />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    ...Platform.select({
      ios: {top: (width - 67) / 8},
      android: {top: (width - 150) / 8},
    }),
    height: height,
  },
  calendar: {
    marginTop: 5,
    height: 360,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  scheduleListContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingLeft: 24,
    paddingRight: 24,
  },
  listDateTitle: {
    fontFamily: variables.font_3,
    color: variables.text_5,
    fontSize: 14,
    marginTop: 20,
    marginBottom: 20,
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    ...Platform.select({
      ios: {height: '15%', bottom: 42},
      android: {height: '18%', bottom: 25},
    }),
  },
});

export default Calendar;
