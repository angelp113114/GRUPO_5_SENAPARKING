import React,{useEffect,useState} from 'react';
import {Alert,Modal,ScrollView,Text,TouchableOpacity,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {auth,resources} from '../data/api';
import {colors,common} from '../theme';
import Header from '../components/Header';

type P=NativeStackScreenProps<RootStackParamList,'Dashboard'>;
const menus:any={
 aprendiz:[['home','Inicio','⌂'],['perfil','Mi perfil','👤'],['carnet','Visualizar carnet','▣'],['request','Petición de carnet','▤'],['update','Actualizar datos','✎'],['vehicles','Mis vehículos','🚗'],['support','Soporte técnico','⚙'],['notifications','Notificaciones','🔔'],['manual','Manual de uso','?']],
 guarda:[['home','Inicio','⌂'],['scanner','Escanear QR','⌗'],['records','Entrada y salida','↕'],['manual','Manual de uso','?']],
 administrador:[['home','Inicio','⌂'],['pending','Peticiones de carnet','✓'],['updateRequests','Peticiones actualización','↻'],['vehicles','Vehículos','🚗'],['blocks','Bloqueos','⛔'],['reports','Reportes','▤'],['centers','Centros de formación','⌖'],['docs','Tipos de documento','▥'],['users','Usuarios','♟'],['supportAdmin','Soporte técnico','◉'],['records','Entradas y salidas','↕']]
};
export default function DashboardScreen({navigation}:P){
 const [user,setUser]=useState<any>({}); const [drawer,setDrawer]=useState(false); const [unread,setUnread]=useState(0);
 useEffect(()=>{(async()=>{const x=await AsyncStorage.getItem('user');if(x)setUser(JSON.parse(x));loadUnread()})()},[]);
 const loadUnread=async()=>{try{const r=await resources.notifications();const a=Array.isArray(r.data)?r.data:[];setUnread(a.filter((n:any)=>n.leida===false||n.leido===false).length)}catch{}};
 const go=(key:string,title:string)=>{setDrawer(false); if(key==='perfil') navigation.navigate('PerfilAprendiz'); else if(key==='carnet') navigation.navigate('Carnet'); else if(key==='scanner') navigation.navigate('Scanner'); else navigation.navigate('Feature',{key,title});};
 const logout=async()=>{try{await auth.logout()}catch{}await AsyncStorage.multiRemove(['accessToken','user','emailRecuperacion']);navigation.replace('Login')};
 const role=user.rol||'aprendiz'; const list=menus[role]||menus.aprendiz;
 return <View style={common.screen}><Header title="SENA PARKING" subtitle={`${user.nombres||''} ${user.apellidos||''}`} onMenu={()=>setDrawer(true)} onBell={role==='aprendiz'?()=>go('notifications','Notificaciones'):undefined} badge={unread}/>
 <ScrollView contentContainerStyle={common.content}>
  <View style={[common.card,{backgroundColor:colors.light,padding:20}]}><Text style={{fontSize:14,color:colors.dark}}>¡Hola!</Text><Text style={{fontSize:25,fontWeight:'900',color:colors.dark,marginTop:3}}>{user.nombres||'Usuario'} 👋</Text><Text style={{color:colors.muted,marginTop:5}}>Gestiona SENA Parking desde tu celular de forma rápida y sencilla.</Text></View>
  <View style={common.card}><Text style={{fontSize:18,fontWeight:'900',color:colors.dark}}>¿Qué puedes hacer?</Text><Text style={{color:colors.muted,marginTop:8,lineHeight:22}}>Las funciones disponibles dependen de tu rol. Abre el menú ☰ para consultar módulos, solicitudes, documentos, soporte o control de acceso.</Text></View>
  <View style={common.card}><Text style={{fontSize:18,fontWeight:'900',color:colors.dark}}>Tu panel</Text><Text style={{color:colors.muted,marginTop:7,lineHeight:21}}>Esta pantalla es informativa. Las operaciones se realizan únicamente dentro del módulo correspondiente.</Text></View>
 </ScrollView>
 <Modal visible={drawer} transparent animationType="slide" onRequestClose={()=>setDrawer(false)}><View style={{flex:1,backgroundColor:'rgba(0,0,0,.35)'}}><View style={{width:'84%',height:'100%',backgroundColor:'#fff',paddingTop:48,paddingHorizontal:18}}><View style={{flexDirection:'row',alignItems:'center',marginBottom:22}}><ImagePlaceholder/><View style={{flex:1}}><Text style={{fontSize:19,fontWeight:'900',color:colors.dark}}>SENA PARKING</Text><Text style={{fontSize:12,color:colors.muted}}>{role}</Text></View><TouchableOpacity onPress={()=>setDrawer(false)}><Text style={{fontSize:28}}>×</Text></TouchableOpacity></View>{list.map((m:any)=><TouchableOpacity key={m[0]} onPress={()=>go(m[0],m[1])} style={{flexDirection:'row',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#eef2ee'}}><Text style={{width:34,fontSize:21}}>{m[2]}</Text><Text style={{fontWeight:'700',color:colors.text,flex:1}}>{m[1]}</Text><Text style={{color:colors.muted,fontSize:20}}>›</Text></TouchableOpacity>)}<View style={{flex:1}}/><TouchableOpacity onPress={logout} style={{paddingVertical:18,borderTopWidth:1,borderTopColor:colors.border}}><Text style={{color:colors.danger,fontWeight:'900',textAlign:'center'}}>CERRAR SESIÓN</Text></TouchableOpacity></View></View></Modal>
 </View>
}
function ImagePlaceholder(){return <View style={{width:44,height:44,borderRadius:12,backgroundColor:colors.light,alignItems:'center',justifyContent:'center',marginRight:10}}><Text style={{fontSize:23}}>🅿️</Text></View>}
