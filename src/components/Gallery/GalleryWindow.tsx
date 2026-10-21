import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import type { GalleryImage } from "../../data/portfolio";
import {
  getGalleryImages,
  getGalleryImageUri,
} from "../../data/portfolio";
import { isScoreApiConfigured } from "../../services/scoreApi";

const PLACEHOLDER_IMAGES: GalleryImage[] = [
  {
    id: "placeholder-1",
    title: "Gallery placeholder 1",
    mimeType: "image/jpeg",
    base64: "",
  },
  {
    id: "placeholder-2",
    title: "Gallery placeholder 2",
    mimeType: "image/jpeg",
    base64: "",
  },
  {
    id: "placeholder-3",
    title: "Gallery placeholder 3",
    mimeType: "image/jpeg",
    base64: "",
  },
];

export default function GalleryWindow({
  onOpenImage,
}: {
  onOpenImage: (image: GalleryImage) => void;
}) {
  const { theme } = useTheme();
  const [images, setImages] = useState<GalleryImage[]>(
    isScoreApiConfigured() ? [] : PLACEHOLDER_IMAGES,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isScoreApiConfigured()) return;
    let isCurrent = true;
    void getGalleryImages()
      .then((loadedImages) => {
        if (isCurrent) setImages(loadedImages);
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load gallery images.",
          );
        }
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.hint, { color: theme.textMuted }]}>
        Click or tap an image to view it.
      </Text>
      {images.length === 0 && !error ? (
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          No images in the gallery yet. Add base64 image documents to MongoDB.
        </Text>
      ) : (
        <View style={styles.grid}>
          {images.map((image) => (
            <Pressable
              key={image.id}
              accessibilityRole="button"
              accessibilityLabel={`View ${image.title}`}
              onPress={() => onOpenImage(image)}
              style={styles.thumbnailItem}
            >
              <Image
                source={{ uri: getGalleryImageUri(image) }}
                resizeMode="cover"
                style={styles.thumbnail}
              />
              <Text
                numberOfLines={1}
                style={[styles.imageTitle, { color: theme.textMain }]}
              >
                {image.title}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10, paddingBottom: 8 },
  hint: { fontSize: 11 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  thumbnailItem: { width: 132, gap: 4 },
  thumbnail: {
    width: 132,
    height: 88,
    backgroundColor: "#d6d6d6",
    borderWidth: 1,
    borderColor: "#777",
  },
  imageTitle: { fontSize: 10 },
  error: { color: "#a12622", fontSize: 11 },
});
