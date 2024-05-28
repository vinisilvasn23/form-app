import React, { useEffect, useState } from 'react'
import {
  Button,
  View,
  StyleSheet,
  PermissionsAndroid,
  Alert,
} from 'react-native'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

export default function TabTwoScreen() {
  const [hasPermission, setHasPermission] = useState<boolean>(false)

  const checkExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App Storage Permission',
          message: 'App needs access to external storage to save data.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true)
      } else {
        console.warn('Storage permission denied')
      }
    } catch (err) {
      console.error('Error requesting storage permission:', err)
    }
  }

  const listFiles = async () => {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory!
    )
  }

  useEffect(() => {
    checkExternalStoragePermission()
    listFiles()
  }, [])

  const handleSubmit = async () => {
    const fileUri = FileSystem.documentDirectory + 'formData.json'
    const fileInfo = await FileSystem.getInfoAsync(fileUri)

    let fileContent: any[] = []
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(fileUri)
      fileContent = JSON.parse(content)
    }

    const csvHeader = 'Nome,Empresa,Email,Telefone\n'
    const csvRows = fileContent
      .map((item) => {
        return `${item.name},${item.company},${item.email},${item.phone}`
      })
      .join('\n')

    const csvContent = csvHeader + csvRows
    const csvFilePath = FileSystem.documentDirectory + 'formData.csv'
    await FileSystem.writeAsStringAsync(csvFilePath, csvContent)

    await shareCSV(csvFilePath)
  }

  const shareCSV = async (fileUri: string) => {
    try {
      await Sharing.shareAsync(fileUri, { mimeType: 'text/csv' })
    } catch (error) {
      console.error('Error non deu non:', error)
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Ionicons
          size={310}
          name='code-slash'
          style={styles.headerImage}
        />
      }
    >
      <View>
        <Button
          onPress={handleSubmit}
          title='Coletar Dados'
        />
      </View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
})

// import React, { useState, useEffect } from "react";
// import { View, Image, StyleSheet, PanResponder, Alert, Dimensions } from "react-native";

// const images: { [key: number]: any } = {
//   1: require("../../assets/2.jpg"),
//   2: require("../../assets/2.jpg"),
//   3: require("../../assets/3.jpg"),
//   4: require("../../assets/4.jpg"),
//   5: require("../../assets/5.jpg"),
//   6: require("../../assets/6.jpg"),
//   7: require("../../assets/7.jpg"),
//   8: require("../../assets/8.jpg"),
//   9: require("../../assets/9.jpg"),
// };

// const { width } = Dimensions.get("window");
// const PIECE_SIZE = width / 3;

// export default function TabTwoScreen() {
//   const [positions, setPositions] = useState<number[]>([]);

//   useEffect(() => {
//     setPositions(shuffle(Array.from({ length: 9 }, (_, index) => index)));
//   }, []);

//   const movePiece = (fromIndex: number, toIndex: number) => {
//     const newPositions = [...positions];
//     [newPositions[fromIndex], newPositions[toIndex]] = [newPositions[toIndex], newPositions[fromIndex]];
//     setPositions(newPositions);

//     if (isSolved(newPositions)) {
//       Alert.alert("Parabéns!", "Você concluiu o quebra-cabeça!");
//     }
//   };

//   const panResponder = PanResponder.create({
//     onStartShouldSetPanResponder: () => true,
//     onPanResponderRelease: (event, gesture) => {
//       const { moveX, moveY } = gesture;
//       const positionX = Math.floor(moveX / PIECE_SIZE);
//       const positionY = Math.floor(moveY / PIECE_SIZE);
//       const newPosition = positionX + positionY * 3;
//       const emptyIndex = positions.indexOf(8);

//       if (
//         newPosition >= 0 &&
//         newPosition <= 8 &&
//         (
//           (newPosition === emptyIndex - 1 && emptyIndex % 3 !== 0) ||
//           (newPosition === emptyIndex + 1 && emptyIndex % 3 !== 2) ||
//           newPosition === emptyIndex - 3 ||
//           newPosition === emptyIndex + 3
//         )
//       ) {
//         movePiece(newPosition, emptyIndex);
//       }
//     },
//   });

//   const isSolved = (positions: number[]) => {
//     return positions.every((position, index) => position === index);
//   };

//   return (
//     <View style={styles.container}>
//       {positions.map((position, index) => (
//         <View
//           key={index}
//           style={[
//             styles.piece,
//             {
//               left: (index % 3) * PIECE_SIZE,
//               top: Math.floor(index / 3) * PIECE_SIZE,
//             },
//           ]}
//           {...panResponder.panHandlers}
//         >
//           {position !== 8 && (
//             <Image source={images[position + 1]} style={styles.image} />
//           )}
//         </View>
//       ))}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f0f0f0",
//   },
//   piece: {
//     width: PIECE_SIZE,
//     height: PIECE_SIZE,
//     position: "absolute",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
// });

// function shuffle(array: any[]) {
//   let currentIndex = array.length,
//     randomIndex;
//   while (currentIndex !== 0) {
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex],
//       array[currentIndex],
//     ];
//   }
//   return array;
// }
