import { StyleSheet } from 'react-native';
import { BannerAd } from 'react-native-google-mobile-ads';

const styles = StyleSheet.create({
      container: {
        padding: 15,
        justifyContent: 'start',
        alignItems: 'start',
        gap: 10,
        height: '100%',
        backgroundColor: '#f3f3f2',

      },
      descCon:{
        padding: 10,
        borderRadius: 15,
        backgroundColor: '',
      },
      description:{
        fontSize: 16,
        textAlign: 'left',
        color:'black'
      },
      switchCon:{
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 20,
        height: 70


      },
      switchText:{
        fontSize: 16,
        textAlign: 'center',
        color:'black'
      },
      icon:{
        color: 'white',
        fontSize: 25

      },
      
      resetButton:{
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'black',
        borderRadius: 10,
        height: 70
      },

      linkButtons:{
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 20,
      },

      resetContent:{

        fontSize: 16,
        textAlign: 'center',
        color:'white'
      },

      linkIcon:{
        color: 'black',
        fontSize: 25

      },

      linkText:{

        fontSize: 16,
        textAlign: 'center',
        color:'black'
      },
      


      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      bannerAd:{
        display: 'flex',
        padding: '0',
        margin: 0,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0
      },

  });
  export default styles;
