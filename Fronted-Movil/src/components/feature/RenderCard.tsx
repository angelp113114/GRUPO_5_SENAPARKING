import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { resources, messageOf } from '../../data/api';
import { colors, common } from '../../theme';
import Button from '../Button';
import styles from './featureStyles';
import FileViewerModal from '../FileViewerModal';
import Photo from './Photo';
import FileButtonView from './FileButtonView';
import AdminActions from './AdminActions';
import SupportReply from './SupportReply';
import BlockActions from './BlockActions';
import AdminVehicleActions from './AdminVehicleActions';
import CompareData from './CompareData';
import CenterActions from './CenterActions';
import DocActions from './DocActions';
import { docsArray, statusText } from './featureUtils';

export default function RenderCard({
  x,
  kind,
  i,
  load,
}: any) {
  const [viewer, setViewer] =
    useState<any>(null);

  const open = (
    name: string,
    label: string
  ) =>
    setViewer({
      name,
      title: label,
    });

  const user =
    x.user ||
    x.User ||
    {};

  return (
    <View style={common.card}>
      <Text
        style={styles.cardTitle}
      >
        {user.nombres
          ? `${user.nombres} ${
              user.apellidos ||
              ''
            }`
          : x.nombres
          ? `${x.nombres} ${
              x.apellidos ||
              ''
            }`
          : x.nombre ||
            x.titulo ||
            x.asunto ||
            `Registro #${
              x.id ??
              i + 1
            }`}
      </Text>

      {kind === 'notifications' ? (
        <>
          <Text
            style={{
              marginTop: 7,
            }}
          >
            {x.mensaje}
          </Text>

          <Text
            style={styles.date}
          >
            {x.createdAt
              ? new Date(
                  x.createdAt
                ).toLocaleString(
                  'es-CO'
                )
              : ''}
          </Text>
        </>
      ) : kind === 'support' || kind === 'supportAdmin' ? (
  <>
    <Text style={styles.boldLine}>
      Asunto: {x.asunto || '—'}
    </Text>

    <Text style={{ marginTop: 8 }}>
      {x.descripcion || '—'}
    </Text>

    {/* ESTADO */}
    <View
      style={{
        marginTop: 12,
        padding: 10,
        borderRadius: 10,
        backgroundColor:
          [
            'resuelto',
            'solucionado',
            'solucionada',
            'cerrado',
            'cerrada',
          ].includes(
            String(x.estado || '')
              .trim()
              .toLowerCase()
          )
            ? '#E8F5E9'
            : '#FFF8E1',
      }}
    >
      <Text
        style={{
          fontWeight: '900',
          color:
            [
              'resuelto',
              'solucionado',
              'solucionada',
              'cerrado',
              'cerrada',
            ].includes(
              String(x.estado || '')
                .trim()
                .toLowerCase()
            )
              ? '#2E7D32'
              : '#B26A00',
        }}
      >
        {[
          'resuelto',
          'solucionado',
          'solucionada',
          'cerrado',
          'cerrada',
        ].includes(
          String(x.estado || '')
            .trim()
            .toLowerCase()
        )
          ? '✅ RESUELTO'
          : '⏳ PENDIENTE'}
      </Text>
    </View>

    {/* FECHA */}
    {(x.createdAt || x.fechaCreacion) && (
      <Text style={styles.date}>
        Solicitud:{' '}
        {new Date(
          x.createdAt || x.fechaCreacion
        ).toLocaleString('es-CO')}
      </Text>
    )}

    {/* RESPUESTA DEL ADMINISTRADOR */}
    {x.respuesta ? (
      <View style={styles.answer}>
        <Text style={styles.answerTitle}>
          💬 Respuesta del administrador
        </Text>

        <Text>
          {x.respuesta}
        </Text>

        {(x.updatedAt || x.fechaRespuesta) && (
          <Text style={styles.date}>
            Respondido:{' '}
            {new Date(
              x.fechaRespuesta || x.updatedAt
            ).toLocaleString('es-CO')}
          </Text>
        )}
      </View>
    ) : (
      <View
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 10,
          backgroundColor: '#F5F5F5',
        }}
      >
        <Text style={{ color: colors.muted }}>
          El administrador todavía no ha respondido esta solicitud.
        </Text>
      </View>
    )}

    {/* SOLO ADMINISTRADOR PUEDE RESPONDER */}
    {kind === 'supportAdmin' &&
      ![
        'resuelto',
        'solucionado',
        'solucionada',
        'cerrado',
        'cerrada',
      ].includes(
        String(x.estado || '')
          .trim()
          .toLowerCase()
      ) && (
        <SupportReply
          id={x.id}
          load={load}
        />
      )}
  </>
) : kind === 'pending' ? (
        <>
          <Text>
            Documento:{' '}
            {user.documento ||
              '—'}
          </Text>

          <Text>
            Tipo documento:{' '}
            {user.tipoDocumento ||
              '—'}
          </Text>

          <Text>
            Correo:{' '}
            {user.email || '—'}
          </Text>

          <Text>
            Celular:{' '}
            {user.celular ||
              '—'}
          </Text>

          <Text>
            Ficha:{' '}
            {user.ficha || '—'}
          </Text>

          <Text>
            Centro:{' '}
            {user
              .centroFormacion
              ?.nombre ||
              '—'}
          </Text>

          <Text
            style={
              styles.subhead
            }
          >
            Vehículo
          </Text>

          <Text>
            Tipo:{' '}
            {x.tipoVehiculo ||
              '—'}
          </Text>

          <Text>
            Marca:{' '}
            {x.marca || '—'}
          </Text>

          <Text>
            Color:{' '}
            {x.color || '—'}
          </Text>

          <Text>
            {x.tipoVehiculo ===
            'moto'
              ? 'Placa'
              : 'Serial'}:{' '}
            {x.serialPlaca ||
              '—'}
          </Text>

          {x.tipoVehiculo ===
            'moto' && (
            <>
              <Text>
                Cilindraje:{' '}
                {x.cilindraje ||
                  '—'}
              </Text>

              <Text>
                Modelo:{' '}
                {x.modelo || '—'}
              </Text>
            </>
          )}

          <Photo
            name={
              x.fotoAprendiz
            }
            label="Foto del aprendiz"
          />

          <Photo
            name={
              x.fotoVehiculo
            }
            label="Foto del vehículo"
          />

          {x.formatoDiligenciado && (
            <FileButtonView
              name={
                x.formatoDiligenciado
              }
              label="Formato diligenciado"
              onOpen={open}
            />
          )}

          {docsArray(
            x.documentosAnexos
          ).map(
            (
              d: any,
              j: number
            ) => (
              <FileButtonView
                key={j}
                name={
                  d.ruta ||
                  d.nombre ||
                  d
                }
                label={
                  d.tipo ||
                  d.nombre ||
                  `Anexo ${
                    j + 1
                  }`
                }
                onOpen={open}
              />
            )
          )}

          {x.estado ===
            'pendiente' && (
            <AdminActions
              id={x.id}
              kind="carnet"
              load={load}
            />
          )}

          {x.estado ===
            'aprobada' && (
            <Button
              title="GENERAR CARNET"
              onPress={async () => {
                try {
                  await resources.generateCarnet(
                    x.id
                  );

                  Alert.alert(
                    'Listo',
                    'Carnet generado'
                  );

                  load();
                } catch (e) {
                  Alert.alert(
                    'Error',
                    messageOf(e)
                  );
                }
              }}
            />
          )}
        </>
      ) : kind ===
        'updateRequests' ? (
        <>
          <Text
            style={
              styles.boldLine
            }
          >
            Tipo:{' '}
            {x.tipo ===
            'datos_vehiculo'
              ? 'Datos del vehículo'
              : 'Datos personales'}
          </Text>

          <CompareData
            title="DATOS ANTERIORES"
            data={
              x.datosActuales
            }
          />

          <CompareData
            title="DATOS A ACTUALIZAR"
            data={
              x.datosNuevos
            }
          />

          {x.fotoNueva && (
            <Photo
              name={x.fotoNueva}
              label="Nueva foto"
            />
          )}

          {docsArray(
            x.documentos
          ).map(
            (
              d: any,
              j: number
            ) => (
              <FileButtonView
                key={j}
                name={
                  d.ruta ||
                  d.nombre ||
                  d
                }
                label={
                  d.nombre ||
                  d.tipo ||
                  `Documento ${
                    j + 1
                  }`
                }
                onOpen={open}
              />
            )
          )}

          <Text
            style={
              styles.boldLine
            }
          >
            {statusText(
              x.estado
            )}
          </Text>

          {x.estado ===
            'pendiente' && (
            <AdminActions
              id={x.id}
              kind="update"
              load={load}
            />
          )}
        </>
      ) : kind ===
          'vehicles' ||
        kind ===
          'myVehicles' ? (
        <>
          <Text>
            Tipo:{' '}
            {x.tipo || '—'}
          </Text>

          <Text>
            Marca:{' '}
            {x.marca || '—'}
          </Text>

          <Text>
            Color:{' '}
            {x.color || '—'}
          </Text>

          {x.tipo ===
          'moto' ? (
            <>
              <Text>
                Placa:{' '}
                {x.placa || '—'}
              </Text>

              <Text>
                Cilindraje:{' '}
                {x.cilindraje ||
                  '—'}
              </Text>

              <Text>
                Modelo:{' '}
                {x.modelo || '—'}
              </Text>
            </>
          ) : (
            <Text>
              Serial:{' '}
              {x.serial || '—'}
            </Text>
          )}

          <Text
            style={
              styles.subhead
            }
          >
            Propietario
          </Text>

          <Text>
            {user.nombres
              ? `${user.nombres} ${
                  user.apellidos ||
                  ''
                }`
              : '—'}
          </Text>

          <Text>
            Documento:{' '}
            {user.documento ||
              '—'}
          </Text>

          <Text>
            Ficha:{' '}
            {user.ficha || '—'}
          </Text>

          <Text>
            Centro:{' '}
            {user
              .centroFormacion
              ?.nombre ||
              '—'}
          </Text>

          <Photo
            name={
              x.foto_principal
            }
            label="Foto principal"
          />

          <Photo
            name={
              x.foto_secundaria
            }
            label="Foto secundaria"
          />

          {kind ===
            'vehicles' && (
            <AdminVehicleActions
              item={x}
              load={load}
            />
          )}
        </>
      ) : kind ===
          'users' ||
        kind ===
          'blocks' ? (
        <>
          <Text>
            Documento:{' '}
            {x.documento ||
              '—'}
          </Text>

          <Text>
            Correo:{' '}
            {x.email || '—'}
          </Text>

          <Text>
            Rol:{' '}
            {x.rol || '—'}
          </Text>

          <Text>
            Estado:{' '}
            {x.estado ||
              'activo'}
          </Text>

          {kind ===
            'blocks' && (
            <BlockActions
              user={x}
              load={load}
            />
          )}
        </>
      ) : kind ===
        'records' ? (
        <>
          <Text>
            Aprendiz:{' '}
            {x.aprendiz ||
              '—'}
          </Text>

          <Text>
            Vehículo:{' '}
            {x.vehiculo ||
              '—'}{' '}
            ·{' '}
            {x.placaSerial ||
              '—'}
          </Text>

          <Text>
            Entrada:{' '}
            {x.hora_entrada
              ? new Date(
                  x.hora_entrada
                ).toLocaleString(
                  'es-CO'
                )
              : '—'}
          </Text>

          <Text>
            Salida:{' '}
            {x.hora_salida
              ? new Date(
                  x.hora_salida
                ).toLocaleString(
                  'es-CO'
                )
              : '—'}
          </Text>

          <Text
            style={styles.status}
          >
            {x.estado ===
            'dentro'
              ? '🟢 Dentro'
              : '⚪ Fuera'}
          </Text>
        </>
      ) : kind ===
        'reports' ? (
        <>
          <Text>
            Asunto:{' '}
            {x.asunto || '—'}
          </Text>

          <Text
            style={{
              marginTop: 6,
            }}
          >
            {x.descripcion ||
              '—'}
          </Text>

          <Text
            style={
              styles.boldLine
            }
          >
            Estado:{' '}
            {statusText(
              x.estado
            )}
          </Text>

          {x.respuesta && (
            <Text
              style={{
                marginTop: 5,
              }}
            >
              Solución:{' '}
              {x.respuesta}
            </Text>
          )}
        </>
      ) : kind ===
        'centers' ? (
        <>
          <Text>
            Ciudad:{' '}
            {x.ciudad || '—'}
          </Text>

          <Text>
            Dirección:{' '}
            {x.direccion ||
              '—'}
          </Text>

          <CenterActions
            item={x}
            load={load}
          />
        </>
      ) : kind === 'docs' ? (
        <>
          <Text>
            Sigla:{' '}
            {x.sigla || '—'}
          </Text>

          <Text>
            Nombre:{' '}
            {x.nombre_documento ||
              x.descripcion ||
              x.nombre ||
              '—'}
          </Text>

          <DocActions
            item={x}
            load={load}
          />
        </>
      ) : (
        <Text>
          {JSON.stringify(x).slice(
            0,
            500
          )}
        </Text>
      )}

      <FileViewerModal
        visible={!!viewer}
        onClose={() =>
          setViewer(null)
        }
        name={viewer?.name}
        title={
          viewer?.title
        }
      />
    </View>
  );
}

/* =========================================================
   ACCIONES ADMIN
========================================================= */

