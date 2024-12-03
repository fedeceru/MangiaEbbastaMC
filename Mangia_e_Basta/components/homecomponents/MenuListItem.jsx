import { Text, TouchableOpacity, Image } from "react-native";
import { styles } from "../../Styles";

export default MenuListItem = ({ menu, handleShowDetails }) => { 
    return (
        <TouchableOpacity style={styles.card} onPress={() => handleShowDetails(menu)}>
            <Image source={{ uri: "data:image/jpeg;base64," + menu.image }} style={styles.image} />
            <Text style={styles.title}>{menu.name}</Text>
            <Text style={styles.text}>Prezzo: {menu.price}€</Text>
            <Text style={styles.text}>Descrizione: {menu.shortDescription}</Text>
            <Text style={styles.text}>Tempo di consegna: {menu.deliveryTime}</Text>
        </TouchableOpacity>
    );
};
