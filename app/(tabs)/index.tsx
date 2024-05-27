import React from 'react'
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native'
import * as Yup from 'yup'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { useNavigation } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system'
import { Formik } from 'formik'
import { TextInputMask } from 'react-native-masked-text'

interface Values {
  name: string
  company: string
  email: string
  phone: string
}

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  company: Yup.string().required('Empresa é obrigatória'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: Yup.string().required('Telefone é obrigatório'),
})

export default function HomeScreen() {
  const navigation = useNavigation()

  const saveData = async (values: Values) => {
    try {
      const fileUri = FileSystem.documentDirectory + 'formData.json'
      const fileInfo = await FileSystem.getInfoAsync(fileUri)

      let fileContent: Values[] = []
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(fileUri)
        fileContent = JSON.parse(content)
      }
      fileContent.push(values)

      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(fileContent))
      Alert.alert('Sucesso', 'Dados salvos com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar dados:', error)
      Alert.alert('Erro', 'Não foi possível salvar os dados.')
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <Formik
        initialValues={{ name: '', company: '', email: '', phone: '' }}
        validationSchema={FormSchema}
        onSubmit={(values, actions) => {
          saveData(values)
          actions.resetForm()
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}

            <Text style={styles.label}>Empresa</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('company')}
              onBlur={handleBlur('company')}
              value={values.company}
            />
            {touched.company && errors.company && (
              <Text style={styles.error}>{errors.company}</Text>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType='email-address'
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <Text style={styles.label}>Telefone</Text>
            <TextInputMask
              type={'cel-phone'}
              style={styles.input}
              value={values.phone}
              onChangeText={(text) => setFieldValue('phone', text)}
            />
            {touched.phone && errors.phone && (
              <Text style={styles.error}>{errors.phone}</Text>
            )}

            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.btnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  reactLogo: {
    width: 'auto',
    height: 100,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    fontSize: 24,
  },
  error: {
    color: 'red',
  },
  btn: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
  },
  btnText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 24,
  },
})
