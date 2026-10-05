import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

import {
  auth,
  messageOf,
  resources,
} from '../data/api';

import { colors, common } from '../theme';

import Field from '../components/Field';
import Button from '../components/Button';
import Header from '../components/Header';
import SelectField from '../components/SelectField';
import DatePickerField from '../components/DatePickerField';

type P = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

export default function RegisterScreen({ navigation }: P) {
  const [rol, setRol] = useState('aprendiz');

  const [centers, setCenters] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);

  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [f, setF] = useState<any>({
    nombres: '',
    apellidos: '',
    documento: '',
    tipoDocumento: '',
    celular: '',
    ficha: '',
    centroFormacionId: '',
    fechaVinculacion: '',
    fechaFinalizacion: '',
    email: '',
    password: '',
  });

  const set = (k: string, v: string) => {
    setF((p: any) => ({
      ...p,
      [k]: v,
    }));
  };

  useEffect(() => {
    Promise.all([
      resources.centers(),
      resources.docs(),
    ])
      .then(([c, d]) => {
        setCenters(
          Array.isArray(c.data)
            ? c.data
            : c.data?.data || []
        );

        setDocs(
          Array.isArray(d.data)
            ? d.data
            : d.data?.data || []
        );
      })
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (rol === 'aprendiz' && !ok) {
      setError(
        'Debes aceptar los términos y condiciones'
      );
      return;
    }

    if (!f.tipoDocumento) {
      setError(
        'Selecciona el tipo de documento'
      );
      return;
    }

    if (
      rol === 'aprendiz' &&
      (
        !f.centroFormacionId ||
        !f.fechaVinculacion ||
        !f.fechaFinalizacion
      )
    ) {
      setError(
        'Completa centro y las dos fechas'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      const d = {
        ...f,
        rol,
      };

      if (rol !== 'aprendiz') {
        delete d.ficha;
        delete d.centroFormacionId;
        delete d.fechaVinculacion;
        delete d.fechaFinalizacion;
      }

      await auth.register(d);

      Alert.alert(
        'Registro exitoso',
        'Tu usuario fue creado correctamente',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.replace('Login'),
          },
        ]
      );
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  };

  const centerOptions = centers.map((c) => ({
    label: `${c.nombre}${
      c.ciudad ? ` — ${c.ciudad}` : ''
    }`,
    value: String(c.id),
  }));

  const docOptions = docs.map((d) => ({
    label: `${d.sigla} — ${d.nombre_documento}`,
    value: d.sigla,
  }));

  return (
    <View style={common.screen}>

      <Header
        title="Crear cuenta"
        subtitle={`Registro de ${rol}`}
        navigation={navigation}
      />

      <ScrollView
        contentContainerStyle={common.content}
      >

        {/* SELECCIÓN DE ROL */}
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            marginBottom: 8,
          }}
        >
          {['aprendiz', 'guarda'].map((x) => (
            <TouchableOpacity
              key={x}
              onPress={() => setRol(x)}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor:
                  rol === x
                    ? colors.primary
                    : colors.border,
                backgroundColor:
                  rol === x
                    ? colors.light
                    : '#fff',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '800',
                  color:
                    rol === x
                      ? colors.dark
                      : colors.text,
                }}
              >
                {x.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DATOS PERSONALES */}

        <Field
          label="Nombres"
          value={f.nombres}
          onChangeText={(v) =>
            set('nombres', v)
          }
        />

        <Field
          label="Apellidos"
          value={f.apellidos}
          onChangeText={(v) =>
            set('apellidos', v)
          }
        />

        <Field
          label="Documento"
          value={f.documento}
          onChangeText={(v) =>
            set('documento', v)
          }
          keyboardType="numeric"
        />

        <SelectField
          label="Tipo de documento"
          value={f.tipoDocumento}
          options={
            docOptions.length
              ? docOptions
              : [
                  {
                    label:
                      'CC — Cédula de ciudadanía',
                    value: 'CC',
                  },
                  {
                    label:
                      'TI — Tarjeta de identidad',
                    value: 'TI',
                  },
                  {
                    label:
                      'CE — Cédula de extranjería',
                    value: 'CE',
                  },
                  {
                    label:
                      'PAS — Pasaporte',
                    value: 'PAS',
                  },
                ]
          }
          onChange={(v) =>
            set('tipoDocumento', v)
          }
        />

        <Field
          label="Número de celular"
          value={f.celular}
          onChangeText={(v) =>
            set('celular', v)
          }
          keyboardType="phone-pad"
        />

        <Field
          label="Correo electrónico"
          value={f.email}
          onChangeText={(v) =>
            set('email', v)
          }
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Field
          label="Contraseña"
          value={f.password}
          onChangeText={(v) =>
            set('password', v)
          }
          secureTextEntry
        />

        {/* DATOS DEL APRENDIZ */}

        {rol === 'aprendiz' && (
          <>
            <Field
              label="Ficha"
              value={f.ficha}
              onChangeText={(v) =>
                set('ficha', v)
              }
            />

            <SelectField
              label="Centro de formación"
              value={String(
                f.centroFormacionId || ''
              )}
              options={centerOptions}
              onChange={(v) =>
                set(
                  'centroFormacionId',
                  v
                )
              }
              placeholder="Selecciona un centro de la base de datos"
            />

            <DatePickerField
              label="Fecha de vinculación"
              value={f.fechaVinculacion}
              onChange={(v) =>
                set(
                  'fechaVinculacion',
                  v
                )
              }
              maxDate={
                f.fechaFinalizacion ||
                undefined
              }
            />

            <DatePickerField
              label="Fecha de finalización"
              value={f.fechaFinalizacion}
              onChange={(v) =>
                set(
                  'fechaFinalizacion',
                  v
                )
              }
              minDate={
                f.fechaVinculacion ||
                undefined
              }
            />

            {/* TÉRMINOS Y CONDICIONES */}

            <TouchableOpacity
              onPress={() => setOk(!ok)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 14,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 5,
                  backgroundColor: ok
                    ? colors.primary
                    : '#fff',
                  marginRight: 9,
                }}
              />

              <Text>
                Acepto los términos y condiciones
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* ERROR */}

        {error ? (
          <Text style={common.error}>
            {error}
          </Text>
        ) : null}

        {/* REGISTRARSE */}

        <Button
          title="REGISTRARSE"
          onPress={submit}
          loading={loading}
        />

        <View
          style={{
            height: 12,
          }}
        />

        {/* VOLVER AL HOME */}

        <Button
          title="Volver al inicio"
          outline
          onPress={() =>
            navigation.navigate('Home')
          }
        />

      </ScrollView>
    </View>
  );
}