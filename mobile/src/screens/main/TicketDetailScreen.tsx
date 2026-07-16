import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ticketService} from '../../services/userService';
import {chatService} from '../../services/chatService';
import {useRequireAuth} from '../../hooks/useRequireAuth';
import {useAppSelector} from '../../store';
import {RequestTicket} from '../../types';
import {Colors, FontSize, Spacing, BorderRadius} from '../../theme';

const STATUS_COLORS: Record<string, string> = {OPEN: Colors.success, IN_PROGRESS: Colors.warning, CLOSED: Colors.textHint};

const TicketDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {requireAuth} = useRequireAuth();
  const route = useRoute<any>();
  const {id} = route.params;
  const currentUser = useAppSelector(s => s.auth.user);
  const [ticket, setTicket] = useState<RequestTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {setTicket(await ticketService.getById(id));} catch (_) {}
      setLoading(false);
    })();
  }, [id]);

  const handleChat = async () => {
    if (!ticket) return;
    try {
      const convo = await chatService.startConversation({sellerId: ticket.userId, listingType: 'REQUEST_TICKET', listingId: ticket.id});
      navigation.navigate('Chat', {conversationId: convo.id, otherUserName: ticket.title});
    } catch (_) {Alert.alert('Error', 'Failed to start chat');}
  };

  if (loading) return <ActivityIndicator style={styles.center} color={Colors.primary} size="large" />;
  if (!ticket) return <View style={styles.center}><Text>Not found</Text></View>;

  const isOwner = currentUser?.id === ticket.userId;
  const statusColor = STATUS_COLORS[ticket.status] ?? Colors.textHint;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="ticket" size={48} color={Colors.primary} />
        <View style={[styles.badge, {backgroundColor: statusColor + '20'}]}>
          <Text style={[styles.badgeText, {color: statusColor}]}>{ticket.status}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{ticket.title}</Text>

        <View style={styles.infoRow}><Icon name="map-marker" size={16} color={Colors.textHint} /><Text style={styles.infoText}>{ticket.location}</Text></View>
        {ticket.budget && <View style={styles.infoRow}><Icon name="currency-inr" size={16} color={Colors.textHint} /><Text style={styles.infoText}>Budget: ₹{ticket.budget}</Text></View>}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.desc}>{ticket.description}</Text>
        </View>

        {!isOwner && (
          <TouchableOpacity style={styles.chatBtn} onPress={() => requireAuth(handleChat)}>
            <Icon name="chat" size={20} color={Colors.textOnPrimary} />
            <Text style={styles.chatText}>Respond to Request</Text>
          </TouchableOpacity>
        )}

        {isOwner && ticket.status === 'OPEN' && (
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={async () => {
              try {
                await ticketService.updateStatus(id, 'CLOSED');
                setTicket({...ticket, status: 'CLOSED'});
              } catch (_) {}
            }}>
            <Text style={styles.closeBtnText}>Mark as Closed</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  header: {height: 160, backgroundColor: Colors.surfaceVariant, justifyContent: 'center', alignItems: 'center', gap: Spacing.md},
  badge: {paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.full},
  badgeText: {fontSize: FontSize.sm, fontWeight: '700'},
  body: {padding: Spacing.base},
  title: {fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.text, marginBottom: 4},
  workType: {fontSize: FontSize.base, color: Colors.primary, fontWeight: '600', marginBottom: Spacing.md},
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm},
  infoText: {fontSize: FontSize.base, color: Colors.textSecondary},
  section: {marginVertical: Spacing.base},
  sectionTitle: {fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm},
  desc: {fontSize: FontSize.base, color: Colors.textSecondary, lineHeight: 22},
  chatBtn: {backgroundColor: Colors.primary, flexDirection: 'row', padding: Spacing.md + 2, borderRadius: BorderRadius.xl, justifyContent: 'center', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.md},
  chatText: {fontSize: FontSize.base, fontWeight: '700', color: Colors.textOnPrimary},
  closeBtn: {backgroundColor: Colors.error + '15', borderWidth: 1.5, borderColor: Colors.error, padding: Spacing.md, borderRadius: BorderRadius.xl, alignItems: 'center', marginTop: Spacing.md},
  closeBtnText: {color: Colors.error, fontWeight: '700', fontSize: FontSize.base},
});

export default TicketDetailScreen;
