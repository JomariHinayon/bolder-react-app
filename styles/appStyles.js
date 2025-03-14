import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, padding: 2, backgroundColor: 'white', overflow: 'hidden' },
  darkContainer: {
    backgroundColor: '#2d2c2e',
  },
  darkUpper: {
    backgroundColor: '#242425'
  },
  darkText:{
    color: 'white'
  },
  darkBlueText:{
    color: '#007acd'
  },
  safeAreaView:{

    flex: 1
  },
  rewardMessageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    padding: 10,
    width: 220,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'absolute',
    justifySelf: 'center',
    alignSelf: 'center',
    top: 100,
    flexDirection: 'row',
    gap: 5,
    zIndex: 10000,
    elevate: 10000

  },
  rewardMessageText: {
    color: 'white',
    fontWeight: 'normal',
    fontSize: 15,
  },

  newChatCon:{
      backgroundColor: 'transparent',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: 400,
    },
    logoAINew:{
      height: 120,
      width: 120,
      marginBottom: 15,

    },
    hiImYourAIAgent:{
      fontSize: 22,
      fontWeight: 'bold'
    },
    howCanIHelpYouToday:{
      fontSize: 16,
      color: 'grey'

    },



  message: {
    padding: 0,
    borderRadius: 8,
    marginVertical: 0,
    color: 'white',


  },
  userMessage: {
    backgroundColor: 'black', 
    alignSelf: 'flex-end',
    borderRadius: 25,
    padding: 15,
    marginRight: 15

  
  },
  botMessage: {
    backgroundColor: '', 
    alignSelf: 'flex-start',
    borderRadius: 25,
    margin: 0,

    padding: 15,
    flexDiretion: 'column'
  },
  darkUserMessage: {
    backgroundColor: '#007acd', 
  },
  darkBotMessage: {
    backgroundColor: '#3f3f42', 
  },
  languageText: {
    fontSize: 17,
    marginTop: 5
  },
  darkText: {
    color: 'white', 
  },


  chatBox: { flex: 1, marginBottom: '', padding: 10, gap: 5 },
  firstColumn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '',
    height: 70,
  },
  secondColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  darksecondColumn:{
    borderColor: '#007acd',

  },


  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    gap: 5
  },
 
  newChatText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
  adsBox: {
    backgroundColor: '',
    borderRadius: 5,
    alignItems: 'end',
    height: 30,
    justifyContent: 'end'
  },
  
  adsText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'

  },
  noCredits:{
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center'
  },
  titleLogo:{
   fontSize: 20,
    fontWeight: 'bold',
  },
  chatHistoryTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginLeft:5
  },
  chatHistory: {
      alignItems: 'center',
      justifyContent: 'start', 
      flexDirection: 'row',
      backgroundColor: "transparent",
      padding: 10,
      borderRadius: 10,
      overflow: 'visible',
      marginTop: 10,
      borderTopWidth: 2,
      borderColor: '#f3f3f2',
  },
  darkChatHistory:{ 
    backgroundColor: '#3f3f42',
  },
  chatItemContainer: {
    borderRadius: 10,
    backgroundColor: 'transparent',
    width: '100%',
    overflow: 'visible', 
  },
  chatContent: {
    flexDirection: 'row',
    zIndex:0,
    overflow: 'visible',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible', 
    backgroundColor: '',
    borderBottomWidth: 1,
    borderColor: '#f3f3f2',
    width: '100%'
  },
  pastChatItem: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    elevation: 1,
    overflow: 'visible',
  },
  highlightChatItem: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  pastChatItem: {
    flex: 1,             
    paddingRight: 35,   
    color: '#000',        
  },
  ellipsisContainer: {
    position: 'absolute',  
    right: 0,           
    backgroundColor: 'white',
    padding: 5,            
    backgroundColorOpacity: 0.1,
    zIndex: 10,            
  },
  darkEllipsisContainer:{
    backgroundColor: '#2d2c2e',
    zIndex: 10,            
    elevation: 10

  },
  floatingMenu: {
    position: 'absolute',
    width: 100,
    top: 0, 
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 50, 
    zIndex: 9999, 
    overflow: 'visible', 
    shadow: 'none'
  },
  darkFloatingMenu:{
    backgroundColor: '#3f3f42',
  },
  darkFloatingButton:{
    borderBottomColor: '#242425',

  },
  floatingButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    height:'100%',
    overflow: 'visible', 
    shadow: 'none'
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  clearText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  settings:{
    flexDirection: 'row', 
    alignItems: 'center', 
    borderTopWidth: 2, 
    borderColor: '#F2F2F2', 
    padding: 12,
    backgroundColor: 'black',
    backgroundColorOpacity: 0.1,
    position: 'absoulte',
    borderRadius: 10,
    height: 60
  },
  darkSettings:{
    backgroundColor: '#1e1e1e',
    borderColor: '#2d2c2e',
  },
  message: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%' },
  inputContainer: { justifyContent:'center', flexDirection: 'row', padding: 17, alignItems: 'center', height: '11%', backgroundColor: ''},
  typeCon: { backgroundColor: '#f2f2f5', justifyContent: 'space-between', gap: '10', alignItems: 'center', flexDirection: 'row', padding: 5, flex:1, height: 60,  borderRadius: 35, },
  sendBtn: {backgroundColor: 'black', padding: 5, width: 50, height: 50, borderRadius: 25,  justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc'},
  darkTypeCon: { backgroundColor: '#007acd' },
  darkNoTypeCon: { backgroundColor: '#3f3f42', color: 'red', justifyContent: 'center', gap: '10', alignItems: 'center', flexDirection: 'row', padding: 5, flex:1, height: 60, marginBottom: 20, borderRadius: 10,  borderTopStartRadius:7},
  noTypeCon: { 
    borderTopEndRadius:7,
    borderBottomStartRadius:9,
    borderBottomEndRadius:7, 
    borderLeftWidth:2,
    borderBottomWidth:2, 
    borderColor:"rgba(0, 0, 0, 0.34)",
    flexDirection: 'row',
    backgroundColor: 'black', justifyContent: 'center', gap: '10', alignItems: 'center', flexDirection: 'row', padding: 5, flex:1, height: 60, marginBottom: 20, borderRadius: 10,  borderTopStartRadius:7},
  watchAdsText: {color: 'red', textAlign: 'center', fontSize: 15, fontWeight: 'bold'},
  watchAdsHour: {textAlign: 'center', color: 'red', fontSize: 15, margin: 3, fontWeight: 'bold'},
  disabledButtonAd: {},
  darkWatchAdsText: {color: 'red'},
  watchAdButton: {backgroundColor: 'pink', justifySelf: 'center', alignSelf: 'center', height:40, padding: 5, borderRadius: 5, marginBottom: 5, width: 200, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc'},
  input: { backgroundColor: 'transparent', color: 'white', borderRadius: 10, width: 320, padding: 10 },
  typeYourMessage: {color: 'black', fontSize: 17, backgroundColor: 'transparent', width: '80%', marginLeft: 15},
  roundButtonContainer: { borderRadius: 30, height: 55, width: 55, backgroundColor: '', justifyContent: 'center', alignItems: 'center' },
  upperCon: { flexDirection: 'row',  justifyContent: 'space-between', alignItems: 'center', height: '9%', backgroundColor: 'white', padding: 15, width: '100%', borderEndColor: 'black' , borderBottomColor: '#f2f2f5', borderBottomWidth: 1},
  adBtn: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 15,justifyContent: 'space-between', alignItems:'center', backgroundColor: 'black', height: 45, padding: 0,  paddingHorizontal: 10, gap: 5, width: 'auto'},
  getRewardsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '',

  },
  chatTitle: { fontSize: 13, fontWeight: 'bold', color: 'white', textAlign: 'center', flex: 1 },
  sideMenu: { position: 'absolute', justifyContent: 'start', justifyContent: 'start', flex: 1, flexDirection: 'row', backgroundColor: 'transparent',   zIndex: 1000, height: '100%' },
  darkLeftMenu:{ backgroundColor: '#2d2c2e' },
  darkRightMenu:{  backgroundColor: 'rgba(27, 26, 26, 0.8)' },

  leftMenu: {
    position: 'absolute',
    top: 0,
    left: 0,              
    height: '100%',       
    width: '85%',        
    backgroundColor: 'white',
    padding: 15,
    zIndex: 50,
    elevation: 5,          
    shadowColor: '#000',   
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },  
  leftMenuClose:{
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 5

  },
  rightMenu: {position: '', backgroundColor: 'black', width: '100%', top: 0, left: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)'},
  pastChatsTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  pastChatItem: { padding: 10, fontSize: 16,  borderBottomColor: '#ccc' },
  deleteButtonContainer: { padding: 5, backgroundColor: 'red', borderRadius: 5 },
  typingIndicator: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%', alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
  scrollToTopButton:{
    position: 'absolute',
    bottom: 85,
    backgroundColor: 'black',
    borderRadius: 5,
    justifySelf: 'center',
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent:'center',
    alignItems: 'center',


  },

  
  
  loadMoreButton: {
    backgroundColor: '',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#03a1e7',
    fontWeight: 'bold',
  },
  highlightChatItem: {
    backgroundColor: '',
    fontWeight: 'bold',
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
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  languageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  typingText: {
    fontSize: 16,
    color: 'gray',
  },
  dot: {
    fontSize: 50,
    color: '#cdcdcc',
    marginLeft: 1,
  },

  adModalBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  adModalCon:{
    width: '80%',
    backgroundColor: 'white',
    height: '60%',
    flexDirection: 'column',
    borderRadius:20,
    overflow: 'hidden',
  },
  adCloseButton:{
    position: 'absolute',
    right: 10,
    top: 10,
    elevate: 10,
    zIndex: 10,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.46)',
    borderRadius: '50%',
    width: 37,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 2,
    height: 37,
    margin:5

  },
  adWatchCount: {
    position: 'absolute',
    left: 10,
    top: 10,
    elevate: 10,
    zIndex: 10,
    color: 'white',
    margin:10,
    fontSize: 15

  },

  closeButtonText:{
    color: 'white',

  },
  adUpperCon:{
    backgroundColor: '#f3f3f2',
    height: '65%',
    overflow: 'hidden',
    borderRadius: 20,
    // borderWidth: 5,
    // borderColor: 'white'
  },
  
  adLowerCon:{
    backgroundColor: 'rd',
    padding: 5,
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',

  },
  watchAdsButton:{
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 40,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5
  },
  disabledWatchAdsButton: {
    backgroundColor: 'grey',
    padding: 20,
    borderRadius: 40,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5
  },
  watchAdsText:{
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  adModalText:{
    fontSize: 15,
    fontWeight: 'normal',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,

  },
  modalSecText:{
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },



});

export default styles;