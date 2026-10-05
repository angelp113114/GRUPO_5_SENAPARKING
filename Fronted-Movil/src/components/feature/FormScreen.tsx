import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { resources, messageOf, api } from '../../data/api';
import { colors, common } from '../../theme';
import Header from '../Header';
import Button from '../Button';
import Field from '../Field';
import SelectField from '../SelectField';
import DatePickerField from '../DatePickerField';
import CompareData from './CompareData';
import FileButton from './FileButton';
import styles from './featureStyles';
import { arr, uriFile } from './featureUtils';
import Tab from './Tab';

export default function FormScreen({
  keyName,
  title,
  user,
  navigation,
  onDone,
}: any) {
  const [tipo, setTipo] =
    useState('bicicleta');

  const [marca, setMarca] =
    useState('');

  const [color, setColor] =
    useState('');

  const [serial, setSerial] =
    useState('');

  const [
    cilindraje,
    setCilindraje,
  ] = useState('');

  const [modelo, setModelo] =
    useState('');

  const [asunto, setAsunto] =
    useState('');

  const [
    descripcion,
    setDescripcion,
  ] = useState('');

  const [form, setForm] =
    useState<any>({
      tipo: 'datos_personales',
    });

  const [loading, setLoading] =
    useState(false);

  const [photo, setPhoto] =
    useState<any>(null);

  const [
    vehiclePhoto,
    setVehiclePhoto,
  ] = useState<any>(null);

  const [docs, setDocs] =
    useState<any[]>([]);

  const [personal, setPersonal] =
    useState<any>({});

  const [vehicle, setVehicle] =
    useState<any>(null);

  const [centers, setCenters] =
    useState<any[]>([]);

  const [docTypes, setDocTypes] =
    useState<any[]>([]);

  useEffect(() => {
    if (
      keyName === 'request' ||
      keyName === 'update'
    ) {
      Promise.all([
        resources.centers(),
        resources.docs(),
        resources.myVehicles(),
      ])
        .then(
          ([c, d, v]) => {
            setCenters(
              arr(c.data)
            );

            setDocTypes(
              arr(d.data)
            );

            const vv =
              arr(v.data)[0] ||
              null;

            setVehicle(vv);

            if (vv) {
              setTipo(
                vv.tipo ||
                  'bicicleta'
              );

              setMarca(
                vv.marca || ''
              );

              setColor(
                vv.color || ''
              );

              setSerial(
                vv.tipo ===
                  'moto'
                  ? vv.placa ||
                      ''
                  : vv.serial ||
                      ''
              );

              setCilindraje(
                vv.cilindraje ||
                  ''
              );

              setModelo(
                vv.modelo || ''
              );
            }

            if (
              keyName ===
              'update'
            ) {
              resources
                .user(user.id)
                .then((r) =>
                  setPersonal(
                    r.data
                  )
                )
                .catch(
                  () => {}
                );
            }
          }
        )
        .catch(() => {});
    }
  }, []);

  const takePhoto = async (
    setter: any
  ) => {
    const p =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!p.granted) {
      return Alert.alert(
        'Permiso',
        'Permita el acceso a la cámara'
      );
    }

    const r =
      await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });

    if (!r.canceled) {
      setter(
        uriFile(
          r.assets[0]
        )
      );
    }
  };

  const pickImage = async (
    setter: any
  ) => {
    const p =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!p.granted) {
      return Alert.alert(
        'Permiso',
        'Permita acceso a las fotos'
      );
    }

    const r =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });

    if (!r.canceled) {
      setter(
        uriFile(
          r.assets[0]
        )
      );
    }
  };

  const pickFile = async (
    setter: any
  ) => {
    const r =
      await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

    if (!r.canceled) {
      setter(
        uriFile(
          r.assets[0]
        )
      );
    }
  };

  const chooseFileSource = (
    setter: any
  ) => {
    Alert.alert(
      'Seleccionar archivo',
      '¿De dónde desea seleccionar el archivo?',
      [
        {
          text: 'Cámara',
          onPress: () =>
            takePhoto(setter),
        },
        {
          text: 'Fotos',
          onPress: () =>
            pickImage(setter),
        },
        {
          text: 'Archivos',
          onPress: () =>
            pickFile(setter),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const addCategory = (
    cat: string,
    label: string
  ) => {
    const saveDocument = (
      asset: any
    ) => {
      const f = uriFile(asset);

      if (!f) {
        return;
      }

      setDocs(
        (p: any[]) => [
          ...p.filter(
            (x) =>
              x.category !== cat
          ),
          {
            ...f,
            file: f,
            category: cat,
            label,
          },
        ]
      );
    };

    Alert.alert(
      'Seleccionar archivo',
      '¿De dónde desea seleccionar el archivo?',
      [
        {
          text: 'Cámara',
          onPress: async () => {
            const p =
              await ImagePicker.requestCameraPermissionsAsync();

            if (!p.granted) {
              return Alert.alert(
                'Permiso',
                'Permita el acceso a la cámara'
              );
            }

            const r =
              await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                quality: 0.85,
              });

            if (!r.canceled) {
              saveDocument(
                r.assets[0]
              );
            }
          },
        },
        {
          text: 'Fotos',
          onPress: async () => {
            const p =
              await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!p.granted) {
              return Alert.alert(
                'Permiso',
                'Permita acceso a las fotos'
              );
            }

            const r =
              await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.85,
              });

            if (!r.canceled) {
              saveDocument(
                r.assets[0]
              );
            }
          },
        },
        {
          text: 'Archivos',
          onPress: async () => {
            const r =
              await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
              });

            if (!r.canceled) {
              saveDocument(
                r.assets[0]
              );
            }
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const submit = async () => {
    setLoading(true);

    try {
      if (
        keyName ===
        'createCenter'
      ) {
        if (
          !asunto.trim() ||
          !descripcion.trim() ||
          !serial.trim()
        ) {
          throw new Error(
            'Nombre, ciudad y dirección son obligatorios'
          );
        }

        await resources.createCenter(
          {
            nombre:
              asunto.trim(),
            ciudad:
              descripcion.trim(),
            direccion:
              serial.trim(),
          }
        );

        Alert.alert(
          'Listo',
          'Centro creado correctamente'
        );
      } else if (
        keyName ===
        'createDoc'
      ) {
        if (
          !asunto.trim() ||
          !serial.trim()
        ) {
          throw new Error(
            'Nombre y sigla son obligatorios'
          );
        }

        await resources.createDoc(
          {
            sigla: serial
              .trim()
              .toUpperCase(),
            nombre_documento:
              asunto.trim(),
          }
        );

        Alert.alert(
          'Listo',
          'Tipo de documento creado correctamente'
        );
      } else if (
        keyName ===
        'support'
      ) {
        if (
          !asunto.trim() ||
          !descripcion.trim()
        ) {
          throw new Error(
            'El asunto y la descripción son obligatorios'
          );
        }

        await resources.createSupport(
          {
            asunto:
              asunto.trim(),
            descripcion:
              descripcion.trim(),
          }
        );

        Alert.alert(
          'SENA PARKING',
          'Soporte enviado correctamente'
        );
      } else if (
        keyName ===
        'request'
      ) {
        const required =
          tipo === 'moto'
            ? [
                'cedula',
                'tecno',
                'soat',
                'placa',
                'propiedad',
              ]
            : [
                'cedula',
                'serial',
                'propiedad',
              ];

        if (
          !marca.trim() ||
          !color.trim() ||
          !serial.trim() ||
          !photo ||
          !vehiclePhoto
        ) {
          throw new Error(
            'Completa los datos y las dos fotos obligatorias'
          );
        }

        if (
          tipo === 'moto' &&
          (!cilindraje.trim() ||
            !modelo.trim())
        ) {
          throw new Error(
            'Para moto el cilindraje y modelo son obligatorios'
          );
        }

        if (
          !required.every(
            (t) =>
              docs.some(
                (d: any) =>
                  d.category ===
                  t
              )
          )
        ) {
          throw new Error(
            `Debes adjuntar: ${required.join(
              ', '
            )}`
          );
        }

        const fd: any =
          new FormData();

        fd.append(
          'tipoVehiculo',
          tipo
        );

        fd.append(
          'marca',
          marca.trim()
        );

        fd.append(
          'color',
          color.trim()
        );

        fd.append(
          'serialPlaca',
          serial.trim()
        );

        fd.append(
          'cilindraje',
          tipo === 'moto'
            ? cilindraje.trim()
            : ''
        );

        fd.append(
          'modelo',
          tipo === 'moto'
            ? modelo.trim()
            : ''
        );

        fd.append(
          'fotoAprendiz',
          photo
        );

        fd.append(
          'fotoVehiculo',
          vehiclePhoto
        );

        docs.forEach(
          (d: any) => {
            fd.append(
              'documentosAnexos',
              d.file
            );

            fd.append(
              'documentosTipos',
              d.category
            );
          }
        );

        await resources.requestCarnet(
          fd
        );

        Alert.alert(
          'SENA PARKING',
          'Solicitud enviada correctamente'
        );
      } else if (
        keyName ===
        'update'
      ) {
        let actual: any =
          {};

        let nuevos: any =
          {};

        if (
          form.tipo ===
          'datos_personales'
        ) {
          actual = {
            nombres:
              personal.nombres,
            apellidos:
              personal.apellidos,
            documento:
              personal.documento,
            tipoDocumento:
              personal.tipoDocumento,
            celular:
              personal.celular,
            ficha:
              personal.ficha,
            centroFormacionId:
              personal.centroFormacionId,
            fechaVinculacion:
              personal.fechaVinculacion,
            fechaFinalizacion:
              personal.fechaFinalizacion,
          };

          nuevos = {
            ...actual,
          };
        } else {
          actual = {
            vehiculoId:
              vehicle?.id,
            tipoVehiculo:
              vehicle?.tipo,
            marca:
              vehicle?.marca,
            color:
              vehicle?.color,
            serialPlaca:
              vehicle?.tipo ===
              'moto'
                ? vehicle?.placa
                : vehicle?.serial,
            cilindraje:
              vehicle?.cilindraje,
            modelo:
              vehicle?.modelo,
          };

          nuevos = {
            vehiculoId:
              vehicle?.id,
            tipoVehiculo:
              tipo,
            marca,
            color,
            serialPlaca:
              serial,
            cilindraje:
              tipo === 'moto'
                ? cilindraje
                : '',
            modelo:
              tipo === 'moto'
                ? modelo
                : '',
          };
        }

        const fd: any =
          new FormData();

        fd.append(
          'tipo',
          form.tipo
        );

        fd.append(
          'datosActuales',
          JSON.stringify(
            actual
          )
        );

        fd.append(
          'datosNuevos',
          JSON.stringify(
            nuevos
          )
        );

        if (photo) {
          fd.append(
            'fotoNueva',
            photo
          );
        }

        docs.forEach(
          (d: any) => {
            fd.append(
              'documentos',
              d.file
            );

            fd.append(
              'documentosTipos',
              d.category
            );
          }
        );

        await api.post(
          '/api/solicitudes-actualizacion',
          fd
        );

        Alert.alert(
          'SENA PARKING',
          'Solicitud de actualización enviada correctamente'
        );
      }

      onDone();

      navigation.goBack();
    } catch (e) {
      Alert.alert(
        'Error',
        messageOf(e)
      );
    } finally {
      setLoading(false);
    }
  };

  const centerOptions =
    centers.map((c) => ({
      label: `${c.nombre}${
        c.ciudad
          ? ` — ${c.ciudad}`
          : ''
      }`,
      value: String(
        c.id
      ),
    }));

  const docOptions =
    docTypes.map((d) => ({
      label: `${d.sigla} — ${d.nombre_documento}`,
      value: d.sigla,
    }));

  const requestCategories =
    tipo === 'moto'
      ? [
          [
            'cedula',
            'Foto de la cédula',
          ],
          [
            'tecno',
            'Tecnomecánica',
          ],
          ['soat', 'SOAT'],
          [
            'placa',
            'Foto de la placa',
          ],
          [
            'propiedad',
            'Tarjeta de propiedad',
          ],
        ]
      : [
          [
            'cedula',
            'Foto de la cédula',
          ],
          [
            'serial',
            'Foto del serial',
          ],
          [
            'propiedad',
            'Tarjeta de propiedad',
          ],
        ];

  const updateVehicleCategories =
    tipo === 'moto'
      ? [
          [
            'tecno',
            'Tecnomecánica (opcional)',
          ],
          [
            'soat',
            'SOAT (opcional)',
          ],
          [
            'placa',
            'Foto de la placa (opcional)',
          ],
          [
            'propiedad',
            'Tarjeta de propiedad (opcional)',
          ],
        ]
      : [
          [
            'serial',
            'Foto del serial (opcional)',
          ],
          [
            'propiedad',
            'Tarjeta de propiedad (opcional)',
          ],
        ];

  let body: React.ReactNode;

  if (
    keyName ===
    'createCenter'
  ) {
    body = (
      <>
        <Text style={common.title}>
          Nuevo centro
        </Text>

        <Field
          label="NOMBRE"
          value={asunto}
          onChangeText={
            setAsunto
          }
        />

        <Field
          label="CIUDAD"
          value={descripcion}
          onChangeText={
            setDescripcion
          }
        />

        <Field
          label="DIRECCIÓN"
          value={serial}
          onChangeText={
            setSerial
          }
        />
      </>
    );
  } else if (
    keyName ===
    'createDoc'
  ) {
    body = (
      <>
        <Text style={common.title}>
          Nuevo tipo de documento
        </Text>

        <Field
          label="NOMBRE"
          value={asunto}
          onChangeText={
            setAsunto
          }
        />

        <Field
          label="SIGLA"
          value={serial}
          onChangeText={
            setSerial
          }
        />
      </>
    );
  } else if (
    keyName ===
    'support'
  ) {
    body = (
      <>
        <Text style={common.title}>
          Soporte técnico
        </Text>

        <Field
          label="ASUNTO"
          value={asunto}
          onChangeText={
            setAsunto
          }
        />

        <Field
          label="DESCRIPCIÓN"
          value={descripcion}
          onChangeText={
            setDescripcion
          }
          multiline
          numberOfLines={6}
        />
      </>
    );
  } else if (
    keyName ===
    'request'
  ) {
    body = (
      <>
        <Text style={common.title}>
          Petición de carnet
        </Text>

        <Text
          style={common.subtitle}
        >
          Para la primera solicitud
          se mantienen los
          documentos requeridos.
        </Text>

        <SelectField
          label="TIPO DE VEHÍCULO"
          value={tipo}
          options={[
            {
              label:
                '🚲 Bicicleta',
              value:
                'bicicleta',
            },
            {
              label: '🏍️ Moto',
              value: 'moto',
            },
          ]}
          onChange={(v) => {
            setTipo(v);
            setSerial('');
            setDocs([]);
          }}
        />

        <Field
          label="MARCA"
          value={marca}
          onChangeText={
            setMarca
          }
        />

        <Field
          label="COLOR"
          value={color}
          onChangeText={
            setColor
          }
        />

        <Field
          label={
            tipo === 'moto'
              ? 'PLACA'
              : 'SERIAL'
          }
          value={serial}
          onChangeText={
            setSerial
          }
        />

        {tipo === 'moto' && (
          <>
            <Field
              label="CILINDRAJE"
              value={
                cilindraje
              }
              onChangeText={
                setCilindraje
              }
              keyboardType="numeric"
            />

            <Field
              label="MODELO"
              value={modelo}
              onChangeText={
                setModelo
              }
              keyboardType="numeric"
            />
          </>
        )}

        <FileButton
          label="Foto del aprendiz"
          value={photo?.name}
          onPress={() =>
            chooseFileSource(
              setPhoto
            )
          }
        />

        <FileButton
          label="Foto del vehículo"
          value={
            vehiclePhoto?.name
          }
          onPress={() =>
            chooseFileSource(
              setVehiclePhoto
            )
          }
        />

        <Text
          style={styles.subhead}
        >
          Anexos requeridos
        </Text>

        {requestCategories.map(
          ([c, l]) => (
            <FileButton
              key={c}
              label={`📎 ${l}`}
              value={
                docs.find(
                  (d: any) =>
                    d.category ===
                    c
                )?.name
              }
              onPress={() =>
                addCategory(
                  c,
                  l
                )
              }
            />
          )
        )}
      </>
    );
  } else {
    body = (
      <>
        <Text style={common.title}>
          Actualizar datos
        </Text>

        <Text
          style={common.subtitle}
        >
          Solo se solicitarán los
          datos necesarios. La
          cédula no es un requisito
          documental y los anexos
          del vehículo son
          opcionales.
        </Text>

        <View
          style={{
            flexDirection:
              'row',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Tab
            active={
              form.tipo ===
              'datos_personales'
            }
            text="Personales"
            onPress={() => {
              setForm({
                tipo:
                  'datos_personales',
              });

              setDocs([]);
            }}
          />

          <Tab
            active={
              form.tipo ===
              'datos_vehiculo'
            }
            text="Vehículo"
            onPress={() => {
              setForm({
                tipo:
                  'datos_vehiculo',
              });

              setDocs([]);
            }}
          />
        </View>

        {form.tipo ===
        'datos_personales' ? (
          <>
            <Field
              label="NOMBRES"
              value={
                personal.nombres ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  nombres: v,
                })
              }
            />

            <Field
              label="APELLIDOS"
              value={
                personal.apellidos ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  apellidos: v,
                })
              }
            />

            <Field
              label="DOCUMENTO (OPCIONAL)"
              value={
                personal.documento ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  documento: v,
                })
              }
            />

            <SelectField
              label="TIPO DE DOCUMENTO"
              value={
                personal.tipoDocumento ||
                ''
              }
              options={
                docOptions
              }
              onChange={(v) =>
                setPersonal({
                  ...personal,
                  tipoDocumento:
                    v,
                })
              }
            />

            <Field
              label="CELULAR"
              value={
                personal.celular ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  celular: v,
                })
              }
            />

            <Field
              label="FICHA"
              value={
                personal.ficha ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  ficha: v,
                })
              }
            />

            <Text
              style={common.label}
            >
              CENTRO ACTUAL
            </Text>

            <Text
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor:
                  colors.border,
                borderRadius: 10,
                color:
                  colors.dark,
                backgroundColor:
                  colors.bg,
              }}
            >
              {personal
                .centroFormacion
                ?.nombre ||
                'No disponible'}
            </Text>

            <SelectField
              label="CENTRO DE FORMACIÓN (OPCIONAL)"
              value={String(
                personal.centroFormacionId ||
                  ''
              )}
              options={
                centerOptions
              }
              onChange={(v) =>
                setPersonal({
                  ...personal,
                  centroFormacionId:
                    v,
                })
              }
            />

            <DatePickerField
              label="Fecha de vinculación"
              value={
                personal.fechaVinculacion ||
                ''
              }
              onChange={(v) =>
                setPersonal({
                  ...personal,
                  fechaVinculacion:
                    v,
                })
              }
            />

            <DatePickerField
              label="Fecha de finalización"
              value={
                personal.fechaFinalizacion ||
                ''
              }
              onChange={(v) =>
                setPersonal({
                  ...personal,
                  fechaFinalizacion:
                    v,
                })
              }
            />

            <FileButton
              label="Foto nueva (opcional)"
              value={
                photo?.name
              }
              onPress={() =>
                chooseFileSource(
                  setPhoto
                )
              }
            />
          </>
        ) : (
          <>
            <CompareData
              title="DATOS ACTUALES DEL VEHÍCULO"
              data={
                vehicle
                  ? {
                      vehiculoId:
                        vehicle.id,
                      tipoVehiculo:
                        vehicle.tipo,
                      marca:
                        vehicle.marca,
                      color:
                        vehicle.color,
                      serialPlaca:
                        vehicle.tipo ===
                        'moto'
                          ? vehicle.placa
                          : vehicle.serial,
                      cilindraje:
                        vehicle.cilindraje,
                      modelo:
                        vehicle.modelo,
                    }
                  : null
              }
            />

            <SelectField
              label="NUEVO TIPO"
              value={tipo}
              options={[
                {
                  label:
                    'Bicicleta',
                  value:
                    'bicicleta',
                },
                {
                  label:
                    'Moto',
                  value: 'moto',
                },
              ]}
              onChange={(v) => {
                setTipo(v);
                setDocs([]);
              }}
            />

            <Field
              label="MARCA"
              value={marca}
              onChangeText={
                setMarca
              }
            />

            <Field
              label="COLOR"
              value={color}
              onChangeText={
                setColor
              }
            />

            <Field
              label={
                tipo === 'moto'
                  ? 'PLACA'
                  : 'SERIAL (OPCIONAL)'
              }
              value={serial}
              onChangeText={
                setSerial
              }
            />

            {tipo === 'moto' && (
              <>
                <Field
                  label="CILINDRAJE"
                  value={
                    cilindraje
                  }
                  onChangeText={
                    setCilindraje
                  }
                />

                <Field
                  label="MODELO"
                  value={modelo}
                  onChangeText={
                    setModelo
                  }
                />
              </>
            )}

            <Text
              style={
                styles.subhead
              }
            >
              Documentos del
              vehículo — todos
              opcionales
            </Text>

            {updateVehicleCategories.map(
              ([c, l]) => (
                <FileButton
                  key={c}
                  label={`📎 ${l}`}
                  value={
                    docs.find(
                      (d: any) =>
                        d.category ===
                        c
                    )?.name
                  }
                  onPress={() =>
                    addCategory(
                      c,
                      l
                    )
                  }
                />
              )
            )}
          </>
        )}
      </>
    );
  }

  return (
    <View
      style={common.screen}
    >
      <Header
        title={title}
        navigation={
          navigation
        }
        onMenu={() => {}}
      />

      <ScrollView
        contentContainerStyle={
          common.content
        }
      >
        <View
          style={common.card}
        >
          {body}

          <Button
            title="ENVIAR / GUARDAR"
            onPress={submit}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   FILE BUTTON
========================================================= */

