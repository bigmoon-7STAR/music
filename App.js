import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  // 再生中の曲の状態（ダミーデータ）
  const [currentTrack, setCurrentTrack] = useState({
    title: "Beat Eater",
    artist: "Polis Piccadilly",
    // あなたが描いたイラストのURLなどに置き換え可能です
    coverArt: "https://via.placeholder.com/150/1e90ff/ffffff?text=Music", 
    mainColor: "#1e90ff" // 本来は画像から抽出
  });

  return (
    <View style={styles.container}>
      {/* 動的な背景グラデーション（Apple Music風） */}
      <LinearGradient
        colors={[currentTrack.mainColor, '#000000']}
        style={styles.background}
      />

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>ライブラリ</Text>
        <Text style={styles.infoText}>ここに曲のリストが表示されます...</Text>
      </ScrollView>

      {/* ミニプレーヤー（常時表示） */}
      <View style={styles.miniPlayer}>
        <Image source={{ uri: currentTrack.coverArt }} style={styles.albumArt} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity><Text style={styles.controlIcon}>⏮</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.controlIcon}>▶️</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.controlIcon}>⏭</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  background: { position: 'absolute', left: 0, right: 0, top: 0, height: '100%' },
  content: { marginTop: 60, padding: 20 },
  sectionTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  infoText: { color: '#ccc', marginTop: 10 },
  miniPlayer: {
    position: 'absolute', bottom: 30, left: 10, right: 10,
    backgroundColor: 'rgba(255,255,255,0.1)', height: 70,
    borderRadius: 12, flexDirection: 'row', alignItems: 'center', padding: 10,
    borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)'
  },
  albumArt: { width: 50, height: 50, borderRadius: 6 },
  trackInfo: { flex: 1, marginLeft: 15 },
  trackTitle: { color: '#fff', fontWeight: 'bold' },
  trackArtist: { color: '#aaa', fontSize: 12 },
  controls: { flexDirection: 'row', gap: 20, marginRight: 10 },
  controlIcon: { color: '#fff', fontSize: 24 }
});
