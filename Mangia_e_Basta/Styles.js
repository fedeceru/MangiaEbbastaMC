import { StyleSheet } from 'react-native';

const colors = {
  primary: '#3498DB',
  secondary: '#2980B9',
  background: '#f5f5f5',
  text: '#333',
  buttonText: '#fff',
  border: '#ddd',
  cardBackground: '#fff',
  inputBackground: '#fff',
  tabBar: '#fff',
  tabBarInactive: '#95a5a6',
  tabBarActive: '#3498DB',
};

export const styles = StyleSheet.create({
  //Generic styles


  //HomeScreen styles
  homeContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  detailsImage: {
      width: '100%',
      height: 300,  
      borderRadius: 10,
      marginBottom: 20,
  },
  detailsCard: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
  },
  detailsTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
  },
  detailsText: {
      fontSize: 16,
      color: '#666',
      marginBottom: 10,
  },
  detailsButton: {
      backgroundColor: '#e63946',  
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 5,
      marginTop: 20,
      alignItems: 'center',
  },
  detailsButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  },
  menulist: {
    flex: 1,
  },
  listItemCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden', 
  },
  listMenuImage: {
      width: '100%',
      height: 150, 
      borderRadius: 8,
      marginBottom: 10,
      resizeMode: 'cover', 
  },
  listTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginBottom: 5,
  },
  listText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
  },
  listCaption: {
      fontSize: 12,
      color: '#888',
      marginTop: 5,
  },

  //InitialScreen styles
  locationContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  locationImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  locationDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  locationInstructions: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },
  locationButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF', 
  },
  splashIcon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333', 
    marginBottom: 20,
  },

  //ProfileScreen styles
  editScrollViewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  editInputContainer: {
    marginBottom: 20,
  },
  editInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: '#F5F5F5',
    color: '#000000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D1D1',
  },
  editInputError: {
    borderColor: '#FF5C5C',
  },
  editErrorText: {
    fontSize: 14,
    color: '#FF5C5C',
    marginTop: 5,
  },
  editButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FF5C5C',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileCard: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: '#000',
  },
  profileName: {
      marginTop: 10,
      fontSize: 22,
      fontWeight: 'bold',
      color: '#000',
  },
  profileCardContainer: {
      backgroundColor: '#f1f1f1',
      marginHorizontal: 20,
      padding: 20,
      borderRadius: 10,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
  },
  profileCardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
  },
  profileCardDetails: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
  },
  profileCardFullName: {
      fontSize: 16,
      color: '#000',
      marginBottom: 5,
  },
  profileCardNumber: {
      fontSize: 16,
      color: '#000',
      marginBottom: 5,
  },
  profileCardExpiryContainer: {
      marginTop: 10,
  },
  profileCardExpiry: {
      fontSize: 16,
      color: '#000',
      marginBottom: 5,
  },
  profileCardCVV: {
      fontSize: 16,
      color: '#000',
  },
  profileButtonContainer: {
      marginTop: 30,
      marginHorizontal: 20,
  },
  profileButton: {
      backgroundColor: '#333', 
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: 'center',
      flexDirection: 'row',
  },
  profileButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  profileIcon: {
      marginRight: 10,
  },
  profileButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
  },

  //LoadingScreen styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7', 
    padding: 20,
  },
  loadingIcon: {
    width: 100,
    height: 100,
    marginBottom: 30, 
  },
  loadingLoader: {
    marginBottom: 20, 
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#003366', 
  },
});