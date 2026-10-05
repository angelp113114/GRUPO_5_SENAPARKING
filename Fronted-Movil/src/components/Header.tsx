import React from 'react';
import {Image,Text,TouchableOpacity,View} from 'react-native';
import {colors} from '../theme';
export default function Header({title='SENA PARKING',subtitle,onMenu,onBell,badge=0,navigation,showBack=true}:{title?:string;subtitle?:string;onMenu?:()=>void;onBell?:()=>void;badge?:number;navigation?:any;showBack?:boolean}){
 const back=showBack&&navigation?.canGoBack?.();
 return <View style={{backgroundColor:'#fff',paddingHorizontal:12,paddingTop:14,paddingBottom:12,borderBottomWidth:1,borderBottomColor:colors.border,flexDirection:'row',alignItems:'center'}}>
  {back&&<TouchableOpacity onPress={()=>navigation.goBack()} style={{width:40,height:42,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:31,color:colors.dark}}>‹</Text></TouchableOpacity>}
  {onMenu&&<TouchableOpacity onPress={onMenu} style={{width:42,height:42,alignItems:'center',justifyContent:'center',marginRight:2}}><Text style={{fontSize:27,color:colors.dark}}>☰</Text></TouchableOpacity>}
  <Image source={require('../../assets/logo-sena-parking.png')} style={{width:42,height:42,resizeMode:'contain',marginRight:9}}/>
  <View style={{flex:1}}><Text style={{fontSize:18,fontWeight:'900',color:colors.dark}}>{title}</Text>{subtitle&&<Text style={{fontSize:11,color:colors.muted}}>{subtitle}</Text>}</View>
  {onBell&&<TouchableOpacity onPress={onBell} style={{width:44,height:44,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:23}}>🔔</Text>{badge>0&&<View style={{position:'absolute',right:2,top:2,minWidth:18,height:18,borderRadius:9,backgroundColor:colors.danger,alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff',fontSize:10,fontWeight:'900'}}>{badge>99?'99+':badge}</Text></View>}</TouchableOpacity>}
 </View>
}
