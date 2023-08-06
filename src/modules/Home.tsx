import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Button,
  SectionList,
  LayoutAnimation,
  Alert,
  Switch,
} from 'react-native';

import AddAccount from '../components/AddAccount';
import {load, save} from '../utils/Storage';
import iconAdd from '../assets/icon_add.png';
import iconGame from '../assets/icon_game.png';
import iconPlantform from '../assets/icon_platform.png';
import iconBank from '../assets/icon_bank.png';
import iconOther from '../assets/icon_other.png';

import iconArrow from '../assets/icon_arrow.png';

let iconMap: {游戏: any; 平台: any; 银行卡: any; 其他: any} = {
  游戏: iconGame,
  平台: iconPlantform,
  银行卡: iconBank,
  其他: iconOther,
};

type str = '游戏' | '平台' | '银行卡' | '其他';

export default () => {
  const addAccountRef = useRef<any>(null);

  const [sectionData, setSectionData] = useState<any[]>([]);

  const [sectionState, setSectionState] = useState({
    游戏: true,
    平台: true,
    银行卡: true,
    其他: true,
  });
  const [passwordOpen, setPaawordOpen] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    load('accountList').then(data => {
      const accountList: any[] = JSON.parse(data as string);
      const gameList = accountList.filter(item => item.type === '游戏') || [];
      const platformList =
        accountList.filter(item => item.type === '平台') || [];
      const blankList =
        accountList.filter(item => item.type === '银行卡') || [];
      const otherList = accountList.filter(item => item.type === '其他') || [];
      const sectionData = [
        {
          type: '游戏',
          data: gameList,
        },
        {
          type: '平台',
          data: platformList,
        },
        {
          type: '银行卡',
          data: blankList,
        },
        {
          type: '其他',
          data: otherList,
        },
      ];
      LayoutAnimation.easeInEaseOut();
      setSectionData(sectionData);
    });
  };

  const onAccountSaveSuccess = () => {
    loadData();
  };

  const renderTitle = () => {
    return (
      <View style={styles.titleLayout}>
        <Text style={styles.titleTxt}>账号管理</Text>
        <Switch
          style={styles.stySwitch}
          value={passwordOpen}
          onValueChange={value => {
            setPaawordOpen(value);
          }}></Switch>
      </View>
    );
  };

  const renderItem = (data: any) => {
    const {item, index, section}: {item: any; index: any; section: any} = data;
    if (!sectionState[section.type as str]) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          addAccountRef.current.show(item);
        }}
        onLongPress={() => {
          const buttons = [
            {
              text: '取消',
              onPress: () => {},
            },
            {
              text: '确定',
              onPress: () => deleteAccount(item),
            },
          ];
          Alert.alert('提示', `确定删除[${item.name}]账号吗?`, buttons);
        }}
        style={styles.itemLayout}>
        <Text style={styles.nameTxt}>{item.name}</Text>
        <View style={styles.accpwd}>
          <Text style={styles.accpwdTxt}>账号:{item.account}</Text>
          <Text style={styles.accpwdTxt}>
            密码:{passwordOpen ? item.password : '********'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const deleteAccount = (account: any) => {
    load('accountList').then(data => {
      let accountList = JSON.parse(data as string);
      accountList = accountList.filter((item: any) => item.id !== account.id);
      save('accountList', JSON.stringify(accountList)).then(() => {
        loadData();
      });
    });
  };

  const renderSectionHeader = (item: any) => {
    const {section}: {section: any} = item;

    return (
      <View
        style={[
          styles.groupHeader,
          {
            borderBottomLeftRadius:
              !section.data.length || !sectionState[section.type as str]
                ? 12
                : 0,
            borderBottomRightRadius:
              !section.data.length || !sectionState[section.type as str]
                ? 12
                : 0,
          },
        ]}>
        <Image
          style={styles.typeImg}
          source={iconMap[section.type as str]}></Image>
        <Text style={styles.typeTxt}>{section.type}</Text>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => {
            const copy = {...sectionState};
            copy[section.type as str] = !copy[section.type as str];
            LayoutAnimation.easeInEaseOut();
            setSectionState(copy);
          }}>
          <Image
            source={iconArrow}
            style={[
              styles.arrowImg,
              {
                transform: [
                  {
                    rotate: sectionState[section.type as str]
                      ? '0deg'
                      : '-90deg',
                  },
                ],
              },
            ]}></Image>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderTitle()}
      <SectionList
        sections={sectionData}
        keyExtractor={(_, index) => `${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContainer}></SectionList>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          addAccountRef.current.show();
        }}>
        <Image source={iconAdd} style-={styles.addImg}></Image>
      </TouchableOpacity>
      <AddAccount
        ref={addAccountRef}
        onSave={onAccountSaveSuccess}></AddAccount>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  titleLayout: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleTxt: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },
  stySwitch: {
    position: 'absolute',
    right: 12,
  },
  addButton: {
    position: 'absolute',
    bottom: 64,
    right: 28,
  },
  addImg: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  groupHeader: {
    width: '100%',
    height: 46,
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 12,
  },
  typeImg: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  listContainer: {
    padding: 12,
  },
  typeTxt: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginLeft: 20,
  },
  arrowImg: {
    width: 20,
    height: 20,
  },
  arrowButton: {
    position: 'absolute',
    right: 0,
    padding: 16,
  },
  itemLayout: {
    width: '100%',
    paddingHorizontal: 12,
    flexDirection: 'column',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  nameTxt: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  accpwd: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  accpwdTxt: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    marginBottom: 6,
  },
});
