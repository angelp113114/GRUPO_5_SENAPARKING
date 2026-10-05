import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";

import { fileUrl } from "../data/api";
import { colors } from "../theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  name?: string;
  title?: string;
};

export default function FileViewerModal({
  visible,
  onClose,
  name,
  title = "Archivo",
}: Props) {
  if (!name) return null;

  const url = fileUrl(name);
  const lower = String(name).toLowerCase();

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(lower);
  const isPdf = /\.pdf$/i.test(lower);
  const isOffice = /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(lower);

  const viewerUrl =
    isPdf || isOffice
      ? `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(
          url
        )}`
      : url;

  const openExternal = async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log("No se pudo abrir el archivo:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: 44,
        }}
      >
        <View
          style={{
            height: 58,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 8,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                color: colors.dark,
              }}
            >
              ‹
            </Text>
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontWeight: "900",
              fontSize: 16,
              color: colors.dark,
            }}
          >
            {title}
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 25 }}>×</Text>
          </TouchableOpacity>
        </View>

        {isImage ? (
          <Image
            source={{ uri: url }}
            style={{
              flex: 1,
              resizeMode: "contain",
            }}
          />
        ) : (
          <>
            <WebView
              source={{ uri: viewerUrl }}
              style={{ flex: 1 }}
              startInLoadingState
            />

            <TouchableOpacity
              onPress={openExternal}
              style={{
                margin: 15,
                padding: 15,
                borderRadius: 12,
                alignItems: "center",
                backgroundColor: colors.primary,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "900",
                }}
              >
                ABRIR ARCHIVO EXTERNAMENTE
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
}