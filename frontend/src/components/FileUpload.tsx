import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { File as FSFile } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View, ActivityIndicator, TextInput } from 'react-native';
import { supabase } from '../lib/supabase';

interface SelectedFile {
  uri: string;
  name: string;
  mimeType: string;
}

interface FileUploadProps {
  tripId: string;
  userId: string;
  onUploadSuccess?: () => void;
}

const FileUpload = ({ tripId, userId, onUploadSuccess }: FileUploadProps) => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userDescription, setUserDescription] = useState('');

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedFile({
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType || 'application/octet-stream',
        });
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
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || asset.uri.split('/').pop() || 'photo.jpg';
        setSelectedFile({
          uri: asset.uri,
          name: fileName,
          mimeType: 'image/jpeg',
        });
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

  const handleSubmit = async () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please upload or scan a receipt first.');
      return;
    }

    setUploading(true);
    try {
      // 1. Build a unique storage path
      const ext = selectedFile.name.split('.').pop() || 'jpg';
      const storagePath = `${userId}/${tripId}/${Date.now()}_${selectedFile.name}`;

      // 2. Read file bytes via expo-file-system v2 (avoids fetch on local URIs in RN)
      const fsFile = new FSFile(selectedFile.uri);
      const arrayBuffer = await fsFile.arrayBuffer();

      const { error: storageError } = await supabase.storage
        .from('receipts')
        .upload(storagePath, arrayBuffer, {
          contentType: selectedFile.mimeType,
          upsert: false,
        });

      if (storageError) throw storageError;

      // 3. Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(storagePath);

      const receiptUrl = publicUrlData?.publicUrl ?? null;

      // 4. Insert into TRIP_RECEIPTS — AI-generated columns are NULL for now
      const { data: insertedData, error: dbError } = await supabase
        .from('TRIP_RECEIPTS')
        .insert({
          trip_id: tripId,
          user_id: userId,
          url: receiptUrl,
          user_description: userDescription,
          // AI-generated columns — will be filled by the backend later
          merchant_name: null,
          merchant_location: null,
          amount: null,
          currency: null,
          category: null,
          receipt_date: null,
          extracted_description: null,
          status: null,
          ai_reason: null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      onUploadSuccess?.();

      // Navigate to processing screen instead of showing an alert
      router.push({
        pathname: '/employee/receipt-processing',
        params: {
          file: selectedFile.name,
          url: receiptUrl ?? '',
          tripId: tripId,
          userId: userId,
          receiptId: insertedData.id,
          userDescription: userDescription,
        }
      });

      setSelectedFile(null);
      setUserDescription('');
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error?.message || 'Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="items-center py-12">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSelectFile}
        disabled={uploading}
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

      {selectedFile && (
        <View className="w-full mb-6">
          <View className="flex-row items-center bg-surface-container rounded-2xl p-3 mb-3 shadow-sm border border-outline-variant/30">
            <MaterialIcons name="insert-drive-file" size={20} color="#630ED4" />
            <Text
              className="ml-2 mr-2 font-body text-sm text-on-surface-variant max-w-[200px]"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {selectedFile.name}
            </Text>
            <TouchableOpacity onPress={() => setSelectedFile(null)} disabled={uploading}>
              <MaterialIcons name="close" size={20} color="#AB3500" />
            </TouchableOpacity>
          </View>

          <View className="bg-surface-container rounded-2xl p-4 border border-outline-variant/30">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="description" size={16} color="#7b7487" />
              <Text className="text-on-surface-variant font-label text-xs uppercase tracking-wider">
                Receipt Description
              </Text>
            </View>
            <TextInput
              placeholder="Explain what this receipt is for..."
              placeholderTextColor="#7b748780"
              multiline
              numberOfLines={3}
              value={userDescription}
              onChangeText={setUserDescription}
              className="text-on-surface font-body text-sm min-h-[80px]"
              style={{ textAlignVertical: 'top' }}
              editable={!uploading}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={uploading}
        className="rounded-[24px] overflow-hidden shadow-lg shadow-primary/20 w-full"
        style={{ opacity: uploading ? 0.7 : 1 }}
      >
        <LinearGradient
          colors={['#630ED4', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center justify-center gap-3 py-4"
          style={{ borderRadius: 24 }}
        >
          {uploading ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text className="text-white font-headline font-bold text-base">
                Uploading…
              </Text>
            </>
          ) : (
            <>
              <MaterialIcons name="send" size={22} color="white" />
              <Text className="text-white font-headline font-bold text-base">
                Submit Receipt
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default FileUpload;
