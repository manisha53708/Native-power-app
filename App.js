import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Linking,
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function App() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const placeholderImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop';

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const handleSmartCheckIn = async () => {
    setLoading(true);
    
    try {
      // 1. Cek & Minta Izin Kamera
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      // 2. Cek & Minta Izin Lokasi
      const locationStatus = await Location.requestForegroundPermissionsAsync();

      if (cameraStatus.status !== 'granted' || locationStatus.status !== 'granted') {
        Alert.alert(
          "Izin Diperlukan 🔒",
          "Aplikasi butuh izin Kamera & GPS. Jika sudah pernah menolak, silakan klik 'Buka Pengaturan'.",
          [
            { text: "Batal", style: "cancel" },
            { text: "Buka Pengaturan", onPress: openAppSettings }
          ]
        );
        setLoading(false);
        return;
      }

      // 3. Buka Kamera
      const cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6, // Kompresi diturunkan agar loading cepat
      });

      if (cameraResult.canceled) {
        setLoading(false);
        return;
      }

      setImage(cameraResult.assets[0].uri);

      // 4. Ambil GPS dengan Cepat (Menggunakan Balanced agar tidak stuck di HP tertentu)
      const currentUserLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000, // batasan waktu 5 detik
      });
      
      setLocation(currentUserLocation.coords);

      // 5. Ambil Alamat (Reverse Geocode)
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: currentUserLocation.coords.latitude,
          longitude: currentUserLocation.coords.longitude
        });

        if (reverseGeocode && reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          const formattedAddress = `${place.street || ''}, ${place.district || ''}, ${place.city || ''}`.replace(/^,\s*,?/, '');
          setAddress(formattedAddress || 'Lokasi terdeteksi tanpa nama jalan');
        }
      } catch (geoError) {
        setAddress("Koordinat terkunci, gagal memuat nama jalan.");
      }

    } catch (error) {
      Alert.alert("Info Perangkat", "Pastikan GPS/Lokasi di HP Anda sudah dinyalakan sebelum menekan tombol.");
    } finally {
      setLoading(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (galleryStatus.status !== 'granted') {
        Alert.alert("Izin Ditolak", "Aktifkan izin galeri di pengaturan HP.", [{ text: "OK" }]);
        return;
      }

      const galleryResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!galleryResult.canceled) {
        setImage(galleryResult.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Error", "Gagal membuka galeri");
    }
  };

  const resetAppFields = () => {
    setImage(null);
    setLocation(null);
    setAddress('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>NATIVE POWER</Text>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>⚡ SMART CHECK-IN</Text>
        </View>
      </View>

      <View style={styles.previewCard}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image ? image : placeholderImage }} 
            style={styles.previewImage} 
          />
          {loading && (
            <View style={styles.blurLoader}>
              <ActivityIndicator size="large" color="#00ffcc" />
              <Text style={styles.loaderText}>Memproses data...</Text>
            </View>
          )}
        </View>
        
        <View style={styles.dataContainer}>
          {location ? (
            <View style={styles.metaBox}>
              <Text style={styles.metaTitle}>📍 REALTIME TELEMETRY</Text>
              <View style={styles.row}>
                <Text style={styles.geoLabel}>LATITUDE :</Text>
                <Text style={styles.geoValue}>{location.latitude.toFixed(6)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.geoLabel}>LONGITUDE:</Text>
                <Text style={styles.geoValue}>{location.longitude.toFixed(6)}</Text>
              </View>
              {address ? (
                <View style={styles.addressBox}>
                  <Text style={styles.addressLabel}>GEOLOCATION PLACE:</Text>
                  <Text style={styles.addressText}>{address}</Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.fallbackBox}>
              <Text style={styles.fallbackText}>Sistem Aktif. Silakan nyalakan GPS HP Anda lalu lakukan check-in.</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={[styles.btnPrimary, loading && styles.btnDisabled]} 
          onPress={handleSmartCheckIn} 
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.btnPrimaryText}>📸 SECURE SCAN & GPS</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={pickFromGallery}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSecondaryText}>🖼️ Browse Photo Gallery</Text>
        </TouchableOpacity>

        {(image || location) && (
          <TouchableOpacity style={styles.btnReset} onPress={resetAppFields}>
            <Text style={styles.btnResetText}>✕ Reset Device Data</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 3,
    textAlign: 'center',
  },
  badgeContainer: {
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    borderWidth: 1,
    borderColor: '#00ffcc',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeText: {
    color: '#00ffcc',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  previewCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#141414',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#222222',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 25,
  },
  imageContainer: {
    width: width * 0.55,
    height: width * 0.55,
    maxWidth: 210,
    maxHeight: 210,
    borderRadius: 105,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333333',
    backgroundColor: '#1f1f1f',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  blurLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loaderText: {
    color: '#00ffcc',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  dataContainer: {
    width: '100%',
    marginTop: 20,
  },
  fallbackBox: {
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262626',
  },
  fallbackText: {
    color: '#666666',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  metaBox: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262626',
    padding: 14,
  },
  metaTitle: {
    color: '#00ffcc',
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    paddingBottom: 4,
  },
  geoLabel: {
    color: '#555555',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
  },
  geoValue: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
  },
  addressBox: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  addressLabel: {
    color: '#888888',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  addressText: {
    color: '#cccccc',
    fontSize: 12,
    lineHeight: 16,
  },
  actionSection: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#00ffcc',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnDisabled: {
    backgroundColor: '#006652',
  },
  btnPrimaryText: {
    color: '#0a0a0a',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 1,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#333333',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 15,
  },
  btnSecondaryText: {
    color: '#aaaaaa',
    fontWeight: '700',
    fontSize: 14,
  },
  btnReset: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  btnResetText: {
    color: '#ff5555',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});