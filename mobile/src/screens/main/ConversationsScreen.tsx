import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {chatService} from '../../services/chatService';
import {ChatConversation} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';
import {useAppSelector} from '../../store';

const ConversationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const currentUser = useAppSelector(s => s.auth.user);
  const [convos, setConvos] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await chatService.getConversations();
      setConvos(data);
    } catch (_) {}
    setIsLoading(false);
  }, []);

  useEffect(() => {load();}, [load]);

  const getOtherName = (convo: ChatConversation) => {
    if (!currentUser) return 'Unknown';
    return currentUser.id === convo.buyerId ? convo.sellerName : convo.buyerName;
  };

  if (isLoading && convos.length === 0) return <ActivityIndicator style={styles.center} color={Colors.primary} size="large" />;

  return (
    <FlatList
      data={convos}
      keyExtractor={i => i.id.toString()}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {setRefreshing(true); await load(); setRefreshing(false);}} colors={[Colors.primary]} />}
      renderItem={({item}) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Chat', {conversationId: item.id, otherUserName: getOtherName(item)})}>
          <View style={styles.avatar}>
            <Icon name="account" size={26} color={Colors.primary} />
          </View>
          <View style={styles.body}>
            <View style={styles.topRow}>
              <Text style={styles.name}>{getOtherName(item)}</Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage ?? 'No messages yet'}</Text>
            <Text style={styles.listingType}>{item.listingType?.replace(/_/g, ' ')}</Text>
          </View>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Icon name="chat-off" size={56} color={Colors.textHint} />
          <Text style={styles.emptyText}>No conversations yet</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  list: {paddingBottom: Spacing.xl, flexGrow: 1, backgroundColor: Colors.background},
  item: {flexDirection: 'row', alignItems: 'center', padding: Spacing.base, backgroundColor: Colors.surface},
  avatar: {width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md},
  body: {flex: 1},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  name: {fontSize: FontSize.base, fontWeight: '700', color: Colors.text},
  unreadBadge: {backgroundColor: Colors.unread, borderRadius: 10, minWidth: 20, paddingHorizontal: 5, paddingVertical: 1, alignItems: 'center'},
  unreadText: {fontSize: FontSize.xs, color: Colors.textOnPrimary, fontWeight: '700'},
  lastMsg: {fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2},
  listingType: {fontSize: FontSize.xs, color: Colors.textHint, marginTop: 2},
  sep: {height: 1, backgroundColor: Colors.divider},
  empty: {alignItems: 'center', marginTop: Spacing.xxxl * 2},
  emptyText: {color: Colors.textHint, fontSize: FontSize.md, marginTop: Spacing.md},
});

export default ConversationsScreen;
