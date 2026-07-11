import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Client} from '@stomp/stompjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {chatService} from '../../services/chatService';
import {useAppSelector} from '../../store';
import {ChatMessage} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const WS_URL = __DEV__ ? 'ws://10.0.2.2:8080/ws' : 'wss://ooumitra-backend.onrender.com/ws';

const ChatScreen: React.FC = () => {
  const route = useRoute<any>();
  const {conversationId, otherUserName} = route.params;
  const currentUser = useAppSelector(s => s.auth.user);
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const stompRef = useRef<Client | null>(null);

  useEffect(() => {
    loadMessages(true);
    initWebSocket();
    return () => {stompRef.current?.deactivate();};
  }, [conversationId]);

  const loadMessages = async (reset = false) => {
    const p = reset ? 0 : page;
    if (!reset && p >= totalPages) return;
    if (!reset) setIsLoading(true);
    try {
      const res = await chatService.getMessages(conversationId, {page: p, size: 30});
      setMessages(prev => reset ? res.content.reverse() : [...res.content.reverse(), ...prev]);
      setTotalPages(res.totalPages);
      setPage(p + 1);
    } catch (_) {}
    setIsLoading(false);
  };

  const initWebSocket = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {Authorization: `Bearer ${token}`},
      onConnect: () => {
        client.subscribe(`/user/queue/messages`, (frame) => {
          const msg: ChatMessage = JSON.parse(frame.body);
          if (msg.conversationId === conversationId) {
            setMessages(prev => [...prev, msg]);
            flatListRef.current?.scrollToEnd({animated: true});
          }
        });
      },
    });
    client.activate();
    stompRef.current = client;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    try {
      const msg = await chatService.sendMessage(conversationId, {content: text, messageType: 'TEXT'});
      setMessages(prev => [...prev, msg]);
      flatListRef.current?.scrollToEnd({animated: true});
    } catch (_) {}
  };

  const renderItem = ({item}: {item: ChatMessage}) => {
    const isMe = item.senderId === currentUser?.id;
    return (
      <View style={[styles.msgRow, isMe ? styles.msgRowRight : styles.msgRowLeft]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.msgText, isMe && styles.msgTextMe]}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      {isLoading && messages.length === 0 ? (
        <ActivityIndicator style={styles.center} color={Colors.primary} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onEndReachedThreshold={0.2}
          onEndReached={() => loadMessages()}
          onContentSizeChange={() => messages.length > 0 && flatListRef.current?.scrollToEnd({animated: false})}
        />
      )}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.inputField}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textHint}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={sendMessage} disabled={!input.trim()}>
          <Icon name="send" size={22} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  list: {padding: Spacing.base, paddingBottom: Spacing.md},
  msgRow: {marginBottom: Spacing.sm, flexDirection: 'row'},
  msgRowLeft: {justifyContent: 'flex-start'},
  msgRowRight: {justifyContent: 'flex-end'},
  bubble: {maxWidth: '78%', padding: Spacing.md, borderRadius: BorderRadius.xl, elevation: 1},
  bubbleMe: {backgroundColor: Colors.primary, borderBottomRightRadius: 4},
  bubbleOther: {backgroundColor: Colors.surface, borderBottomLeftRadius: 4},
  msgText: {fontSize: FontSize.base, color: Colors.text},
  msgTextMe: {color: Colors.textOnPrimary},
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: Colors.surface, padding: Spacing.sm,
    borderTopWidth: 1, borderTopColor: Colors.divider,
    gap: Spacing.sm,
  },
  inputField: {
    flex: 1, backgroundColor: Colors.background, borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    fontSize: FontSize.base, color: Colors.text, maxHeight: 120,
  },
  sendBtn: {width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center'},
  sendBtnDisabled: {opacity: 0.5},
});

export default ChatScreen;
