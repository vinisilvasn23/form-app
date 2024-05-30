import React, { useState } from 'react'
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
  const [focusedInput, setFocusedInput] = useState<string | null>(null)

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
      console.error('Erro ao salvar dados', error)
      Alert.alert('Erro', 'Não foi possível salvar os dados.')
    }
  }
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ dark: '#ffff', light: '#fff7ff' }}
      headerImage={
        <Image
          source={require('@/assets/images/icon2.png')}
          style={styles.reactLogo}
        />
      }
    >
      <View style={{ backgroundColor: '#fff7ff' }}>
        <View style={styles.container_text}>
          <Text style={styles.title}>Insira os dados para contato</Text>
        </View>
        <View style={styles.container}>
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
              <>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'name' && styles.focusedInput
                  ]}
                  onChangeText={handleChange('name')}
                  onBlur={() => {
                    handleBlur('name')
                    setFocusedInput(null)
                  }}
                  onFocus={() => setFocusedInput('name')}
                  value={values.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.error}>{errors.name}</Text>
                )}
  
                <Text style={styles.label}>Empresa</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'company' && styles.focusedInput
                  ]}
                  onChangeText={handleChange('company')}
                  onBlur={() => {
                    handleBlur('company')
                    setFocusedInput(null)
                  }}
                  onFocus={() => setFocusedInput('company')}
                  value={values.company}
                />
                {touched.company && errors.company && (
                  <Text style={styles.error}>{errors.company}</Text>
                )}
  
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === 'email' && styles.focusedInput
                  ]}
                  onChangeText={handleChange('email')}
                  onBlur={() => {
                    handleBlur('email')
                    setFocusedInput(null)
                  }}
                  onFocus={() => setFocusedInput('email')}
                  value={values.email}
                  keyboardType='email-address'
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
  
                <Text style={styles.label}>Telefone</Text>
                <TextInputMask
                  type={'cel-phone'}
                  style={[
                    styles.input,
                    focusedInput === 'phone' && styles.focusedInput
                  ]}
                  value={values.phone}
                  onChangeText={(text) => setFieldValue('phone', text)}
                  onBlur={() => setFocusedInput(null)}
                  onFocus={() => setFocusedInput('phone')}
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
              </>
            )}
          </Formik>
        </View>
      </View>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  reactLogo: {
    marginTop: 20,
    width: '100%',
    height:'80%',
    resizeMode: 'contain',
  },
  container_text: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "700", 
    color: '#363636',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderColor: '#363636',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    fontSize: 24,
    marginTop: 16,
    color: '#363636',
    borderWidth: 3,
  },
  focusedInput: {
    borderWidth: 3,
    borderColor: '#f8b43a',
  },
  error: {
    color: 'red',
  },
  btn: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  btnText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  label: {
    color: '#363636',
    fontSize: 24,
    fontWeight: '900',
  },
})

HomeScreen.navigationOptions = {
  title: 'Home',
  headerShown: false,
  orientation: ['portrait', 'landscape'],
};