import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import Config from 'react-native-config';
import {variables} from '../../style/variables';
import Header from '../../components/Header';
import {useSelector} from 'react-redux';

const Notifications = () => {
  const [notificationDatas, setNotificationDatas] = useState([]);
  const url = Config.API_APP_KEY;
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.token) {
          const response = await axios.get(`${url}api/v1/notification`, {
            headers: {Authorization: `Bearer ${user.token}`},
          });
          setNotificationDatas(response.data.body.data);
          console.log(response.data.body.data);
        } else {
          console.error('No token found.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <Header title="알림" type="alarm" />
      <ScrollView style={styles.scheduleListContainer}>
        {/* {notificationDatas.map((data, i) => {
          return (
            <View key={i}>
              <Text style={styles.listDateTitle}>{data.date.replace(/-/g, '.')}</Text>
              {data.contents.map((item, key) => (
                <TouchableOpacity style={styles.item} key={key}>
                  <Shadow
                    style={styles.todo}
                    distance={4}
                    startColor={'#00000010'}
                    endColor={'#ffffff05'}
                    offset={[0, 0.2]}>
                    <View style={styles.content}>
                      <Text style={styles.text}>{item.title}</Text>
                      <Text style={styles.time}>{item.notifyAt}</Text>
                    </View>
                  </Shadow>
                </TouchableOpacity>
              ))}
            </View>
          );
        })} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  scheduleListContainer: {
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
  item: {marginBottom: 10},
  todo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    width: '99%',
    marginLeft: 1,
  },
  content: {
    width: '100%',
    flexDirection: 'column',
  },
  text: {
    fontFamily: variables.font_3,
    color: variables.text_2,
  },
  time: {
    fontFamily: variables.font_4,
    fontSize: 13,
    color: variables.text_6,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
});
