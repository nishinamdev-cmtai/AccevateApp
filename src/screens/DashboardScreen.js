import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef(null);

  useEffect(() => {
    checkUserName();
  }, []);

  useEffect(() => {
    if (!dashboard?.carousel) return;
    const interval = setInterval(() => {
      const next = activeIndex === dashboard.carousel.length - 1 ? 0 : activeIndex + 1;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex, dashboard]);

  const checkUserName = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('LoginScreen');
        return;
      }
      const response = await fetch(
        'https://aapsuj.accevate.co/flutter-api/dashboard.php',
        {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      if (!response.ok || data?.status === false) {
        Alert.alert('Session Expired', 'Please login again');
        navigation.replace('LoginScreen');
        return;
      }
      setDashboard(data.dashboard);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!dashboard) return null;

  return (
    <ScrollView style={styles.container}>

      <FlatList
        ref={flatRef}
        data={dashboard.carousel}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.bannerBox}>
            <Image source={{ uri: item }} style={styles.banner} resizeMode="cover" />
          </View>
        )}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      />

      <View style={styles.dotsRow}>
        {dashboard.carousel.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="school-outline" size={22} color="#333" />
          <Text style={styles.title}> Students</Text>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.infoBox}>
            <Icon name="male-outline" size={28} color="#2a6ef7" />
            <Text style={styles.infoLabel}>Boys</Text>
            <Text style={styles.infoNumber}>{dashboard.student.Boy}</Text>
          </View>

          <View style={styles.infoBox}>
            <Icon name="female-outline" size={28} color="#e84188" />
            <Text style={styles.infoLabel}>Girls</Text>
            <Text style={styles.infoNumber}>{dashboard.student.Girl}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="wallet-outline" size={22} color="#333" />
          <Text style={styles.title}> Fees Summary</Text>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.amountBox}>
            <Icon name="cash-outline" size={22} color="#0a7d22" />
            <Text style={styles.amountLabel}>Total</Text>
            <Text style={styles.amountValue}>₹{dashboard.amount.Total}</Text>
          </View>

          <View style={[styles.amountBox, styles.successBox]}>
            <Icon name="checkmark-circle-outline" size={22} color="#0a7d22" />
            <Text style={styles.amountLabel}>Paid</Text>
            <Text style={styles.amountValue}>₹{dashboard.amount.Paid}</Text>
          </View>

          <View style={[styles.amountBox, styles.warningBox]}>
            <Icon name="alert-circle-outline" size={22} color="#b50000" />
            <Text style={styles.amountLabel}>Due</Text>
            <Text style={styles.amountValue}>₹{dashboard.amount.due}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.dynamicButton, { backgroundColor: dashboard.color.dynamic_color }]}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Dynamic Color</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f4f5f9' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  bannerBox: { width, alignItems: 'center' },
  banner: { width: '100%', height: 180, borderRadius: 0 },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 50, backgroundColor: '#bbb', marginHorizontal: 4 },
  activeDot: { width: 18, backgroundColor: '#333' },

  card: { backgroundColor: '#ffffff', padding: 14, borderRadius: 16, marginTop: 12, elevation: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: 'bold' },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },

  infoBox: { alignItems: 'center', backgroundColor: '#f2f4ff', padding: 12, borderRadius: 14, width: '48%' },
  infoLabel: { fontSize: 13, marginTop: 4 },
  infoNumber: { fontSize: 20, fontWeight: 'bold' },

  amountBox: { alignItems: 'center', padding: 10, borderRadius: 14, width: '32%', backgroundColor: '#f7f7f7' },
  successBox: { backgroundColor: '#e9f7ec' },
  warningBox: { backgroundColor: '#fde9e9' },

  amountLabel: { fontSize: 12, marginTop: 4 },
  amountValue: { fontSize: 16, fontWeight: 'bold' },

  dynamicButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default DashboardScreen;
