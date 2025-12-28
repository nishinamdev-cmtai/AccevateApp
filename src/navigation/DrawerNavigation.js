import  {  useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,Linking
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DashboardScreen from "../screens/DashboardScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function DrawerNavigation({ onLogout,navigation }) {
  const Drawer = createDrawerNavigator();

    const [user, setUser] = useState(null);
   useEffect(()=>{
    checkUserName();
      },[]);
      
        const checkUserName = async () => {
    try {
        const userData = await AsyncStorage.getItem('user');
      const user = JSON.parse(userData);
    console.log('User data from storage:', user);
      setUser(user);
    } catch (error) {
      console.log('Auth check error:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };
const HeaderRightButtons = ({ navigation }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
    

    <TouchableOpacity
  style={{ marginHorizontal: 8 }}
  onPress={() => Linking.openURL('tel:+919358292756')}
>
  <Ionicons name="call-outline" size={22} color="#fff" />
</TouchableOpacity>
    <TouchableOpacity
      style={{ marginHorizontal: 8 }}
     
    >
      <Ionicons name="notifications-outline" size={22} color="#fff" />
    </TouchableOpacity>

  </View>
);

  const CustomDrawerContent = (props) => {
   
    return (
      <View style={{ flex: 1,width:250 }}>
        <ScrollView>

       
          <View style={styles.headerBox}>
            <Image
               source={require('../assets/Logo.png')} 
              style={styles.profileImage}
              resizeMode="contain"
            />
            <View>
           <Text style={styles.userName}>
  {user?.name || "User"}
</Text>

            
            </View>
          </View>

         
          <View style={{ paddingHorizontal: 10 }}>
       
        <DrawerButton
          title="Home"
          IconComponent={MaterialCommunityIcons}
          iconName="microsoft-windows"
          onPress={() =>
            props.navigation.navigate("Dashboard", { screen: "Dashboard" })
          }
        />

        <DrawerButton
        title="Logout"
        IconComponent={Ionicons}
        iconName="power-outline"
        color="red"
        onPress={onLogout}
      />
        
  
          </View>
        </ScrollView>
      </View>
    );
  };

  return (

<Drawer.Navigator
  drawerContent={(props) => <CustomDrawerContent {...props} />}
  screenOptions={({ navigation }) => ({
    headerStyle: {
      backgroundColor: "#0051F9",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
    },

   drawerStyle: {
      width: 250, 
    },
    headerRight: () => <HeaderRightButtons navigation={navigation} />,
  })}
>


    
    <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: true }} />

  </Drawer.Navigator>
);

}


const DrawerButton = ({ title, IconComponent, iconName, onPress, color }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <IconComponent name={iconName} size={20} color={color || "#555"} style={{ width: 30 }} />
    <Text style={[styles.menuText, { color: color || "#000" }]}>{title}</Text>
  </TouchableOpacity>
);



const styles = StyleSheet.create({
  headerBox: {
    backgroundColor: "#0051F9",
    padding: 10,
    flexDirection: "column",
    gap:10,
    paddingTop:30,
  
    // alignItems: "center",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 50,
    alignSelf: "center",
    // marginRight: 12,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom:10,
    marginTop:10,
    backgroundColor:"#fff",
  },
  userName: { fontSize: 15, fontWeight: "bold", color: "#fff",textAlign:"center" },
  userRole: { color: "#fff", opacity: 0.9 },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    // marginVertical: 2,
     borderColor:"#e3e3e3ff",borderTopWidth:0.5,
    borderBottomWidth:0.5,
    gap:10,
    paddingHorizontal: 10,
  },
  menuIcon: { fontSize: 20, width: 30 },
  menuText: { fontSize: 15, fontWeight: "400",marginTop:10 },

  sectionHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    // marginVertical: 2,
    marginTop: 8,
    // backgroundColor: "#f4f4f4",
    alignItems: "center",
    borderColor:"#e3e3e3ff",
    borderBottomWidth:1,
    gap:10,
    paddingHorizontal: 10,
  },
  sectionText: { fontSize: 15, fontWeight: "400",color:"#000" },

  subItem: {
    flexDirection: "row",
    paddingLeft: 40,
    // paddingVertical: 10,
    marginTop:20,
    marginBottom:10
    
  },
  bullet: { fontSize: 25, marginRight: 10, color: "#007AFF" },
});
