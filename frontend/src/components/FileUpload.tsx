import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const FileUpload = () => {
  const router = useRouter();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFileName(result.assets[0].name);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick a document');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileName = result.assets[0].fileName || result.assets[0].uri.split('/').pop() || 'photo.jpg';
        setSelectedFileName(fileName);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take a photo');
    }
  };

  const handleSelectFile = () => {
    Alert.alert(
      'Upload Receipt',
      'Choose an option to upload your receipt',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take a Photo', onPress: takePhoto },
        { text: 'Upload from Files', onPress: pickDocument },
      ],
      { cancelable: true }
    );
  };

  const sendToBackend = () => {
    if (!selectedFileName) {
      Alert.alert('No File Selected', 'Please upload or scan a receipt first.');
      return;
    }
    
    // Navigate to the processing screen, passing the filename
    router.push({
      pathname: '/employee/receipt-processing',
      params: { file: selectedFileName }
    });
    
    // Optionally clear it out here or rely on component unmount
    setSelectedFileName(null);
  };

  return (
    <View className="items-center py-12">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSelectFile}
        className="w-20 h-20 rounded-full bg-surface-container-high items-center justify-center mb-6"
      >
        <MaterialIcons name="cloud-upload" size={40} color="#630ED4" />
      </TouchableOpacity>
      <Text className="font-headline font-bold text-xl text-on-surface mb-2 text-center">
        Upload Receipts
      </Text>
      <Text className="text-on-surface-variant font-body text-sm text-center mb-8 max-w-xs leading-relaxed">
        Tap the cloud to upload a document or take a photo of your receipt.
      </Text>

      {selectedFileName && (
        <View className="flex-row items-center bg-surface-container rounded-2xl p-3 mb-6 shadow-sm border border-outline-variant/30">
          <MaterialIcons name="insert-drive-file" size={20} color="#630ED4" />
          <Text
            className="ml-2 mr-2 font-body text-sm text-on-surface-variant max-w-[200px]"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {selectedFileName}
          </Text>
          <TouchableOpacity onPress={() => setSelectedFileName(null)}>
            <MaterialIcons name="close" size={20} color="#AB3500" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        onPress={sendToBackend}
        className="rounded-[24px] overflow-hidden shadow-lg shadow-primary/20 w-full"
      >
        <LinearGradient
          colors={['#630ED4', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center justify-center gap-3 py-4"
          style={{ borderRadius: 24 }}
        >
          <MaterialIcons name="send" size={22} color="white" />
          <Text className="text-white font-headline font-bold text-base">
            Submit Receipt
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default FileUpload;
