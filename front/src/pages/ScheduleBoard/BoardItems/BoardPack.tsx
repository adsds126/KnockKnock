import React, {RefObject} from 'react';
import {View, StyleSheet, Platform, Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import LinearGradient from 'react-native-linear-gradient';
import {variables, VariablesKeys} from '../../../style/variables';
import {BoardDataItem} from '../../../util/dataConvert';
import BoardItem from './BoardItem';

const deviceHeight = Dimensions.get('window').height;

type BoardPackProps = {
  active: number | null;
  onActiveChange: (newValue: number) => void;
  url: string;
  boardData: BoardDataItem[];
  carouselRef: RefObject<any>;
};

const BoardPack = ({url, active, onActiveChange, boardData, carouselRef}: BoardPackProps) => {
  const renderItem = ({item}: {item: any}) => {
    let colorValue = item.color;
    if (colorValue.startsWith('variables.')) {
      let colorKey = colorValue.substring('variables.'.length) as VariablesKeys;
      colorValue = variables[colorKey];
    }
    return (
      <BoardItem
        key={item.boardId.toString()}
        boardId={item.tagId}
        title={item.name}
        number={item.scheduleCount}
        color={colorValue}
        active={active}
      />
    );
  };

  const sliderHeight = Platform.select({
    ios: deviceHeight / 1.38,
    android: deviceHeight / 1.31,
  });

  return (
    <View style={styles.Container}>
      <LinearGradient
        style={[styles.linearGradient, {top: 0}]}
        start={{x: 0, y: 0.1}}
        end={{x: 0, y: 0.9}}
        colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
      />
      <Carousel
        ref={carouselRef}
        data={boardData}
        renderItem={renderItem}
        layout={'default'}
        sliderHeight={sliderHeight}
        itemHeight={210}
        vertical={true}
        loop={true}
        inactiveSlideOpacity={0.8}
        onSnapToItem={index => onActiveChange(boardData[index].tagId)}
      />
      <LinearGradient
        style={styles.linearGradient}
        start={{x: 0, y: 0.1}}
        end={{x: 0, y: 0.9}}
        colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
      />
    </View>
  );
};
export default BoardPack;

const styles = StyleSheet.create({
  Container: {
    height: '100%',
    justifyContent: 'space-between',
  },
  linearGradient: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    ...Platform.select({
      ios: {height: '10%', bottom: 98},
      android: {height: '12%', bottom: 94},
    }),
  },
});
