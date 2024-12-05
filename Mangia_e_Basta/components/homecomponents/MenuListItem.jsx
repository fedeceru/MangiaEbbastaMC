import { Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default MenuListItem = ({ menu, handleShowDetails }) => { 
    return (
        <TouchableOpacity style={localStyles.card} onPress={() => handleShowDetails(menu)}>
            <Image source={{ uri: "data:image/jpeg;base64," + menu.image }} style={localStyles.menuImage} />
            <Text style={localStyles.title}>{menu.name}</Text>
            <Text style={localStyles.text}>Prezzo: {menu.price}€</Text>
            <Text style={localStyles.text}>Consegna in: {menu.deliveryTime} minuti</Text>
            <Text style={localStyles.caption}>Descrizione: {menu.shortDescription}</Text>
        </TouchableOpacity>
    );
};

const localStyles = StyleSheet.create({
    card: {
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
    menuImage: {
        width: '100%',
        height: 150, 
        borderRadius: 8,
        marginBottom: 10,
        resizeMode: 'cover', 
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    text: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    caption: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
});
