import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: '12%', padding: 2, backgroundColor: 'white', overflow: 'hidden' },
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
  message: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    color: 'white'

  },
  userMessage: {
    backgroundColor: '#03a1e7', 
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#f0f0f0', 
    alignSelf: 'flex-start',
  },
  darkUserMessage: {
    backgroundColor: '#007acd', 
  },
  darkBotMessage: {
    backgroundColor: '#3f3f42', 
  },
  languageText: {
    fontSize: 16,
  },
  darkText: {
    color: 'white', 
  },


  chatBox: { flex: 1, marginBottom: '4%', padding: 10 },
  firstColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '',
    height: 55,
  },
  secondColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2fafe',
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#41b7ec',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  darksecondColumn:{
    borderColor: '#007acd',

  },


  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    width: '100%',
    height: '100%',
  },
 
  newChatText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#41b7ec',
  },
  adsBox: {
    backgroundColor: '',
    borderRadius: 5,
    alignItems: 'end',
    height: 30,
    justifyContent: 'end'
  },
  
  adsText: {
    fontSize: 13,
    marginLeft: 10,
    fontWeight: 'normal',
  },
  titleLogo:{
   fontSize: 20,
    fontWeight: 'bold',
  },
  chatHistoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft:5
  },
  chatHistory: {
      alignItems: 'center',
      justifyContent: 'start', 
      flexDirection: 'row',
      backgroundColor: "#f3f3f2",
      padding: 10,
      borderRadius: 10,
      overflow: 'visible',
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height:'50%',
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
  },
  darkSettings:{
    backgroundColor: '#1e1e1e',
    borderColor: '#2d2c2e',
  },
  message: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%' },
  inputContainer: { flexDirection: 'row', padding: 15, alignItems: 'center', height: '11%', backgroundColor: ''  },
  typeCon: { backgroundColor: '#03a1e7', justifyContent: 'center', gap: '10', alignItems: 'center', flexDirection: 'row', padding: 5, flex:1, height: 60, marginBottom: 20, borderRadius: 10,  borderTopStartRadius:7},
  noTypeCon: {backgroundColor: 'red', justifyContent: 'center', gap: '10', alignItems: 'center', flexDirection: 'row', padding: 5, flex:1, height: 60, marginBottom: 20, borderRadius: 10,  borderTopStartRadius:7},
  darkTypeCon: { backgroundColor: '#007acd' },
  
  input: { backgroundColor: 'transparent', color: 'white', borderRadius: 10, width: 320, padding: 10 },
  roundButtonContainer: { borderRadius: 30, height: 55, width: 55, backgroundColor: '', justifyContent: 'center', alignItems: 'center' },
  upperCon: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '9%', backgroundColor: 'white', padding: 20 },
  mainLogo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1, color: '' },
  chatTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', textAlign: 'center', flex: 1 },
  sideMenu: { position: 'absolute', justifyContent: 'start', justifyContent: 'start', flex: 1, flexDirection: 'row', backgroundColor: 'transparent',  marginTop: '12%', zIndex: 1000, height: '100%' },
  darkLeftMenu:{ backgroundColor: '#2d2c2e' },
  darkRightMenu:{  backgroundColor: 'rgba(27, 26, 26, 0.8)' },

  leftMenu: {
    position: 'absolute',
    top: 0,
    left: 0,              
    height: '100%',       
    width: '78%',        
    backgroundColor: 'white',
    padding: 15,
    zIndex: 50,
    elevation: 5,          
    shadowColor: '#000',   
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },  
  rightMenu: {position: '', backgroundColor: 'black', width: '100%', top: 0, left: 0, backgroundColor: 'rgba(52, 52, 52, 0.8)'},
  pastChatsTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  pastChatItem: { padding: 10, fontSize: 16,  borderBottomColor: '#ccc' },
  deleteButtonContainer: { padding: 5, backgroundColor: 'red', borderRadius: 5 },
  typingIndicator: { padding: '4%', marginVertical: '2%', borderRadius: 10, maxWidth: '85%', alignSelf: 'flex-start', backgroundColor: '#e0e0e0' },
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
  selectedLanguageItem: {
    backgroundColor: '#d3d3d3',
  },
  selectedLanguageText: {
    fontWeight: 'bold',
  },
  darkSelectedLanguageItem: {
    backgroundColor: '#555',
  },
  darkSelectedLanguageText: {
    fontWeight: 'bold',
    color: 'white',
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
});

export default styles;
