import React, {useEffect} from 'react';
import {Text, StyleSheet, SafeAreaView, Dimensions, View, ScrollView} from 'react-native';
import {useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {setScheduleItems} from '../../util/redux/scheduleSlice';
import {StackNavigationProp} from '@react-navigation/stack';
import Header from '../../components/Header';
import ScheduleList from '../../components/ScheduleList';
import {variables} from '../../style/variables';
import {Shadow} from 'react-native-shadow-2';
import {fetchScheduleItems} from '../../api/scheduleApi';
import {ScheduleData} from '../../util/dataConvert';
import {AuthProps} from '../../navigations/StackNavigator';

const {width, height} = Dimensions.get('window');

type navigationProp = StackNavigationProp<RootStackParamList, 'BoardEdit'>;
type ScheduleItems = Record<string, ScheduleData[]>;

type RootStackParamList = {
  BoardEdit: undefined;
  BoardDetail: {title: string; color: string; number: number};
};

type BoardDetailRouteProp = RouteProp<RootStackParamList, 'BoardDetail'>;

const BoardDetail: React.FC<AuthProps> = ({url}) => {
  const navigation = useNavigation<navigationProp>();
  const route = useRoute<BoardDetailRouteProp>();
  const token = useSelector((state: any) => state.user.token);
  const items = useSelector((state: any) => state.schedule.items);
  const setItems = (newItems: ScheduleItems) => {
    dispatch(setScheduleItems(newItems));
  };
  const {title, color, number} = route.params;
  const dispatch = useDispatch();

  const loadScheduleItems = async () => {
    if (url) {
      try {
        const fetchedItems = await fetchScheduleItems(url, token);
        if (title === '전체' && color === '#757575') {
          return fetchedItems;
        } else {
          const filteredItems = Object.keys(fetchedItems).reduce<ScheduleItems>((acc, date) => {
            acc[date] = fetchedItems[date].filter(
              item => item.tag.name === title && item.tag.color === color,
            );
            return acc;
          }, {});
          return filteredItems;
        }
      } catch (error) {
        console.error('Failed to load schedules:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      const newItems = await loadScheduleItems();
      if (newItems && JSON.stringify(items) !== JSON.stringify(newItems)) {
        dispatch(setScheduleItems(newItems));
      }
    })();
  }, [items]);
  console.log('items: ', JSON.stringify(items, null, 2));
  return (
    <SafeAreaView style={styles.container}>
      <Header title="스케줄 보드" type="edit" nextFunc={() => navigation.navigate('BoardEdit')} />
      <ScrollView style={styles.ScheduleItemList}>
        <Shadow
          style={styles.shadow}
          distance={8}
          startColor={'#00000010'}
          endColor={'#ffffff05'}
          offset={[0, 1]}>
          <View style={[styles.contentInfo, {backgroundColor: color}]}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.itemNumContainer}>
              <Text style={styles.textMemo}>total memo:</Text>
              <Text style={styles.textNum}> {number}</Text>
            </View>
          </View>
        </Shadow>
        <View style={styles.listContainer}>
          <ScheduleList items={items} setItems={setItems} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BoardDetail;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  ScheduleItemList: {
    width: '100%',
    height: '100%',
  },
  contentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginRight: 12,
    marginLeft: 12,
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 36,
    borderRadius: 12,
  },
  shadow: {
    width: '100%',
  },
  title: {
    fontFamily: variables.font_3,
    fontSize: 30,
    color: variables.text_7,
  },
  itemNumContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  textMemo: {
    fontFamily: variables.font_5,
    fontSize: 16,
    color: variables.text_7,
  },
  textNum: {
    fontFamily: variables.font_2,
    fontSize: 19,
    color: variables.text_7,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    marginRight: 12,
    marginLeft: 12,
    paddingBottom: 150,
  },
});
