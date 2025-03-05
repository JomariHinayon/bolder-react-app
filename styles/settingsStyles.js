import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      padding: 15,
      justifyContent: 'start',
      alignItems: 'start',
      backgroundColor: '#f3f3f2',
      gap: 10,
      flex: 1
    },
    darkContainer: {
      backgroundColor: '#242425',
    },
    darkSmCon:{
      backgroundColor: '#3f3f42',
    },
    darkText:{
      color: 'white'
    },
    modalContainer: {

      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      height: 500
    },
    darkModalContent: {
      backgroundColor: '#444',
    },
    modalTitClose:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding:5,
        marginBottom:5
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    languageCon: {
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      backgroundColor: 'white',
      borderRadius: 20,
      
    },
  
    selectedLanguageItem:{
      backgroundColor: '#f3f3f2',
      borderRadiius: 25
    },
    allLanguageCon:{
      backgroundColor: '',
      overflowY: 'scroll',
      height: 200
    },

    selectedLanguageText:{
      fontWeight: 'bold',
    },
    selectedDarkLanguageText:{
      fontWeight: 'bold',

    },
    darkLanguageItem:{
      backgroundColor: 'transparent',

    },
    selectedDarkLanguageItem:{
      backgroundColor: '#2d2c2e',
    },
    languageItem: {
        backgroundColor: 'transparent',
        marginTop: 2,
        height: 50,
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        justifyContent: 'start',
        alignItems: 'center',
    },

    languageText: {
      marginLeft: 10,
      fontSize: 16,
    },
    darkText: {
      color: 'white',
    },
    deleteAllCon:{
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      height: 200,
      gap: 4,
      borderRadius: 10,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      backgroundColor: 'white',
    },
    deleteAllBtn:{
      backgroundColor: 'black',
      padding: 15,
      borderRadius: 25,
      marginTop: 10,
      width:200,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    cacheSize:{
      fontSize: 30,
      fontWeight: 'bold'
    },
    cacheText:{
      fontSize: 16,
      color: 'gray',
      textAlign: 'center',
      fontWeight: 'normal'
    },
    deleteAllText:{
      fontSize: 15,
      color: 'white',
      fontWeight: 'bold'
    },
    darkDropdownContent:{

    },
    dropdownContent:{
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 5,
      marginTop: 0,
      marginBottom: 10,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    darkDropdownContent:{
      backgroundColor: '#3f3f42',
    },
    dropDownBoldText:{
      fontWeight: 'bold',
      fontSize: 15
    }
    
  });
  export default styles;
