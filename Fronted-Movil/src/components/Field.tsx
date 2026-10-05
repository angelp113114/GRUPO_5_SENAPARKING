import React from 'react'; import {Text,TextInput,TextInputProps,View} from 'react-native'; import {common} from '../theme';
export default function Field({label,...props}:{label:string}&TextInputProps){return <View><Text style={common.label}>{label}</Text><TextInput style={common.input} {...props}/></View>}
