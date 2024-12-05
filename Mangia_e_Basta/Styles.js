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
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  label: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  profileImageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loader: {
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },

  //styles for card layout
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 16,
  },
  

  //styles for input fields
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 6,
  },
  inputContainer: {
    marginBottom: 20,
  },

  //styles for profile card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
},
profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
},
profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
},
cardContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginHorizontal: 16,
},
cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
},
cardDetails: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 15,
},
cardFullName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
},
cardNumber: {
    fontSize: 18,
    letterSpacing: 2,
    marginBottom: 10,
},
cardExpiryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
cardExpiry: {
    fontSize: 16,
},
cardCVV: {
    fontSize: 16,
},
navigationContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
},
navigationButton: {
    backgroundColor: '#000', 
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
},
buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
},
icon: {
    marginRight: 10,
},
navigationButtonText: {
    color: '#fff', 
    fontSize: 16,
    textAlign: 'center',
},

});

