import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {getuuid} from '../utils/UUID';

import {save, load} from '../utils/Storage';

import iconCloseModal from '../assets/icon_close_modal.png';

export default forwardRef((props: any, ref) => {
  const {onSave} = props;

  const [visible, setVisible] = useState(false);
  const [isModfy, setIsModfy] = useState(false);
  const [type, settype] = useState('游戏');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [account, setAccount] = useState('');

  const [id, setId] = useState('');
  const show = (currentAccount: any) => {
    setVisible(true);
    if (currentAccount) {
      setIsModfy(true);
      setId(currentAccount.id as string);
      settype(currentAccount.type as string);
      setName(currentAccount.name as string);
      setAccount(currentAccount.account as string);
      setPassword(currentAccount.password as string);
    } else {
      setIsModfy(false);
      setId(getuuid() as string);
      settype('游戏');
      setName('');
      setAccount('');
      setPassword('');
    }
  };
  const hide = () => {
    setVisible(false);
  };

  //写要公开的api
  useImperativeHandle(ref, () => {
    return {
      show,
      hide,
    };
  });

  const onSavePress = () => {
    const newAccount = {
      id,
      password,
      name,
      type,
      account,
    };
    load('accountList').then(data => {
      let accountList = data ? JSON.parse(data as string) : [];
      // 如果是编辑现有账号，push前先移除
      if (isModfy) {
        accountList = accountList.filter((item: any) => item.id !== id);
      }
      accountList.push(newAccount);
      save('accountList', JSON.stringify(accountList)).then(() => {
        onSave();
        hide();
      });
    });
  };

  const renderTitle = () => {
    const styles = StyleSheet.create({
      titleLayout: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      titleTxt: {
        fontSize: 18,
        color: '#333333',
        fontWeight: 'bold',
      },
      closeButton: {
        position: 'absolute',
        right: 6,
      },
      closeImg: {
        width: 28,
        height: 28,
        resizeMode: 'contain',
      },
    });
    return (
      <View style={styles.titleLayout}>
        <Text style={styles.titleTxt}>{isModfy ? '修改账号' : '添加账户'}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={hide}>
          <Image style={styles.closeImg} source={iconCloseModal}></Image>
        </TouchableOpacity>
      </View>
    );
  };

  const renderType = () => {
    const styles = StyleSheet.create({
      typesLayout: {
        width: '100%',
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
      },
      tab: {
        flex: 1,
        height: '100%',
        borderWidth: 1,
        borderBlockColor: '#c0c0c0',
        justifyContent: 'center',
        alignItems: 'center',
      },
      leftTab: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      },
      rightTab: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      },
      moveLeftPix: {
        marginLeft: -1,
      },
      tabTxt: {
        fontSize: 14,
      },
    });
    const typesArry = ['游戏', '平台', '银行卡', '其它'];
    return (
      <View style={styles.typesLayout}>
        {typesArry.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.tab,
                index === 0
                  ? styles.leftTab
                  : index === 3
                  ? styles.rightTab
                  : {},
                index > 0 && styles.moveLeftPix,
                {
                  backgroundColor: type === item ? '#3050ff' : 'transparent',
                },
              ]}
              onPress={() => {
                settype(item);
              }}>
              <Text
                style={[
                  styles.tabTxt,
                  {
                    color: type === item ? 'white' : '#666666',
                  },
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderName = () => {
    const styles = StyleSheet.create({
      input: {
        width: '100%',
        height: 40,
        backgroundColor: '#f0f0f0',
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333333',
      },
    });
    return (
      <TextInput
        style={styles.input}
        maxLength={20}
        value={name}
        onChangeText={text => {
          setName(text);
        }}></TextInput>
    );
  };

  const renderAccount = () => {
    const styles = StyleSheet.create({
      input: {
        width: '100%',
        height: 40,
        backgroundColor: '#f0f0f0',
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333333',
      },
    });
    return (
      <TextInput
        style={styles.input}
        maxLength={20}
        value={account}
        onChangeText={text => {
          setAccount(text);
        }}></TextInput>
    );
  };

  const renderPassword = () => {
    const styles = StyleSheet.create({
      input: {
        width: '100%',
        height: 40,
        backgroundColor: '#f0f0f0',
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333333',
      },
    });
    return (
      <TextInput
        style={styles.input}
        maxLength={20}
        value={password}
        onChangeText={text => {
          setPassword(text);
        }}></TextInput>
    );
  };

  const renderButton = () => {
    const styles = StyleSheet.create({
      saveButton: {
        width: '100%',
        height: 44,
        backgroundColor: '#3050ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10,
        marginBottom: 10,
      },
      saveText: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
      },
    });
    return (
      <TouchableOpacity style={styles.saveButton} onPress={onSavePress}>
        <Text style={styles.saveText}>保 存</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={hide}
      transparent={true}
      statusBarTranslucent={true}
      animationType="fade">
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.content}>
          {renderTitle()}
          <Text style={styles.subTitleText}>账号类型</Text>
          {renderType()}
          <Text style={styles.subTitleText}>账号名称</Text>
          {renderName()}
          <Text style={styles.subTitleText}>账号</Text>
          {renderAccount()}
          <Text style={styles.subTitleText}>密码</Text>
          {renderPassword()}
          {renderButton()}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000060',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  subTitleText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 10,
  },
});
