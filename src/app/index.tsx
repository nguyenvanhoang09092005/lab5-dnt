import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  Platform,
  Pressable,
  Text,
  View,
  type DimensionValue,
} from 'react-native';
import {
  Card,
  LabScreen,
  Label,
  Notice,
  useLabTheme,
} from '@/components/lab-ui';
const notes = [
  {
    name: 'C',
    label: 'Đô',
    color: '#A93A3D',
    sound: require('../../assets/sounds/note1.wav'),
  },
  {
    name: 'D',
    label: 'Rê',
    color: '#A65625',
    sound: require('../../assets/sounds/note2.wav'),
  },
  {
    name: 'E',
    label: 'Mi',
    color: '#866313',
    sound: require('../../assets/sounds/note3.wav'),
  },
  {
    name: 'F',
    label: 'Fa',
    color: '#31754C',
    sound: require('../../assets/sounds/note4.wav'),
  },
  {
    name: 'G',
    label: 'Sol',
    color: '#2A66A2',
    sound: require('../../assets/sounds/note5.wav'),
  },
  {
    name: 'A',
    label: 'La',
    color: '#6948A0',
    sound: require('../../assets/sounds/note6.wav'),
  },
  {
    name: 'B',
    label: 'Si',
    color: '#A13F76',
    sound: require('../../assets/sounds/note7.wav'),
  },
];
function NoteBar({
  note,
  index,
  onPlay,
  onError,
}: {
  note: (typeof notes)[number];
  index: number;
  onPlay: () => void;
  onError: () => void;
}) {
  const player = useAudioPlayer(note.sound);
  const play = async () => {
    try {
      await player.seekTo(0);
      player.play();
      onPlay();
    } catch {
      onError();
    }
  };
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={'Phát nốt ' + note.label}
      onPress={play}
      style={({ pressed }) => ({
        minHeight: 58,
        width: (100 - index * 4 + '%') as DimensionValue,
        alignSelf: 'center',
        borderRadius: 15,
        backgroundColor: note.color,
        paddingHorizontal: 22,
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text style={{ color: '#FFFFFF', opacity: 0.65 }}>●</Text>
      <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '800' }}>
        {note.name}{' '}
        <Text style={{ fontSize: 13, fontWeight: '500' }}> / {note.label}</Text>
      </Text>
      <Text style={{ color: '#FFFFFF', opacity: 0.65 }}>●</Text>
    </Pressable>
  );
}
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
export default function SoundScreen() {
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const t = useLabTheme();
  const [note, setNote] = useState(''),
    [error, setError] = useState('');
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() =>
      setError('Không thể khởi tạo âm thanh. Hãy thử tải lại ứng dụng.'),
    );
  }, []);
  return (
    <LabScreen>
      <Card>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <Label>YOUR POCKET XYLOPHONE</Label>
          <Text
            accessibilityLiveRegion="polite"
            style={{ color: t.accent, fontWeight: '700' }}
          >
            {note ? note + ' ♪' : 'Sẵn sàng ♪'}
          </Text>
        </View>
        <View style={{ gap: 10, paddingVertical: 8 }}>
          {notes.map((item, index) =>
            Platform.OS === 'web' && !hydrated ? (
              <View
                key={item.name}
                style={{
                  height: 58,
                  width: (100 - index * 4 + '%') as DimensionValue,
                  alignSelf: 'center',
                  borderRadius: 15,
                  backgroundColor: item.color,
                }}
              />
            ) : (
              <NoteBar
                key={item.name}
                note={item}
                index={index}
                onPlay={() => {
                  setNote(item.label);
                  setError('');
                }}
                onError={() =>
                  setError(
                    'Chưa phát được nốt nhạc. Kiểm tra âm lượng và chạm lại nhé.',
                  )
                }
              />
            ),
          )}
        </View>
      </Card>
      {error !== '' && <Notice error>{error}</Notice>}
      <Notice>
        Thử giai điệu: Đô · Đô · Sol · Sol · La · La · Sol. Mỗi thanh nhạc có âm
        thanh riêng để bạn tự do kết hợp.
      </Notice>
    </LabScreen>
  );
}
