import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ScheduleOptionSelect from '../../components/ScheduleOptionSelect';
import ScheduleOptionToggle from '../../components/ScheduleOptionToggle';
import {SetBoardData, SetScheduleData} from '../../util/dataConvert';
import Selector from '../../components/BottomSheet';
import Icon from 'react-native-vector-icons/Ionicons';
import {variables} from '../../style/variables';

interface ScheduleOptionProps {
  postSchedule: SetScheduleData;
  setPostSchedule: React.Dispatch<React.SetStateAction<SetScheduleData>>;
  postTag: SetBoardData;
  setPostTag: React.Dispatch<React.SetStateAction<SetBoardData>>;
  getCurrentDateStartAndEnd?: any;
  onNotificationChange: (notifications: number[] | null) => void;
}

const ScheduleAddOption: React.FC<ScheduleOptionProps> = ({
  postSchedule,
  setPostSchedule,
  postTag,
  setPostTag,
  getCurrentDateStartAndEnd,
  onNotificationChange,
}) => {
  const [boardIsOpen, setBoardIsOpen] = useState(false);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [timeType, setTimeType] = useState('');

  const handleTogglePeriod = (value: boolean) => {
    const {start, end} = getCurrentDateStartAndEnd();
    let newStartAt = start;
    let newEndAt = end;

    if (!value) {
      const currentDate = new Date();
      newStartAt = `${start} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      newEndAt = `${end} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    }

    setPostSchedule(prevData => ({
      ...prevData,
      period: value ? 'ALL_DAY' : 'SPECIFIC_TIME',
      startAt: newStartAt,
      endAt: newEndAt,
    }));
  };

  const onCancel = () => {
    setVisible(false);
  };

  const handleConfirm = (date: Date) => {
    onCancel();
    const formattedDate =
      postSchedule.period === 'ALL_DAY'
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            date.getDate(),
          ).padStart(2, '0')}`
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            date.getDate(),
          ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
            date.getMinutes(),
          ).padStart(2, '0')}`;

    if (timeType === 'start') {
      setPostSchedule(prevData => ({
        ...prevData,
        startAt: formattedDate,
        endAt: formattedDate,
      }));
    } else if (timeType === 'end') {
      if (new Date(formattedDate) < new Date(postSchedule.startAt)) {
        Alert.alert('시작과 종료를 시간순서에\n맞게 설정해주세요.');
        return;
      }
      setPostSchedule(prevData => ({
        ...prevData,
        endAt: formattedDate,
      }));
    }
  };

  const toggleStartAt = () => {
    setVisible(!visible);
    setTimeType('start');
  };

  const toggleEndAt = () => {
    setVisible(!visible);
    setTimeType('end');
  };

  const parseDate = (dateString: string) => {
    const [year, month, day, hours, minutes] = dateString.split(/[- :]/).map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  let date = new Date();

  postSchedule.startAt.length !== 0 && timeType === 'start'
    ? parseDate(postSchedule.startAt)
    : parseDate(postSchedule.endAt);

  const onTagState = (value: {color: string; name: string}) => {
    setPostTag(value);
  };

  const handleNotificationOpen = () => {
    setNotificationIsOpen(prevState => !prevState);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.contentLayout}>
      <TextInput
        defaultValue={postSchedule.title}
        placeholder="스케줄을 입력해 주세요."
        style={styles.contentTitleInput}
        onChangeText={text => setPostSchedule(prevData => ({...prevData, title: text}))}
      />
      <ScheduleOptionSelect
        type="스케줄 보드"
        state={postTag}
        event={() => setBoardIsOpen(prevState => !prevState)}
        iconName="pricetag-outline"
      />
      <ScheduleOptionSelect
        type="알림 시간"
        state={postSchedule.alerts.length ? postSchedule.alerts.join(',  ') + '분 전' : ''}
        event={handleNotificationOpen}
        iconName="notifications-outline"
      />
      <ScheduleOptionToggle
        type="하루 종일"
        value={postSchedule.period === 'ALL_DAY'}
        onToggle={handleTogglePeriod}
        iconName="sunny-outline"
      />
      <ScheduleOptionSelect
        type="일정 시작 시간"
        state={postSchedule.startAt}
        event={toggleStartAt}
        iconName="time-outline"
      />
      <ScheduleOptionSelect
        type="일정 종료 시간"
        state={postSchedule.endAt}
        event={toggleEndAt}
        iconName="time-outline"
      />
      <KeyboardAvoidingView
        style={styles.contentInput}
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 64 : 0}>
        <Icon name="create-outline" style={styles.icon} />
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>메모</Text>
          <TextInput
            style={styles.contentText}
            defaultValue={postSchedule.content}
            placeholder="자세한 내용을 기록하려면 입력하세요"
            onChangeText={text => setPostSchedule(prevData => ({...prevData, content: text}))}
            multiline={true}
            numberOfLines={4}
            returnKeyType="default"
            textAlignVertical="top"
          />
        </View>
      </KeyboardAvoidingView>
      <Selector
        modalVisible={boardIsOpen}
        setModalVisible={setBoardIsOpen}
        onData={onTagState}
        type="board"
      />
      <Selector
        modalVisible={notificationIsOpen}
        setModalVisible={setNotificationIsOpen}
        onData={onNotificationChange}
        type="notification"
      />
      <DateTimePickerModal
        isVisible={visible}
        mode={postSchedule.period === 'ALL_DAY' ? 'date' : 'datetime'}
        onConfirm={handleConfirm}
        onCancel={onCancel}
        date={date}
      />
    </ScrollView>
  );
};

export default ScheduleAddOption;

const styles = StyleSheet.create({
  contentLayout: {
    marginRight: 24,
    marginLeft: 24,
    marginTop: 24,
  },
  contentTitleInput: {
    fontFamily: variables.font_3,
    color: variables.text_2,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: variables.line_1,
    paddingBottom: 16,
  },
  contentInput: {
    marginTop: 20,
    flexDirection: 'row',
  },
  inputContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: variables.line_1,
    ...Platform.select({
      ios: {paddingBottom: 16},
      android: {paddingBottom: 0},
    }),
  },
  inputTitle: {
    fontFamily: variables.font_3,
    color: variables.text_2,
    fontSize: 14,
  },
  contentText: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: variables.line_2,
    fontFamily: variables.font_4,
    color: variables.text_3,
    fontSize: 14,
  },
  icon: {
    fontSize: 24,
    marginRight: 30,
    color: variables.main,
  },
});
